import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY;

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const reference = req.nextUrl.searchParams.get('reference');

    if (!reference) {
      return NextResponse.json(
        { error: 'No reference provided' },
        { status: 400 }
      );
    }

    const response = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET}`,
        },
      }
    );

    const { status, data } = response.data;

    if (status && data.status === 'success') {
      const { bookingId } = data.metadata;

      // Update booking as paid
      const booking = await prisma.booking.update({
        where: { id: bookingId },
        data: {
          paymentStatus: 'PAID',
          paymentReference: reference,
          paystackReference: reference,
        },
      });

      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/booking/schedule?reference=${reference}`
      );
    } else {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/payments/failed`
      );
    }
  } catch (error) {
    console.error('Payment verification error:', error);
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/payments/failed`
    );
  }
}