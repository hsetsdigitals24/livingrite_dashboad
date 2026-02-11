import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request: Request, { params }: { params: { token: string } }) {
    const { password, confirmPassword } = await request.json();

    if (!password || !confirmPassword) {
        return new Response(
            JSON.stringify({ error: "Password and confirmation are required" }),
            { status: 400, headers: { "Content-Type": "application/json" } }
        );
    }

    if (password !== confirmPassword) {
        return new Response(
            JSON.stringify({ error: "Passwords do not match" }),
            { status: 400, headers: { "Content-Type": "application/json" } }
        );
    }

    if (password.length < 8) {
        return new Response(
            JSON.stringify({ error: "Password must be at least 8 characters long" }),
            { status: 400, headers: { "Content-Type": "application/json" } }
        );
    }

    try {
        // Find the reset token
        const resetToken = await prisma.passwordResetToken.findUnique({
            where: { token: params.token },
        });

        if (!resetToken) {
            return new Response(
                JSON.stringify({ error: "Invalid or expired reset token" }),
                { status: 404, headers: { "Content-Type": "application/json" } }
            );
        }

        // Check if token has expired
        if (new Date() > resetToken.expiresAt) {
            return new Response(
                JSON.stringify({ error: "Reset token has expired" }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }

        // Check if token has already been used
        if (resetToken.isUsed) {
            return new Response(
                JSON.stringify({ error: "This reset token has already been used" }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Find the user by email
        const user = await prisma.user.findUnique({
            where: { email: resetToken.email },
        });

        if (!user) {
            return new Response(
                JSON.stringify({ error: "User not found" }),
                { status: 404, headers: { "Content-Type": "application/json" } }
            );
        }

        // Update user's password
        await prisma.user.update({
            where: { id: user.id },
            data: { password: hashedPassword },
        });

        // Mark the token as used
        await prisma.passwordResetToken.update({
            where: { id: resetToken.id },
            data: { isUsed: true },
        });

        return new Response(
            JSON.stringify({ message: "Password reset successfully" }),
            { status: 200, headers: { "Content-Type": "application/json" } }
        );
    } catch (error) {
        console.error("Password reset error:", error);
        return new Response(
            JSON.stringify({ error: "Failed to reset password" }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
}
