

const N8N_SUBSCRIPTION_WEBHOOK_URL = import.meta.env.VITE_SUBSCRIPTION_WEBHOOK_PROD_URL;

async function callWebhook(url, payload) {
  if (!url) {
    console.warn('Webhook URL not configured');
    return;
  }
  try {
    await fetch(url, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(payload),
    });
  } catch (e) {
    console.error('Webhook error:', e);
  }
}

export const notifySubscriptionCreated = (subscription, client, language) =>
  callWebhook(N8N_SUBSCRIPTION_WEBHOOK_URL, {
    event:        'subscription_created',
    subscription,
    client,
    language: language || navigator.language || 'en-US',
  });

export const notifySubscriptionCancelled = (subscription, client, language) =>
  callWebhook(N8N_SUBSCRIPTION_WEBHOOK_URL, {
    event:        'subscription_cancelled',
    subscription,
    client,
    language: language || navigator.language || 'en-US',
  });