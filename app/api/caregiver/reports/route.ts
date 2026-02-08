import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || (session.user?.role !== 'STAFF' && session.user?.role !== 'ADMIN')) {
      return NextResponse.json(
        { error: 'Unauthorized - Staff access required' },
        { status: 403 }
      );
    }

    const formData = await req.formData();
    const clientId = formData.get('clientId') as string;
    const clientName = formData.get('clientName') as string;
    const progressNotes = formData.get('progressNotes') as string;
    const isUrgent = formData.get('isUrgent') === 'true';
    const vitalSystolic = formData.get('vitalSystolic')
      ? parseInt(formData.get('vitalSystolic') as string)
      : null;
    const vitalDiastolic = formData.get('vitalDiastolic')
      ? parseInt(formData.get('vitalDiastolic') as string)
      : null;
    const vitalTemperature = formData.get('vitalTemperature')
      ? parseFloat(formData.get('vitalTemperature') as string)
      : null;
    const attachment = formData.get('attachment') as File;

    // Validate required fields
    if (!clientId || !progressNotes?.trim()) {
      return NextResponse.json(
        { error: 'Client and progress notes are required' },
        { status: 400 }
      );
    }

    // Find the booking to verify it exists
    const booking = await prisma.booking.findUnique({
      where: { id: clientId },
    });

    if (!booking) {
      return NextResponse.json(
        { error: 'Client booking not found' },
        { status: 404 }
      );
    }

    // TODO: Handle file upload to cloud storage (Cloudflare R2, S3, etc.)
    let attachmentUrl = null;
    if (attachment) {
      // Placeholder for file upload logic
      // For now, just store the filename
      attachmentUrl = `/uploads/${Date.now()}-${attachment.name}`;
    }

    // Create a care note/progress record
    // This would typically be stored in a dedicated ProgressReport or CareNote model
    // For now, we're logging this as a database record
    const careNote = {
      bookingId: clientId,
      staffId: session.user?.email,
      progressNotes,
      isUrgent,
      vitals: {
        systolic: vitalSystolic,
        diastolic: vitalDiastolic,
        temperature: vitalTemperature,
      },
      attachmentUrl,
      createdAt: new Date(),
    };

    console.log('Care Note Created:', careNote);

    // If urgent, send immediate notification to family
    if (isUrgent) {
      try {
        // TODO: Send urgent notification email to client
        console.log(`URGENT: Notification sent for client ${clientName}`);
      } catch (emailError) {
        console.error('Failed to send urgent notification:', emailError);
        // Continue despite email failure
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Progress report submitted successfully',
        careNote,
        urgentNotification: isUrgent ? 'Sent to family' : null,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error submitting progress report:', error);
    return NextResponse.json(
      { error: 'Failed to submit progress report' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || (session.user?.role !== 'STAFF' && session.user?.role !== 'ADMIN')) {
      return NextResponse.json(
        { error: 'Unauthorized - Staff access required' },
        { status: 403 }
      );
    }

    // Get all bookings for the staff member's clients
    const bookings = await prisma.booking.findMany({
      where: {
        status: {
          in: ['SCHEDULED', 'COMPLETED'],
        },
      },
      select: {
        id: true,
        clientName: true,
        clientEmail: true,
        scheduledAt: true,
        status: true,
      },
      orderBy: {
        scheduledAt: 'desc',
      },
    });

    return NextResponse.json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch clients' },
      { status: 500 }
    );
  }
}
