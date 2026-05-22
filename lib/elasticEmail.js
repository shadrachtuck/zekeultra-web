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

  // #region agent log
  fetch('http://127.0.0.1:7280/ingest/0d8b1a1c-cdf4-44b3-a95d-63b33884d273',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'dc5bc0'},body:JSON.stringify({sessionId:'dc5bc0',location:'elasticEmail.js:preSend',message:'Preparing Elastic Email request',data:{hasApiKey:!!apiKey,apiKeyLength:apiKey?.length??0,expectedKeyLength:ELASTIC_EMAIL_API_KEY_LENGTH,keyLengthValid:apiKey?.length===ELASTIC_EMAIL_API_KEY_LENGTH,recipientCount:recipients.length,toDomain:recipients[0]?.split('@')[1]??null,fromHasAngleBrackets:from?.includes('<')??false,fromDomain:from?.match(/@([^>]+)/)?.[1]??from?.split('@')[1]??null,subjectLength:subject?.length??0,replyToDomain:replyTo?.split('@')[1]??null},timestamp:Date.now(),hypothesisId:'H6-H10',runId:'post-fix'})}).catch(()=>{});
  // #endregion

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
    try { parsedError = JSON.parse(errorBody); } catch { parsedError = { raw: errorBody.slice(0, 200) }; }
    // #region agent log
    fetch('http://127.0.0.1:7280/ingest/0d8b1a1c-cdf4-44b3-a95d-63b33884d273',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'dc5bc0'},body:JSON.stringify({sessionId:'dc5bc0',location:'elasticEmail.js:apiError',message:'Elastic Email API rejected request',data:{status:response.status,parsedError,apiKeyPrefix:apiKey?.slice(0,4)??null,apiKeySuffix:apiKey?.slice(-4)??null},timestamp:Date.now(),hypothesisId:'H1-H3-H4',runId:'pre-fix'})}).catch(()=>{});
    // #endregion
    const elasticMessage = parsedError?.Error || parsedError?.error || 'Failed to send email via Elastic Email';
    throw new Error(elasticMessage);
  }

  const result = await response.json();
  // #region agent log
  fetch('http://127.0.0.1:7280/ingest/0d8b1a1c-cdf4-44b3-a95d-63b33884d273',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'dc5bc0'},body:JSON.stringify({sessionId:'dc5bc0',location:'elasticEmail.js:success',message:'Elastic Email send succeeded',data:{hasTransactionId:!!result?.TransactionID,hasMessageId:!!result?.MessageID},timestamp:Date.now(),hypothesisId:'H1-H4',runId:'pre-fix'})}).catch(()=>{});
  // #endregion
  return result;
}
