# Emfudweni High School - Hostinger VPS Deployment Guide

## Project Structure on VPS

```
/var/www/emfudweni/
├── frontend/          ← React build (served by Nginx)
│   ├── index.html
│   ├── static/
│   └── ...
└── backend/           ← Node.js API (managed by PM2)
    ├── server.js
    ├── database.js
    ├── routes/
    ├── middleware/
    ├── ecosystem.config.js
    ├── .env           ← you create this manually
    └── logs/
```

**How it works:**
- **Nginx** serves the React frontend directly from `/var/www/emfudweni/frontend/`
- **Nginx** proxies `/api/*` requests to the Node.js backend on port 3001
- **PM2** keeps the Node.js backend running and restarts it if it crashes
- **MySQL** stores all data (school info, students, admin users)

---

## Step 1: Buy & Access Hostinger VPS

1. Go to [Hostinger VPS](https://www.hostinger.com/vps-hosting) and buy a plan (KVM 1 is enough)
2. Choose **Ubuntu 22.04** as the OS
3. Set a root password
4. Note your VPS IP address from the Hostinger dashboard

Test SSH access from your local machine:
```bash
ssh root@YOUR_VPS_IP
```

---

## Step 2: Setup VPS Software

SSH into your VPS and run these commands:

```bash
# Update system
apt update && apt upgrade -y

# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# Install PM2 (process manager)
npm install -g pm2

# Install Nginx
apt install -y nginx

# Install MySQL
apt install -y mysql-server

# Install Certbot for SSL
apt install -y certbot python3-certbot-nginx
```

Verify installations:
```bash
node --version    # Should show v20.x
pm2 --version     # Should show 5.x
nginx -v          # Should show nginx/1.x
mysql --version   # Should show mysql 8.x
```

---

## Step 3: Setup MySQL Database

```bash
# Secure MySQL installation
mysql_secure_installation
# Answer: Yes to all prompts, set a root password

# Login to MySQL
mysql -u root -p

# Run these SQL commands:
CREATE DATABASE emfudweni_school;
CREATE USER 'emfudweni_user'@'localhost' IDENTIFIED BY 'YOUR_STRONG_PASSWORD';
GRANT ALL PRIVILEGES ON emfudweni_school.* TO 'emfudweni_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

Replace `YOUR_STRONG_PASSWORD` with a strong password. Save it — you'll need it for the `.env` file.

---

## Step 4: Point Domain to VPS

In your domain registrar (Hostinger, GoDaddy, etc.):

| Type | Name | Value |
|------|------|-------|
| A | @ | YOUR_VPS_IP |
| A | www | YOUR_VPS_IP |

Wait for DNS to propagate (can be instant or up to 24 hours).

---

## Step 5: Configure Deploy Script

On your **local machine**, edit `deploy-hostinger.sh`:

```bash
VPS_HOST="154.41.252.100"         # Your VPS IP
VPS_USER="root"                    # Your SSH user
VPS_PORT="22"                      # SSH port
DOMAIN="emfudweni.co.za"          # Your domain
```

---

## Step 6: Deploy

From your **local machine** (project root):

```bash
./deploy-hostinger.sh
```

This script will:
1. Build the React frontend locally
2. Upload frontend build to `/var/www/emfudweni/frontend/`
3. Upload backend code to `/var/www/emfudweni/backend/`
4. Install Node.js dependencies on VPS
5. Start backend with PM2
6. Configure Nginx (first deploy only)

---

## Step 7: Create .env File on VPS

SSH into VPS and create the environment file:

```bash
ssh root@YOUR_VPS_IP
nano /var/www/emfudweni/backend/.env
```

Paste these values:
```
NODE_ENV=production
JWT_SECRET=paste-a-64-char-random-string-here
DATABASE_URL=mysql://emfudweni_user:YOUR_STRONG_PASSWORD@localhost:3306/emfudweni_school
FRONTEND_URL=https://yourdomain.co.za
PORT=3001
HOST=0.0.0.0
```

Generate a JWT secret:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Save the file (Ctrl+O, Enter, Ctrl+X), then restart:
```bash
pm2 restart emfudweni-backend
```

---

## Step 8: Create Admin User

```bash
cd /var/www/emfudweni/backend
node reset-admin.js
```

This creates the admin login. Note the username and password it outputs.

---

## Step 9: Add SSL Certificate (HTTPS)

```bash
certbot --nginx -d yourdomain.co.za -d www.yourdomain.co.za
```

Follow the prompts. Certbot will automatically configure Nginx for HTTPS and set up auto-renewal.

---

## Step 10: Verify Everything Works

Test these URLs:
- **Website**: `https://yourdomain.co.za`
- **API health**: `https://yourdomain.co.za/api/health`
- **Admin login**: `https://yourdomain.co.za` → click Admin/Login

---

## Useful Commands

```bash
# Check backend status
pm2 status

# View backend logs
pm2 logs emfudweni-backend

# Restart backend
pm2 restart emfudweni-backend

# Check Nginx status
systemctl status nginx

# Test Nginx config
nginx -t

# Reload Nginx
systemctl reload nginx

# View Nginx error logs
tail -f /var/log/nginx/emfudweni-error.log
```

## Re-deploying After Code Changes

Just run from your local machine:
```bash
./deploy-hostinger.sh
```

The script handles everything — rebuilds frontend, uploads files, restarts backend.
