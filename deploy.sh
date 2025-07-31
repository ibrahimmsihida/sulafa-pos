#!/bin/bash

echo "🚀 Starting deployment process..."

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the project
echo "🔨 Building the project..."
npm run build

# Check if build directory exists
if [ -d "build" ]; then
    echo "✅ Project built successfully!"
else
    echo "❌ Project build failed!"
    exit 1
fi

echo "🎉 Project ready for deployment!"
echo "📋 Next steps:"
echo "1. Create account on Vercel.com"
echo "2. Connect GitHub repository"
echo "3. Add environment variables"
echo "4. Deploy"