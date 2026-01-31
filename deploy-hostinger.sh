#!/bin/bash

###############################################################################
# Emfudweni High School - Hostinger VPS Deployment Script
# This script deploys the backend to a Hostinger VPS server
###############################################################################

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration - EDIT THESE VALUES
VPS_HOST="your-vps-ip-or-domain"  # e.g., 123.45.67.89 or vps.yourdomain.com
VPS_USER="root"                    # or your VPS username
VPS_PORT="22"                      # SSH port (usually 22)
APP_DIR="/home/$VPS_USER/emfudweni-high-school"
BACKEND_DIR="$APP_DIR/backend"

echo -e "${GREEN}╔════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║   Emfudweni High School - Hostinger VPS Deployment    ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════════════════╝${NC}"
echo ""

# Check if configuration is set
if [ "$VPS_HOST" = "your-vps-ip-or-domain" ]; then
    echo -e "${RED}ERROR: Please edit this script and set your VPS_HOST, VPS_USER${NC}"
    echo -e "${RED}Open deploy-hostinger.sh and update the configuration section${NC}"
    exit 1
fi

# Function to run commands on VPS
run_remote() {
    ssh -p $VPS_PORT $VPS_USER@$VPS_HOST "$1"
}

# Step 1: Test connection
echo -e "${YELLOW}→ Testing SSH connection to VPS...${NC}"
if run_remote "echo 'Connected successfully'"; then
    echo -e "${GREEN}✓ SSH connection successful${NC}"
else
    echo -e "${RED}✗ SSH connection failed. Check your VPS_HOST, VPS_USER, and SSH keys${NC}"
    exit 1
fi

# Step 2: Create app directory
echo -e "${YELLOW}→ Creating application directory...${NC}"
run_remote "mkdir -p $APP_DIR"
echo -e "${GREEN}✓ Directory created: $APP_DIR${NC}"

# Step 3: Upload backend files
echo -e "${YELLOW}→ Uploading backend files to VPS...${NC}"
rsync -avz -e "ssh -p $VPS_PORT" \
    --exclude 'node_modules' \
    --exclude '.env' \
    --exclude 'logs' \
    --exclude '*.db' \
    ./backend/ $VPS_USER@$VPS_HOST:$BACKEND_DIR/
echo -e "${GREEN}✓ Backend files uploaded${NC}"

# Step 4: Install dependencies
echo -e "${YELLOW}→ Installing Node.js dependencies on VPS...${NC}"
run_remote "cd $BACKEND_DIR && npm install --production"
echo -e "${GREEN}✓ Dependencies installed${NC}"

# Step 5: Setup PM2
echo -e "${YELLOW}→ Setting up PM2 process manager...${NC}"
run_remote "cd $BACKEND_DIR && pm2 delete emfudweni-backend 2>/dev/null || true"
run_remote "cd $BACKEND_DIR && pm2 start ecosystem.config.js"
run_remote "pm2 save"
run_remote "pm2 startup | grep 'sudo' | bash"
echo -e "${GREEN}✓ PM2 configured and application started${NC}"

# Step 6: Setup logs directory
echo -e "${YELLOW}→ Creating logs directory...${NC}"
run_remote "mkdir -p $BACKEND_DIR/logs"
echo -e "${GREEN}✓ Logs directory created${NC}"

# Step 7: Reminder about environment variables
echo ""
echo -e "${YELLOW}╔════════════════════════════════════════════════════════╗${NC}"
echo -e "${YELLOW}║             IMPORTANT: Environment Variables           ║${NC}"
echo -e "${YELLOW}╚════════════════════════════════════════════════════════╝${NC}"
echo -e "${YELLOW}You need to set up environment variables on your VPS:${NC}"
echo ""
echo -e "1. SSH into your VPS:"
echo -e "   ${GREEN}ssh -p $VPS_PORT $VPS_USER@$VPS_HOST${NC}"
echo ""
echo -e "2. Create .env file:"
echo -e "   ${GREEN}cd $BACKEND_DIR${NC}"
echo -e "   ${GREEN}nano .env${NC}"
echo ""
echo -e "3. Add these variables (use values from backend/.env.example):"
echo -e "   NODE_ENV=production"
echo -e "   JWT_SECRET=your-secret-key"
echo -e "   DATABASE_URL=mysql://user:password@localhost:3306/emfudweni_school"
echo -e "   FRONTEND_URL=https://your-frontend-domain.web.app"
echo -e "   PORT=3001"
echo ""
echo -e "4. Restart the application:"
echo -e "   ${GREEN}pm2 restart emfudweni-backend${NC}"
echo ""
echo -e "${YELLOW}╔════════════════════════════════════════════════════════╗${NC}"
echo -e "${YELLOW}║                  Deployment Complete!                  ║${NC}"
echo -e "${YELLOW}╚════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "Application is running on: ${GREEN}http://$VPS_HOST:3001${NC}"
echo -e "Check status: ${GREEN}pm2 status${NC}"
echo -e "View logs: ${GREEN}pm2 logs emfudweni-backend${NC}"
echo ""
