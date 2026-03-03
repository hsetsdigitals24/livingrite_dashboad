import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// GET - upcoming doctor appointments for family members of the client
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== 'CLIENT') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // gather patient ids linked to this client
    const assignments = await prisma.familyMemberAssignment.findMany({
      where: { clientId: session.user.id },
      select: { patientId: true },
    });
    const patientIds = assignments.map((a) => a.patientId);

    const appointments = await prisma.medicalAppointment.findMany({
      where: {
        patientId: { in: patientIds },
        date: { gte: new Date() },
      },
      orderBy: { date: 'asc' },
      include: {
        patient: { select: { firstName: true, lastName: true } },
      },
    });

    return NextResponse.json({ success: true, data: appointments });
  } catch (err) {
    console.error('Failed to fetch client doctor appointments', err);
    return NextResponse.json({ success: false, error: 'Could not load appointments' }, { status: 500 });
  }
}

// POST - client can log a doctor appointment for their family member
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== 'CLIENT') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { patientId, date, provider, reason, notes } = await req.json();
    if (!patientId || !date || !provider || !reason) {
      return NextResponse.json({ error: 'patientId, date, provider and reason are required' }, { status: 400 });
    }

    // verify family relationship
    const fam = await prisma.familyMemberAssignment.findFirst({
      where: { clientId: session.user.id, patientId },
    });
    if (!fam) {
      return NextResponse.json({ error: 'Patient is not linked to you' }, { status: 403 });
    }

    const appointment = await prisma.medicalAppointment.create({
      data: {
        patientId,
        date: new Date(date),
        provider,
        reason,
        notes: notes || '',
      },
    });

    return NextResponse.json({ success: true, data: appointment });
  } catch (err) {
    console.error('Error creating client doctor appointment', err);
    return NextResponse.json({ success: false, error: 'Failed to create appointment' }, { status: 500 });
  }
}
