# Legacy Payment API Routes - Cleanup Summary

**Date**: April 8, 2026  
**Status**: Deprecated & Marked for Reference

## Overview

The following payment-related API routes have been marked as deprecated and are **no longer used** in the new invoice workflow. They are kept for historical reference and potential future migration purposes.

## Deprecated Routes

### 1. Payment Initiation
**File**: `/app/api/payments/initiate/route.ts`  
**Purpose**: Used to initiate Paystack payment for a booking  
**Status**: ⚠️ DEPRECATED  
**Why**: In-app payment processing removed. Clients now pay directly to bank account.  
**Replacement**: `/api/admin/invoices` (admin creates invoice), then admin sends via email

### 2. Payment Verification
**File**: `/app/api/payments/verify/[reference]/route.ts`  
**Purpose**: Verified Paystack transaction status  
**Status**: ⚠️ DEPRECATED  
**Why**: No longer needed. Payment tracking is manual via invoice status updates.  
**Replacement**: `PATCH /api/admin/invoices/[invoiceId]` with `status="PAID"`

### 3. Payment Status Updates (Admin)
**File**: `/app/api/payments/[paymentId]/route.ts`  
**Purpose**: Admin endpoint to update Payment model status  
**Status**: ⚠️ DEPRECATED  
**Why**: Payment model no longer used in booking workflow.  
**Replacement**: `PATCH /api/admin/invoices/[invoiceId]` to update invoice status

### 4. Refund Requests
**File**: `/app/api/payments/[paymentId]/refund/route.ts`  
**Purpose**: Admin endpoint to request refunds for payments  
**Status**: ⚠️ DEPRECATED  
**Why**: Refunds now handled manually by updating invoice status and contacting client.  
**Replacement**: Update invoice status to CANCELLED, contact client directly

### 5. Paystack Webhook Handler
**File**: `/app/api/webhooks/paystack/route.ts`  
**Purpose**: Handled Paystack webhook events (charge.success, charge.failed, refund.*)  
**Status**: ⚠️ DEPRECATED  
**Why**: In-app payments removed. No longer need to listen for Paystack events.  
**Replacement**: None needed (manual payment tracking). If webhooks needed, see `/api/bookings/webhook` for intake form handling.

## Database Models - Deprecated

The following Prisma models are **still defined but commented out** in `/prisma/schema.prisma` (lines 685-755):
- `Payment`
- `PaymentAttempt`
- `RefundRequest`

These are kept for:
1. Historical reference
2. Legacy data access if needed
3. Migration path if payments need to be restored

To fully remove them, uncomment the lines and run `npx prisma migrate dev`.

## What Replaced These Routes?

### Old Payment Workflow (REMOVED)
```
Client Books → Pay Now Button → Paystack Payment → Invoice Generated → Booking Confirmed
```

### New Payment Workflow (CURRENT)
```
Admin Creates Invoice → Admin Sends Email → Client Receives Email with Bank Details → Client Pays Externally → Admin Marks Paid
```

## New APIs for Payment/Invoice Management

### Admin Invoice Creation
**Endpoint**: `POST /api/admin/invoices`  
**Purpose**: Create invoice for a client with services and amount  
**Example**:
```json
{
  "clientId": "user-id",
  "amount": 100000,
  "servicesData": [
    { "serviceId": "svc-1", "title": "Consultation", "price": 100000 }
  ],
  "tax": 15000,
  "discount": 0,
  "dueAt": "2026-04-15"
}
```

### Admin Invoice Status Updates
**Endpoint**: `PATCH /api/admin/invoices/[invoiceId]`  
**Purpose**: Update invoice status (DRAFT, GENERATED, SENT, VIEWED, PAID, OVERDUE, CANCELLED)  
**Example**:
```json
{
  "status": "PAID"
}
```

### Admin Invoice Email Sending
**Endpoint**: `POST /api/admin/invoices/[invoiceId]` with `action=send`  
**Purpose**: Send invoice email to client with payment instructions  
**Triggers**: Calls `sendInvoiceEmail()` which includes bank details from AdminSettings

### Admin Settings (Payment Account)
**Endpoint**: `GET/PUT /api/admin/settings`  
**Purpose**: Configure payment account details shown on invoices  
**Fields**: Account name, number, bank, code, currency, instructions

## Migration Notes

If you ever need to migrate back to payment processing:

1. **Uncomment Payment models** in `/prisma/schema.prisma`
2. **Restore Payment foreign key** in Booking model
3. **Run migration**: `npx prisma migrate dev`
4. **Restore API routes** from git history
5. **Update client pages** to re-enable "Pay Now" buttons
6. **Reconfigure Paystack webhook** in admin settings

## Files Modified

### Routes Marked as Deprecated
- ✅ `/app/api/payments/initiate/route.ts` - Added DEPRECATED notice
- ✅ `/app/api/payments/verify/[reference]/route.ts` - Added DEPRECATED notice
- ✅ `/app/api/payments/[paymentId]/route.ts` - Added DEPRECATED notice
- ✅ `/app/api/payments/[paymentId]/refund/route.ts` - Added DEPRECATED notice
- ✅ `/app/api/webhooks/paystack/route.ts` - Added DEPRECATED notice

### Unchanged (Still in Use)
- `/app/api/admin/invoices/*` - New invoice management system
- `/app/api/admin/settings/*` - Payment account configuration
- Booking related routes - Still in use for consultation management

## Note on File Organization

The payment routes directory still exists at `/app/api/payments/` with deprecated route files. These can be:

**Option 1**: Keep as-is (current approach)
- Pros: Historical reference, easy to restore if needed
- Cons: Takes up space, may confuse new developers

**Option 2**: Archive to `/app/api/deprecated/payments/`
- Pros: Clear separation, cleaner codebase
- Cons: More refactoring, breaks import paths if any exist

**Current Status**: Option 1 (keeping in place with clear deprecation notices)

## Checklist for Complete Cleanup

- ✅ Add deprecation notices to all payment routes
- ✅ Document new payment workflow
- ✅ Document API replacements
- ⏳ Search codebase for payment route imports (if any)
- ⏳ Remove payment button references from client pages (already done)
- ⏳ Remove payment status from booking pages (already done)
- ⏳ Update environment variables documentation (Paystack keys no longer needed)

## Environment Variables Note

The following environment variables are **no longer used** but can be safely left in `.env` for now:
- `PAYSTACK_PUBLIC_KEY`
- `PAYSTACK_SECRET_KEY`

These can be removed once confirmed no legacy integrations depend on them.

## Testing & Verification

To verify the cleanup is complete:

1. **Search codebase** for imports of `/api/payments/` - should find none
2. **Verify client pages** - no "Pay Now" buttons or payment flows
3. **Verify admin pages** - invoice creation and status updates work
4. **Verify emails** - invoice emails include payment instructions from AdminSettings
5. **Check logs** - no errors about missing Payment model in active flows

## Support & Questions

If you need to:
- **Understand old payment system**: See files in `/app/api/payments/` with historical documentation
- **Implement new invoice workflow**: See `/admin/invoices/` pages and `/api/admin/invoices/*` APIs
- **Configure payment details**: Go to `/admin/settings`
- **Restore payment processing**: See "Migration Notes" section above

---

**Last Updated**: April 8, 2026  
**System**: Next.js 16 + Prisma 5.22.0  
**Status**: Cleanup Complete - All deprecated routes marked with DEPRECATED notices
