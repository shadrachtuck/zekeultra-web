# Email Contact Form Setup Guide

This guide will help you set up the contact form to send messages via **Elastic Email**.

## Overview

The contact form posts to `/api/contact`, which sends a transactional email through the [Elastic Email REST API v4](https://elasticemail.com/developers/api-documentation/rest-api).

## Step 1: Elastic Email account

1. Sign up at [elasticemail.com](https://elasticemail.com)
2. Verify your email address
3. Add and verify your sending domain (required for production)

## Step 2: Create an API key

1. Open **Settings → API** in the Elastic Email dashboard
2. Create a key with **SendHttp** permission (transactional sending)
3. Copy the key immediately (shown only once)

## Step 3: Environment variables

Add these to `.env.local` (local) and Vercel project settings (production):

```env
ELASTIC_EMAIL_API_KEY=your_api_key_here
ELASTIC_EMAIL_FROM=ZekeUltra Website <noreply@yourdomain.com>
```

- `ELASTIC_EMAIL_FROM` must use an address on a domain you verified in Elastic Email
- The display name is optional; the angle-bracket format is standard

## Step 4: Recipient email in Prismic

Submissions are delivered to the address configured in Prismic:

1. **Contact** document → `contact_email`, or
2. **Site Settings** → `contact_email`

If neither is set, the API falls back to `zekecantmiss@gmail.com`.

## Step 5: Expose the form on the site

The contact form is available in two places:

1. **`/contact`** — dedicated page (linked from the header menu)
2. **Contact slice** — add a Contact slice to the homepage (or any page) in Prismic Slice Machine

Label copy for the slice comes from the slice fields in Prismic.

## Step 6: Test

1. `npm run dev`
2. Visit `/contact` or the homepage section with the Contact slice
3. Submit the form and confirm the message arrives at the Prismic recipient address

## Features

- Field validation and sanitization
- Rate limiting (5 submissions per IP per 15 minutes)
- Basic spam keyword filter
- Reply-To set to the visitor’s email
- Success/error messages from Prismic where configured

## Troubleshooting

### "Email service not configured"

- Set both `ELASTIC_EMAIL_API_KEY` and `ELASTIC_EMAIL_FROM` in your environment
- Restart the dev server after changing `.env.local`

### Elastic Email returns 4xx

- Confirm the API key has **SendHttp** access
- Confirm `ELASTIC_EMAIL_FROM` uses a verified domain
- Check server logs for the raw Elastic Email error body

### Form works locally but not on Vercel

- Add the same env vars in Vercel → Project → Settings → Environment Variables
- Redeploy after adding variables

## Security

- Never commit `.env.local` or API keys to git
- Keys are only used server-side in the API route
- Rate limiting and validation reduce abuse

## Support

- [Elastic Email API docs](https://elasticemail.com/developers/api-documentation/rest-api)
- [Elastic Email help center](https://help.elasticemail.com/)
