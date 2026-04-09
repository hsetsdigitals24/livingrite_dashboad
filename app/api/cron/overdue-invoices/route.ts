import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendOverdueInvoiceReminder } from '@/lib/email';

export const dynamic = 'force-dynamic';

/**
 * GET /api/cron/overdue-invoices
 * Automated reminder for overdue invoices
 * 
 * Runs on a schedule to:
 * 1. Find invoices where dueAt < now() and status != PAID/CANCELLED
 * 2. Mark them as OVERDUE if not already
 * 3. Send reminder email to client
 * 
 * Protected with Bearer token using CRON_SECRET from environment
 */
export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const now = new Date();

  try {
    // Find all invoices that are overdue but not paid or cancelled
    const overdueInvoices = await prisma.invoice.findMany({
      where: {
        dueAt: {
          lt: now, // Due date is in the past
        },
        status: {
          notIn: ['PAID', 'CANCELLED'], // Not already paid or cancelled
        },
      },
      include: {
        client: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    const results = {
      processed: 0,
      markedOverdue: 0,
      remindersEmailSent: 0,
      remindersAlreadySent: 0,
      errors: [] as Array<{ invoiceId: string; invoiceNumber: string; error: string }>,
    };

    console.log(
      `[Overdue Invoices Cron] Found ${overdueInvoices.length} potentially overdue invoice(s)`
    );

    for (const invoice of overdueInvoices) {
      try {
        results.processed++;

        // Check if we've already sent a reminder (status is OVERDUE)
        const alreadySentReminder = invoice.status === 'OVERDUE';

        // Mark as OVERDUE if not already
        if (!alreadySentReminder) {
          await prisma.invoice.update({
            where: { id: invoice.id },
            data: {
              status: 'OVERDUE',
            },
          });
          results.markedOverdue++;
        } else {
          results.remindersAlreadySent++;
        }

        // Send reminder email
        if (invoice.client?.email) {
          try {
            const daysPastDue = Math.floor(
              (now.getTime() - new Date(invoice.dueAt!).getTime()) / (1000 * 60 * 60 * 24)
            );

            const invoiceLink = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/client/invoices?invoiceId=${invoice.id}`;

            await sendOverdueInvoiceReminder(
              invoice.client.email,
              invoice.client.name || 'Valued Customer',
              invoice.invoiceNumber,
              invoice.totalAmount,
              invoice.currency,
              invoice.dueAt!,
              invoiceLink,
              daysPastDue
            );

            results.remindersEmailSent++;

            console.log(
              `[Overdue Invoices Cron] Reminder sent for invoice ${invoice.invoiceNumber} to ${invoice.client.email}`
            );
          } catch (emailError) {
            const errorMsg = emailError instanceof Error ? emailError.message : 'Unknown error';
            results.errors.push({
              invoiceId: invoice.id,
              invoiceNumber: invoice.invoiceNumber,
              error: `Email send failed: ${errorMsg}`,
            });
            console.error(
              `[Overdue Invoices Cron] Error sending reminder for invoice ${invoice.invoiceNumber}:`,
              emailError
            );
          }
        } else {
          results.errors.push({
            invoiceId: invoice.id,
            invoiceNumber: invoice.invoiceNumber,
            error: 'Client email not found',
          });
          console.warn(
            `[Overdue Invoices Cron] No email for invoice ${invoice.invoiceNumber}`
          );
        }
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : 'Unknown error';
        results.errors.push({
          invoiceId: invoice.id,
          invoiceNumber: invoice.invoiceNumber,
          error: errorMsg,
        });
        console.error(
          `[Overdue Invoices Cron] Error processing invoice ${invoice.invoiceNumber}:`,
          error
        );
      }
    }

    console.log('[Overdue Invoices Cron] Summary:', {
      processed: results.processed,
      markedOverdue: results.markedOverdue,
      remindersEmailSent: results.remindersEmailSent,
      remindersAlreadySent: results.remindersAlreadySent,
      errors: results.errors.length,
    });

    return NextResponse.json(results, { status: 200 });
  } catch (error) {
    console.error('[Overdue Invoices Cron] Fatal error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      {
        error: message,
        processed: 0,
        markedOverdue: 0,
        remindersEmailSent: 0,
        remindersAlreadySent: 0,
        errors: [{ invoiceId: 'FATAL', invoiceNumber: 'N/A', error: message }],
      },
      { status: 500 }
    );
  }
}
