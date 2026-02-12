import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

/**
 * POST /api/webhooks/paystack
 * Handle Paystack webhook events:
 * - charge.success: Payment successful
 * - charge.failed: Payment failed
 * - refund.created: Refund requested
 * - refund.processed: Refund processed
 */
export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-paystack-signature");
    const secret = process.env.PAYSTACK_SECRET_KEY!;

    // Verify signature
    const computed = crypto
      .createHmac("sha512", secret)
      .update(rawBody)
      .digest("hex");

    if (signature !== computed) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const event = JSON.parse(rawBody);
    const data = event.data;

    console.log(`[Paystack Webhook] Event: ${event.event}`, {
      reference: data.reference,
      amount: data.amount,
      status: data.status,
    });

    // Handle charge.success event
    if (event.event === "charge.success") {
      const payment = await prisma.payment.findFirst({
        where: { providerRef: data.reference },
        include: {
          booking: {
            select: {
              id: true,
              clientEmail: true,
              clientName: true,
            },
          },
        },
      });

      if (payment) {
        // Update payment status
        await prisma.payment.update({
          where: { id: payment.id },
          data: {
            status: "PAID",
            paidAt: new Date(data.paid_at || new Date()),
          },
        });

        // Create payment attempt record
        await prisma.paymentAttempt.create({
          data: {
            paymentId: payment.id,
            reference: data.reference,
            amount: data.amount / 100, // Convert from kobo to main unit
            status: "success",
            metadata: {
              gateway_response: data.gateway_response,
              authorization: data.authorization,
              customer: data.customer,
            },
          },
        });

        // TODO: Send payment success email
        console.log(
          `[Paystack Webhook] Payment successful for booking: ${payment.booking.id}`
        );

        // TODO: Trigger invoice generation
      }
    }

    // Handle charge.failed event
    if (event.event === "charge.failed") {
      const payment = await prisma.payment.findFirst({
        where: { providerRef: data.reference },
      });

      if (payment) {
        // Update payment status to FAILED
        await prisma.payment.update({
          where: { id: payment.id },
          data: {
            status: "FAILED",
          },
        });

        // Create payment attempt record
        await prisma.paymentAttempt.create({
          data: {
            paymentId: payment.id,
            reference: data.reference,
            amount: data.amount / 100,
            status: "failed",
            errorCode: data.gateway_response,
            errorMsg: data.message,
            metadata: {
              gateway_response: data.gateway_response,
              customer: data.customer,
            },
          },
        });

        // TODO: Send payment failed email with retry link
        console.log(
          `[Paystack Webhook] Payment failed: ${data.gateway_response}`
        );
      }
    }

    // Handle refund.created event
    if (event.event === "refund.created") {
      const refund = event.data;
      const payment = await prisma.payment.findFirst({
        where: { providerRef: refund.transaction.reference },
      });

      if (payment) {
        // Create refund request record
        await prisma.refundRequest.create({
          data: {
            paymentId: payment.id,
            amount: refund.amount / 100,
            reason: refund.reason || "Refund initiated",
            status: "PENDING",
            providerRef: refund.reference,
            notes: `Transaction ID: ${refund.transaction.id}, Status: ${refund.status}`,
          },
        });

        console.log(`[Paystack Webhook] Refund created: ${refund.reference}`);
      }
    }

    // Handle refund.processed event
    if (event.event === "refund.processed") {
      const refund = event.data;
      const payment = await prisma.payment.findFirst({
        where: { providerRef: refund.transaction.reference },
      });

      if (payment) {
        // Update refund request
        const existingRefund = await prisma.refundRequest.findFirst({
          where: { providerRef: refund.reference },
        });

        if (existingRefund) {
          await prisma.refundRequest.update({
            where: { id: existingRefund.id },
            data: {
              status: "PROCESSED",
              processedAt: new Date(),
            },
          });
        }

        // Update payment status to REFUNDED
        await prisma.payment.update({
          where: { id: payment.id },
          data: {
            status: "REFUNDED",
            refundedAt: new Date(),
            refundedAmount: refund.amount / 100,
          },
        });

        // TODO: Send refund confirmation email
        console.log(
          `[Paystack Webhook] Refund processed: ${refund.reference}`
        );
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("[Paystack Webhook] Error processing webhook:", error);
    const message =
      error instanceof Error ? error.message : "Webhook processing failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

