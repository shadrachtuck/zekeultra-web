import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { createClient } from '../../../lib/prismic';

// Simple in-memory rate limiting (in production, use Redis or similar)
const rateLimitMap = new Map();

// Rate limiting: max 5 requests per IP per 15 minutes
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes

function isRateLimited(ip) {
  const now = Date.now();
  const userRequests = rateLimitMap.get(ip) || [];
  
  // Remove old requests outside the window
  const recentRequests = userRequests.filter(time => now - time < RATE_LIMIT_WINDOW);
  
  if (recentRequests.length >= RATE_LIMIT_MAX) {
    return true;
  }
  
  // Add current request
  recentRequests.push(now);
  rateLimitMap.set(ip, recentRequests);
  
  return false;
}

function sanitizeInput(input) {
  if (typeof input !== 'string') return '';
  return input.trim().replace(/[<>]/g, ''); // Remove potential HTML tags
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
    // Get client IP for rate limiting
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0] : 'unknown';
    
    // Check rate limiting
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    const { name, email, subject, message } = await request.json();

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Sanitize and validate inputs
    const sanitizedName = sanitizeInput(name);
    const sanitizedEmail = sanitizeInput(email);
    const sanitizedSubject = sanitizeInput(subject);
    const sanitizedMessage = sanitizeInput(message);

    // Validate field lengths and content
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

    // Basic spam detection
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

    // Get settings from Prismic
    const client = createClient();
    const contactSettings = await client.getSingle('contact');
    const siteSettings = await client.getSingle('site_settings');
    
    // Get Resend API key from Prismic settings
    const resendApiKey = siteSettings?.data?.resend_api_key;
    
    if (!resendApiKey) {
      console.error('Resend API key not found in site settings');
      return NextResponse.json(
        { error: 'Email service not configured. Please contact the administrator.' },
        { status: 500 }
      );
    }

    // Initialize Resend with API key from Prismic
    const resend = new Resend(resendApiKey);
    
    // Get recipient email from Prismic settings
    const recipientEmail = contactSettings?.data?.contact_email || 
                          siteSettings?.data?.contact_email || 
                          'zekecantmiss@gmail.com';

    // Create email content with sanitized data
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

    // Send email using Resend
    const { data, error } = await resend.emails.send({
      from: 'ZekeUltra Website <onboarding@resend.dev>',
      to: [recipientEmail],
      subject: `Contact Form: ${sanitizedSubject}`,
      html: emailContent,
      replyTo: sanitizedEmail,
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json(
        { error: 'Failed to send email. Please try again later.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: contactSettings?.data?.success_message || 'Message sent successfully!'
    });

  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Internal server error. Please try again later.' },
      { status: 500 }
    );
  }
} 