import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { NextResponse } from 'next/server';

// POST: Upload/update patient media
export async function POST(
  req: Request,
  { params }: { params: { patientId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'CAREGIVER') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { patientId } = params;
    const formData = await req.formData();
    const file = formData.get('file') as File;

    // Verify caregiver has access to this patient
    const assignment = await prisma.patientCaregiverAssignment.findFirst({
      where: {
        patientId,
        caregiverId: session.user.id,
        unassignedAt: null,
      },
    });

    if (!assignment) {
      return NextResponse.json(
        { error: 'Patient not assigned to you' },
        { status: 403 }
      );
    }

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Convert file to base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString('base64');
    const dataUrl = `data:${file.type};base64,${base64}`;

    // Update patient image
    const patient = await prisma.patient.update({
      where: { id: patientId },
      data: {
        image: dataUrl,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Image uploaded successfully',
      imageUrl: patient.image,
    });
  } catch (error) {
    console.error('Error uploading image:', error);
    return NextResponse.json(
      { error: 'Failed to upload image' },
      { status: 500 }
    );
  }
}
