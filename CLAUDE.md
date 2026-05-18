# LivingRite Portal - AI Assistant Guide

Quick reference for working on the LivingRite Portal project.

## Project Overview

**Stack**: Next.js 16 (App Router) + NextAuth + Prisma (PostgreSQL) + Sanity CMS
**Purpose**: Smart booking & care management platform for healthcare services
**Key Roles**: ADMIN, CAREGIVER, CLIENT (single role per user)

## Quick Start

```bash
npm run dev      # Start dev server (port 3000)
npm run build    # Build for production
npx prisma studio  # Visual database browser
```

## Architecture Layers

### Database (Prisma + PostgreSQL)

- **Schema**: `prisma/schema.prisma`
- User, Patient, Booking, Caregiver Assignment, Conversation, Message, Ticket, Invoice
- Single `User` table with `role` enum (ADMIN, CAREGIVER, CLIENT, PROSPECT)

### API Routes

- Location: `app/api/`
- Pattern: Check session → validate role → check patient access (for family) → query/mutate → return JSON
- Response format: `{ data: {...} }` (200) or `{ error: "message" }` (400/401/403/500)

### Frontend (Next.js App Router)

- Routes in `app/` (layout.tsx, page.tsx files)
- Server-side auth check: `getServerSession()` + `redirect()` if unauthorized
- Client components: Use `useUserRole()` hook from `hooks/useUserRole.ts`
- Styling: Tailwind CSS + Radix UI components in `components/ui/`

### External Services

- **Email**: SendGrid (`lib/email.ts`)
- **SMS**: Gateway (`lib/sms.ts`)
- **File Storage**: AWS R2/Cloudflare (`lib/r2.ts`) - 5MB limit, MIME validation
- **Payments**: Paystack (webhooks in `app/api/payments/webhooks/`)
- **Content**: Sanity CMS (read-only in app, queries in `lib/blog.ts`, `lib/testimonials.ts`)
- **Booking**: Cal.com embed (`@calcom/embed-react`)

## Authentication & Authorization Patterns

### Route Protection

```typescript
// Server component: Redirect if not authenticated
const session = await getServerSession(authOptions);
if (!session) redirect("/auth/signin");
if (session.user.role !== "CLIENT") redirect("/unauthorized");

// API route: Return 401/403 if unauthorized
const session = await getServerSession(authOptions);
if (!session?.user?.id)
  return new Response(JSON.stringify({ error: "Unauthorized" }), {
    status: 401,
  });
if (session.user.role !== "CLIENT")
  return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403 });
```

### Patient Data Access (Critical)

Clients can only access patient data if they have a `FamilyMemberAssignment`:

```typescript
const access = await prisma.familyMemberAssignment.findUnique({
  where: { patientId_clientId: { patientId, clientId: session.user.id } },
});
if (!access)
  return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403 });
if (access.accessLevel === "VIEW" && isWriteOperation)
  return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403 });
```

## Common Tasks & Patterns

### Add New API Endpoint

1. Create `app/api/[feature]/route.ts`
2. Add auth check at top: `getServerSession()` + role check
3. For patient data: Verify family relationship with `FamilyMemberAssignment`
4. Query Prisma, return JSON response
5. Handle errors with appropriate status codes (400, 401, 403, 500)

### Add New Page/Feature

1. Create route: `app/[feature]/page.tsx` (server component)
2. Check auth: `getServerSession()` + `redirect()` if needed
3. For client-side role checks: Use `useUserRole()` hook
4. Style with Tailwind + Radix UI components from `components/ui/`

### Add Form Component

1. Create in `components/forms/[FormName].tsx`
2. Use React Hook Form for state management
3. Submit to API endpoint with `fetch()` or similar
4. Handle errors and loading states

### Add Database Model

1. Update `prisma/schema.prisma`
2. Run migration: `npx prisma migrate dev --name descriptive_name`
3. Update TypeScript types if needed
4. Update seed.ts if needed for test data

## File Organization

```
app/
  api/                 # API routes
    admin/            # Admin-only endpoints
    client/           # Client-specific endpoints
    caregiver/        # Caregiver-specific endpoints
    auth/             # Authentication endpoints
    [feature]/        # Feature-specific endpoints

  admin/              # Admin dashboard pages
  client/             # Client portal pages
  caregiver/          # Caregiver dashboard pages
  auth/               # Authentication pages (signin, signup, etc.)
  [public]/           # Public pages (about, contact, blog, etc.)

components/
  admin/              # Admin-specific components
  forms/              # Form components
  ui/                 # Reusable UI components
  nav/                # Navigation components
  [feature]/          # Feature-specific components

lib/
  auth.ts             # Auth utilities
  email.ts            # SendGrid integration
  sms.ts              # SMS integration
  r2.ts               # File upload (R2)
  invoice.ts          # Invoice generation
  reporting/          # Admin analytics
  [feature].ts        # Feature utilities

prisma/
  schema.prisma       # Database schema
  migrations/         # Migration files
  seed.ts             # Seed data

types/                # TypeScript type definitions
hooks/                # React hooks
```

## Environment Variables

See `.env` file - includes:

- `DATABASE_URL` - PostgreSQL connection
- `SANITY_*` - Sanity CMS credentials
- `AWS_R2_*` - R2 storage keys
- `SENDGRID_API_KEY` - Email service
- `TWILIO_*` - SMS service (or alternative)
- `NEXTAUTH_*` - NextAuth configuration
- `PAYSTACK_*` - Payment credentials
- `CALCOM_*` - Cal.com booking

## Debugging & Tools

- **Dev Console**: Check `npm run dev` output for logs
- **Prisma Studio**: `npx prisma studio` - visual database browser
- **NextAuth Debug**: Enable in dev environment
- **Network Tab**: Browser DevTools for API requests
- **Logs**: Check terminal for server-side errors

## Useful Commands

```bash
npm run dev              # Start dev server
npm run build            # Build for production
npm start                # Start production server
npm run lint             # Run ESLint
npx prisma migrate dev   # Create migration
npx prisma studio       # Open Prisma Studio
npx prisma generate     # Regenerate Prisma client
npm run seed             # Seed database (if script exists)
```

## Key Conventions

- **Naming**: camelCase for JS/TS, kebab-case for file names (except components)
- **Components**: Prefer server components, use `'use client'` only when needed
- **API Routes**: Always return JSON with `{ data: {...} }` or `{ error: "..." }`
- **Errors**: Use standard HTTP status codes (400, 401, 403, 404, 500)
- **Types**: Keep in `types/` directory, import as needed
- **Hooks**: Keep in `hooks/` directory, prefix with `use`

## Common Gotchas

1. **Patient Access**: Always verify `FamilyMemberAssignment` before returning patient data
2. **Role Checks**: Single role per user - don't allow role combinations
3. **File Uploads**: 5MB limit, validate MIME types in `app/api/upload/route.ts`
4. **Prisma**: Run `npx prisma generate` after schema changes (included in build)
5. **NextAuth**: Session includes `user.id` and `user.role` - check both for security
6. **Middleware**: Auth redirects happen in `proxy.ts` - review route patterns there

## Need Help?

- Check existing similar endpoints in `app/api/`
- Look at existing pages in `app/` for pattern examples
- Review `lib/` utilities for common operations
- Refer to `.github/copilot-instructions.md` for more detailed architecture

---

**Last Updated**: May 14, 2026
