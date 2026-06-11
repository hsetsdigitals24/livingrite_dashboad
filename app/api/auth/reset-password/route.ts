import { sendPasswordResetEmail } from "@/lib/email";
import { prisma } from "@/lib/prisma";
import {randomUUID} from "crypto"


export async function POST(request: Request) {
    const { email } = await request.json();
    if (!email) {
        return new Response(JSON.stringify({ error: 'Email is required' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    const response = await prisma.passwordResetToken.create({
        data: {
            email,
            token: randomUUID(),
            expiresAt: new Date(Date.now() + 3600 * 1000) // Token expires in 1 hour
        }
    }); 

    const resetLink = `${process.env.NEXTAUTH_URL}/auth/reset-password/${response.token}`;


    await sendPasswordResetEmail(email, resetLink);

    return new Response(JSON.stringify({ message: `Password reset link sent to ${email}` }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
    });
}