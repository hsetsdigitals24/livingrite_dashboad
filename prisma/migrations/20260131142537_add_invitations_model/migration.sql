/*
  Warnings:

  - You are about to drop the column `requiresPayment` on the `Booking` table. All the data in the column will be lost.
  - The `status` column on the `Booking` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[paymentReference]` on the table `Booking` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Booking" DROP COLUMN "requiresPayment",
ADD COLUMN     "paymentReference" TEXT,
DROP COLUMN "status",
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'PENDING';

-- DropEnum
DROP TYPE "BookingStatus";

-- CreateTable
CREATE TABLE "user_profiles" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT,
    "age" INTEGER,
    "biologicalGender" TEXT,
    "heightCm" DOUBLE PRECISION,
    "weightKg" DOUBLE PRECISION,
    "timezone" TEXT,
    "medicalConditions" TEXT[],
    "medications" JSONB,
    "primaryCaregiverProvider" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vitals" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
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
    "userId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "medicationAdherence" JSONB,
    "hygieneSelfcare" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "daily_logs_pkey" PRIMARY KEY ("id")
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
    "avgHeartRate" INTEGER,
    "maxHeartRate" INTEGER,
    "cadenceAvg" INTEGER,
    "elevationGainM" INTEGER,
    "perceivedExertion" INTEGER,
    "notes" TEXT,
    "zone1Minutes" INTEGER,
    "zone2Minutes" INTEGER,
    "zone3Minutes" INTEGER,
    "zone4Minutes" INTEGER,
    "zone5Minutes" INTEGER,
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
    "userId" TEXT NOT NULL,
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
    "userId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "testResults" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "lab_results_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "invitations" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "invitationCode" TEXT NOT NULL,
    "invitedBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "acceptedAt" TIMESTAMP(3),
    "acceptedBy" TEXT,
    "used" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "invitations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_profiles_userId_key" ON "user_profiles"("userId");

-- CreateIndex
CREATE INDEX "vitals_userId_idx" ON "vitals"("userId");

-- CreateIndex
CREATE INDEX "vitals_recordedAt_idx" ON "vitals"("recordedAt");

-- CreateIndex
CREATE INDEX "daily_logs_userId_idx" ON "daily_logs"("userId");

-- CreateIndex
CREATE INDEX "daily_logs_date_idx" ON "daily_logs"("date");

-- CreateIndex
CREATE UNIQUE INDEX "daily_logs_userId_date_key" ON "daily_logs"("userId", "date");

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
CREATE INDEX "medical_appointments_userId_idx" ON "medical_appointments"("userId");

-- CreateIndex
CREATE INDEX "medical_appointments_date_idx" ON "medical_appointments"("date");

-- CreateIndex
CREATE INDEX "lab_results_userId_idx" ON "lab_results"("userId");

-- CreateIndex
CREATE INDEX "lab_results_date_idx" ON "lab_results"("date");

-- CreateIndex
CREATE UNIQUE INDEX "invitations_invitationCode_key" ON "invitations"("invitationCode");

-- CreateIndex
CREATE INDEX "invitations_email_idx" ON "invitations"("email");

-- CreateIndex
CREATE INDEX "invitations_invitationCode_idx" ON "invitations"("invitationCode");

-- CreateIndex
CREATE INDEX "invitations_role_idx" ON "invitations"("role");

-- CreateIndex
CREATE INDEX "invitations_used_idx" ON "invitations"("used");

-- CreateIndex
CREATE UNIQUE INDEX "Booking_paymentReference_key" ON "Booking"("paymentReference");

-- AddForeignKey
ALTER TABLE "user_profiles" ADD CONSTRAINT "user_profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vitals" ADD CONSTRAINT "vitals_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "daily_logs" ADD CONSTRAINT "daily_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

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
ALTER TABLE "medical_appointments" ADD CONSTRAINT "medical_appointments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lab_results" ADD CONSTRAINT "lab_results_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
