# Email Contact Form Setup Guide

This guide will help you set up the email contact form to send messages to Zeke's email address.

## Overview

The contact form uses **Resend** (a modern email API) to send emails. It's reliable, has a generous free tier (3,000 emails/month), and is easy to set up.

## Step 1: Sign Up for Resend

1. Go to [resend.com](https://resend.com)
2. Sign up for a free account
3. Verify your email address

## Step 2: Get Your API Key

1. After signing up, go to your [Resend Dashboard](https://resend.com/api-keys)
2. Click "Create API Key"
3. Give it a name like "ZekeUltra Contact Form"
4. Copy the API key (starts with `re_`)

## Step 3: Add Environment Variable

Create or update your `.env.local` file in the project root:

```env
# Resend Email API
RESEND_API_KEY=re_your_api_key_here
```

## Step 4: Configure Sender Domain (Optional but Recommended)

For production, you should verify your domain with Resend:

1. In your Resend dashboard, go to "Domains"
2. Add your domain (e.g., `yourdomain.com`)
3. Follow the DNS verification steps
4. Update the `from` email in `app/api/contact/route.js`:

```javascript
from: 'ZekeUltra Website <noreply@yourdomain.com>'
```

For development/testing, you can use Resend's sandbox domain:
```javascript
from: 'ZekeUltra Website <onboarding@resend.dev>'
```

## Step 5: Configure Zeke's Email in Prismic

1. Go to your Prismic dashboard
2. Navigate to "Site Settings" document
3. Add Zeke's email address to the "Contact Email" field
4. This is where all contact form submissions will be sent

## Step 6: Test the Contact Form

1. Start your development server: `npm run dev`
2. Navigate to `/contact`
3. Fill out and submit the form
4. Check Zeke's email for the message

## Features

✅ **Form Validation**: Validates required fields and email format
✅ **Success/Error Messages**: Shows clear feedback to users
✅ **Spam Protection**: Built-in validation and rate limiting
✅ **Reply-To**: Zeke can reply directly to the sender's email
✅ **Prismic Integration**: All text and settings managed through CMS
✅ **Responsive Design**: Works on all devices

## Email Template

The email includes:
- Sender's name and email
- Their message
- Professional formatting
- Reply-to functionality

## Troubleshooting

### Emails Not Sending
- Check your `RESEND_API_KEY` is correct
- Verify the API key has proper permissions
- Check the browser console for errors

### Domain Verification Issues
- Ensure DNS records are properly configured
- Wait up to 24 hours for DNS propagation
- Use the sandbox domain for testing

### Rate Limiting
- Free tier: 3,000 emails/month
- Upgrade plan if you need more

## Security Notes

- Never commit your `.env.local` file to version control
- The API key is only used server-side
- Form validation prevents spam and malicious input
- Email addresses are validated before sending

## Support

- [Resend Documentation](https://resend.com/docs)
- [Resend Support](https://resend.com/support)
- Check the browser console for detailed error messages 