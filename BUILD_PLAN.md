# LivingRite Portal - Build Plan

## Project Overview
A comprehensive care management and business operations platform with client portal, admin command center, and automated workflow systems.

---

## Table of Contents
1. [Architecture Overview](#architecture-overview)
2. [Phase Breakdown](#phase-breakdown)
3. [Database Schema](#database-schema)
4. [API Architecture](#api-architecture)
5. [Client Portal Features](#client-portal-features)
6. [Admin Command Center](#admin-command-center)
7. [Third-Party Integrations](#third-party-integrations)
8. [Authentication & Security](#authentication--security)
9. [Implementation Timeline](#implementation-timeline)

---

## Architecture Overview

### Tech Stack
- **Frontend**: Next.js 15+ (React 19)
- **Backend**: Next.js API Routes / Node.js
- **Database**: PostgreSQL (with Prisma ORM)
- **File Storage**: Cloudflare R2
- **Real-time Updates**: WebSockets / Socket.io
- **Email**: SendGrid / Nodemailer
- **SMS**: Twilio
- **Analytics**: Mixpanel / PostHog
- **Payment**: Stripe / PayPal
- **Scheduling**: Calendly API
- **CRM**: MailChimp API

### System Architecture
```
┌─────────────────────────────────────────────────────────────┐
│                      Client Layer                           │
│  (Family Portal) | (Admin Dashboard) | (Care Team App)     │
└────────────────────────┬────────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────────┐
│              Next.js Application Layer                      │
│  - API Routes     - Middleware      - Authentication       │
│  - WebSocket Connections           - Real-time Updates    │
└────────────────────────┬────────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────────┐
│            Data & Integration Layer                         │
│  - PostgreSQL Database                                      │
│  - File Storage (Cloudflare R2)                             │
│  - Third-Party APIs (Calendly, Stripe, Twilio, etc.)      │
└─────────────────────────────────────────────────────────────┘
```

---

## Phase Breakdown

### Phase 1: Foundation & Core Infrastructure (Weeks 1-4)
- [x] Project setup and configuration
- [ ] Database design and Prisma setup
- [ ] Authentication system (JWT/Session)
- [ ] Role-based access control (RBAC)
- [ ] Basic folder structure and API conventions
- [ ] Environment configuration

### Phase 2: Client Portal - MVP (Weeks 5-8)
- [ ] Family user onboarding
- [ ] Care update viewing (real-time feeds)
- [ ] Weekly health logs display
- [ ] Document storage system
- [ ] Basic messaging with care team

### Phase 3: Payment & Invoicing (Weeks 9-10)
- [ ] Stripe/PayPal integration
- [ ] Invoice generation and download
- [ ] Payment history tracking
- [ ] Subscription management

### Phase 4: Admin Command Center - MVP (Weeks 11-14)
- [ ] Dashboard overview and KPIs
- [ ] Patient progress notes management
- [ ] Consultation request tracking
- [ ] Service booking management
- [ ] Basic reporting

### Phase 5: Smart Booking & Calendly Integration (Weeks 15-16)
- [ ] Calendly API integration
- [ ] Consultation scheduler UI
- [ ] Real-time availability sync
- [ ] Timezone detection and display

### Phase 6: Advanced Features (Weeks 17-20)
- [ ] Photo/video uploads and management
- [ ] Automated email campaign system (MailChimp)
- [ ] Analytics and performance tracking
- [ ] A/B testing framework
- [ ] Client retention analytics

### Phase 7: Mobile Optimization & Polish (Weeks 21-22)
- [ ] Mobile responsiveness
- [ ] Performance optimization
- [ ] Security audit
- [ ] Testing and QA

---

## Database Schema

### Core Tables Structure

#### 1. Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  phone_number VARCHAR(20),
  role ENUM('admin', 'care_team', 'family', 'client') NOT NULL,
  organization_id UUID FOREIGN KEY,
  avatar_url VARCHAR(255),
  is_active BOOLEAN DEFAULT true,
  email_verified_at TIMESTAMP,
  phone_verified_at TIMESTAMP,
  last_login_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_organization_id ON users(organization_id);
CREATE INDEX idx_users_role ON users(role);
```

#### 2. Clients (Care Recipients) Table
```sql
CREATE TABLE clients (
  id UUID PRIMARY KEY,
  user_id UUID FOREIGN KEY REFERENCES users(id),
  organization_id UUID FOREIGN KEY,
  date_of_birth DATE NOT NULL,
  gender VARCHAR(50),
  medical_conditions TEXT[],
  allergies TEXT[],
  emergency_contact_name VARCHAR(255),
  emergency_contact_phone VARCHAR(20),
  insurance_provider VARCHAR(255),
  insurance_policy_number VARCHAR(255),
  status ENUM('active', 'inactive', 'archived') DEFAULT 'active',
  care_level ENUM('basic', 'intermediate', 'intensive') NOT NULL,
  assigned_care_team UUID[] FOREIGN KEY REFERENCES users(id),
  intake_form_completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_clients_organization_id ON clients(organization_id);
CREATE INDEX idx_clients_user_id ON clients(user_id);
```

#### 3. Family Members / Guardian Table
```sql
CREATE TABLE family_members (
  id UUID PRIMARY KEY,
  client_id UUID FOREIGN KEY REFERENCES clients(id),
  user_id UUID FOREIGN KEY REFERENCES users(id),
  relationship VARCHAR(100) NOT NULL, -- 'parent', 'child', 'spouse', etc.
  is_primary_contact BOOLEAN DEFAULT false,
  access_level ENUM('view_only', 'messaging', 'full_access') DEFAULT 'view_only',
  notification_preferences JSONB, -- email, sms, push preferences
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_family_members_client_id ON family_members(client_id);
```

#### 4. Care Updates / Progress Notes Table
```sql
CREATE TABLE progress_notes (
  id UUID PRIMARY KEY,
  client_id UUID FOREIGN KEY REFERENCES clients(id),
  created_by_id UUID FOREIGN KEY REFERENCES users(id),
  title VARCHAR(255),
  content TEXT NOT NULL,
  note_type ENUM('daily_update', 'health_assessment', 'medication_log', 'incident_report') NOT NULL,
  visibility ENUM('family_only', 'family_and_team', 'internal_only') DEFAULT 'family_and_team',
  urgent BOOLEAN DEFAULT false,
  attachments JSONB[], -- { url, file_type, file_name }
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_progress_notes_client_id ON progress_notes(client_id);
CREATE INDEX idx_progress_notes_created_at ON progress_notes(created_at);
```

#### 5. Health Logs Table
```sql
CREATE TABLE health_logs (
  id UUID PRIMARY KEY,
  client_id UUID FOREIGN KEY REFERENCES clients(id),
  log_date DATE NOT NULL,
  vital_signs JSONB, -- { blood_pressure, heart_rate, temperature, weight }
  medications_taken TEXT[],
  meals JSONB[], -- { meal_type, content, time }
  mood VARCHAR(100),
  activities TEXT[],
  sleep_hours DECIMAL(4,2),
  notes TEXT,
  created_by_id UUID FOREIGN KEY REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_health_logs_client_id_date ON health_logs(client_id, log_date);
```

#### 6. Documents Storage Table
```sql
CREATE TABLE documents (
  id UUID PRIMARY KEY,
  client_id UUID FOREIGN KEY REFERENCES clients(id),
  uploaded_by_id UUID FOREIGN KEY REFERENCES users(id),
  file_name VARCHAR(255) NOT NULL,
  file_type VARCHAR(50), -- pdf, image, doc, etc.
  file_url VARCHAR(255) NOT NULL, -- S3 URL
  file_size BIGINT,
  document_category ENUM('prescription', 'test_result', 'medical_record', 'insurance', 'other') NOT NULL,
  description TEXT,
  is_public BOOLEAN DEFAULT false,
  visibility ENUM('family_only', 'care_team_only', 'everyone') DEFAULT 'care_team_only',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_documents_client_id ON documents(client_id);
CREATE INDEX idx_documents_category ON documents(document_category);
```

#### 7. Messages / Direct Communication Table
```sql
CREATE TABLE messages (
  id UUID PRIMARY KEY,
  sender_id UUID FOREIGN KEY REFERENCES users(id),
  recipient_id UUID FOREIGN KEY REFERENCES users(id),
  client_id UUID FOREIGN KEY REFERENCES clients(id), -- which client is this about
  content TEXT NOT NULL,
  message_type ENUM('text', 'file', 'voice_note') DEFAULT 'text',
  attachment_url VARCHAR(255),
  is_read BOOLEAN DEFAULT false,
  read_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_messages_recipient_id_is_read ON messages(recipient_id, is_read);
CREATE INDEX idx_messages_created_at ON messages(created_at);
```

#### 8. Care Plans & Schedules Table
```sql
CREATE TABLE care_plans (
  id UUID PRIMARY KEY,
  client_id UUID FOREIGN KEY REFERENCES clients(id),
  care_coordinator_id UUID FOREIGN KEY REFERENCES users(id),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  start_date DATE NOT NULL,
  end_date DATE,
  care_goals JSONB[], -- { goal, target_date, status }
  daily_schedule JSONB, -- { day_of_week, activities: [ { time, activity, assigned_to } ] }
  status ENUM('active', 'inactive', 'archived') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_care_plans_client_id ON care_plans(client_id);
```

#### 9. Appointments Table
```sql
CREATE TABLE appointments (
  id UUID PRIMARY KEY,
  client_id UUID FOREIGN KEY REFERENCES clients(id),
  scheduled_with VARCHAR(255), -- doctor, specialist, clinic, etc.
  appointment_date TIMESTAMP NOT NULL,
  appointment_type VARCHAR(100),
  location VARCHAR(255),
  notes TEXT,
  status ENUM('scheduled', 'completed', 'cancelled', 'no_show') DEFAULT 'scheduled',
  created_by_id UUID FOREIGN KEY REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_appointments_client_id_date ON appointments(client_id, appointment_date);
```

#### 10. Consultations & Leads Table
```sql
CREATE TABLE consultations (
  id UUID PRIMARY KEY,
  lead_id UUID FOREIGN KEY REFERENCES leads(id),
  requester_email VARCHAR(255) NOT NULL,
  requester_name VARCHAR(255) NOT NULL,
  requester_phone VARCHAR(20),
  service_type VARCHAR(100) NOT NULL,
  description TEXT,
  timezone VARCHAR(100),
  preferred_dates TIMESTAMP[],
  consultation_type ENUM('phone', 'video', 'in_person') DEFAULT 'video',
  calendly_event_id VARCHAR(255),
  status ENUM('pending', 'scheduled', 'completed', 'cancelled') DEFAULT 'pending',
  assigned_to_id UUID FOREIGN KEY REFERENCES users(id),
  scheduled_at TIMESTAMP,
  completed_at TIMESTAMP,
  notes TEXT,
  conversion_status ENUM('not_contacted', 'interested', 'proposal_sent', 'client', 'lost') DEFAULT 'not_contacted',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_consultations_status ON consultations(status);
CREATE INDEX idx_consultations_conversion_status ON consultations(conversion_status);
```

#### 11. Leads Table
```sql
CREATE TABLE leads (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  company_name VARCHAR(255),
  source ENUM('website', 'referral', 'ad', 'social_media', 'other') NOT NULL,
  interested_services TEXT[],
  timezone VARCHAR(100),
  location_country VARCHAR(100),
  is_diaspora BOOLEAN,
  status ENUM('new', 'engaged', 'qualified', 'disqualified', 'converted') DEFAULT 'new',
  assigned_to_id UUID FOREIGN KEY REFERENCES users(id),
  notes TEXT,
  last_contacted_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_leads_email ON leads(email);
CREATE INDEX idx_leads_status ON leads(status);
```

#### 12. Service Bookings Table
```sql
CREATE TABLE service_bookings (
  id UUID PRIMARY KEY,
  client_id UUID FOREIGN KEY REFERENCES clients(id),
  service_type VARCHAR(100) NOT NULL,
  service_duration_hours INT,
  booking_start_date TIMESTAMP NOT NULL,
  booking_end_date TIMESTAMP,
  assigned_care_team UUID[] FOREIGN KEY REFERENCES users(id),
  status ENUM('pending', 'confirmed', 'in_progress', 'completed', 'cancelled') DEFAULT 'pending',
  billing_frequency ENUM('hourly', 'daily', 'weekly', 'monthly') NOT NULL,
  rate_amount DECIMAL(10,2) NOT NULL,
  total_cost DECIMAL(12,2),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_service_bookings_client_id ON service_bookings(client_id);
CREATE INDEX idx_service_bookings_status ON service_bookings(status);
```

#### 13. Invoices Table
```sql
CREATE TABLE invoices (
  id UUID PRIMARY KEY,
  invoice_number VARCHAR(50) UNIQUE NOT NULL,
  client_id UUID FOREIGN KEY REFERENCES clients(id),
  billing_period_start DATE NOT NULL,
  billing_period_end DATE NOT NULL,
  services JSONB[], -- { service_type, hours, rate, subtotal }
  subtotal DECIMAL(12,2) NOT NULL,
  tax DECIMAL(12,2),
  discount DECIMAL(12,2),
  total_amount DECIMAL(12,2) NOT NULL,
  payment_status ENUM('draft', 'sent', 'paid', 'overdue', 'cancelled') DEFAULT 'draft',
  due_date DATE NOT NULL,
  paid_date DATE,
  stripe_invoice_id VARCHAR(255),
  pdf_url VARCHAR(255),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_invoices_client_id ON invoices(client_id);
CREATE INDEX idx_invoices_payment_status ON invoices(payment_status);
```

#### 14. Payments Table
```sql
CREATE TABLE payments (
  id UUID PRIMARY KEY,
  invoice_id UUID FOREIGN KEY REFERENCES invoices(id),
  amount DECIMAL(12,2) NOT NULL,
  payment_method ENUM('stripe', 'paypal', 'bank_transfer', 'cash') NOT NULL,
  stripe_payment_intent_id VARCHAR(255),
  transaction_id VARCHAR(255),
  payment_status ENUM('pending', 'completed', 'failed', 'refunded') DEFAULT 'pending',
  paid_at TIMESTAMP,
  refund_reason TEXT,
  refunded_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_payments_invoice_id ON payments(invoice_id);
CREATE INDEX idx_payments_payment_status ON payments(payment_status);
```

#### 15. Support Tickets Table
```sql
CREATE TABLE support_tickets (
  id UUID PRIMARY KEY,
  ticket_number VARCHAR(50) UNIQUE NOT NULL,
  created_by_id UUID FOREIGN KEY REFERENCES users(id),
  assigned_to_id UUID FOREIGN KEY REFERENCES users(id),
  client_id UUID FOREIGN KEY REFERENCES clients(id),
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  category ENUM('billing', 'technical', 'account', 'general', 'urgent') NOT NULL,
  priority ENUM('low', 'medium', 'high', 'critical') DEFAULT 'medium',
  status ENUM('open', 'in_progress', 'waiting_customer', 'resolved', 'closed') DEFAULT 'open',
  resolution_notes TEXT,
  resolved_at TIMESTAMP,
  satisfaction_rating INT, -- 1-5 scale
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  resolved_date TIMESTAMP
);

CREATE INDEX idx_support_tickets_status ON support_tickets(status);
CREATE INDEX idx_support_tickets_priority ON support_tickets(priority);
```

#### 16. Communications Table
```sql
CREATE TABLE communications (
  id UUID PRIMARY KEY,
  communication_type ENUM('email', 'sms', 'in_app', 'push') NOT NULL,
  recipient_id UUID FOREIGN KEY REFERENCES users(id),
  subject VARCHAR(255),
  content TEXT NOT NULL,
  template_id VARCHAR(255), -- mailchimp or custom template
  status ENUM('draft', 'queued', 'sent', 'delivered', 'failed', 'bounced') DEFAULT 'draft',
  external_id VARCHAR(255), -- Mailchimp, Twilio ID, etc.
  sent_at TIMESTAMP,
  opened_at TIMESTAMP,
  clicked_at TIMESTAMP,
  delivery_error TEXT,
  campaign_id VARCHAR(255), -- for marketing campaigns
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_communications_recipient_id_status ON communications(recipient_id, status);
```

#### 17. A/B Tests Table
```sql
CREATE TABLE ab_tests (
  id UUID PRIMARY KEY,
  test_name VARCHAR(255) NOT NULL,
  test_type ENUM('landing_page', 'email', 'feature', 'pricing') NOT NULL,
  variant_a_name VARCHAR(100),
  variant_b_name VARCHAR(100),
  variant_a_config JSONB,
  variant_b_config JSONB,
  start_date TIMESTAMP NOT NULL,
  end_date TIMESTAMP,
  status ENUM('draft', 'running', 'completed', 'cancelled') DEFAULT 'draft',
  hypothesis TEXT,
  created_by_id UUID FOREIGN KEY REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_ab_tests_status ON ab_tests(status);
```

#### 18. Engagement Metrics Table
```sql
CREATE TABLE engagement_metrics (
  id UUID PRIMARY KEY,
  client_id UUID FOREIGN KEY REFERENCES clients(id),
  family_id UUID FOREIGN KEY REFERENCES family_members(id),
  metric_date DATE NOT NULL,
  last_login TIMESTAMP,
  messages_sent INT,
  documents_viewed INT,
  updates_read INT,
  features_used TEXT[],
  engagement_score DECIMAL(5,2), -- 0-100 score
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_engagement_metrics_client_id_date ON engagement_metrics(client_id, metric_date);
```

#### 19. Organization / Company Table
```sql
CREATE TABLE organizations (
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE,
  email VARCHAR(255),
  phone VARCHAR(20),
  website VARCHAR(255),
  logo_url VARCHAR(255),
  address JSONB,
  timezone VARCHAR(100),
  mailchimp_api_key VARCHAR(255),
  mailchimp_list_id VARCHAR(255),
  stripe_account_id VARCHAR(255),
  calendly_username VARCHAR(255),
  twilio_sid VARCHAR(255),
  twilio_token VARCHAR(255),
  max_clients INT,
  subscription_tier ENUM('starter', 'professional', 'enterprise') DEFAULT 'starter',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## API Architecture

### Authentication & Authorization
```
POST   /api/auth/register           - Register new user
POST   /api/auth/login              - User login
POST   /api/auth/logout             - User logout
POST   /api/auth/refresh            - Refresh JWT token
POST   /api/auth/forgot-password    - Password reset flow
POST   /api/auth/reset-password     - Complete password reset
GET    /api/auth/me                 - Get current user profile
PUT    /api/auth/me                 - Update user profile
```

### Client Portal - Family/Client APIs
```
GET    /api/clients/:clientId                    - Get client details
GET    /api/clients/:clientId/updates            - Get care updates (paginated)
GET    /api/clients/:clientId/health-logs        - Get weekly health logs
GET    /api/clients/:clientId/documents          - List documents
POST   /api/documents                            - Upload document
GET    /api/documents/:documentId                - Download document
GET    /api/messages/:conversationId             - Get messages with care team
POST   /api/messages                             - Send message
GET    /api/clients/:clientId/care-plan          - Get care plan
GET    /api/clients/:clientId/appointments       - Get appointments
GET    /api/clients/:clientId/invoices           - Get invoices
GET    /api/invoices/:invoiceId/download         - Download invoice PDF
```

### Care Team APIs
```
POST   /api/clients/:clientId/progress-notes     - Create progress note
PUT    /api/progress-notes/:noteId               - Update progress note
GET    /api/clients/:clientId/progress-notes     - Get all notes
POST   /api/clients/:clientId/flag-urgent        - Flag urgent update
GET    /api/messages/:conversationId             - Get messages
POST   /api/messages                             - Send message
POST   /api/documents                            - Upload document
POST   /api/clients/:clientId/health-logs        - Create health log entry
```

### Admin & Operations APIs
```
GET    /api/admin/dashboard                      - Dashboard KPIs
GET    /api/admin/clients                        - List all clients
GET    /api/admin/leads                          - List leads
GET    /api/admin/consultations                  - List consultations
GET    /api/admin/consultations/:id              - Get consultation details
PUT    /api/admin/consultations/:id              - Update consultation status
GET    /api/admin/service-bookings               - List service bookings
POST   /api/admin/service-bookings               - Create service booking
GET    /api/admin/invoices                       - List invoices
POST   /api/admin/invoices                       - Create invoice
GET    /api/admin/support-tickets                - List support tickets
POST   /api/admin/support-tickets                - Create ticket
PUT    /api/admin/support-tickets/:id            - Update ticket status
GET    /api/admin/reports/revenue                - Revenue report
GET    /api/admin/reports/services-popular       - Popular services
GET    /api/admin/reports/client-satisfaction    - Satisfaction metrics
GET    /api/admin/analytics                      - Performance analytics
```

### Booking & Consultation APIs
```
GET    /api/consultations/available-slots        - Get Calendly availability
POST   /api/consultations/schedule               - Schedule consultation
PUT    /api/consultations/:id/reschedule         - Reschedule consultation
DELETE /api/consultations/:id/cancel             - Cancel consultation
GET    /api/consultations/:id/intake-form        - Get intake form
POST   /api/consultations/:id/submit-intake      - Submit intake form
```

### Payment APIs
```
POST   /api/payments/create-intent               - Create Stripe payment intent
POST   /api/payments/webhook/stripe              - Stripe webhook handler
GET    /api/payments/invoice/:invoiceId          - Get invoice
POST   /api/payments/invoice/:invoiceId/send     - Send invoice to client
```

### Email & Automation APIs
```
POST   /api/email/send-confirmation              - Send consultation confirmation
POST   /api/email/send-reminder                  - Send pre-consultation reminder
POST   /api/email/send-followup                  - Send post-consultation followup
POST   /api/campaigns/mailchimp-sync             - Sync leads to MailChimp
GET    /api/campaigns/:id/performance            - Get campaign performance
```

---

## Client Portal Features

### Feature 1: Real-Time Care Updates
**Components:**
- `UpdatesFeed.tsx` - Main feed component
- `UpdateCard.tsx` - Individual update card with images/attachments
- `UpdateFilter.tsx` - Filter by date, type
- `WebSocket` - Real-time notification handler

**Database Dependencies:**
- `progress_notes` table
- `documents` table (for attachments)

**Key Functionality:**
- Paginated feed loading
- Filter by update type, date range
- Expandable update details
- Attachment preview/download
- Timestamp display with timezone
- Notification badges for urgent updates

### Feature 2: Health Logs (Weekly)
**Components:**
- `HealthLogsView.tsx` - Weekly logs display
- `HealthLogChart.tsx` - Vital signs visualization
- `MealTracker.tsx` - Daily meal tracking
- `MedicationTracker.tsx` - Medication adherence

**Database Dependencies:**
- `health_logs` table

**Key Functionality:**
- Weekly view with day-by-day breakdown
- Vital signs charting (blood pressure, heart rate, weight trends)
- Meal log with photos
- Medication compliance tracking
- Mood and activity logs
- Export to PDF

### Feature 3: Document Storage
**Components:**
- `DocumentLibrary.tsx` - Main document browser
- `DocumentUpload.tsx` - Upload interface
- `DocumentCard.tsx` - Document preview/download
- `DocumentViewer.tsx` - PDF/image viewer

**Database Dependencies:**
- `documents` table

**Key Functionality:**
- Organize by category (prescriptions, test results, etc.)
- Search and filter
- Download individual or bulk documents
- File size/type validation
- Virus scanning integration
- Permission-based visibility

### Feature 4: Care Plans & Schedules
**Components:**
- `CarePlanView.tsx` - View care plan
- `WeeklySchedule.tsx` - Weekly care schedule
- `GoalsTracker.tsx` - Track care goals

**Database Dependencies:**
- `care_plans` table

**Key Functionality:**
- Display weekly schedule with assigned team members
- Care goals and progress
- Important tasks highlighting
- Team member contact info
- Schedule sync to personal calendar (ics export)

### Feature 5: Messaging
**Components:**
- `MessageThread.tsx` - Conversation view
- `MessageInput.tsx` - Text input with file attachment
- `ConversationsList.tsx` - List of conversations
- `MessageNotification.tsx` - Unread indicators

**Database Dependencies:**
- `messages` table
- `users` table (for participants)

**Key Functionality:**
- Real-time message updates (WebSocket)
- Message history search
- File attachment support
- Message read receipts
- Typing indicators
- Time-based message grouping

### Feature 6: Appointments
**Components:**
- `AppointmentsCalendar.tsx` - Calendar view
- `AppointmentCard.tsx` - Appointment details
- `AppointmentReminder.tsx` - Reminder notification

**Database Dependencies:**
- `appointments` table

**Key Functionality:**
- Calendar view (month/week/day)
- Appointment details with location/notes
- Doctor/specialist contact info
- Set reminders (1 day, 3 days, 1 week)
- Export to calendar app

### Feature 7: Invoices & Billing
**Components:**
- `InvoicesList.tsx` - List invoices
- `InvoiceDetail.tsx` - Invoice detail view
- `PaymentHistory.tsx` - Payment history timeline

**Database Dependencies:**
- `invoices` table
- `payments` table

**Key Functionality:**
- View all invoices
- Download PDF
- View payment history
- Payment status tracking
- Overdue invoice alerts
- Print invoice

---

## Admin Command Center

### Dashboard Overview
**Metrics to Display:**
- Total active clients
- Monthly recurring revenue (MRR)
- Consultation requests (MTD, YTD)
- Conversion rate (Inquiry → Client)
- Average client LTV
- Churn rate
- Client satisfaction score
- Support ticket response time

**Components:**
- `AdminDashboard.tsx` - Main dashboard
- `MetricsCard.tsx` - Individual metric display
- `RevenueChart.tsx` - Revenue trend chart
- `ConversionFunnel.tsx` - Pipeline visualization

### Consultation & Lead Management
**Features:**
- Lead database with segmentation
- Consultation request tracking
- Status pipeline: Inquiry → Consultation → Proposal → Client
- Assignment to specific team members
- Consultation notes and follow-ups
- Conversion tracking

**Components:**
- `LeadsList.tsx` - Lead database view
- `LeadDetail.tsx` - Lead profile
- `ConsultationForm.tsx` - Create/update consultation
- `ConversionPipeline.tsx` - Visual pipeline

### Service Booking Management
**Features:**
- Create/modify service bookings
- Assign care team members
- Track billing and hours
- Service popularity analytics
- Capacity planning

**Components:**
- `ServiceBookingsList.tsx`
- `BookingDetail.tsx`
- `BookingForm.tsx`
- `ServiceAnalytics.tsx`

### Client Data & Segmentation
**Features:**
- Searchable client database
- Filter by status, care level, location
- Segment by engagement level
- Geographic distribution
- Service utilization

**Components:**
- `ClientsList.tsx` - Main client table
- `ClientProfile.tsx` - Detailed client view
- `SegmentationTools.tsx` - Create segments
- `GeographicMap.tsx` - Client distribution map

### Customer Pipeline View
**Visualization:**
```
Inquiry (100%)
    ↓
Contacted (85%)
    ↓
Interested (60%)
    ↓
Proposed (40%)
    ↓
Client (20%)
```

**Components:**
- `PipelineView.tsx` - Kanban-style pipeline
- `StageCard.tsx` - Leads in each stage
- `PipelineMetrics.tsx` - Stage metrics and duration

### Support Ticket System
**Features:**
- Create and manage support tickets
- Priority and category classification
- Assignment to support team
- Resolution tracking
- Customer satisfaction rating
- Knowledge base linking

**Components:**
- `TicketsList.tsx`
- `TicketDetail.tsx`
- `TicketForm.tsx`
- `KnowledgeBase.tsx`

### Reporting & Analytics
**Reports Available:**
1. **Revenue Report**
   - Monthly revenue breakdown
   - Service type breakdown
   - Client LTV analysis
   - Payment method breakdown

2. **Popular Services Report**
   - Service bookings by type
   - Top performing services
   - Revenue by service
   - Growth trends

3. **Client Satisfaction Report**
   - NPS scores
   - Feedback sentiment analysis
   - Service satisfaction by care level
   - Support ticket satisfaction

4. **Performance Analytics**
   - Traffic sources
   - Conversion rates
   - Funnel drop-off analysis
   - User behavior analytics

5. **Client Retention Report**
   - Churn rate
   - Retention cohorts
   - At-risk clients
   - Loyalty analysis

**Components:**
- `ReportBuilder.tsx` - Custom report builder
- `ReportViewer.tsx` - View and export reports
- `AnalyticsDashboard.tsx` - Visual analytics

---

## Third-Party Integrations

### 1. Calendly Integration

**Endpoints Used:**
- `GET /calendly/users/:username/availability` - Get availability
- `POST /calendly/scheduled_events` - Create event
- `PATCH /calendly/scheduled_events/:event_id` - Update event
- `DELETE /calendly/scheduled_events/:event_id` - Cancel event
- `GET /calendly/scheduled_events` - List events

**Features:**
- Real-time availability display
- Time zone auto-detection
- One-click scheduling from platform
- Calendar sync to Google/Outlook
- Automatic reminders
- Pre-consultation intake form

**Implementation:**
```typescript
// /lib/calendly.ts
export async function getAvailableSlots(username: string) {
  // Fetch from Calendly API
}

export async function scheduleConsultation(data: ConsultationData) {
  // Create event on Calendly
  // Store calendar link in DB
}
```

### 2. Stripe Integration

**Features:**
- Payment processing
- Subscription billing
- Invoice generation
- Payment history
- Refund handling

**Implementation:**
```typescript
// /lib/stripe.ts
export async function createPaymentIntent(amount: number, clientId: string) {
  // Create Stripe intent
}

export async function handleWebhookEvent(event) {
  // Handle payment_intent.succeeded
  // Handle invoice.paid
  // Handle charge.refunded
}
```

### 3. MailChimp Integration

**Features:**
- Email campaign creation
- Lead list sync
- Automation sequences
- Campaign performance tracking
- Segment-based campaigns

**Automation Sequences:**
1. **Pre-Consultation Sequence**
   - Immediate: Confirmation email
   - 6h before: SMS reminder
   - 12h before: Email reminder
   - Post-consultation: Thank you + feedback

2. **Lead Nurture Sequence**
   - Day 1: Welcome email
   - Day 3: Service overview
   - Day 7: Social proof / testimonials
   - Day 14: Special offer

**Implementation:**
```typescript
// /lib/mailchimp.ts
export async function addToList(email: string, segment: string) {
  // Sync to MailChimp list
}

export async function triggerAutomation(email: string, workflowId: string) {
  // Trigger automation workflow
}
```

### 4. Twilio Integration

**Features:**
- SMS reminders
- SMS notifications
- Two-factor authentication
- Voice calls (optional)

**Implementation:**
```typescript
// /lib/twilio.ts
export async function sendSMS(phoneNumber: string, message: string) {
  // Send SMS via Twilio
}

export async function scheduleReminder(phoneNumber: string, message: string, sendAt: Date) {
  // Schedule SMS reminder
}
```

### 5. Cloudflare R2 Integration

**Features:**
- Document storage
- Photo/video storage
- Secure file upload
- Time-limited signed URLs
- S3-compatible API
- Global edge caching

**Implementation:**
```typescript
// /lib/r2.ts
import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const r2 = new S3Client({
  region: "auto",
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
  endpoint: process.env.R2_ENDPOINT_URL!,
});

export async function uploadDocument(file: File, clientId: string) {
  const key = `documents/${clientId}/${Date.now()}-${file.name}`;
  const command = new PutObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME!,
    Key: key,
    Body: await file.arrayBuffer(),
    ContentType: file.type,
  });
  
  await r2.send(command);
  return key;
}

export async function generateSignedUrl(fileKey: string, expiresIn: number = 3600) {
  // Generate signed URL valid for specific time (default 1 hour)
  const command = new GetObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME!,
    Key: fileKey,
  });
  
  return await getSignedUrl(r2, command, { expiresIn });
}

export function getPublicUrl(fileKey: string) {
  // Get public R2 URL if object is public
  return `${process.env.R2_PUBLIC_URL}/${fileKey}`;
}
```

### 6. SendGrid Integration

**Features:**
- Transactional emails
- Email templates
- Bounce/complaint handling

---

## Authentication & Security

### Authentication Flow

1. **User Registration**
   - Email verification
   - Phone verification (optional)
   - Role assignment
   - Organization assignment

2. **Login**
   - Email + password authentication
   - JWT token generation (access + refresh)
   - Session tracking

3. **Authorization**
   - Role-based access control (RBAC)
   - Organization-based isolation
   - Resource-level permissions

### Security Measures

1. **Data Protection**
   - Passwords: bcrypt hashing
   - Sensitive data: Encryption at rest (AES-256)
   - Communication: TLS/HTTPS only
   - API: Rate limiting and DDoS protection

2. **Access Control**
   - JWT tokens with 15-min expiry
   - Refresh tokens with 7-day expiry
   - API key authentication for external integrations
   - IP whitelisting for admin endpoints

3. **Compliance**
   - HIPAA compliance (healthcare data)
   - GDPR compliance (data privacy)
   - SOC2 audit trail
   - Data encryption and key rotation

4. **File Security**
   - File type validation (whitelist allowed types)
   - Virus scanning for uploaded documents
   - Secure file storage with access logs via R2
   - Time-limited signed URLs for downloads
   - Automatic cleanup of sensitive files
   - R2 bucket encryption at rest

---

## Implementation Timeline

### Month 1: Foundation (Weeks 1-4)
- Week 1-2: Database schema, Prisma setup, project structure
- Week 3-4: Authentication system, RBAC, basic UI setup

### Month 2: Client Portal MVP (Weeks 5-8)
- Week 5: Updates feed, health logs
- Week 6: Document storage
- Week 7: Messaging system
- Week 8: Care plans, appointments

### Month 3: Payments & Operations (Weeks 9-12)
- Week 9-10: Stripe integration, invoicing
- Week 11-12: Consultation tracking, lead management

### Month 4: Admin & Booking (Weeks 13-16)
- Week 13-14: Admin dashboard, analytics
- Week 15-16: Calendly integration, booking system

### Month 5: Marketing & Automation (Weeks 17-20)
- Week 17-18: MailChimp integration, email automation
- Week 19-20: A/B testing, advanced analytics

### Month 6: Optimization (Weeks 21-24)
- Week 21-22: Mobile optimization, performance tuning
- Week 23-24: Testing, security audit, deployment

---

## Technology Stack Summary

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 15, React 19, TypeScript, Tailwind CSS |
| Backend | Node.js, Next.js API Routes |
| Database | PostgreSQL, Prisma ORM |
| File Storage | Cloudflare R2 |
| Real-time | Socket.io / WebSockets |
| Authentication | JWT + Refresh Tokens |
| Payments | Stripe |
| Email | SendGrid + MailChimp |
| SMS | Twilio |
| Scheduling | Calendly API |
| Analytics | PostHog / Mixpanel |
| Deployment | Vercel / AWS |
| Monitoring | Sentry + DataDog |

---

## Key Deliverables

### Phase 1
- [x] Database schema design
- [x] API documentation
- [x] Authentication system
- [ ] Folder structure

### Phase 2
- [ ] Client portal frontend
- [ ] Real-time updates
- [ ] Document management

### Phase 3
- [ ] Payment processing
- [ ] Invoice generation
- [ ] Billing dashboard

### Phase 4
- [ ] Admin dashboard
- [ ] Analytics reports
- [ ] Support ticket system

### Phase 5
- [ ] Calendly integration
- [ ] Booking system
- [ ] Intake forms

### Phase 6
- [ ] Email automation
- [ ] MailChimp campaigns
- [ ] A/B testing framework

---

## Risk Mitigation

| Risk | Mitigation |
|------|-----------|
| HIPAA Compliance | Encrypted storage, access logs, audit trail |
| Real-time Scalability | WebSocket server optimization, CDN usage |
| Payment Security | PCI compliance, Stripe handling, webhook validation |
| Data Privacy | Encryption, data masking, GDPR compliance |
| Integration Failures | Fallback systems, retry logic, monitoring |

---

## Success Metrics

- **Client Portal Adoption**: >80% family member registration within 3 months
- **Support Reduction**: 30% fewer support tickets via self-service portal
- **Booking Efficiency**: 2x faster consultation scheduling
- **Revenue Growth**: 25% increase in client bookings post-implementation
- **User Satisfaction**: >4.5/5 star rating on portal features
- **Admin Efficiency**: 50% reduction in administrative tasks

---

## Notes for Development

1. **Priority**: Start with database design and authentication - these are foundation for everything
2. **Testing**: Write unit tests for API endpoints and critical business logic
3. **Monitoring**: Set up error tracking and performance monitoring from day 1
4. **Documentation**: Maintain API documentation as you build
5. **Code Review**: Establish code review process for security and quality
6. **Staging**: Use staging environment that mirrors production
7. **Secrets Management**: Use environment variables for all sensitive data (API keys, DB passwords)
8. **Backup**: Regular database backups and disaster recovery plan

---

**Last Updated**: January 4, 2026
**Status**: Ready for Development
