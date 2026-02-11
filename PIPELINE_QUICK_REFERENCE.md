# Customer Pipeline - Quick Reference

## File Structure

```
app/
├── api/
│   ├── inquiries/
│   │   ├── route.ts              # POST (create), GET (list)
│   │   └── [id]/route.ts         # GET, PATCH (actions)
│   └── proposals/
│       ├── route.ts              # POST (create), GET (list)
│       └── [id]/route.ts         # GET, PATCH (actions)
├── admin/
│   ├── components/
│   │   ├── InquiryForm.tsx       # Modal for creating inquiries
│   │   ├── ProposalForm.tsx      # Modal for creating proposals
│   │   └── Sidebar.tsx           # Updated with Pipeline menu
│   ├── sections/
│   │   └── Pipeline.tsx          # Main pipeline dashboard
│   └── AdminDashboard.tsx        # Updated with pipeline section
└── client/
    └── inquiry/
        └── page.tsx              # Public inquiry form
lib/
├── inquiry.ts                    # Inquiry business logic
├── proposal.ts                   # Proposal business logic
└── prisma.ts                     # Database client
```

## Key Endpoints

### Public (No Auth Required)
```
POST /api/inquiries              - Submit inquiry
GET  /client/inquiry             - Inquiry form page
```

### Admin (Auth Required)
```
GET    /api/inquiries                      - List
GET    /api/inquiries?stats=true           - Stats
GET    /api/inquiries/[id]                 - Detail
PATCH  /api/inquiries/[id]                 - Update/Qualify/Disqualify/Convert

GET    /api/proposals                      - List
GET    /api/proposals?stats=true           - Stats
GET    /api/proposals/[id]                 - Detail
PATCH  /api/proposals/[id]                 - Update/Send/Viewed/Accept/Reject

GET    /admin                              - Admin dashboard with Pipeline tab
```

## User Conversion Stages

| Stage | Trigger | Description |
|-------|---------|-------------|
| PROSPECT | User created | Initial contact |
| INQUIRY | Form submitted | Inquiry received |
| CONSULTATION_BOOKED | Inquiry converted | Booking scheduled |
| PROPOSAL_SENT | Proposal sent | Quote provided |
| CLIENT | Proposal accepted | Became paying customer |

## Status Enum Values

### InquiryStatus
- `NEW` - Just submitted
- `QUALIFIED` - Looks like good fit
- `DISQUALIFIED` - Not a good fit
- `CONVERTED` - Became booking

### ProposalStatus
- `DRAFT` - Being prepared
- `SENT` - Sent to client
- `VIEWED` - Client opened it
- `ACCEPTED` - Client approved
- `REJECTED` - Client declined

### BookingStatus (Updated)
- `SCHEDULED` - Upcoming
- `PROPOSAL` - Waiting on proposal
- `RESCHEDULED` - Moved date
- `CANCELLED` - Cancelled
- `COMPLETED` - Done
- `NO_SHOW` - Didn't attend

## Admin Dashboard Navigation

1. Click "Pipeline" in left sidebar
2. Three tabs:
   - **Overview** - Funnel charts and conversion rates
   - **Inquiries** - All inquiries with quick actions
   - **Proposals** - All proposals with quick actions

## Creating Inquiries (Admin)

1. Go to Pipeline → Inquiries tab
2. Click "New Inquiry" button
3. Fill form (name, email, phone, source, etc.)
4. Submit

## Creating Proposals (Admin)

1. Have a booking ready
2. Go to Pipeline → Proposals tab (or click in Inquiries)
3. Click "New Proposal" button
4. Select booking
5. Fill form (title, amount, services, validity)
6. Submit

## Common Actions

### Qualify an Inquiry
```
Pipeline → Inquiries tab → Click "Qualify" button
```

### Send a Proposal
```
Pipeline → Proposals tab → Click "Send" button
Status changes from DRAFT → SENT
Booking status changes to PROPOSAL
```

### Accept Proposal (Complete Sale)
```
Pipeline → Proposals tab → Click "Accept" button
User stage changes to CLIENT
clientConvertedAt timestamp is set
```

## Conversion Rates

**Inquiry Funnel:**
- Total inquiries
- New → Qualified rate
- Qualified → Converted rate
- Overall conversion rate (New → Converted)

**Proposal Funnel:**
- Total proposals
- Draft → Sent rate
- Sent → Viewed rate
- Viewed → Accepted rate
- Overall acceptance rate

## Data Models (New/Updated Fields)

### User
```typescript
conversionStage: ClientConversionStage  // Pipeline stage
inquiryDate?: DateTime                   // When inquiry started
clientConvertedAt?: DateTime             // When became client
```

### Inquiry
```typescript
id, userId, name, email, phone
inquirySource?: string                   // "website_form", "email", etc.
subject?, message?, notes?
status: InquiryStatus                    // NEW, QUALIFIED, DISQUALIFIED, CONVERTED
qualifiedAt?, disqualifiedAt?, convertedToBookingAt?
```

### Proposal
```typescript
id, bookingId
status: ProposalStatus                   // DRAFT, SENT, VIEWED, ACCEPTED, REJECTED
title?, description?, servicesOffered?
totalAmount?, currency (NGN)
validUntil?, sentAt?, viewedAt?, acceptedAt?, rejectedAt?
```

### Booking (New Fields)
```typescript
inquirySource?: string
proposalSentAt?: DateTime
pipelineStageHistory?: Json              // [{stage, timestamp, notes}]
proposal?: Proposal (relation)
```

## Example Flow

1. **Day 1:** Customer visits site, submits inquiry form
   - User created with stage: PROSPECT → INQUIRY
   - Inquiry record: NEW

2. **Day 2:** Admin reviews, qualifies inquiry
   - Inquiry: QUALIFIED

3. **Day 3:** Customer books consultation via cal.com
   - Booking created
   - User stage: CONSULTATION_BOOKED
   - Inquiry: CONVERTED

4. **Day 5:** Admin creates proposal
   - Proposal: DRAFT

5. **Day 6:** Admin sends proposal
   - Proposal: SENT
   - Booking status: PROPOSAL
   - proposalSentAt: timestamp

6. **Day 7:** Customer accepts proposal
   - Proposal: ACCEPTED
   - User stage: CLIENT
   - clientConvertedAt: timestamp
   - Ready for payment/service

## Tips

- Funnel metrics auto-update as statuses change
- No manual metrics needed - all calculated from database
- Pipeline stages affect user.role and access levels
- All actions logged via timestamps for audit trail
- Filtering works across all list endpoints
- Search works on name, email, subject fields
