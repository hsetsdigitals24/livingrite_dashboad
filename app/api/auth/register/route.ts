import { NextRequest, NextResponse } from "next/server"
import { hash } from "bcryptjs"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(1),
  role: z.enum(["ADMIN", "STAFF", "CLIENT"]).default("CLIENT"),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const { email, password, name, role, verificationCode } = registerSchema.parse(body)

    // Verify verification code only for admin registrations
    if (role === "ADMIN") {
      const isCodeValid = await prisma.verificationCode.findFirst({
        where: {
          code: verificationCode,
          used: false,
        },
      })

      if (!isCodeValid) {
        return NextResponse.json(
          { error: "Invalid or used verification code" },
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
    
    const { password: _, ...userWithoutPassword } = user
    
    // Mark the verification code as used (only for admins)
    if (role === "ADMIN") {
      const verificationCodeRecord = await prisma.verificationCode.findFirst({
        where: {
          code: verificationCode,
        },
      })
      
      if (verificationCodeRecord) {
        await prisma.verificationCode.update({
          where: { id: verificationCodeRecord.id },
          data: { used: true },
        })
      }
    }
        
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
