import PDFDocument from 'pdfkit';
import { Booking, Invoice } from '@prisma/client';
import { createWriteStream } from 'fs';
import { join } from 'path';
import { mkdir } from 'fs/promises';
import { prisma } from '@/lib/prisma';

export async function generateInvoice(booking: Booking): Promise<string> {
  try {
    // Ensure invoices directory exists
    const invoicesDir = join(process.cwd(), 'public', 'invoices');
    await mkdir(invoicesDir, { recursive: true });

    const invoiceNumber = `INV-${booking.id.slice(0, 8)}-${Date.now()}`;
    const doc = new PDFDocument({ margin: 50 });
    
    const filePath = join(invoicesDir, `${invoiceNumber}.pdf`);
    const stream = createWriteStream(filePath);
    
    doc.pipe(stream);

    // Header
    doc.fontSize(24).font('Helvetica-Bold').text('INVOICE', { align: 'left' });
    doc.fontSize(10).font('Helvetica').text(`Invoice #: ${invoiceNumber}`, { align: 'left' });
    doc.text(`Date: ${new Date().toLocaleDateString()}`, { align: 'left' });
    doc.text(`Booking ID: ${booking.id}`, { align: 'left' });
    doc.moveDown();

    // Client details
    doc.fontSize(12).font('Helvetica-Bold').text('Bill To:', { underline: true });
    doc.fontSize(10).font('Helvetica');
    doc.text(`Name: ${booking.clientName}`);
    doc.text(`Email: ${booking.clientEmail}`);
    if (booking.clientPhone) doc.text(`Phone: ${booking.clientPhone}`);
    doc.moveDown();

    // Service details
    doc.fontSize(12).font('Helvetica-Bold').text('Service Details:', { underline: true });
    doc.fontSize(10).font('Helvetica');
    if (booking.eventTitle) doc.text(`Service: ${booking.eventTitle}`);
    doc.text(`Scheduled: ${new Date(booking.scheduledAt).toLocaleString()}`);
    if (booking.timezone) doc.text(`Timezone: ${booking.timezone}`);
    doc.moveDown();

    // Line items table
    const tableTop = doc.y;
    const col1 = 50;
    const col2 = 300;
    const col3 = 450;

    doc.fontSize(11).font('Helvetica-Bold');
    doc.text('Description', col1, tableTop);
    doc.text('Quantity', col2, tableTop);
    doc.text('Amount', col3, tableTop, { align: 'right' });
    
    // Draw line under header
    doc.moveTo(50, tableTop + 20).lineTo(550, tableTop + 20).stroke();

    // Fetch invoice data from database
    const invoice = await prisma.invoice.findUnique({
      where: { bookingId: booking.id },
    });

    const amount = invoice?.amount || 0;
    const currency = invoice?.currency || 'USD';

    // Line item
    doc.fontSize(10).font('Helvetica');
    doc.text('Consultation Service', col1, tableTop + 35);
    doc.text('1', col2, tableTop + 35);
    doc.text(`${currency} ${amount.toFixed(2)}`, col3, tableTop + 35, { align: 'right' });

    // Total
    const totalY = tableTop + 80;
    doc.moveTo(50, totalY).lineTo(550, totalY).stroke();
    
    doc.fontSize(12).font('Helvetica-Bold');
    doc.text('Total:', col1, totalY + 15);
    doc.text(`${currency} ${amount.toFixed(2)}`, col3, totalY + 15, { align: 'right' });

    // Footer
    doc.fontSize(9).font('Helvetica');
    doc.moveDown(3);
    doc.text('Thank you for your business!', { align: 'center' });
    doc.text('For inquiries, contact support@livingrite.com', { align: 'center' });

    doc.end();
    
    return new Promise((resolve, reject) => {
      stream.on('finish', () => resolve(invoiceNumber));
      stream.on('error', reject);
    });
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
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
    });

    if (booking) {
      const invoiceNumber = await generateInvoice(booking);
      invoiceNumbers.push(invoiceNumber);
    }
  }

  return invoiceNumbers;
}