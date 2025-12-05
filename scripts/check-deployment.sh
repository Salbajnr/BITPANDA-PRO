#!/bin/bash

echo "🔍 Checking Deployment Readiness..."
echo ""

# Check Node version
echo "✓ Node Version:"
node --version
echo ""

# Check npm version
echo "✓ NPM Version:"
npm --version
echo ""

# Check if required files exist
echo "✓ Checking Required Files:"
files=("package.json" "server/index.ts" "client/package.json" "render.yaml")
for file in "${files[@]}"; do
  if [ -f "$file" ]; then
    echo "  ✅ $file exists"
  else
    echo "  ❌ $file missing"
  fi
done
echo ""

# Check if tsx is in dependencies
echo "✓ Checking Dependencies:"
if grep -q '"tsx"' package.json; then
  echo "  ✅ tsx found in dependencies"
else
  echo "  ❌ tsx not found in dependencies"
fi

if grep -q '"firebase-admin"' package.json; then
  echo "  ✅ firebase-admin found in dependencies"
else
  echo "  ❌ firebase-admin not found in dependencies"
fi
echo ""

# Check environment variables
echo "✓ Checking Environment Variables:"
required_vars=("DATABASE_URL" "COOKIE_SECRET" "SESSION_SECRET" "JWT_SECRET")
for var in "${required_vars[@]}"; do
  if [ -z "${!var}" ]; then
    echo "  ⚠️  $var not set"
  else
    echo "  ✅ $var is set"
  fi
done
echo ""

# Test build command
echo "✓ Testing Build Command:"
echo "  Running: npm run build:client"
if npm run build:client; then
  echo "  ✅ Build successful"
else
  echo "  ❌ Build failed"
fi
echo ""

echo "✅ Deployment check complete!"
