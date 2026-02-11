import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(
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
        { error: "You do not have permission to add records to this patient" },
        { status: 403 }
      );
    }

    const { date, testResults } = await request.json();

    if (!date || !testResults) {
      return NextResponse.json(
        { error: "Date and test results are required" },
        { status: 400 }
      );
    }

    const labResult = await prisma.labResults.create({
      data: {
        patientId: params.patientId,
        date: new Date(date),
        testResults,
      },
    });

    return NextResponse.json(labResult, { status: 201 });
  } catch (error) {
    console.error("Error creating lab result:", error);
    return NextResponse.json(
      { error: "Failed to create lab result" },
      { status: 500 }
    );
  }
}

export async function GET(
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
        { error: "You do not have access to this patient's records" },
        { status: 403 }
      );
    }

    const results = await prisma.labResults.findMany({
      where: { patientId: params.patientId },
      orderBy: { date: "desc" },
    });

    return NextResponse.json(results);
  } catch (error) {
    console.error("Error fetching lab results:", error);
    return NextResponse.json(
      { error: "Failed to fetch lab results" },
      { status: 500 }
    );
  }
}
