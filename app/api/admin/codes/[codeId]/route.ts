import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function DELETE(
  req: NextRequest,
  { params }: { params: { codeId: string } }
) {
  try {
    const { codeId } = params;

    const deletedCode = await prisma.adminSignupCode.delete({
      where: { id: codeId },
    });

    return NextResponse.json(deletedCode);
  } catch (error) {
    console.error('Error deleting code:', error);
    return NextResponse.json(
      { error: 'Failed to delete code' },
      { status: 500 }
    );
  }
}
