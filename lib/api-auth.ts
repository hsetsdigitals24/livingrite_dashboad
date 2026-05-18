import { getServerSession, Session } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export type Role = 'ADMIN' | 'CAREGIVER' | 'CLIENT' | 'PROSPECT';

export type AuthedSession = Session & {
  user: { id: string; role: Role; email?: string | null; name?: string | null };
};

export type AuthSuccess = { session: AuthedSession; response?: never };
export type AuthFailure = { session?: never; response: NextResponse };
export type AuthResult = AuthSuccess | AuthFailure;

/**
 * Get the current session and assert the user has one of the allowed roles.
 * Usage:
 *   const auth = await requireRole('CAREGIVER');
 *   if (auth.response) return auth.response;
 *   const { session } = auth;
 */
export async function requireRole(...allowed: Role[]): Promise<AuthResult> {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return { response: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) };
  }

  if (allowed.length && !allowed.includes(session.user.role as Role)) {
    return { response: NextResponse.json({ error: 'Forbidden' }, { status: 403 }) };
  }

  return { session: session as AuthedSession };
}

/**
 * Assert a CLIENT has a FamilyMemberAssignment for the given patient.
 * Pass `write: true` to also require EDIT (not VIEW-only) access.
 * Returns null when access is allowed, or a NextResponse to short-circuit the handler.
 */
export async function requirePatientAccess(
  patientId: string,
  clientId: string,
  options: { write?: boolean } = {}
): Promise<NextResponse | null> {
  const access = await prisma.familyMemberAssignment.findUnique({
    where: { patientId_clientId: { patientId, clientId } },
  });

  if (!access) {
    return NextResponse.json({ error: 'Access denied to this patient' }, { status: 403 });
  }

  if (options.write && access.accessLevel === 'VIEW') {
    return NextResponse.json(
      { error: 'You do not have permission to modify this patient' },
      { status: 403 }
    );
  }

  return null;
}

/**
 * Assert a CAREGIVER has an active assignment to the given patient.
 */
export async function requireCaregiverAssignment(
  patientId: string,
  caregiverId: string
): Promise<NextResponse | null> {
  const assignment = await prisma.patientCaregiverAssignment.findFirst({
    where: { patientId, caregiverId, unassignedAt: null },
    select: { id: true },
  });

  if (!assignment) {
    return NextResponse.json({ error: 'Patient not assigned to you' }, { status: 403 });
  }

  return null;
}
