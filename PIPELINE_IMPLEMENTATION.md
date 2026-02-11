# Customer Pipeline Implementation Guide

## Overview
Complete implementation of the Inquiry → Consultation → Proposal → Client sales pipeline. This guide documents all new features, APIs, and how to use them.

## What's New

### 1. **Core Library Functions**

#### `/lib/inquiry.ts`
Manages inquiry lifecycle:
- `createInquiry()` - Create new inquiry and update user conversion stage
- `getInquiries()` - Fetch inquiries with filtering and pagination
- `getInquiryById()` - Get single inquiry details
- `updateInquiry()` - Update inquiry fields
- `qualifyInquiry()` - Mark inquiry as qualified
- `disqualifyInquiry()` - Mark inquiry as disqualified with reason
- `convertInquiryToBooking()` - Convert inquiry to booking and update user stage
- `getInquiryFunnelStats()` - Get conversion metrics

#### `/lib/proposal.ts`
Manages proposal lifecycle:
- `createProposal()` - Create proposal from booking
- `getProposals()` - Fetch proposals with filtering
- `getProposalById()` - Get single proposal details
- `updateProposal()` - Update proposal fields
- `sendProposal()` - Send proposal and update booking status to PROPOSAL
- `markProposalViewed()` - Track when client views proposal
- `acceptProposal()` - Accept proposal and convert user to CLIENT
- `rejectProposal()` - Reject proposal with reason
- `getProposalFunnelStats()` - Get conversion metrics

### 2. **API Endpoints**

#### Inquiries
```
POST   /api/inquiries              - Create inquiry
GET    /api/inquiries              - List inquiries (with filtering)
GET    /api/inquiries?stats=true   - Get funnel statistics
GET    /api/inquiries/[id]         - Get inquiry details
PATCH  /api/inquiries/[id]         - Update inquiry or change status
  action: "qualify" | "disqualify" | "convert"
```

#### Proposals
```
POST   /api/proposals              - Create proposal
GET    /api/proposals              - List proposals (with filtering)
GET    /api/proposals?stats=true   - Get funnel statistics
GET    /api/proposals/[id]         - Get proposal details
PATCH  /api/proposals/[id]         - Update proposal or change status
  action: "send" | "viewed" | "accept" | "reject"
```

### 3. **Admin Components**

#### `InquiryForm.tsx`
Modal form to create inquiries:
- Fields: name, email, phone, source, subject, message, notes
- Validation: name and email required
- Updates user conversion stage to INQUIRY

#### `ProposalForm.tsx`
Modal form to create proposals:
- Fields: title, description, services, amount, currency, validity period, notes
- Service selection from database
- Auto-calculates validity date
- Binds to specific booking

### 4. **Admin Sections**

#### `Pipeline.tsx` - Sales Pipeline Dashboard
Three tabs:

**Overview Tab:**
- Inquiry funnel pie chart with conversion rates
- Proposal funnel pie chart with acceptance rates
- Real-time metrics

**Inquiries Tab:**
- Table of all inquiries
- Status badges (NEW, QUALIFIED, DISQUALIFIED, CONVERTED)
- Quick actions: Qualify, Disqualify
- Filtering by source and search

**Proposals Tab:**
- Table of all proposals
- Status badges (DRAFT, SENT, VIEWED, ACCEPTED, REJECTED)
- Quick actions: Send, Accept
- Amount and client info displayed

### 5. **Public Pages**

#### `/client/inquiry` - Public Inquiry Form
- Accessible without authentication
- Fields: name, email, phone, subject, message
- Success redirect to home page
- Inquiry source tracked as "website_form"
- Auto-creates user if new

### 6. **Navigation Updates**

**Sidebar Addition:**
- "Pipeline" menu item with GitBranch icon
- Positioned after Dashboard

### 7. **Dashboard Metrics**

New metrics added to `/api/admin/dashboard`:
```json
{
  "totalInquiries": 25,
  "qualifiedInquiries": 8,
  "convertedInquiries": 3,
  "totalProposals": 12,
  "acceptedProposals": 5
}
```

## Data Flow

### Inquiry to Booking Conversion
1. Visitor submits inquiry form at `/client/inquiry`
2. `Inquiry` record created with status: NEW
3. `User.conversionStage` updated to INQUIRY
4. Admin reviews inquiry in Pipeline dashboard
5. Admin clicks "Qualify" → `Inquiry.status = QUALIFIED`
6. Admin converts to booking → `Inquiry.status = CONVERTED`
7. `User.conversionStage` updated to CONSULTATION_BOOKED
8. New `Booking` created from cal.com webhook

### Booking to Proposal Conversion
1. `Booking` created with status: SCHEDULED
2. Admin creates `Proposal` for booking
3. Proposal status: DRAFT
4. Admin sends proposal → status: SENT, `Booking.status = PROPOSAL`
5. Client views proposal → status: VIEWED
6. Client accepts proposal → status: ACCEPTED
7. `User.conversionStage` updated to CLIENT
8. `User.clientConvertedAt` timestamp set
9. Payment/Invoice processed for ongoing services

## Key Features

### User Conversion Stages
```
PROSPECT
  ↓ (inquiry submitted)
INQUIRY
  ↓ (booking created)
CONSULTATION_BOOKED
  ↓ (proposal accepted)
PROPOSAL_SENT
  ↓ (payment received)
CLIENT
```

### Booking Status Flow
```
SCHEDULED
  ↓ (proposal sent)
PROPOSAL
  ↓ (proposal accepted & paid)
COMPLETED
```

### Inquiry Status Flow
```
NEW
  ├→ QUALIFIED → CONVERTED (to booking)
  └→ DISQUALIFIED
```

### Proposal Status Flow
```
DRAFT
  → SENT
    → VIEWED
      ├→ ACCEPTED (becomes CLIENT)
      └→ REJECTED
```

## Usage Examples

### Create Inquiry (Public)
```bash
curl -X POST http://localhost:3000/api/inquiries \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+2348012345678",
    "subject": "Interested in homecare",
    "message": "Looking for quality healthcare",
    "inquirySource": "website_form"
  }'
```

### Create Proposal
```bash
curl -X POST http://localhost:3000/api/proposals \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "bookingId": "booking-123",
    "title": "Custom Care Package",
    "description": "Tailored healthcare solution",
    "totalAmount": 50000,
    "currency": "NGN",
    "validUntil": "2026-03-13",
    "servicesOffered": [
      {"id": "service-1", "title": "Home Visit", "price": 25000}
    ]
  }'
```

### Send Proposal
```bash
curl -X PATCH http://localhost:3000/api/proposals/proposal-123 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "action": "send"
  }'
```

### Qualify Inquiry
```bash
curl -X PATCH http://localhost:3000/api/inquiries/inquiry-123 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "action": "qualify"
  }'
```

### Get Pipeline Stats
```bash
curl http://localhost:3000/api/inquiries?stats=true
curl http://localhost:3000/api/proposals?stats=true
```

## Database Changes

### New Models
- `Inquiry` - Tracks initial leads/contacts
- `Proposal` - Tracks quotes and proposal stage

### Enhanced Models
- `User.conversionStage` - Tracks pipeline position
- `User.inquiryDate` - When user first inquired
- `User.clientConvertedAt` - When became paying client
- `Booking.inquirySource` - Where inquiry came from
- `Booking.proposalSentAt` - When proposal was sent
- `Booking.pipelineStageHistory` - JSON audit trail
- `Booking.proposal` - One-to-one relation to Proposal

### New Enums
- `ClientConversionStage` - PROSPECT, INQUIRY, CONSULTATION_BOOKED, PROPOSAL_SENT, CLIENT
- `InquiryStatus` - NEW, QUALIFIED, DISQUALIFIED, CONVERTED
- `ProposalStatus` - DRAFT, SENT, VIEWED, ACCEPTED, REJECTED
- `BookingStatus` - Added PROPOSAL stage

## Testing Checklist

- [ ] Create inquiry from public form
- [ ] View inquiries in admin pipeline
- [ ] Qualify/disqualify inquiries
- [ ] Create proposal from booking
- [ ] Send proposal and track status
- [ ] Accept/reject proposals
- [ ] Verify user conversion stage updates
- [ ] Check funnel conversion rates
- [ ] Test pagination and filtering
- [ ] Verify email notifications (if implemented)

## Future Enhancements

1. **Email Notifications**
   - Send inquiry confirmation to user
   - Send proposal to client email
   - Send acceptance/rejection notifications

2. **Proposal Templates**
   - Pre-designed proposal templates
   - Variable substitution for client details
   - PDF generation and download

3. **Automations**
   - Auto-send reminder if proposal not viewed
   - Auto-convert to booking on acceptance
   - Scheduled follow-ups

4. **Analytics**
   - Time in each stage
   - Bottleneck analysis
   - Team performance metrics

5. **Integrations**
   - Slack notifications for pipeline updates
   - Google Sheets export
   - CRM integrations
