import PDFDocument from 'pdfkit';
import { Booking } from '@prisma/client';
import { createWriteStream } from 'fs';
import { join } from 'path';

export async function generateInvoice(booking: Booking): Promise<string> {
  const invoiceNumber = `INV-${Date.now()}`;
  const doc = new PDFDocument();
  
  const filePath = join(process.cwd(), 'public', 'invoices', `${invoiceNumber}.pdf`);
  const stream = createWriteStream(filePath);
  doc.pipe(stream);

  // Header
  doc.fontSize(20).text('INVOICE', 50, 50);
  doc.fontSize(10).text(`Invoice #: ${invoiceNumber}`, 50, 80);
  doc.text(`Date: ${new Date().toLocaleDateString()}`, 50, 95);

  // Client details
  doc.text(`Bill To:`, 50, 130);
  doc.text(booking.clientName, 50, 145);
  doc.text(booking.clientEmail, 50, 160);

  // Line items
  doc.text('Description', 50, 200);
  doc.text('Amount', 450, 200);
  doc.moveTo(50, 215).lineTo(550, 215).stroke();
  
  doc.text('Consultation Service', 50, 230);
  doc.text(`₦${booking.paymentAmount?.toLocaleString()}`, 450, 230);

  // Total
  doc.moveTo(50, 260).lineTo(550, 260).stroke();
  doc.fontSize(12).text('Total', 350, 275);
  doc.text(`₦${booking.paymentAmount?.toLocaleString()}`, 450, 275);

  doc.end();
  
  return invoiceNumber;
}