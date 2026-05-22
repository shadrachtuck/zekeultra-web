#!/bin/bash

echo "🚀 Setting up Vercel deployment for ZekeUltra..."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
else
    echo "✅ Vercel CLI already installed"
fi

# Check if user is logged in
if ! vercel whoami &> /dev/null; then
    echo "🔐 Please log in to Vercel..."
    vercel login
else
    echo "✅ Already logged in to Vercel"
fi

# Check if project is linked
if [ ! -f ".vercel/project.json" ]; then
    echo "🔗 Linking project to Vercel..."
    vercel link
else
    echo "✅ Project already linked to Vercel"
fi

echo ""
echo "📋 Next steps:"
echo "1. Set up environment variables in Vercel dashboard:"
echo "   - NEXT_PUBLIC_PRISMIC_ENDPOINT"
echo "   - NEXT_PUBLIC_PRISMIC_ACCESS_TOKEN"
echo "   - STRIPE_SECRET_KEY"
echo "   - ELASTIC_EMAIL_API_KEY"
echo "   - ELASTIC_EMAIL_FROM"
echo ""
echo "2. Deploy commands:"
echo "   - Development/Preview: npm run deploy:preview"
echo "   - Production: npm run deploy:prod"
echo ""
echo "3. Check DEPLOYMENT.md for detailed instructions"
echo ""
echo "🎉 Setup complete! Ready to deploy." 