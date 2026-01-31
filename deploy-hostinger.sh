#!/bin/bash

###############################################################################
# Emfudweni High School - Hostinger VPS Full-Stack Deployment
# Deploys BOTH frontend (React build) and backend (Node.js API)
###############################################################################

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# ═══════════════════════════════════════════════════════
# CONFIGURATION - EDIT THESE VALUES BEFORE FIRST DEPLOY
# ═══════════════════════════════════════════════════════
VPS_HOST="your-vps-ip"               # e.g., 154.41.252.100
VPS_USER="root"                       # your SSH user
VPS_PORT="22"                         # SSH port
DOMAIN="yourdomain.co.za"            # your domain name

# Paths on VPS
FRONTEND_DIR="/var/www/emfudweni/frontend"
BACKEND_DIR="/var/www/emfudweni/backend"

echo -e "${BLUE}╔════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  Emfudweni High School - Hostinger VPS Deployment     ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════╝${NC}"
echo ""

# Check configuration
if [ "$VPS_HOST" = "your-vps-ip" ]; then
    echo -e "${RED}ERROR: Edit deploy-hostinger.sh first!${NC}"
    echo -e "${RED}Set VPS_HOST, VPS_USER, and DOMAIN at the top of the file.${NC}"
    exit 1
fi

# Helper function
run_remote() {
    ssh -p "$VPS_PORT" "$VPS_USER@$VPS_HOST" "$1"
}

# ─── Step 1: Test SSH connection ───
echo -e "${YELLOW}[1/7] Testing SSH connection...${NC}"
if run_remote "echo 'Connected'"; then
    echo -e "${GREEN}  ✓ SSH connection OK${NC}"
else
    echo -e "${RED}  ✗ SSH failed. Check your VPS_HOST and SSH keys.${NC}"
    exit 1
fi

# ─── Step 2: Build frontend locally ───
echo -e "${YELLOW}[2/7] Building frontend...${NC}"
cd "$(dirname "$0")/frontend" || exit 1
REACT_APP_API_URL="https://$DOMAIN/api" npm run build
if [ $? -ne 0 ]; then
    echo -e "${RED}  ✗ Frontend build failed${NC}"
    exit 1
fi
echo -e "${GREEN}  ✓ Frontend built successfully${NC}"
cd ..

# ─── Step 3: Create directories on VPS ───
echo -e "${YELLOW}[3/7] Setting up directories on VPS...${NC}"
run_remote "mkdir -p $FRONTEND_DIR $BACKEND_DIR/logs"
echo -e "${GREEN}  ✓ Directories ready${NC}"

# ─── Step 4: Upload frontend build ───
echo -e "${YELLOW}[4/7] Uploading frontend...${NC}"
rsync -avz --delete -e "ssh -p $VPS_PORT" \
    ./frontend/build/ "$VPS_USER@$VPS_HOST:$FRONTEND_DIR/"
echo -e "${GREEN}  ✓ Frontend uploaded to $FRONTEND_DIR${NC}"

# ─── Step 5: Upload backend ───
echo -e "${YELLOW}[5/7] Uploading backend...${NC}"
rsync -avz -e "ssh -p $VPS_PORT" \
    --exclude 'node_modules' \
    --exclude '.env' \
    --exclude 'logs' \
    --exclude '*.db' \
    --exclude 'coverage' \
    --exclude '__tests__' \
    ./backend/ "$VPS_USER@$VPS_HOST:$BACKEND_DIR/"
echo -e "${GREEN}  ✓ Backend uploaded to $BACKEND_DIR${NC}"

# ─── Step 6: Install dependencies & restart backend ───
echo -e "${YELLOW}[6/7] Installing dependencies & starting backend...${NC}"
run_remote "cd $BACKEND_DIR && npm install --production"
run_remote "cd $BACKEND_DIR && pm2 delete emfudweni-backend 2>/dev/null; pm2 start ecosystem.config.js"
run_remote "pm2 save"
echo -e "${GREEN}  ✓ Backend running with PM2${NC}"

# ─── Step 7: Setup Nginx (first deploy only) ───
echo -e "${YELLOW}[7/7] Checking Nginx...${NC}"
NGINX_EXISTS=$(run_remote "test -f /etc/nginx/sites-available/emfudweni && echo 'yes' || echo 'no'")
if [ "$NGINX_EXISTS" = "no" ]; then
    echo -e "${YELLOW}  Setting up Nginx for first time...${NC}"
    # Upload and configure nginx
    scp -P "$VPS_PORT" ./backend/nginx.conf "$VPS_USER@$VPS_HOST:/etc/nginx/sites-available/emfudweni"
    run_remote "sed -i 's/yourdomain.co.za/$DOMAIN/g' /etc/nginx/sites-available/emfudweni"
    run_remote "ln -sf /etc/nginx/sites-available/emfudweni /etc/nginx/sites-enabled/"
    run_remote "rm -f /etc/nginx/sites-enabled/default"
    run_remote "nginx -t && systemctl reload nginx"
    echo -e "${GREEN}  ✓ Nginx configured for $DOMAIN${NC}"
else
    run_remote "nginx -t && systemctl reload nginx"
    echo -e "${GREEN}  ✓ Nginx already configured, reloaded${NC}"
fi

# ─── Done ───
echo ""
echo -e "${GREEN}╔════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║            Deployment Complete!                       ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "  Website:  ${BLUE}http://$DOMAIN${NC}"
echo -e "  API:      ${BLUE}http://$DOMAIN/api/health${NC}"
echo ""
echo -e "  ${YELLOW}Remaining steps (first deploy only):${NC}"
echo -e "  1. Create .env on VPS:  ${GREEN}ssh $VPS_USER@$VPS_HOST 'nano $BACKEND_DIR/.env'${NC}"
echo -e "  2. Setup admin user:    ${GREEN}ssh $VPS_USER@$VPS_HOST 'cd $BACKEND_DIR && node reset-admin.js'${NC}"
echo -e "  3. Restart backend:     ${GREEN}ssh $VPS_USER@$VPS_HOST 'pm2 restart emfudweni-backend'${NC}"
echo -e "  4. Add SSL:             ${GREEN}ssh $VPS_USER@$VPS_HOST 'certbot --nginx -d $DOMAIN -d www.$DOMAIN'${NC}"
echo ""
