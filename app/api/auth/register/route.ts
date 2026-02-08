import { NextRequest, NextResponse } from "next/server"
import { hash } from "bcryptjs"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(1),
  role: z.enum(["ADMIN", "CAREGIVER", "CLIENT"]).default("CLIENT"),
  verificationCode: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const { email, password, name, role, verificationCode } = registerSchema.parse(body)

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
        role
      },
    })
    
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
