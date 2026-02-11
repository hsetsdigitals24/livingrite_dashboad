-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'CAREGIVER', 'CLIENT');

-- CreateEnum
CREATE TYPE "AccessLevel" AS ENUM ('VIEW', 'EDIT', 'FULL_ACCESS');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('FREE', 'PENDING', 'PAID', 'FAILED', 'REFUNDED');

-- CreateEnum
CREATE TYPE "BookingStatus" AS ENUM ('SCHEDULED', 'RESCHEDULED', 'CANCELLED', 'COMPLETED', 'NO_SHOW');

-- CreateEnum
CREATE TYPE "ReminderStatus" AS ENUM ('PENDING', 'SENT', 'FAILED', 'CANCELLED');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "emailVerified" TIMESTAMP(3),
    "password" TEXT,
    "image" TEXT,
    "phone" TEXT,
    "role" "Role" NOT NULL DEFAULT 'CLIENT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "password_reset_tokens" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "isUsed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "password_reset_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "caregiver_profiles" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "licenseNumber" TEXT,
    "specialization" TEXT[],
    "yearsOfExperience" INTEGER,
    "bio" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "caregiver_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "patients" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "image" TEXT,
    "dateOfBirth" TIMESTAMP(3),
    "biologicalGender" TEXT,
    "heightCm" DOUBLE PRECISION,
    "weightKg" DOUBLE PRECISION,
    "timezone" TEXT,
    "medicalConditions" TEXT[],
    "medications" JSONB,
    "emergencyContact" TEXT,
    "emergencyPhone" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "patients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "family_member_assignments" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "relationshipType" TEXT NOT NULL,
    "accessLevel" "AccessLevel" NOT NULL DEFAULT 'VIEW',
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "family_member_assignments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "patient_caregiver_assignments" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "caregiverId" TEXT NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "unassignedAt" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "patient_caregiver_assignments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accounts" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verification_tokens" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "bookings" (
    "id" TEXT NOT NULL,
    "calcomId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "serviceId" TEXT,
    "patientId" TEXT,
    "calendlyEventId" TEXT,
    "scheduledAt" TIMESTAMP(3) NOT NULL,
    "timezone" TEXT,
    "status" "BookingStatus" NOT NULL DEFAULT 'SCHEDULED',
    "intakeForm" JSONB,
    "notes" TEXT,
    "clientName" TEXT NOT NULL,
    "clientEmail" TEXT NOT NULL,
    "clientPhone" TEXT,
    "eventTitle" TEXT,
    "note" TEXT,
    "meetingUri" TEXT,
    "intakeFormData" JSONB,
    "confirmationSent" BOOLEAN NOT NULL DEFAULT false,
    "reminderSent" BOOLEAN NOT NULL DEFAULT false,
    "thankYouSent" BOOLEAN NOT NULL DEFAULT false,
    "followUpSent" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "cancelledAt" TIMESTAMP(3),
    "rescheduledFrom" TEXT,

    CONSTRAINT "bookings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vitals" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "temperature" DOUBLE PRECISION NOT NULL,
    "bloodPressure" TEXT NOT NULL,
    "heartRate" INTEGER NOT NULL,
    "recordedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "vitals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "daily_logs" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "medicationAdherence" JSONB,
    "hygieneSelfcare" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "daily_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "files" (
    "id" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "originalName" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "url" TEXT NOT NULL,
    "patientId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "files_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sleep_logs" (
    "id" TEXT NOT NULL,
    "dailyLogId" TEXT NOT NULL,
    "bedtime" TIMESTAMP(3) NOT NULL,
    "wakeTime" TIMESTAMP(3) NOT NULL,
    "totalSleepMinutes" INTEGER NOT NULL,
    "awakeMinutes" INTEGER,
    "lightSleepMinutes" INTEGER,
    "deepSleepMinutes" INTEGER,
    "remSleepMinutes" INTEGER,
    "sleepScore" INTEGER,
    "interruptions" INTEGER,
    "avgHeartRateDuringSleep" DOUBLE PRECISION,
    "lowestHeartRate" INTEGER,
    "highestHeartRate" INTEGER,
    "respiratoryRateAvg" DOUBLE PRECISION,
    "bloodOxygenAvg" DOUBLE PRECISION,
    "roomTemperature" DOUBLE PRECISION,
    "noiseLevel" TEXT,
    "lightExposure" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sleep_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "morning_vitals" (
    "id" TEXT NOT NULL,
    "dailyLogId" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "systolic" INTEGER NOT NULL,
    "diastolic" INTEGER NOT NULL,
    "pulse" INTEGER NOT NULL,
    "temperatureCelsius" DOUBLE PRECISION NOT NULL,
    "weightKg" DOUBLE PRECISION,
    "restingHeartRate" INTEGER,
    "heartRateVariability" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "morning_vitals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "evening_vitals" (
    "id" TEXT NOT NULL,
    "dailyLogId" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "systolic" INTEGER NOT NULL,
    "diastolic" INTEGER NOT NULL,
    "pulse" INTEGER NOT NULL,
    "temperatureCelsius" DOUBLE PRECISION NOT NULL,
    "weightKg" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "evening_vitals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "physical_activities" (
    "id" TEXT NOT NULL,
    "dailyLogId" TEXT NOT NULL,
    "steps" INTEGER,
    "distanceKm" DOUBLE PRECISION,
    "activeMinutes" INTEGER,
    "caloriesBurned" DOUBLE PRECISION,
    "floorsClimbed" INTEGER,
    "sedentaryMinutes" INTEGER,
    "standingMinutes" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "physical_activities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workouts" (
    "id" TEXT NOT NULL,
    "physicalActivityId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "durationMinutes" INTEGER NOT NULL,
    "distanceKm" DOUBLE PRECISION,
    "calories" DOUBLE PRECISION,
    "heartRateZone1Minutes" INTEGER,
    "heartRateZone2Minutes" INTEGER,
    "heartRateZone3Minutes" INTEGER,
    "heartRateZone4Minutes" INTEGER,
    "heartRateZone5Minutes" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "workouts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "nutrition" (
    "id" TEXT NOT NULL,
    "dailyLogId" TEXT NOT NULL,
    "totalCalories" DOUBLE PRECISION NOT NULL,
    "totalProteinG" DOUBLE PRECISION NOT NULL,
    "totalCarbsG" DOUBLE PRECISION NOT NULL,
    "totalFatG" DOUBLE PRECISION NOT NULL,
    "totalFiberG" DOUBLE PRECISION NOT NULL,
    "totalSugarG" DOUBLE PRECISION NOT NULL,
    "totalSodiumMg" INTEGER,
    "totalWaterMl" DOUBLE PRECISION,
    "supplements" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "nutrition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "meals" (
    "id" TEXT NOT NULL,
    "nutritionId" TEXT NOT NULL,
    "mealType" TEXT NOT NULL,
    "mealTime" TIMESTAMP(3) NOT NULL,
    "foods" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "meals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mental_health" (
    "id" TEXT NOT NULL,
    "dailyLogId" TEXT NOT NULL,
    "moodRatings" JSONB NOT NULL,
    "meditationSessions" INTEGER,
    "meditationTotalMin" INTEGER,
    "meditationType" TEXT,
    "meditationTime" TIMESTAMP(3),
    "gratitudeJournal" TEXT[],
    "qualityTimeSocialMin" INTEGER,
    "meaningfulConversations" INTEGER,
    "socialEnergyLevel" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "mental_health_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cognitive_performance" (
    "id" TEXT NOT NULL,
    "dailyLogId" TEXT NOT NULL,
    "focusSessions" JSONB,
    "brainTrainingCompleted" BOOLEAN,
    "gamesPlayed" JSONB,
    "averageScore" INTEGER,
    "reactionTimeMs" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cognitive_performance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "environmental_exposure" (
    "id" TEXT NOT NULL,
    "dailyLogId" TEXT NOT NULL,
    "totalScreenMinutes" INTEGER,
    "workScreenMinutes" INTEGER,
    "leisureScreenMinutes" INTEGER,
    "blueLightEveningExposure" TEXT,
    "outdoorTimeMinutes" INTEGER,
    "sunlightExposureMin" INTEGER,
    "airQualityIndex" INTEGER,
    "uvExposureIndex" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "environmental_exposure_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "women_health" (
    "id" TEXT NOT NULL,
    "dailyLogId" TEXT NOT NULL,
    "menstrualCycleDay" INTEGER,
    "cyclePhase" TEXT,
    "symptoms" JSONB,
    "basalBodyTemperature" DOUBLE PRECISION,
    "cervicalMucus" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "women_health_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "glucose_monitoring" (
    "id" TEXT NOT NULL,
    "dailyLogId" TEXT NOT NULL,
    "fastingGlucoseMgDl" INTEGER,
    "averageGlucoseMgDl" INTEGER,
    "timeInRangePercent" INTEGER,
    "postMealReadings" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "glucose_monitoring_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "medical_appointments" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "provider" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "pulse" INTEGER,
    "systolic" INTEGER,
    "diastolic" INTEGER,
    "weightKg" DOUBLE PRECISION,
    "temperatureCelsius" DOUBLE PRECISION,
    "labOrders" JSONB,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "medical_appointments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lab_results" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "testResults" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "lab_results_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "services" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "basePrice" DOUBLE PRECISION,
    "currency" TEXT NOT NULL DEFAULT 'NGN',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "pricingConfig" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "services_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payments" (
    "id" TEXT NOT NULL,
    "bookingId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "providerRef" TEXT,
    "paidAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "invoices" (
    "id" TEXT NOT NULL,
    "bookingId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "currency" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "invoices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reminders" (
    "id" TEXT NOT NULL,
    "bookingId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "scheduledAt" TIMESTAMP(3) NOT NULL,
    "status" "ReminderStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reminders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admin_signup_codes" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "isUsed" BOOLEAN NOT NULL DEFAULT false,
    "usedBy" TEXT,
    "usedAt" TIMESTAMP(3),
    "createdBy" TEXT NOT NULL,

    CONSTRAINT "admin_signup_codes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "landing_page_popups" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "imageUrl" TEXT,
    "imageAlt" TEXT,
    "actionButtonText" TEXT NOT NULL,
    "actionButtonUrl" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "landing_page_popups_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "password_reset_tokens_token_key" ON "password_reset_tokens"("token");

-- CreateIndex
CREATE UNIQUE INDEX "caregiver_profiles_userId_key" ON "caregiver_profiles"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "patients_email_key" ON "patients"("email");

-- CreateIndex
CREATE INDEX "family_member_assignments_patientId_idx" ON "family_member_assignments"("patientId");

-- CreateIndex
CREATE INDEX "family_member_assignments_clientId_idx" ON "family_member_assignments"("clientId");

-- CreateIndex
CREATE UNIQUE INDEX "family_member_assignments_patientId_clientId_key" ON "family_member_assignments"("patientId", "clientId");

-- CreateIndex
CREATE INDEX "patient_caregiver_assignments_patientId_idx" ON "patient_caregiver_assignments"("patientId");

-- CreateIndex
CREATE INDEX "patient_caregiver_assignments_caregiverId_idx" ON "patient_caregiver_assignments"("caregiverId");

-- CreateIndex
CREATE UNIQUE INDEX "patient_caregiver_assignments_patientId_caregiverId_key" ON "patient_caregiver_assignments"("patientId", "caregiverId");

-- CreateIndex
CREATE UNIQUE INDEX "accounts_provider_providerAccountId_key" ON "accounts"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_sessionToken_key" ON "sessions"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "verification_tokens_token_key" ON "verification_tokens"("token");

-- CreateIndex
CREATE UNIQUE INDEX "verification_tokens_identifier_token_key" ON "verification_tokens"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "bookings_calcomId_key" ON "bookings"("calcomId");

-- CreateIndex
CREATE INDEX "bookings_clientEmail_idx" ON "bookings"("clientEmail");

-- CreateIndex
CREATE INDEX "bookings_scheduledAt_idx" ON "bookings"("scheduledAt");

-- CreateIndex
CREATE INDEX "vitals_patientId_idx" ON "vitals"("patientId");

-- CreateIndex
CREATE INDEX "vitals_recordedAt_idx" ON "vitals"("recordedAt");

-- CreateIndex
CREATE INDEX "daily_logs_patientId_idx" ON "daily_logs"("patientId");

-- CreateIndex
CREATE INDEX "daily_logs_date_idx" ON "daily_logs"("date");

-- CreateIndex
CREATE UNIQUE INDEX "daily_logs_patientId_date_key" ON "daily_logs"("patientId", "date");

-- CreateIndex
CREATE INDEX "files_patientId_idx" ON "files"("patientId");

-- CreateIndex
CREATE UNIQUE INDEX "sleep_logs_dailyLogId_key" ON "sleep_logs"("dailyLogId");

-- CreateIndex
CREATE UNIQUE INDEX "morning_vitals_dailyLogId_key" ON "morning_vitals"("dailyLogId");

-- CreateIndex
CREATE UNIQUE INDEX "evening_vitals_dailyLogId_key" ON "evening_vitals"("dailyLogId");

-- CreateIndex
CREATE UNIQUE INDEX "physical_activities_dailyLogId_key" ON "physical_activities"("dailyLogId");

-- CreateIndex
CREATE UNIQUE INDEX "nutrition_dailyLogId_key" ON "nutrition"("dailyLogId");

-- CreateIndex
CREATE UNIQUE INDEX "mental_health_dailyLogId_key" ON "mental_health"("dailyLogId");

-- CreateIndex
CREATE UNIQUE INDEX "cognitive_performance_dailyLogId_key" ON "cognitive_performance"("dailyLogId");

-- CreateIndex
CREATE UNIQUE INDEX "environmental_exposure_dailyLogId_key" ON "environmental_exposure"("dailyLogId");

-- CreateIndex
CREATE UNIQUE INDEX "women_health_dailyLogId_key" ON "women_health"("dailyLogId");

-- CreateIndex
CREATE UNIQUE INDEX "glucose_monitoring_dailyLogId_key" ON "glucose_monitoring"("dailyLogId");

-- CreateIndex
CREATE INDEX "medical_appointments_patientId_idx" ON "medical_appointments"("patientId");

-- CreateIndex
CREATE INDEX "medical_appointments_date_idx" ON "medical_appointments"("date");

-- CreateIndex
CREATE INDEX "lab_results_patientId_idx" ON "lab_results"("patientId");

-- CreateIndex
CREATE INDEX "lab_results_date_idx" ON "lab_results"("date");

-- CreateIndex
CREATE UNIQUE INDEX "services_slug_key" ON "services"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "payments_bookingId_key" ON "payments"("bookingId");

-- CreateIndex
CREATE UNIQUE INDEX "payments_providerRef_key" ON "payments"("providerRef");

-- CreateIndex
CREATE UNIQUE INDEX "invoices_bookingId_key" ON "invoices"("bookingId");

-- CreateIndex
CREATE INDEX "reminders_bookingId_idx" ON "reminders"("bookingId");

-- CreateIndex
CREATE UNIQUE INDEX "admin_signup_codes_code_key" ON "admin_signup_codes"("code");

-- CreateIndex
CREATE INDEX "admin_signup_codes_isUsed_idx" ON "admin_signup_codes"("isUsed");

-- CreateIndex
CREATE INDEX "admin_signup_codes_expiresAt_idx" ON "admin_signup_codes"("expiresAt");

-- CreateIndex
CREATE INDEX "landing_page_popups_isActive_idx" ON "landing_page_popups"("isActive");

-- AddForeignKey
ALTER TABLE "caregiver_profiles" ADD CONSTRAINT "caregiver_profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "family_member_assignments" ADD CONSTRAINT "family_member_assignments_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "patients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "family_member_assignments" ADD CONSTRAINT "family_member_assignments_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "patient_caregiver_assignments" ADD CONSTRAINT "patient_caregiver_assignments_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "patients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "patient_caregiver_assignments" ADD CONSTRAINT "patient_caregiver_assignments_caregiverId_fkey" FOREIGN KEY ("caregiverId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "services"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "patients"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vitals" ADD CONSTRAINT "vitals_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "patients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "daily_logs" ADD CONSTRAINT "daily_logs_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "patients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "files" ADD CONSTRAINT "files_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "patients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sleep_logs" ADD CONSTRAINT "sleep_logs_dailyLogId_fkey" FOREIGN KEY ("dailyLogId") REFERENCES "daily_logs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "morning_vitals" ADD CONSTRAINT "morning_vitals_dailyLogId_fkey" FOREIGN KEY ("dailyLogId") REFERENCES "daily_logs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "evening_vitals" ADD CONSTRAINT "evening_vitals_dailyLogId_fkey" FOREIGN KEY ("dailyLogId") REFERENCES "daily_logs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "physical_activities" ADD CONSTRAINT "physical_activities_dailyLogId_fkey" FOREIGN KEY ("dailyLogId") REFERENCES "daily_logs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workouts" ADD CONSTRAINT "workouts_physicalActivityId_fkey" FOREIGN KEY ("physicalActivityId") REFERENCES "physical_activities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nutrition" ADD CONSTRAINT "nutrition_dailyLogId_fkey" FOREIGN KEY ("dailyLogId") REFERENCES "daily_logs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "meals" ADD CONSTRAINT "meals_nutritionId_fkey" FOREIGN KEY ("nutritionId") REFERENCES "nutrition"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mental_health" ADD CONSTRAINT "mental_health_dailyLogId_fkey" FOREIGN KEY ("dailyLogId") REFERENCES "daily_logs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cognitive_performance" ADD CONSTRAINT "cognitive_performance_dailyLogId_fkey" FOREIGN KEY ("dailyLogId") REFERENCES "daily_logs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "environmental_exposure" ADD CONSTRAINT "environmental_exposure_dailyLogId_fkey" FOREIGN KEY ("dailyLogId") REFERENCES "daily_logs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "women_health" ADD CONSTRAINT "women_health_dailyLogId_fkey" FOREIGN KEY ("dailyLogId") REFERENCES "daily_logs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "glucose_monitoring" ADD CONSTRAINT "glucose_monitoring_dailyLogId_fkey" FOREIGN KEY ("dailyLogId") REFERENCES "daily_logs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medical_appointments" ADD CONSTRAINT "medical_appointments_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "patients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lab_results" ADD CONSTRAINT "lab_results_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "patients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "bookings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "bookings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reminders" ADD CONSTRAINT "reminders_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "bookings"("id") ON DELETE CASCADE ON UPDATE CASCADE;
