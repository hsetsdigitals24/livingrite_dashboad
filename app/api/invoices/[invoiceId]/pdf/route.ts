import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import PDFDocument from 'pdfkit';

export const dynamic = 'force-dynamic';

/**
 * GET /api/invoices/[invoiceId]/pdf
 * Generate and return invoice as PDF
 * 
 * Access Control:
 * - Clients can only download their own invoices
 * - Admins can download any invoice
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ invoiceId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { invoiceId } = await params;

    // Fetch invoice with relationships
    const invoice = await prisma.invoice.findUnique({
      where: { id: invoiceId },
      include: {
        client: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        patient: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    if (!invoice) {
      return NextResponse.json(
        { error: 'Invoice not found' },
        { status: 404 }
      );
    }

    // Access control: Client can only see their own invoices
    if (session.user.role === 'CLIENT' && invoice.clientId !== session.user.id) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      );
    }

    // Fetch admin settings for payment account details
    const adminSettings = await prisma.adminSettings.findFirst();

    // Generate PDF
    const pdfBuffer = await generateInvoicePDF(invoice, adminSettings);

    // Return PDF with headers
    return new NextResponse(pdfBuffer as any, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="Invoice_${invoice.invoiceNumber}.pdf"`,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });
  } catch (error) {
    console.error('Error generating invoice PDF:', error);
    const message =
      error instanceof Error ? error.message : 'Failed to generate PDF';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/**
 * Generate invoice PDF buffer using pdfkit
 */
async function generateInvoicePDF(
  invoice: any,
  adminSettings: any
): Promise<Uint8Array> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      margin: 40,
      size: 'A4',
      bufferPages: true,
    });

    const buffers: Uint8Array[] = [];

    // Collect buffer data
    doc.on('data', (chunk: Buffer) => buffers.push(new Uint8Array(chunk)));
    doc.on('error', reject);
    doc.on('end', () => {
      // Concatenate all chunks into a single Uint8Array
      const totalLength = buffers.reduce((sum, buf) => sum + buf.length, 0);
      const result = new Uint8Array(totalLength);
      let offset = 0;
      for (const buf of buffers) {
        result.set(buf, offset);
        offset += buf.length;
      }
      resolve(result);
    });

    try {
      // Header section
      doc.fontSize(24).font('Helvetica-Bold').text('LIVINGRITE', 40, 40);
      doc.fontSize(10)
        .font('Helvetica')
        .text('Healthcare Consulting & Care Services', 40, 70);
      doc.fontSize(9)
        .text('Email: support@livingrite.com', 40, 85)
        .text('Web: www.livingrite.com', 40, 100);

      // Invoice title and date (right aligned)
      const rightX = 500;
      doc
        .fontSize(20)
        .font('Helvetica-Bold')
        .text('INVOICE', rightX, 40, { align: 'right' });
      doc
        .fontSize(10)
        .font('Helvetica')
        .text(`Invoice #: ${invoice.invoiceNumber}`, rightX, 75, { align: 'right' })
        .text(
          `Date: ${new Date(invoice.createdAt).toLocaleDateString()}`,
          rightX,
          92,
          { align: 'right' }
        )
        .text(
          `Due Date: ${invoice.dueAt ? new Date(invoice.dueAt).toLocaleDateString() : 'Not set'}`,
          rightX,
          109,
          { align: 'right' }
        );

      // Divider
      doc.moveTo(40, 130).lineTo(560, 130).stroke();

      // Bill to section
      doc
        .fontSize(12)
        .font('Helvetica-Bold')
        .text('BILL TO:', 40, 150);
      doc
        .fontSize(10)
        .font('Helvetica')
        .text(invoice.client?.name || 'Client Name', 40, 170);

      if (invoice.client?.email) {
        doc.text(invoice.client.email, 40, 185);
      }

      // Patient information (if available)
      if (invoice.patient) {
        doc
          .fontSize(11)
          .font('Helvetica-Bold')
          .text('PATIENT:', 320, 150);
        doc
          .fontSize(10)
          .font('Helvetica')
          .text(
            `${invoice.patient.firstName} ${invoice.patient.lastName}`,
            320,
            170
          );
      }

      // Services section
      const servicesY = 220;
      const colDescriptionX = 40;
      const colQuantityX = 380;
      const colPriceX = 480;

      // Table header
      doc
        .fontSize(11)
        .font('Helvetica-Bold')
        .fillColor('#ffffff')
        .rect(40, servicesY, 520, 25)
        .fill()
        .fillColor('#4a5568')
        .rect(40, servicesY, 520, 25)
        .fill();

      doc
        .fillColor('white')
        .fontSize(10)
        .text('Description', colDescriptionX + 5, servicesY + 7)
        .text('Qty', colQuantityX - 20, servicesY + 7)
        .text('Unit Price', colPriceX - 50, servicesY + 7)
        .text('Total', colPriceX, servicesY + 7, { align: 'right' });

      // Service items
      let currentY = servicesY + 35;
      doc.fillColor('black').font('Helvetica');

      if (invoice.servicesData && Array.isArray(invoice.servicesData)) {
        invoice.servicesData.forEach((service: any) => {
          const description = service.title || 'Service';
          const price = parseFloat(service.price) || 0;

          doc
            .fontSize(9)
            .text(description, colDescriptionX, currentY, {
              width: 340,
              height: 20,
            })
            .text('1', colQuantityX - 20, currentY)
            .text(`${invoice.currency} ${price.toFixed(2)}`, colPriceX - 50, currentY)
            .text(`${invoice.currency} ${price.toFixed(2)}`, colPriceX, currentY, {
              align: 'right',
            });

          currentY += 25;
        });
      }

      // Amount summary section
      currentY += 15;
      const summaryX = 380;

      doc
        .fontSize(10)
        .font('Helvetica')
        .text('Subtotal:', summaryX, currentY)
        .text(
          `${invoice.currency} ${invoice.amount.toFixed(2)}`,
          480,
          currentY,
          { align: 'right' }
        );

      currentY += 20;
      if (invoice.tax > 0) {
        doc
          .text('Tax:', summaryX, currentY)
          .text(
            `${invoice.currency} ${invoice.tax.toFixed(2)}`,
            480,
            currentY,
            { align: 'right' }
          );
        currentY += 20;
      }

      if (invoice.discount > 0) {
        doc
          .fillColor('#d9534f')
          .text('Discount:', summaryX, currentY)
          .fillColor('black')
          .text(
            `-${invoice.currency} ${invoice.discount.toFixed(2)}`,
            480,
            currentY,
            { align: 'right' }
          );
        currentY += 20;
      }

      // Total
      doc
        .moveTo(summaryX, currentY - 5)
        .lineTo(560, currentY - 5)
        .stroke();

      doc
        .fontSize(12)
        .font('Helvetica-Bold')
        .text('TOTAL DUE:', summaryX, currentY)
        .text(
          `${invoice.currency} ${invoice.totalAmount.toFixed(2)}`,
          480,
          currentY,
          { align: 'right' }
        );

      // Payment instructions section
      currentY += 40;
      doc
        .fontSize(11)
        .font('Helvetica-Bold')
        .fillColor('#333333')
        .text('PAYMENT INSTRUCTIONS', 40, currentY);

      currentY += 25;

      if (adminSettings) {
        const tableRowHeight = 18;
        const labelWidth = 150;

        // Draw payment details table
        doc
          .fontSize(9)
          .font('Helvetica')
          .text('Account Name:', 40, currentY)
          .text(
            adminSettings.paymentAccountName || 'N/A',
            40 + labelWidth,
            currentY
          );

        currentY += tableRowHeight;
        doc
          .text('Account Number:', 40, currentY)
          .text(
            adminSettings.paymentAccountNumber || 'N/A',
            40 + labelWidth,
            currentY
          );

        currentY += tableRowHeight;
        doc
          .text('Bank Name:', 40, currentY)
          .text(
            adminSettings.paymentBankName || 'N/A',
            40 + labelWidth,
            currentY
          );

        currentY += tableRowHeight;
        doc
          .text('Bank Code:', 40, currentY)
          .text(
            adminSettings.paymentBankCode || 'N/A',
            40 + labelWidth,
            currentY
          );

        currentY += tableRowHeight;
        doc
          .text('Currency:', 40, currentY)
          .text(
            adminSettings.paymentCurrency || 'NGN',
            40 + labelWidth,
            currentY
          );

        // Additional instructions
        if (adminSettings.paymentInstructions) {
          currentY += 25;
          doc
            .fontSize(10)
            .font('Helvetica-Bold')
            .text('Additional Instructions:', 40, currentY);

          currentY += 15;
          doc
            .fontSize(9)
            .font('Helvetica')
            .text(adminSettings.paymentInstructions, 40, currentY, {
              width: 520,
              align: 'left',
            });
        }
      } else {
        doc
          .fontSize(9)
          .font('Helvetica')
          .text(
            'Please contact us for payment details and instructions.',
            40,
            currentY,
            { width: 520 }
          );
      }

      // Special payment note (if available)
      if (invoice.paymentNote) {
        currentY += 40;
        doc
          .fontSize(10)
          .font('Helvetica-Bold')
          .text('SPECIAL INSTRUCTIONS:', 40, currentY);

        currentY += 15;
        doc
          .fontSize(9)
          .font('Helvetica')
          .text(invoice.paymentNote, 40, currentY, {
            width: 520,
            align: 'left',
          });
      }

      // Footer
      const pageHeight = doc.page.height;
      doc
        .fontSize(8)
        .font('Helvetica')
        .fillColor('#999999')
        .text(
          'Thank you for your business! Please keep this invoice for your records.',
          40,
          pageHeight - 40,
          { align: 'center', width: 520 }
        );

      doc
        .fontSize(7)
        .fillColor('#aaaaaa')
        .text(
          `Generated on ${new Date().toLocaleString()}`,
          40,
          pageHeight - 25,
          { align: 'center', width: 520 }
        );

      // Finalize document
      doc.end();
    } catch (error) {
      doc.end();
      reject(error);
    }
  });
}
