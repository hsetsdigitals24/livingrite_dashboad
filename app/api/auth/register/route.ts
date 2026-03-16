import { NextRequest, NextResponse } from "next/server"
import { hash } from "bcryptjs"
import { prisma } from "@/lib/prisma"
import { sendSignupAcknowledgementEmail, sendVerificationEmail } from "@/lib/email"
import { z } from "zod"
import crypto from "crypto"


export const dynamic = 'force-dynamic'

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(1),
  role: z.enum(["ADMIN", "CAREGIVER", "CLIENT"]).default("CLIENT"),
  verificationCode: z.string().optional(),
  title: z.enum(["RN", "DR"]).optional(), // For caregivers: Registered Nurse or Doctor
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const { email, password, name, role, verificationCode, title } = registerSchema.parse(body)

    // Verify caregiver is on allow list
    if (role === "CAREGIVER") {
      const allowListEntry = await prisma.caregiverAllowList.findUnique({
        where: { email },
      })

      if (!allowListEntry || allowListEntry.status !== "APPROVED") {
        return NextResponse.json(
          { error: "Caregiver registration requires admin approval. Please contact the administrator." },
          { status: 403 }
        )
      }

      if (!title) {
        return NextResponse.json(
          { error: "Title (RN or DR) is required for caregiver registration" },
          { status: 400 }
        )
      }
    }

    // Verify admin signup code for ADMIN registrations
    if (role === "ADMIN") {
      if (!verificationCode) {
        return NextResponse.json(
          { error: "Admin signup code is required" },
          { status: 400 }
        )
      }

      const codeRecord = await prisma.adminSignupCode.findUnique({
        where: { code: verificationCode },
      })

      if (!codeRecord) {
        return NextResponse.json(
          { error: "Invalid signup code" },
          { status: 400 }
        )
      }

      if (codeRecord.isUsed) {
        return NextResponse.json(
          { error: "Signup code has already been used" },
          { status: 400 }
        )
      }

      if (new Date(codeRecord.expiresAt) < new Date()) {
        return NextResponse.json(
          { error: "Signup code has expired" },
          { status: 400 }
        )
      }
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    })
    
    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 409 }
      )
    }
    
    const hashedPassword = await hash(password, 12)

    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        role,
        emailVerificaion: false,
      },
    })
    
    // Create CaregiverProfile if role is CAREGIVER
    if (role === "CAREGIVER") {
      await prisma.caregiverProfile.create({
        data: {
          userId: user.id,
          title: title as "RN" | "DR",
        },
      })
    }
    
    // Mark the admin signup code as used
    if (role === "ADMIN" && verificationCode) {
      await prisma.adminSignupCode.update({
        where: { code: verificationCode },
        data: {
          isUsed: true,
          usedBy: email,
          usedAt: new Date(),
        },
      })
    }
    
    // Create verification token (24 hour expiry)
    const verificationToken = crypto.randomBytes(32).toString('hex')
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
    
    let vr = await prisma.verificationToken.create({
      data: {
        identifier: email,
        token: verificationToken,
        expires: expiresAt,
      },
    })
    console.log('Created verification token:', vr)

    // Send verification email
    try {
      await sendVerificationEmail(email, name, verificationToken)
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError)
      // Continue with signup even if email fails
    }
    
    const { password: _, ...userWithoutPassword } = user
        
    return NextResponse.json(userWithoutPassword, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
