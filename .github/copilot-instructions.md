# LivingRite Portal - AI Agent Instructions

## Architecture Overview

**Stack**: Next.js 16 (App Router) + NextAuth + Prisma (PostgreSQL) + Sanity CMS
**Purpose**: Smart booking & care management platform with three user roles (ADMIN, CAREGIVER, CLIENT)

### Data Layer
- **Prisma** (`prisma/schema.prisma`): PostgreSQL models for Users, Patients, Bookings, Invoices, Messages, Tickets
- **Sanity**: Content for blog posts, testimonials, case studies, services (read-only in app)
- **Redis**: Available via ioredis for caching/queue operations
- **AWS R2 (Cloudflare)**: File storage with signed URLs (`lib/r2.ts`)

### User Model
Single `User` table with `role` enum (ADMIN, CAREGIVER, CLIENT) - users cannot have multiple roles:
- **ADMIN**: Full access to all data, analytics, user management (`/admin`)
- **CAREGIVER**: Patient data, schedule, messaging (`/caregiver`)
- **CLIENT**: Family portal to view patient records, invoices, communicate (`/client`)
- **PROSPECT**: Initial leads captured via Inquiry model

### Key Entities
- **Patient**: Health entity (separate from User), linked to clients via `FamilyMemberAssignment` (access levels: VIEW, EDIT)
- **Booking**: Consultation sessions with payment tracking (status: PENDING, CONFIRMED, COMPLETED, CANCELLED)
- **Caregiver Assignment**: Connects caregivers to patients with availability/schedule
- **Conversation/Message**: Role-aware messaging between clients and caregivers
- **Ticket**: Support tickets (ADMIN sees all, users see their own)

## Authentication & Authorization

### Pattern: Multi-level Access Control
1. **Middleware** (`proxy.ts`): Protects routes by role (redirects to `/auth/signin`)
2. **API Handlers** (`app/api/**`): `getServerSession()` + role checks
3. **Client Components** (`useUserRole()` hook): Shows UI conditionally

### Common Auth Checks
```typescript
// API route pattern
const session = await getServerSession(authOptions);
if (!session?.user?.id) return 401;
if (session.user.role !== "CLIENT") return 403; // role-specific

// Family access pattern (CLIENT-only)
const access = await prisma.familyMemberAssignment.findUnique({
  where: { patientId_clientId: { patientId, clientId: session.user.id } }
});
if (!access) return 403; // user must have family relationship
```

**JWT Strategy**: 30-day sessions, role + id stored in token

## Development Workflows

### Build & Run
```bash
npm run dev      # Dev server (port 3000)
npm run build    # Next build + prisma generate
npm start        # Production server
npm run lint     # ESLint check
```

### Database Migrations
```bash
npx prisma migrate dev --name description
npx prisma generate  # After schema changes (included in build)
npx prisma studio   # Visual DB browser
```

### File Upload
Files upload to R2 (`app/api/upload/route.ts`): MIME validation, 5MB limit, returns signed URL

## Key File Patterns

### API Routes Conventions
- **Public**: `/api/auth/**`, `/api/bookings` (creation), `/api/search/**`
- **Admin-only**: `/api/admin/**` (reports, analytics, user mgmt)
- **Role-specific**: `/api/client/**` (patient data), `/api/caregiver/**` (assignments)
- **Shared**: `/api/messages/**`, `/api/tickets/**` (with role-aware filtering)

### Response Pattern
```typescript
// Success: { data: {...} } with 200
// Error: { error: "message" } with 400/401/403/500
// List: { items: [...], total, page, limit }
```

### Service Libraries
- `lib/email.ts`: SendGrid (verification, notifications)
- `lib/sms.ts`: SMS reminders via gateway
- `lib/invoice.ts`: PDF generation (jsPDF/pdfkit)
- `lib/proposal.ts`: Service proposals with acceptance workflow
- `lib/blog.ts`: Sanity blog queries
- `lib/reporting/**`: Admin analytics (conversion funnel, client metrics)

## Component Organization

- **`components/admin/**`**: Admin dashboard components
- **`components/forms/**`**: Reusable form inputs
- **`components/nav/**`**: Navigation (role-aware)
- **`components/ui/**`**: shadcn-like primitives (Radix UI)
- **`hooks/useUserRole.ts`**: Universal client-side role access

## Common Implementation Tasks

### Add New API Endpoint
1. Create `app/api/[feature]/route.ts`
2. Add `getServerSession()` check at top
3. Validate role if needed: `if (session.user.role !== "EXPECTED") return 403`
4. For patient data endpoints, verify family relationship
5. Query Prisma, return JSON response

### Add New Page/Feature
1. Create route file (`app/[feature]/page.tsx`)
2. Check auth in server component: `getServerSession()` + `redirect()`
3. Use role-aware hooks on client components: `useUserRole()`
4. Style with Tailwind + Radix UI components

### Patient Data Access
Always verify family relationship before returning patient data:
```typescript
const access = await prisma.familyMemberAssignment.findUnique({...});
if (!access || (access.accessLevel === "VIEW" && isWriteOperation)) return 403;
```

## External Integrations

- **Cal.com**: Embedded consultant booking (`@calcom/embed-react`)
- **SendGrid**: Transactional email
- **Paystack**: Payment processing (webhooks in `/api/payments/webhooks`)
- **Twilio/SMS Gateway**: Appointment reminders
- **Auth Providers**: Google OAuth, Email/Password via Credentials

## Environment Variables
See `.env` - includes DATABASE_URL, Sanity credentials, AWS R2 keys, email/SMS config, payment credentials

## Testing & Debugging
- Dev server logs details to console
- Prisma Studio: `npx prisma studio` (visual data browser)
- NextAuth debug mode enabled in dev environment
- API route testing: Use REST client or `curl` with Authorization header

---

**Last Updated**: 2026-03-16 | **Version**: 1.0
