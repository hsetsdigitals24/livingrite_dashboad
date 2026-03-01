import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Template variable replacement helper
 */
function replaceTemplateVariables(
  template: string,
  variables: Record<string, string>
): string {
  let result = template;
  Object.entries(variables).forEach(([key, value]) => {
    result = result.replace(new RegExp(`\\{${key}\\}`, 'g'), value);
  });
  return result;
}

/**
 * Get SMS settings from database with fallback to defaults
 */
async function getSMSSettings() {
  try {
    let settings = await prisma.sMSReminderSettings.findFirst();

    if (!settings) {
      settings = await prisma.sMSReminderSettings.create({
        data: {
          preConsultationTemplate:
            "Hi {clientName}, your LivingRite consultation is in 12 hours ({consultationTime}). Please join 5-10 minutes early. Reply with any questions!",
          preConsultationEnabled: true,
          postConsultationTemplate:
            "Hi {clientName}, thank you for your consultation! We'd love your feedback: {feedbackLink}. Reply if you have any questions!",
          postConsultationEnabled: true,
          followUpTemplate:
            "Hi {clientName}, following up from your consultation. How are you doing? Let us know if you have any questions. We're here to help!",
          followUpEnabled: true,
        },
      });
    }

    return settings;
  } catch (error) {
    console.error('Error fetching SMS settings:', error);
    throw error;
  }
}

/**
 * Get 12-hour pre-consultation SMS template
 */
export async function get12HourPreConsultationSMS(
  clientName: string,
  consultationTime: string
): Promise<string> {
  const settings = await getSMSSettings();

  if (!settings.preConsultationEnabled) {
    return ''; // Return empty string if disabled
  }

  return replaceTemplateVariables(settings.preConsultationTemplate, {
    clientName,
    consultationTime,
  });
}

/**
 * Get post-consultation thank you SMS template
 */
export async function getPostConsultationThankYouSMS(
  clientName: string,
  feedbackLink: string
): Promise<string> {
  const settings = await getSMSSettings();

  if (!settings.postConsultationEnabled) {
    return ''; // Return empty string if disabled
  }

  return replaceTemplateVariables(settings.postConsultationTemplate, {
    clientName,
    feedbackLink,
  });
}

/**
 * Get 48-hour follow-up SMS template
 */
export async function get48HourFollowUpSMS(clientName: string): Promise<string> {
  const settings = await getSMSSettings();

  if (!settings.followUpEnabled) {
    return ''; // Return empty string if disabled
  }

  return replaceTemplateVariables(settings.followUpTemplate, {
    clientName,
  });
}

/**
 * Check if a specific reminder type is enabled
 */
export async function isReminderEnabled(
  reminderType: '12-hour-pre' | 'thank-you' | '48-hour-followup'
): Promise<boolean> {
  const settings = await getSMSSettings();

  switch (reminderType) {
    case '12-hour-pre':
      return settings.preConsultationEnabled;
    case 'thank-you':
      return settings.postConsultationEnabled;
    case '48-hour-followup':
      return settings.followUpEnabled;
    default:
      return true;
  }
}
