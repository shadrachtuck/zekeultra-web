# Vercel Deployment Guide

This guide will help you deploy your ZekeUltra website to Vercel with both development and production environments.

## Prerequisites

1. **Vercel CLI installed globally:**
   ```bash
   npm install -g vercel
   ```

2. **Vercel account** - Sign up at [vercel.com](https://vercel.com)

3. **Git repository** - Your project should be connected to a Git repository

## Initial Setup

### 1. Login to Vercel
```bash
vercel login
```

### 2. Link your project (if not already linked)
```bash
vercel link
```

## Environment Variables Setup

### 1. Set up environment variables in Vercel dashboard:

Navigate to your Vercel project dashboard and go to **Settings > Environment Variables**

Add the following variables:

#### Production Environment:
- `NEXT_PUBLIC_PRISMIC_ENDPOINT` - Your Prismic endpoint URL
- `NEXT_PUBLIC_PRISMIC_ACCESS_TOKEN` - Your Prismic access token
- `STRIPE_SECRET_KEY` - Your Stripe secret key
- `ELASTIC_EMAIL_API_KEY` - Your Elastic Email API key (SendHttp permission)
- `ELASTIC_EMAIL_FROM` - Verified sender, e.g. `ZekeUltra Website <noreply@yourdomain.com>`

#### Preview Environment (Development):
- Same variables as production

### 2. Or set via CLI:
```bash
# Production
vercel env add NEXT_PUBLIC_PRISMIC_ENDPOINT production
vercel env add NEXT_PUBLIC_PRISMIC_ACCESS_TOKEN production
vercel env add STRIPE_SECRET_KEY production
vercel env add ELASTIC_EMAIL_API_KEY production
vercel env add ELASTIC_EMAIL_FROM production

# Preview (Development)
vercel env add NEXT_PUBLIC_PRISMIC_ENDPOINT preview
vercel env add NEXT_PUBLIC_PRISMIC_ACCESS_TOKEN preview
vercel env add STRIPE_SECRET_KEY preview
vercel env add ELASTIC_EMAIL_API_KEY preview
vercel env add ELASTIC_EMAIL_FROM preview
```

## Deployment Commands

### Development/Preview Deployment
```bash
npm run deploy:preview
# or
vercel
```
This creates a preview deployment for testing changes.

### Production Deployment
```bash
npm run deploy:prod
# or
vercel --prod
```
This deploys to your production domain.

### Development Environment Deployment
```bash
npm run deploy:dev
# or
vercel --env dev
```

## Git Integration

### Automatic Deployments

1. **Production**: Push to `main` branch triggers automatic production deployment
2. **Preview**: Push to any other branch creates a preview deployment
3. **Pull Requests**: Automatically create preview deployments for review

### Branch Strategy

- `main` → Production deployment
- `develop` → Development deployment
- `feature/*` → Preview deployments

## Environment Configuration

### Production
- Domain: Your custom domain or `your-project.vercel.app`
- Environment: Production
- All environment variables loaded

### Development/Preview
- Domain: `your-project-git-branch.vercel.app`
- Environment: Preview
- Same environment variables as production

## Monitoring & Analytics

### Vercel Analytics
- Built-in performance monitoring
- Real-time analytics
- Error tracking

### Logs
```bash
# View deployment logs
vercel logs

# View function logs
vercel logs --function=api/contact/route
```

## Troubleshooting

### Common Issues

1. **Build Failures**
   - Check build logs in Vercel dashboard
   - Verify all environment variables are set
   - Ensure dependencies are properly installed

2. **Environment Variables Not Loading**
   - Verify variables are set for correct environment
   - Check variable names match exactly
   - Redeploy after adding new variables

3. **API Routes Not Working**
   - Check function timeout settings
   - Verify API routes are in correct location
   - Check CORS settings if needed

### Debug Commands
```bash
# Check project status
vercel ls

# View project info
vercel inspect

# Remove project link
vercel remove
```

## Performance Optimization

### Vercel Edge Functions
- API routes automatically optimized
- Global CDN distribution
- Automatic scaling

### Next.js Optimizations
- Automatic code splitting
- Image optimization
- Static generation where possible

## Security

### Environment Variables
- Never commit sensitive keys to Git
- Use Vercel's encrypted environment variables
- Rotate keys regularly

### Domain Security
- Enable HTTPS (automatic with Vercel)
- Set up custom domains with proper DNS
- Configure security headers if needed

## Support

- **Vercel Documentation**: [vercel.com/docs](https://vercel.com/docs)
- **Vercel Support**: [vercel.com/support](https://vercel.com/support)
- **Next.js Documentation**: [nextjs.org/docs](https://nextjs.org/docs) 