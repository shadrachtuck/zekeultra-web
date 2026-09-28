const ELASTIC_EMAIL_API_URL = 'https://api.elasticemail.com/v4/emails/transactional';
const ELASTIC_EMAIL_API_KEY_LENGTH = 96;

function validateApiKeyFormat(apiKey) {
  if (!apiKey) {
    throw new Error('ELASTIC_EMAIL_API_KEY is not configured');
  }

  if (apiKey.length !== ELASTIC_EMAIL_API_KEY_LENGTH) {
    throw new Error(
      `Invalid Elastic Email API key format: expected ${ELASTIC_EMAIL_API_KEY_LENGTH} characters, got ${apiKey.length}. Create a new key in Elastic Email → Settings → API, copy the full key when shown, and update ELASTIC_EMAIL_API_KEY.`
    );
  }
}

/**
 * Send a transactional email via Elastic Email REST API v4.
 * @see https://elasticemail.com/developers/api-documentation/rest-api
 */
export async function sendTransactionalEmail({ to, from, replyTo, subject, html }) {
  const apiKey = process.env.ELASTIC_EMAIL_API_KEY;
  validateApiKeyFormat(apiKey);

  const recipients = Array.isArray(to) ? to : [to];

  const response = await fetch(ELASTIC_EMAIL_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-ElasticEmail-ApiKey': apiKey,
    },
    body: JSON.stringify({
      Recipients: { To: recipients },
      Content: {
        Body: [{ ContentType: 'HTML', Content: html, Charset: 'utf-8' }],
        From: from,
        ReplyTo: replyTo,
        Subject: subject,
      },
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error('Elastic Email error:', response.status, errorBody);
    let parsedError = null;
    try {
      parsedError = JSON.parse(errorBody);
    } catch {
      parsedError = { raw: errorBody.slice(0, 200) };
    }
    const elasticMessage = parsedError?.Error || parsedError?.error || 'Failed to send email via Elastic Email';
    throw new Error(elasticMessage);
  }

  return response.json();
}
