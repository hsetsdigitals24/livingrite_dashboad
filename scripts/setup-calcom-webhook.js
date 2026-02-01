// Script to document how to set up Cal.com webhooks for this app
// Place this in the Cal.com dashboard: Settings -> Webhooks

console.log('Cal.com webhook setup instructions for LivingRite Portal');
console.log('1. Log in to your Cal.com account');
console.log('2. Go to Settings > Webhooks');
console.log('3. Add a new webhook with the following URL:');
console.log('   ' + (process.env.NEXTAUTH_URL || 'https://your-domain.com') + '/api/webhooks/calcom');
console.log('4. Subscribe to events relevant to your workflow, e.g., booking.created, booking.cancelled, booking.updated');
console.log('5. Optionally set a secret and add it to your .env as CALCOM_WEBHOOK_SECRET');

// Note: This script is informational only — Cal.com webhooks are configured in their dashboard.

function generateSigningKey() {
  try {
    const crypto = require('crypto');
    return crypto.randomBytes(32).toString('hex');
  } catch (e) {
    return 'generate-a-secret-and-place-in-.env';
  }
}

console.log('\nSuggested webhook secret (store in .env as CALCOM_WEBHOOK_SECRET):');
console.log(generateSigningKey());
