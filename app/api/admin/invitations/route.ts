import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"
import { nextAuthOptions } from "@/next-auth"
import crypto from "crypto"

const createInvitationSchema = z.object({
  email: z.string().email(),
  role: z.enum(["ADMIN", "STAFF", "CLIENT"]),
  expiryDays: z.number().optional().default(7),
})

// Middleware to check if user is admin
async function isAdmin() {
  const session = await getServerSession(nextAuthOptions)
  return session?.user?.role === "ADMIN"
}

// GET: List all pending invitations (admin only)
export async function GET(request: NextRequest) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json(
        { error: "Unauthorized - Admin access required" },
        { status: 403 }
      )
    }

    const invitations = await prisma.invitation.findMany({
      where: { used: false },
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
        expiresAt: true,
        used: true,
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(invitations)
  } catch (error) {
    console.error("Error fetching invitations:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// POST: Create a new invitation (admin only)
export async function POST(request: NextRequest) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json(
        { error: "Unauthorized - Admin access required" },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { email, role, expiryDays } = createInvitationSchema.parse(body)

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      )
    }

    // Check if an unused invitation already exists for this email
    const existingInvitation = await prisma.invitation.findFirst({
      where: {
        email: email.toLowerCase(),
        used: false,
        expiresAt: {
          gt: new Date(),
        },
      },
    })

    if (existingInvitation) {
      return NextResponse.json(
        { error: "An active invitation already exists for this email" },
        { status: 400 }
      )
    }

    const session = await getServerSession(nextAuthOptions)
    const invitationCode = crypto.randomBytes(32).toString("hex")
    const expiresAt = new Date(Date.now() + expiryDays * 24 * 60 * 60 * 1000)

    const invitation = await prisma.invitation.create({
      data: {
        email: email.toLowerCase(),
        role,
        invitationCode,
        invitedBy: session!.user!.id!,
        expiresAt,
      },
      select: {
        id: true,
        email: true,
        role: true,
        invitationCode: true,
        createdAt: true,
        expiresAt: true,
      },
    })

    return NextResponse.json(invitation, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.errors },
        { status: 400 }
      )
    }

    console.error("Error creating invitation:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
