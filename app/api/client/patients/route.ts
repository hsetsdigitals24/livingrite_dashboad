import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id || session.user?.role !== "CLIENT") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get all patients associated with this client
    const familyMembers = await prisma.familyMemberAssignment.findMany({
      where: { clientId: session.user.id },
      include: {
        patient: {
          include: {
            vitals: {
              orderBy: { recordedAt: "desc" },
              take: 5,
            },
            dailyLogs: {
              orderBy: { date: "desc" },
              take: 10,
            },
            labResults: {
              orderBy: { date: "desc" },
              take: 5,
            },
            medicalAppointments: {
              orderBy: { date: "desc" },
              take: 5,
            },
            bookings: {
              orderBy: { scheduledAt: "desc" },
              take: 5,
              include: {
                payment: true,
              },
            },
            files: {
              orderBy: { createdAt: "desc" },
              take: 10,
            },
          },
        },
      },
    });

    return NextResponse.json(familyMembers);
  } catch (error) {
    console.error("Error fetching patients:", error);
    return NextResponse.json(
      { error: "Failed to fetch patients" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id || session.user?.role !== "CLIENT") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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
      relationshipType,
    } = await request.json();

    if (!firstName || !lastName) {
      return NextResponse.json(
        { error: "First name and last name are required" },
        { status: 400 }
      );
    }

    if (!relationshipType) {
      return NextResponse.json(
        { error: "Relationship type is required" },
        { status: 400 }
      );
    }

    // Create the patient
    const patient = await prisma.patient.create({
      data: {
        firstName,
        lastName,
        email: email || null,
        phone: phone || null,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
        biologicalGender: biologicalGender || null,
        heightCm: heightCm || null,
        weightKg: weightKg || null,
        timezone: timezone || null,
        medicalConditions: medicalConditions || [],
        emergencyContact: emergencyContact || null,
        emergencyPhone: emergencyPhone || null,
      },
    });

    // Create the family member relationship
    await prisma.familyMemberAssignment.create({
      data: {
        patientId: patient.id,
        clientId: session.user.id,
        relationshipType,
        accessLevel: "EDIT",
      },
    });

    return NextResponse.json(
      { message: "Family member added successfully", patientId: patient.id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating family member:", error);
    return NextResponse.json(
      { error: "Failed to create family member" },
      { status: 500 }
    );
  }
}

