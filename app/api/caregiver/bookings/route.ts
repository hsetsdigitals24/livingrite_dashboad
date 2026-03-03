import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { randomUUID } from 'crypto';

export const dynamic = 'force-dynamic';

// GET - list upcoming bookings for patients assigned to the logged-in caregiver
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== 'CAREGIVER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // find patients assigned to this caregiver
    const assignments = await prisma.patientCaregiverAssignment.findMany({
      where: {
        caregiverId: session.user.id,
        unassignedAt: null,
      },
      select: { patientId: true },
    });

    const patientIds = assignments.map((a) => a.patientId);

    // fetch bookings for those patients (future bookings only)
    const bookings = await prisma.booking.findMany({
      where: {
        patientId: { in: patientIds },
        scheduledAt: { gte: new Date() },
      },
      orderBy: { scheduledAt: 'asc' },
      include: {
        patient: { select: { firstName: true, lastName: true } },
        service: { select: { title: true } },
        payment: true,
      },
    });

    return NextResponse.json({ success: true, data: bookings });
  } catch (err) {
    console.error('Failed to fetch caregiver bookings', err);
    return NextResponse.json({ success: false, error: 'Could not load bookings' }, { status: 500 });
  }
}

// POST - caregiver creates a booking on behalf of a client (family member) for a patient
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== 'CAREGIVER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { patientId, clientId, scheduledAt, serviceId, notes } = body;

    if (!patientId || !clientId || !scheduledAt) {
      return NextResponse.json({ error: 'patientId, clientId and scheduledAt are required' }, { status: 400 });
    }

    // verify assignment
    const assignment = await prisma.patientCaregiverAssignment.findFirst({
      where: { caregiverId: session.user.id, patientId, unassignedAt: null },
    });

    if (!assignment) {
      return NextResponse.json({ error: 'Patient not assigned to you' }, { status: 403 });
    }

    // verify client relationship to patient
    const fam = await prisma.familyMemberAssignment.findFirst({
      where: { clientId, patientId },
    });

    if (!fam) {
      return NextResponse.json({ error: 'Client is not linked to this patient' }, { status: 403 });
    }

    // create booking (no calcom integration yet; manual entry)
    const booking = await prisma.booking.create({
      data: {
        calcomId: randomUUID(),
        userId: clientId,
        patientId,
        serviceId: serviceId || null,
        scheduledAt: new Date(scheduledAt),
        clientName: '',
        clientEmail: '',
        notes: notes || '',
        status: 'SCHEDULED',
      },
    });

    return NextResponse.json({ success: true, data: booking });
  } catch (err) {
    console.error('Error creating caregiver booking', err);
    return NextResponse.json({ success: false, error: 'Failed to create booking' }, { status: 500 });
  }
}