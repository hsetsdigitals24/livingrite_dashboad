import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function PATCH(
  request: Request,
  { params }: { params: { patientId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id || session.user?.role !== "CLIENT") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify access to this patient
    const access = await prisma.familyMemberAssignment.findUnique({
      where: {
        patientId_clientId: {
          patientId: params.patientId,
          clientId: session.user.id,
        },
      },
    });

    if (!access || access.accessLevel === "VIEW") {
      return NextResponse.json(
        { error: "You do not have permission to update this patient's records" },
        { status: 403 }
      );
    }

    const {
      firstName,
      lastName,
      email,
      phone,
      dateOfBirth,
      biologicalGender,
      heightCm,
      weightKg,
      timezone,
      medicalConditions,
      emergencyContact,
      emergencyPhone,
    } = await request.json();

    const updateData: any = {};

    if (firstName !== undefined) updateData.firstName = firstName;
    if (lastName !== undefined) updateData.lastName = lastName;
    if (email !== undefined) updateData.email = email;
    if (phone !== undefined) updateData.phone = phone;
    if (dateOfBirth !== undefined) updateData.dateOfBirth = dateOfBirth ? new Date(dateOfBirth) : null;
    if (biologicalGender !== undefined) updateData.biologicalGender = biologicalGender;
    if (heightCm !== undefined) updateData.heightCm = heightCm ? parseFloat(heightCm) : null;
    if (weightKg !== undefined) updateData.weightKg = weightKg ? parseFloat(weightKg) : null;
    if (timezone !== undefined) updateData.timezone = timezone;
    if (medicalConditions !== undefined) updateData.medicalConditions = medicalConditions;
    if (emergencyContact !== undefined) updateData.emergencyContact = emergencyContact;
    if (emergencyPhone !== undefined) updateData.emergencyPhone = emergencyPhone;

    const updatedPatient = await prisma.patient.update({
      where: { id: params.patientId },
      data: updateData,
    });

    return NextResponse.json(updatedPatient);
  } catch (error) {
    console.error("Error updating patient:", error);
    return NextResponse.json(
      { error: "Failed to update patient" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { patientId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id || session.user?.role !== "CLIENT") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify access to this patient
    const access = await prisma.familyMemberAssignment.findUnique({
      where: {
        patientId_clientId: {
          patientId: params.patientId,
          clientId: session.user.id,
        },
      },
    });

    if (!access) {
      return NextResponse.json(
        { error: "You do not have access to this patient" },
        { status: 403 }
      );
    }

    // Delete the family member relationship (soft delete by just removing the assignment)
    await prisma.familyMemberAssignment.delete({
      where: {
        patientId_clientId: {
          patientId: params.patientId,
          clientId: session.user.id,
        },
      },
    });

    return NextResponse.json({ message: "Family member removed successfully" });
  } catch (error) {
    console.error("Error removing family member:", error);
    return NextResponse.json(
      { error: "Failed to remove family member" },
      { status: 500 }
    );
  }
}
