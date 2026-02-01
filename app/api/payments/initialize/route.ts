import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY;

export async function POST(req: NextRequest) {
  try {
    const { email, amount, bookingId, clientName } = await req.json();

    if (!email || !amount || !bookingId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    console.log({"ApiKey": PAYSTACK_SECRET});

    // Amount in kobo (smallest unit in Paystack)
    const amountInKobo = Math.round(amount * 100);

    const response = await axios.post(
      'https://api.paystack.co/transaction/initialize',
      {
        email,
        amount: amountInKobo,
        metadata: {
          bookingId,
          clientName,
        },
        callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/payments/verify`,
      },
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return NextResponse.json({
      authorizationUrl: response.data.data.authorization_url,
      accessCode: response.data.data.access_code,
      reference: response.data.data.reference,
    });
  } catch (error) {
    console.error('Paystack initialization error:', error);
    return NextResponse.json(
      { error: 'Failed to initialize payment' },
      { status: 500 }
    );
  }
}