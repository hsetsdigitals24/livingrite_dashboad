import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';


export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ codeId: string }> }
) {
  try {
    const { codeId } = await params;

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
