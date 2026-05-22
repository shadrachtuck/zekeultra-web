import { NextResponse } from 'next/server';
import { createClient } from '../../../lib/prismic';
import { sendTransactionalEmail } from '../../../lib/elasticEmail';

// Simple in-memory rate limiting (in production, use Redis or similar)
const rateLimitMap = new Map();

// Rate limiting: max 5 requests per IP per 15 minutes
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes

function isRateLimited(ip) {
  const now = Date.now();
  const userRequests = rateLimitMap.get(ip) || [];

  const recentRequests = userRequests.filter(time => now - time < RATE_LIMIT_WINDOW);

  if (recentRequests.length >= RATE_LIMIT_MAX) {
    return true;
  }

  recentRequests.push(now);
  rateLimitMap.set(ip, recentRequests);

  return false;
}

function sanitizeInput(input) {
  if (typeof input !== 'string') return '';
  return input.trim().replace(/[<>]/g, '');
}

function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
}

function validateText(text, maxLength = 1000) {
  return text && text.length > 0 && text.length <= maxLength;
}

export async function POST(request) {
  try {
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0] : 'unknown';

    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    const { name, email, subject, message } = await request.json();

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    const sanitizedName = sanitizeInput(name);
    const sanitizedEmail = sanitizeInput(email);
    const sanitizedSubject = sanitizeInput(subject);
    const sanitizedMessage = sanitizeInput(message);

    if (!validateText(sanitizedName, 100)) {
      return NextResponse.json(
        { error: 'Name must be between 1 and 100 characters' },
        { status: 400 }
      );
    }

    if (!validateEmail(sanitizedEmail)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      );
    }

    if (!validateText(sanitizedSubject, 200)) {
      return NextResponse.json(
        { error: 'Subject must be between 1 and 200 characters' },
        { status: 400 }
      );
    }

    if (!validateText(sanitizedMessage, 2000)) {
      return NextResponse.json(
        { error: 'Message must be between 1 and 2000 characters' },
        { status: 400 }
      );
    }

    const spamKeywords = ['viagra', 'casino', 'loan', 'credit', 'debt', 'free money'];
    const messageLower = sanitizedMessage.toLowerCase();
    const subjectLower = sanitizedSubject.toLowerCase();

    const hasSpamKeywords = spamKeywords.some(keyword =>
      messageLower.includes(keyword) || subjectLower.includes(keyword)
    );

    if (hasSpamKeywords) {
      return NextResponse.json(
        { error: 'Message contains prohibited content' },
        { status: 400 }
      );
    }

    const apiKey = process.env.ELASTIC_EMAIL_API_KEY;
    const fromAddress = process.env.ELASTIC_EMAIL_FROM;

    if (!apiKey || !fromAddress) {
      // #region agent log
      fetch('http://127.0.0.1:7280/ingest/0d8b1a1c-cdf4-44b3-a95d-63b33884d273',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'dc5bc0'},body:JSON.stringify({sessionId:'dc5bc0',location:'contact/route.js:missingEnv',message:'Elastic Email env vars missing',data:{hasApiKey:!!apiKey,hasFromAddress:!!fromAddress},timestamp:Date.now(),hypothesisId:'H2',runId:'pre-fix'})}).catch(()=>{});
      // #endregion
      console.error('Elastic Email not configured (ELASTIC_EMAIL_API_KEY or ELASTIC_EMAIL_FROM missing)');
      return NextResponse.json(
        { error: 'Email service not configured. Please contact the administrator.' },
        { status: 500 }
      );
    }

    const client = createClient();
    const contactSettings = await client.getSingle('contact');
    const siteSettings = await client.getSingle('site_settings');

    const recipientEmail = contactSettings?.data?.contact_email ||
      siteSettings?.data?.contact_email ||
      'zekecantmiss@gmail.com';

    // #region agent log
    fetch('http://127.0.0.1:7280/ingest/0d8b1a1c-cdf4-44b3-a95d-63b33884d273',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'dc5bc0'},body:JSON.stringify({sessionId:'dc5bc0',location:'contact/route.js:preSend',message:'Contact route ready to send',data:{hasApiKey:!!apiKey,apiKeyLength:apiKey?.length??0,fromHasAngleBrackets:fromAddress?.includes('<')??false,fromDomain:fromAddress?.match(/@([^>]+)/)?.[1]??fromAddress?.split('@')[1]??null,recipientSource:contactSettings?.data?.contact_email?'contact':siteSettings?.data?.contact_email?'site_settings':'fallback',recipientDomain:recipientEmail?.split('@')[1]??null},timestamp:Date.now(),hypothesisId:'H1-H2-H3-H5',runId:'pre-fix'})}).catch(()=>{});
    // #endregion

    const emailContent = `
      <h2>New Contact Form Submission</h2>
      <p><strong>From:</strong> ${sanitizedName}</p>
      <p><strong>Email:</strong> ${sanitizedEmail}</p>
      <p><strong>Subject:</strong> ${sanitizedSubject}</p>
      <p><strong>Message:</strong></p>
      <p>${sanitizedMessage.replace(/\n/g, '<br>')}</p>
      <hr>
      <p><em>This message was sent from the ZekeUltra website contact form.</em></p>
      <p><small>IP: ${ip} | Time: ${new Date().toISOString()}</small></p>
    `;

    await sendTransactionalEmail({
      to: recipientEmail,
      from: fromAddress,
      replyTo: sanitizedEmail,
      subject: `Contact Form: ${sanitizedSubject}`,
      html: emailContent,
    });

    return NextResponse.json({
      success: true,
      message: contactSettings?.data?.success_message || 'Message sent successfully!'
    });

  } catch (error) {
    console.error('Contact form error:', error);
    // #region agent log
    fetch('http://127.0.0.1:7280/ingest/0d8b1a1c-cdf4-44b3-a95d-63b33884d273',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'dc5bc0'},body:JSON.stringify({sessionId:'dc5bc0',location:'contact/route.js:catch',message:'Contact route caught error',data:{errorName:error?.name??null,errorMessage:error?.message??String(error)},timestamp:Date.now(),hypothesisId:'H5',runId:'pre-fix'})}).catch(()=>{});
    // #endregion

    const elasticError = error?.message;
    if (elasticError === 'APIKey Expired') {
      return NextResponse.json(
        { error: 'Elastic Email rejected the API key as expired. In Elastic Email → Settings → API, create a new key (96 characters), leave expiration blank, enable SendHttp, and update ELASTIC_EMAIL_API_KEY.' },
        { status: 500 }
      );
    }

    if (elasticError?.includes('From email address') && elasticError?.includes('not allowed')) {
      return NextResponse.json(
        { error: 'The From address is not verified in Elastic Email. Have Zeke verify his email under Settings → Domains → Verify email, then set ELASTIC_EMAIL_FROM to that exact address.' },
        { status: 500 }
      );
    }

    if (elasticError?.startsWith('Invalid Elastic Email API key format')) {
      return NextResponse.json({ error: elasticError }, { status: 500 });
    }

    if (elasticError && elasticError !== 'Failed to send email via Elastic Email') {
      return NextResponse.json(
        { error: `Email delivery failed: ${elasticError}` },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error. Please try again later.' },
      { status: 500 }
    );
  }
}
