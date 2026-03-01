-- CreateTable
CREATE TABLE "sms_reminder_settings" (
    "id" TEXT NOT NULL,
    "preConsultationTemplate" TEXT NOT NULL DEFAULT 'Hi {clientName}, your LivingRite consultation is in 12 hours ({consultationTime}). Please join 5-10 minutes early. Reply with any questions!',
    "preConsultationEnabled" BOOLEAN NOT NULL DEFAULT true,
    "postConsultationTemplate" TEXT NOT NULL DEFAULT 'Hi {clientName}, thank you for your consultation! We''d love your feedback: {feedbackLink}. Reply if you have any questions!',
    "postConsultationEnabled" BOOLEAN NOT NULL DEFAULT true,
    "followUpTemplate" TEXT NOT NULL DEFAULT 'Hi {clientName}, following up from your consultation. How are you doing? Let us know if you have any questions. We''re here to help!',
    "followUpEnabled" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sms_reminder_settings_pkey" PRIMARY KEY ("id")
);
