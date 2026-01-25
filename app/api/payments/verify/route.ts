import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { generateInvoice } from '@/lib/invoice';

// Singleton PrismaClient to avoid connection issues in serverless
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { reference, bookingId } = body;

    // Basic validation
    if (!reference || typeof reference !== 'string' || !bookingId || typeof bookingId !== 'string') {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    // Verify payment with Paystack
    const response = await fetch(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Paystack API request failed');
    }

    const data = await response.json();

    if (!data.data || data.data.status !== 'success') {
      return NextResponse.json({ success: false }, { status: 400 });
    }

    // Use transaction for atomic updates
    const result = await prisma.$transaction(async (tx) => {
      // Update booking with payment details
      const booking = await tx.booking.update({
        where: { id: bookingId },
        data: {
          paymentStatus: 'PAID',
          paystackReference: reference,
        },
      });

      // Generate invoice
      const invoiceNumber = await generateInvoice(booking);

      // Update with invoice number
      await tx.booking.update({
        where: { id: bookingId },
        data: { invoiceNumber },
      });

      return { invoiceNumber };
    });

    return NextResponse.json({ success: true, invoiceNumber: result.invoiceNumber });
  } catch (error) {
    console.error('Payment verification error:', error);
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 });
  }
}