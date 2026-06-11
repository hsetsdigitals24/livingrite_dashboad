interface SMSProps {
  to: string;
  body: string;
}

interface SMSResponse {
  success: boolean;
  messageId?: string;
  error?: string;
}

const apiToken = process.env.SMS_API_TOKEN;
const url = 'https://www.bulksmsnigeria.com/api/v2/sms';

/**
 * Send SMS via BulkSMS Nigeria API
 * Includes error handling, retry logic, and response tracking
 */
export async function sendSMS({to, body}: SMSProps): Promise<SMSResponse> {
  if (!apiToken) {
    throw new Error('SMS_API_TOKEN environment variable is not set');
  }

  if (!to || !body) {
    throw new Error('SMS recipient and body are required');
  }

  const data = {
    from: 'LivingRite Care',
    to,
    body,
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiToken}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`SMS API error: ${response.status} - ${errorData}`);
    }

    const result = await response.json();
    
    // Check if API returned success
    if (result.status === 0 || result.message === 'success') {
      return {
        success: true,
        messageId: result.messageid || result.id,
      };
    } else {
      return {
        success: false,
        error: result.message || 'Unknown SMS API error',
      };
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('SMS sending failed:', errorMessage);
    return {
      success: false,
      error: errorMessage,
    };
  }
}

/**
 * Send SMS with retry logic (max 3 attempts with exponential backoff)
 */
export async function sendSMSWithRetry(
  {to, body}: SMSProps,
  maxRetries: number = 3,
  initialDelay: number = 1000
): Promise<SMSResponse> {
  let lastError: SMSResponse | null = null;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const result = await sendSMS({to, body});
      
      if (result.success) {
        return result;
      }

      lastError = result;

      // Exponential backoff: 1s, 2s, 4s
      if (attempt < maxRetries - 1) {
        const delay = initialDelay * Math.pow(2, attempt);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    } catch (error) {
      lastError = {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  return lastError || {
    success: false,
    error: 'SMS sending failed after all retry attempts',
  };
}

// Default export for backward compatibility
const SMSHandler = sendSMS;
export default SMSHandler;