---
description: "Overhaul consultation & appointment workflows: remove doctor's visit feature, implement free Cal.com consultations with intake form, and paid dashboard appointments with service selection"
name: "Consultation & Appointment Overhaul"
argument-hint: "feature: [consultations|appointments|cleanup|all]"
agent: "agent"
---

# Consultation & Appointment Workflow Overhaul

## Task Overview
Replace the legacy doctor's visit feature with two separate, purpose-built workflows:
- **Free Consultations**: Cal.com widget → automatic webhook → intake form
- **Paid Appointments**: Family dashboard form → service selection → admin invoice generation

## Implementation Phases

### Phase 1: Cleanup (Preparation)
Remove all doctor's visit feature remnants:
- [ ] Delete doctor's visit table/references from [Prisma schema](../../prisma/schema.prisma)
- [ ] Remove doctor's visit API routes from `app/api/` (identify all `/doctor-visit/*` routes)
- [ ] Delete related components from `components/` (patient-list, booking, scheduling)
- [ ] Remove navigation links to doctor's visit pages (check [header.tsx](../../components/header.tsx), nav components)
- [ ] Clean up database migrations if needed
- [ ] Run `npx prisma migrate dev` to apply schema changes

### Phase 2: Free Consultation Workflow
Implement Cal.com integration with automatic intake form:

**1. Backend Setup**
- [ ] Create `Consultation` Prisma model with fields: `id`, `patientId`, `clientId`, `calComBookingId`, `intakeFormCompleted`, `consultationDetails` (JSON), `createdAt`, `updatedAt`
- [ ] Create webhook endpoint at `app/api/bookings/consultation-webhook/route.ts` to:
  - Receive Cal.com booking confirmation
  - Create Consultation record in database
  - Trigger intake form modal on client
- [ ] Add route to `next-auth.ts` if webhook requires special auth handling

**2. Frontend Setup**
- [ ] Create free consultation page at `app/client/consultation/page.tsx` with:
  - Cal.com embedded widget (`@calcom/embed-react`)
  - Success state that triggers intake form modal
- [ ] Create intake form component at `components/forms/ConsultationIntakeForm.tsx` with fields:
  - Patient age (required)
  - Chief complaint/reason for consultation
  - Medical history summary
  - Current medications
  - Preferred follow-up date (optional)
- [ ] Create API route `app/api/client/consultation-intake/route.ts` to save intake form data

**3. Navigation & Access**
- [ ] Add "Book Free Consultation" link to client dashboard and header (role-aware)
- [ ] Protect consultation routes with CLIENT role check

### Phase 3: Paid Doctor's Appointment Workflow
Implement appointment booking with service selection on family dashboard:

**1. Database Model**
- [ ] Create `DoctorAppointment` Prisma model with fields:
  - `id`, `patientId`, `clientId`, `appointmentDate`, `appointmentTime`
  - `services` (JSON array with structure: `{serviceId, serviceName, amount}`)
  - `customServices` (JSON array: `{name, notes}` - no amount)
  - `appointmentNotes`, `urgencyLevel`, `patientAge`
  - `status` (enum: PENDING, CONFIRMED, COMPLETED, CANCELLED)
  - `invoiceId` (reference to Invoice)
  - `createdAt`, `updatedAt`
- [ ] Create `Service` model if not exists with: `id`, `name`, `description`, `amount`, `isActive`
- [ ] Add relationship: `Invoice` → `DoctorAppointment` (one-to-one)

**2. Admin Dashboard** 
- [ ] Create admin service management page at `app/admin/services/page.tsx`:
  - Table of available services with name, amount, active status
  - Add/edit/delete services (CRUD operations)
  - API route `app/api/admin/services/route.ts` (POST, GET, PUT, DELETE)
- [ ] Add admin invoice generation page at `app/admin/invoices/appointment/[id]/page.tsx`:
  - Show appointment details and service breakdown
  - Generate/send invoice via email (use [lib/invoice.ts](../../lib/invoice.ts))

**3. Client-Facing Appointment Booking**
- [ ] Create appointment booking form at `app/client/booking/appointment/page.tsx`:
  - Patient selection (family members)
  - Preferred appointment date/time
  - Service selection dropdown (populated from admin services list)
  - Option to add custom service (name + notes, no amount)
  - Appointment notes field
  - Urgency level selector
  - Submit to create appointment in PENDING status
- [ ] Create API route `app/api/client/appointments/route.ts` (POST) to:
  - Validate client has access to patient
  - Create DoctorAppointment record
  - Return appointment confirmation
- [ ] Create appointment history/details page at `app/client/appointments/page.tsx`:
  - List all appointments for family members
  - Show service breakdown and invoice status
  - Link to invoice if available

**4. Invoice Workflow**
- [ ] Admin views pending appointments at `app/admin/appointments/page.tsx`
- [ ] Admin clicks "Generate Invoice" which:
  - Calls `app/api/admin/appointments/[id]/invoice/route.ts` (POST)
  - Calculates total: `sum(selectedServices.amount) + customServices are non-billable`
  - Creates Invoice record (use [lib/invoice.ts](../../lib/invoice.ts))
  - Links Invoice to DoctorAppointment
  - Sends invoice email to client
  - Updates appointment status to CONFIRMED

## Data Flow Diagrams

### Free Consultation
```
Client clicks "Book Consultation" 
    → Cal.com widget opens 
    → Client selects time
    → Cal.com confirmation 
    → Webhook → Create Consultation record 
    → Intake form modal appears 
    → Client fills intake form 
    → Stored in DB, consultation_complete
```

### Paid Appointment
```
Family member clicks "Book Appointment"
    → Select patient, date, time
    → Select services from dropdown OR add custom service
    → Submit form
    → Create DoctorAppointment (PENDING status)
    → Admin reviews appointments
    → Admin generates invoice
    → Invoice created + email sent
    → Appointment status → CONFIRMED
```

## Key Implementation Notes

- **Services**: Admin-configured list stored in database, dropdown fetches via `GET /api/admin/services`
- **Custom Services**: Family can add custom service names but no amounts (admin decides billing separately)
- **Age**: Both intake form and appointment form capture patient age (required field)
- **Payment Timing**: Admin decides when to generate invoice (not automatic at booking)
- **Security**: 
  - Consultations & appointments accessible only to `CLIENT` role via family relationships
  - Services CRUD only for `ADMIN` role
  - Invoice generation only for `ADMIN` role
- **Status Flow**: Consultation is auto-complete, Appointment is PENDING → CONFIRMED (after invoice)

## Testing Checklist
- [ ] Webhook from Cal.com triggers correctly and creates Consultation record
- [ ] Intake form appears after Cal.com booking and saves data
- [ ] Client can select from admin services list in appointment form
- [ ] Custom services can be added without amounts
- [ ] Admin service CRUD works (add/edit/delete)
- [ ] Admin can generate invoice for appointments
- [ ] Invoice email sent to client after generation
- [ ] Only logged-in clients can see their consultations/appointments
- [ ] Remove all traces of old doctor's visit feature

## Files to Create/Modify
**Create**: Models, API routes, pages, and forms listed above
**Modify**: [prisma/schema.prisma](../../prisma/schema.prisma), database migrations, navigation components
**Delete**: All `/api/**/doctor-visit` routes, old consultation/booking components, old doctor visit pages
