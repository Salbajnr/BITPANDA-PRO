#!/bin/bash

echo "🔍 Verifying Production Build Configuration..."
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if required files exist
echo "📁 Checking Required Files..."
files=(
  "package.json"
  "server/index.ts"
  "client/package.json"
  "client/vite.config.js"
  "render.yaml"
  ".node-version"
)

all_files_exist=true
for file in "${files[@]}"; do
  if [ -f "$file" ]; then
    echo -e "  ${GREEN}✓${NC} $file"
  else
    echo -e "  ${RED}✗${NC} $file ${RED}MISSING${NC}"
    all_files_exist=false
  fi
done
echo ""

# Check package.json scripts
echo "📜 Checking Build Scripts..."
if grep -q '"build": "npm run build:client"' package.json; then
  echo -e "  ${GREEN}✓${NC} Build script configured"
else
  echo -e "  ${RED}✗${NC} Build script missing or incorrect"
fi

if grep -q '"start":' package.json; then
  echo -e "  ${GREEN}✓${NC} Start script configured"
else
  echo -e "  ${RED}✗${NC} Start script missing"
fi

if grep -q '"install:all":' package.json; then
  echo -e "  ${GREEN}✓${NC} Install:all script configured"
else
  echo -e "  ${RED}✗${NC} Install:all script missing"
fi
echo ""

# Check dependencies
echo "📦 Checking Critical Dependencies..."
critical_deps=("tsx" "firebase-admin" "express" "drizzle-orm" "pg")
for dep in "${critical_deps[@]}"; do
  if grep -q "\"$dep\":" package.json; then
    echo -e "  ${GREEN}✓${NC} $dep"
  else
    echo -e "  ${RED}✗${NC} $dep ${RED}MISSING${NC}"
  fi
done
echo ""

# Check client dependencies
echo "📦 Checking Client Dependencies..."
if [ -f "client/package.json" ]; then
  if grep -q '"vite":' client/package.json; then
    echo -e "  ${GREEN}✓${NC} Vite (build tool)"
  else
    echo -e "  ${RED}✗${NC} Vite missing"
  fi
  
  if grep -q '"react":' client/package.json; then
    echo -e "  ${GREEN}✓${NC} React"
  else
    echo -e "  ${RED}✗${NC} React missing"
  fi
else
  echo -e "  ${RED}✗${NC} client/package.json not found"
fi
echo ""

# Check Render configuration
echo "🚀 Checking Render Configuration..."
if [ -f "render.yaml" ]; then
  echo -e "  ${GREEN}✓${NC} render.yaml exists"
  
  if grep -q "buildCommand:" render.yaml; then
    echo -e "  ${GREEN}✓${NC} Build command configured"
  else
    echo -e "  ${YELLOW}⚠${NC} Build command not found in render.yaml"
  fi
  
  if grep -q "startCommand:" render.yaml; then
    echo -e "  ${GREEN}✓${NC} Start command configured"
  else
    echo -e "  ${YELLOW}⚠${NC} Start command not found in render.yaml"
  fi
else
  echo -e "  ${RED}✗${NC} render.yaml missing"
fi
echo ""

# Check Node version specification
echo "🔧 Checking Node Version..."
if [ -f ".node-version" ]; then
  version=$(cat .node-version)
  echo -e "  ${GREEN}✓${NC} Node version specified: $version"
else
  echo -e "  ${YELLOW}⚠${NC} .node-version file missing (Render will use default)"
fi
echo ""

# Check environment variable documentation
echo "📝 Checking Documentation..."
if [ -f "docs/ENVIRONMENT_SETUP.md" ]; then
  echo -e "  ${GREEN}✓${NC} Environment setup guide"
else
  echo -e "  ${YELLOW}⚠${NC} Environment setup guide missing"
fi

if [ -f "docs/RENDER_DEPLOYMENT.md" ]; then
  echo -e "  ${GREEN}✓${NC} Render deployment guide"
else
  echo -e "  ${YELLOW}⚠${NC} Render deployment guide missing"
fi
echo ""

# Check for common issues
echo "🔍 Checking for Common Issues..."

# Check if tsx is in dependencies (not devDependencies)
if grep -A 50 '"dependencies":' package.json | grep -q '"tsx":'; then
  echo -e "  ${GREEN}✓${NC} tsx in dependencies (correct)"
else
  echo -e "  ${RED}✗${NC} tsx should be in dependencies, not devDependencies"
fi

# Check if firebase-admin is present
if grep -q '"firebase-admin":' package.json; then
  echo -e "  ${GREEN}✓${NC} firebase-admin present"
else
  echo -e "  ${YELLOW}⚠${NC} firebase-admin not found (optional)"
fi

# Check for proper start command
if grep -q 'node.*tsx.*server/index.ts' package.json; then
  echo -e "  ${GREEN}✓${NC} Start command uses tsx runtime"
else
  echo -e "  ${YELLOW}⚠${NC} Start command may need adjustment"
fi
echo ""

# Summary
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
if [ "$all_files_exist" = true ]; then
  echo -e "${GREEN}✅ Build Configuration: READY${NC}"
  echo ""
  echo "Next steps:"
  echo "1. Ensure environment variables are set"
  echo "2. Deploy to Render using render.yaml"
  echo "3. Monitor build logs for any errors"
  echo ""
  echo "See docs/DEPLOYMENT_STATUS.md for deployment guide"
else
  echo -e "${RED}❌ Build Configuration: ISSUES FOUND${NC}"
  echo ""
  echo "Please fix the missing files/configurations above"
fi
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
