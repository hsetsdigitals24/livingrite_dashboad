import PDFDocument from 'pdfkit';
import { Booking, Invoice } from '@prisma/client';
import { createWriteStream } from 'fs';
import { join } from 'path';
import { mkdir } from 'fs/promises';
import { prisma } from '@/lib/prisma';

/**
 * Generate a professional PDF invoice
 * Creates database record and generates PDF file
 */
export async function generateInvoicePDF(
  bookingId: string,
  invoiceNumber: string,
  invoice: any
): Promise<string> {
  try {
    // Ensure invoices directory exists
    const invoicesDir = join(process.cwd(), 'public', 'invoices');
    await mkdir(invoicesDir, { recursive: true });

    const doc = new PDFDocument({ margin: 50, size: 'A4' });

    const filePath = join(invoicesDir, `${invoiceNumber}.pdf`);
    const stream = createWriteStream(filePath);

    doc.pipe(stream);

    // Company header
    doc.fontSize(20).font('Helvetica-Bold').text('LIVINGRITE', 50, 50);
    doc.fontSize(9).font('Helvetica').text('Healthcare Consulting', 50, 75);
    doc.text('support@livingrite.com', 50, 90);
    doc.text('www.livingrite.com', 50, 105);

    // Invoice title and details (right aligned)
    doc.fontSize(16).font('Helvetica-Bold').text('INVOICE', 400, 50);
    doc.fontSize(10).font('Helvetica');
    doc.text(`Invoice #: ${invoiceNumber}`, 400, 80);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 400, 95);
    doc.text(
      `Due Date: ${new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}`,
      400,
      110
    );

    doc.moveTo(50, 140).lineTo(550, 140).stroke();
    doc.moveDown(2);

    // Bill to section
    doc.fontSize(11).font('Helvetica-Bold').text('BILL TO:', 50, 160);
    doc.fontSize(10).font('Helvetica');
    doc.text(invoice.booking.clientName, 50, 180);
    doc.text(invoice.booking.clientEmail, 50, 195);
    if (invoice.booking.clientPhone) {
      doc.text(invoice.booking.clientPhone, 50, 210);
    }

    // Service details
    doc.fontSize(11).font('Helvetica-Bold').text('SERVICE DETAILS:', 300, 160);
    doc.fontSize(10).font('Helvetica');
    doc.text(
      `Service: ${invoice.booking.service?.title || 'Consultation'}`,
      300,
      180
    );
    doc.text(
      `Scheduled: ${new Date(invoice.booking.scheduledAt).toLocaleDateString()}`,
      300,
      195
    );
    if (invoice.booking.timezone) {
      doc.text(`Timezone: ${invoice.booking.timezone}`, 300, 210);
    }

    // Line items table
    const tableTop = 250;
    const col1 = 50;
    const col2 = 350;
    const col3 = 480;

    // Header row
    doc.fontSize(11).font('Helvetica-Bold');
    doc.fillColor('#4a5568');
    doc.rect(50, tableTop, 500, 25).fill();

    doc.fillColor('white');
    doc.text('Description', col1 + 10, tableTop + 7);
    doc.text('Quantity', col2, tableTop + 7);
    doc.text('Amount', col3, tableTop + 7, { align: 'right' });

    // Data row
    doc.fillColor('black');
    doc.fontSize(10).font('Helvetica');
    const itemY = tableTop + 35;
    doc.text(invoice.booking.service?.description || 'Consultation Service', col1, itemY, {
      width: 300,
    });
    doc.text('1', col2, itemY);
    doc.text(`${invoice.currency} ${invoice.amount.toFixed(2)}`, col3, itemY, {
      align: 'right',
    });

    // Tax row
    const taxY = itemY + 30;
    doc.text('Tax (10%)', col1, taxY);
    doc.text('', col2, taxY);
    doc.text(`${invoice.currency} ${invoice.tax.toFixed(2)}`, col3, taxY, {
      align: 'right',
    });

    // Discount row (if applicable)
    if (invoice.discount > 0) {
      const discountY = taxY + 25;
      doc.text('Discount', col1, discountY);
      doc.text('', col2, discountY);
      doc.text(`-${invoice.currency} ${invoice.discount.toFixed(2)}`, col3, discountY, {
        align: 'right',
      });
    }

    // Total row
    const totalY = taxY + 40;
    doc.moveTo(50, totalY - 10).lineTo(550, totalY - 10).stroke();
    doc.fontSize(12).font('Helvetica-Bold');
    doc.text('TOTAL', col1, totalY);
    doc.text(`${invoice.currency} ${invoice.totalAmount.toFixed(2)}`, col3, totalY, {
      align: 'right',
    });

    // Payment instructions
    doc.moveTo(50, totalY + 40).lineTo(550, totalY + 40).stroke();
    doc.fontSize(10).font('Helvetica-Bold').text('PAYMENT INSTRUCTIONS', 50, totalY + 60);
    doc.fontSize(9).font('Helvetica');
    doc.text(
      'Please arrange payment within 30 days. For payment inquiries, contact support@livingrite.com',
      50,
      totalY + 85,
      { width: 500 }
    );

    // Footer
    doc.fontSize(8).font('Helvetica').fillColor('#999');
    doc.text('Thank you for your business! Please keep this invoice for your records.', 50, 750, {
      align: 'center',
    });

    doc.end();

    return new Promise((resolve, reject) => {
      stream.on('finish', () => resolve(`/invoices/${invoiceNumber}.pdf`));
      stream.on('error', reject);
    });
  } catch (error) {
    console.error('Error generating invoice PDF:', error);
    throw error;
  }
}

/**
 * Create invoice record for a booking
 * Generates both database record and PDF
 */
export async function createInvoiceRecord(
  bookingId: string
): Promise<Invoice> {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: {
      service: true,
      payment: true,
      invoice: true,
    },
  });

  if (!booking) {
    throw new Error('Booking not found');
  }

  // Return if invoice already exists
  if (booking.invoice) {
    return booking.invoice;
  }

  // Calculate amount and totals
  const amount = booking.payment?.amount || booking.service?.basePrice || 0;

  if (amount === 0) {
    throw new Error('Cannot create invoice: no amount specified');
  }

  const tax = amount * 0.1; // 10% tax
  const totalAmount = amount + tax;
  const invoiceNumber = `INV-${Date.now()}-${bookingId.slice(0, 8)}`;

  // Create invoice record
  const invoice = await prisma.invoice.create({
    data: {
      bookingId,
      invoiceNumber,
      amount,
      tax,
      totalAmount,
      currency: booking.payment?.currency || 'USD',
      status: 'DRAFT',
    },
  });

  // Generate PDF
  try {
    const pdfUrl = await generateInvoicePDF(bookingId, invoiceNumber, {
      ...invoice,
      booking,
    });

    // Update invoice with PDF URL
    const updatedInvoice = await prisma.invoice.update({
      where: { id: invoice.id },
      data: {
        pdfUrl,
        status: 'GENERATED',
      },
    });

    return updatedInvoice;
  } catch (error) {
    console.error('Error generating PDF for invoice:', error);
    // Return invoice record even if PDF generation fails
    return invoice;
  }
}

export async function generateInvoice(booking: Booking): Promise<string> {
  try {
    const invoice = await createInvoiceRecord(booking.id);
    return invoice.invoiceNumber;
  } catch (error) {
    console.error('Error generating invoice:', error);
    throw error;
  }
}

export async function generateInvoiceForMultipleBookings(
  bookingIds: string[]
): Promise<string[]> {
  const invoiceNumbers: string[] = [];

  for (const bookingId of bookingIds) {
    try {
      const invoiceNumber = await generateInvoice(
        { id: bookingId } as any
      );
      invoiceNumbers.push(invoiceNumber);
    } catch (error) {
      console.error(`Error generating invoice for booking ${bookingId}:`, error);
    }
  }

  return invoiceNumbers;
}