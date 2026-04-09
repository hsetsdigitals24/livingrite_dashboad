# Booking & Payment Workflow Refactoring - Implementation Summary

## Overview
Your booking and payment workflow has been successfully overhauled. The system now decouples bookings from payments, moving to a client-based invoice system where payments are manually tracked.

## What Changed

### 1. Database Schema (✅ Complete)

#### Added Models
- **AdminSettings**: Stores payment account details
  - Account name, number, bank name, bank code
  - Payment currency and instructions
  - Singleton pattern (one record per installation)

#### Modified Models
- **Invoice**: Now client-centric, not booking-centric
  - New field: `clientId` (required)
  - New field: `servicesData` (JSON array of services)
  - New fields: `paymentNote`, `markedPaidBy`, `markedPaidAt`
  - Changed: `bookingId` is now optional (NOT unique)
  - Removed: `serviceId` foreign key

- **Booking**: Payment decoupled
  - Removed: `payment` relationship to Payment model
  - Removed: `invoice` relationship to Invoice model
  - Rest of booking functionality unchanged

#### Deprecated Models (Left Commented for Reference)
- `Payment` (no longer used)
- `PaymentAttempt` (no longer used)
- `RefundRequest` (no longer used)

**Migration Applied**: `20260408025339_refactor_booking_invoice_workflow`

---

## New Features & APIs

### Admin Settings Management
**Endpoint**: `/api/admin/settings`
- **GET**: Fetch current payment settings
- **PUT**: Update payment account details
- **Access**: Admin only

**Page**: `/admin/settings`
- Configure bank account details that appear on all invoices
- Fields: Account name, number, bank, code, currency, instructions
- Visual preview of how it appears in invoices

### Invoice Generation (Admin-Only)
**Endpoint**: `/api/admin/invoices`
- **POST**: Create new invoice
  - Required: `clientId`, `amount`
  - Optional: `patientId`, `services[]`, `tax`, `discount`, `paymentNote`, `dueAt`
  - Returns: Created invoice object
- **GET**: List all invoices
  - Query params: `status`, `clientId`, `page`, `limit`
  - Returns: Paginated invoices with client/patient details

**Page**: `/admin/invoices`
- Dashboard showing all invoices
- Filter by status: DRAFT, GENERATED, SENT, VIEWED, PAID, OVERDUE, CANCELLED
- Quick actions: View, Send Email, Mark as Paid, Edit
- Stats: Total invoices, amount due, amount paid

**Page**: `/admin/invoices/create`
- Form to create invoices
- Client selection dropdown
- Add multiple services dynamically
- Calculate subtotal, tax, discount, total automatically
- Optional due date and payment instructions

### Invoice Management (Admin-Only)
**Endpoint**: `/api/admin/invoices/[invoiceId]`
- **GET**: Fetch specific invoice
- **PUT**: Update invoice status
  - Statuses: DRAFT, GENERATED, SENT, VIEWED, PAID, OVERDUE, CANCELLED
  - When marked PAID: Records `markedPaidBy` and `markedPaidAt`
- **POST**: Send invoice to client via email
  - Action: `send`
  - Includes payment account details from AdminSettings
  - Automatically updates status to SENT

### Client Invoice Management
**Endpoint**: `/api/invoices/my-invoices`
- **GET**: Fetch invoices for logged-in client
- **Authentication**: Requires CLIENT role
- Returns: All invoices where user is the `clientId`

**Page**: `/client/invoices`
- View all personal invoices
- Filter by status
- Download invoice PDFs
- See payment status and due dates
- **NO "Pay Now" button** (payments are manual/external)

### Supporting APIs
**Endpoint**: `/api/admin/clients`
- **GET**: Fetch all CLIENT role users (for invoice creation form)

**Endpoint**: `/api/admin/services`
- **GET**: Fetch all active services (for invoice creation form)

---

## Email Template

When an invoice is sent to a client, they receive an email containing:
- Invoice number and date
- Service breakdown (what they're being billed for)
- Amount details (subtotal, tax, discount, total)
- **Payment Account Information**:
  - Account name
  - Account number
  - Bank name
  - Bank code
  - Currency
- Special instructions (if any)
- Professional footer

The email is generated dynamically from `AdminSettings`, so changes to payment details are immediately reflected in new invoice emails.

---

## Workflow Examples

### Creating and Sending an Invoice to a Client

```
1. Admin goes to /admin/invoices/create
2. Selects client: "John Doe"
3. Adds services:
   - "End-of-Life Care Consultation" @ ₦50,000
   - "Follow-up Session" @ ₦25,000
4. Sets subtotal: ₦75,000
5. Sets tax: ₦11,250 (15%)
6. Total due: ₦86,250
7. Sets due date: 7 days from now
8. Adds note: "Please include invoice number in transfer reference"
9. Clicks "Create Invoice"
10. Invoice created with status: GENERATED
11. Admin goes to /admin/invoices
12. Finds the new invoice
13. Clicks "Send" button
14. Invoice email sent to client with payment account details
15. Invoice status changes to SENT
```

### Client Receives and Pays Invoice

```
1. Client receives email with:
   - Invoice #INV-2026-04-08-12345
   - Services and amounts
   - Bank account: Account Name, Number, Bank Name
   - Due date
2. Client downloads invoice PDF (optional)
3. Client makes bank transfer to provided account details
4. Once transfer is complete, client notifies admin
5. Admin goes to /admin/invoices
6. Finds the invoice
7. Clicks "Mark as Paid"
8. Invoice status changes to PAID
9. Client can see invoice status as PAID in their dashboard
```

---

## Configuration Steps

### Step 1: Configure Payment Account Details
1. Navigate to `/admin/settings`
2. Fill in:
   - Account Name: e.g., "LivingRite Care Limited"
   - Account Number: e.g., "1234567890"
   - Bank Name: e.g., "GTBank"
   - Bank Code: e.g., "044"
   - Currency: e.g., "NGN"
   - Payment Instructions: e.g., "Please include invoice number as reference"
3. Click "Save Settings"

### Step 2: Create First Invoice
1. Navigate to `/admin/invoices/create`
2. Select a client
3. Choose services or enter custom amount
4. Set taxes/discounts if needed
5. Click "Create Invoice"

### Step 3: Send Invoice to Client
1. Navigate to `/admin/invoices`
2. Find the invoice in GENERATED status
3. Click "Send" button
4. Email is sent to client with payment instructions
5. Invoice status changes to SENT

### Step 4: Mark as Paid
1. Once client pays (externally)
2. Go to `/admin/invoices`
3. Click "Mark as Paid" on the invoice
4. Invoice status changes to PAID

---

## Key Differences from Old System

| Aspect | Old System | New System |
|--------|-----------|-----------|
| **When Invoice Created** | At booking time | When admin determines billing |
| **Payment Processing** | In-app (Paystack) | Manual/External (bank transfer) |
| **Invoice Basis** | Booking-centric | Client-centric |
| **Services on Invoice** | Single service | Multiple services |
| **Payment Account** | Not stored | Configurable in AdminSettings |
| **Email to Client** | Generic | Includes payment account details |
| **Marking as Paid** | Automatic via webhook | Manual by admin |
| **Booking ↔ Payment** | Tightly coupled | Completely decoupled |

---

## Remaining Tasks

### Optional (Not Critical for MVP)
- [ ] Update Cal.com intake form workflow (already redirects to intake)
- [ ] Create intake form submission webhook (framework dependent)
- [ ] Archive/delete legacy Payment API routes (if no longer needed)
- [ ] Create PDF invoice generation (currently uses pdfUrl if available)
- [ ] Set up automated reminders for overdue invoices

### Testing Recommendations
- [ ] Test invoice creation with multiple services
- [ ] Test email sending with various AdminSettings
- [ ] Test client invoice visibility (should only see own invoices)
- [ ] Test admin invoice filtering and status updates
- [ ] Test multi-service invoice calculations

---

## Database Migration Details

Applied migration: `20260408025339_refactor_booking_invoice_workflow`

This migration:
1. Added `AdminSettings` table
2. Modified `invoices` table:
   - Removed unique constraint on `bookingId`
   - Made `bookingId` nullable
   - Added `clientId` (required)
   - Added `servicesData` (JSON)
   - Added `paymentNote` (text)
   - Added `markedPaidBy` (text, FK to User)
   - Added `markedPaidAt` (DateTime)
   - Removed `serviceId` (FK to Service)
3. Added indexes for performance
4. Removed foreign key from `Payment` to `Booking`

**Note**: Payment tables still exist but are no longer used. They're commented out in schema.prisma for reference.

---

## File Changes Summary

### Created Files
- `/app/api/admin/settings/route.ts` - Settings API
- `/app/api/admin/invoices/route.ts` - Invoice list/create
- `/app/api/admin/invoices/[invoiceId]/route.ts` - Invoice detail/update
- `/app/admin/settings/page.tsx` - Admin settings page
- `/app/admin/invoices/page.tsx` - Invoice management dashboard
- `/app/admin/invoices/create/page.tsx` - Invoice creation form

### Modified Files
- `prisma/schema.prisma` - Schema changes
- `/lib/email.ts` - Added `sendInvoiceEmail()` function
- `/app/api/invoices/my-invoices/route.ts` - Updated to fetch by clientId
- `/app/api/admin/services/route.ts` - Standardized response format
- `/app/client/invoices/page.tsx` - Removed payment processing UI
- `package.json` - No changes (uses existing dependencies)

---

## Support & Troubleshooting

### Invoice not sending email?
- Check `/api/admin/settings` returns AdminSettings
- Verify SMTP credentials in `.env`
- Check error logs for email service issues

### Client can't see invoices?
- Verify client is logged in (check session)
- Verify `clientId` matches user.id in invoice record
- Check role is CLIENT

### Services not showing in create form?
- Verify services exist in database
- Services must have `isActive: true`
- Check `/api/admin/services` returns data

### Invoice email missing payment details?
- Verify AdminSettings is configured
- Check fields are not empty
- Resend invoice to refresh

---

## Next Steps

1. **Test the workflow**: Create a test invoice and send to a user
2. **Configure payment details**: Set your actual bank account in /admin/settings
3. **Train admins**: Show them how to create and send invoices
4. **Train clients**: Let them know to look for invoice emails with payment instructions
5. **Monitor**: Check that invoices are being created and marked paid correctly
6. **Customize**: Modify email template styling if needed (in lib/email.ts)

---

## Technical Notes

- All invoice operations are logged to console for debugging
- Invoice numbers are unique: `INV-YYYY-MM-DD-XXXXX`
- Invoices transition from DRAFT → GENERATED → SENT → PAID
- Role-based access control: Admins can see all, clients see only their own
- Advisory: Keep AdminSettings in sync across environments (dev/staging/prod)

---

**Implementation Date**: April 8, 2026  
**Version**: 1.0  
**Status**: Ready for Testing
