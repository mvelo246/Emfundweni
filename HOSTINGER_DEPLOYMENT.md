# Hostinger VPS Deployment Guide - Emfudweni High School

Complete guide to deploying your school website backend on Hostinger VPS with MySQL.

---

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [VPS Initial Setup](#vps-initial-setup)
3. [MySQL Database Setup](#mysql-database-setup)
4. [Backend Deployment](#backend-deployment)
5. [Nginx Configuration](#nginx-configuration)
6. [SSL Certificate Setup](#ssl-certificate-setup)
7. [Monitoring & Maintenance](#monitoring--maintenance)
8. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### What You Need
- **Hostinger VPS** (any plan - KVM 1, KVM 2, etc.)
- **Domain name** (optional but recommended)
- **SSH client** (Terminal on Mac/Linux, PuTTY on Windows)
- **Your backend code** (this repository)

### Services Overview
- **Backend**: Node.js (running on port 3001)
- **Database**: MySQL (provided by Hostinger)
- **Reverse Proxy**: Nginx (forwards requests to Node.js)
- **Process Manager**: PM2 (keeps Node.js running)
- **Frontend**: Firebase Hosting (separate deployment)

---

## VPS Initial Setup

### 1. Access Your VPS

#### Option A: Hostinger hPanel
1. Login to [Hostinger hPanel](https://hpanel.hostinger.com)
2. Go to **VPS** section
3. Click **Manage** on your VPS
4. Note your **IP address** and **root password**

#### Option B: SSH Access
```bash
# Connect via SSH (use your VPS IP)
ssh root@your-vps-ip

# You'll be prompted for password (from hPanel)
```

### 2. Update System Packages

```bash
# Update package lists
apt update && apt upgrade -y

# Install essential tools
apt install -y curl git build-essential
```

### 3. Install Node.js (v18 LTS)

```bash
# Install Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs

# Verify installation
node --version  # Should show v18.x.x
npm --version   # Should show 9.x.x or higher
```

### 4. Install PM2 (Process Manager)

```bash
# Install PM2 globally
npm install -g pm2

# Verify installation
pm2 --version
```

### 5. Install Nginx (Web Server)

```bash
# Install Nginx
apt install -y nginx

# Start Nginx
systemctl start nginx
systemctl enable nginx

# Check status
systemctl status nginx
```

### 6. Configure Firewall

```bash
# Allow SSH, HTTP, and HTTPS
ufw allow 22/tcp      # SSH
ufw allow 80/tcp      # HTTP
ufw allow 443/tcp     # HTTPS
ufw allow 3306/tcp    # MySQL (only if accessing remotely)

# Enable firewall
ufw --force enable

# Check status
ufw status
```

---

## MySQL Database Setup

### Option 1: Using Hostinger MySQL (Recommended)

#### Access MySQL via hPanel
1. Login to [Hostinger hPanel](https://hpanel.hostinger.com)
2. Go to **Databases** → **MySQL Databases**
3. Click **Create Database**
   - Database name: `emfudweni_school`
   - Username: `emfudweni_user`
   - Password: (generate strong password)
4. Click **Create**
5. Note down:
   - Database name: `emfudweni_school`
   - Username: `emfudweni_user`
   - Password: (your generated password)
   - Host: `localhost` (if on same VPS) or `mysql.yourdomain.com`

#### Create DATABASE_URL
```
DATABASE_URL=mysql://emfudweni_user:your-password@localhost:3306/emfudweni_school
```

### Option 2: Install MySQL on VPS

```bash
# Install MySQL Server
apt install -y mysql-server

# Secure MySQL installation
mysql_secure_installation
# Answer prompts:
# - Set root password: YES (create strong password)
# - Remove anonymous users: YES
# - Disallow root login remotely: YES
# - Remove test database: YES
# - Reload privilege tables: YES

# Login to MySQL
mysql -u root -p

# Create database and user
CREATE DATABASE emfudweni_school CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'emfudweni_user'@'localhost' IDENTIFIED BY 'your-strong-password';
GRANT ALL PRIVILEGES ON emfudweni_school.* TO 'emfudweni_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

---

## Backend Deployment

### Method 1: Automated Deployment (Recommended)

#### Step 1: Configure Deployment Script
On your **local machine**:

```bash
# Edit the deployment script
nano deploy-hostinger.sh

# Update these values:
VPS_HOST="123.45.67.89"  # Your VPS IP or domain
VPS_USER="root"           # Your SSH username
VPS_PORT="22"             # SSH port

# Save and exit (Ctrl+X, then Y, then Enter)
```

#### Step 2: Set Up SSH Key (Optional but Recommended)

```bash
# On your local machine, generate SSH key if you don't have one
ssh-keygen -t rsa -b 4096

# Copy public key to VPS
ssh-copy-id -p 22 root@your-vps-ip

# Test passwordless login
ssh root@your-vps-ip
```

#### Step 3: Run Deployment Script

```bash
# From your local machine, in the project root
./deploy-hostinger.sh
```

The script will:
- ✓ Test SSH connection
- ✓ Create application directory
- ✓ Upload backend files
- ✓ Install dependencies
- ✓ Configure PM2
- ✓ Start the application

### Method 2: Manual Deployment

#### Step 1: Clone Repository on VPS

```bash
# SSH into VPS
ssh root@your-vps-ip

# Create app directory
mkdir -p /home/root/emfudweni-high-school
cd /home/root/emfudweni-high-school

# Clone from GitHub (if using Git)
git clone https://github.com/yourusername/emfudweni-high-school.git .

# OR upload files via SFTP/SCP from local machine:
# scp -r ./backend root@your-vps-ip:/home/root/emfudweni-high-school/
```

#### Step 2: Install Dependencies

```bash
# Navigate to backend directory
cd /home/root/emfudweni-high-school/backend

# Install production dependencies
npm install --production
```

#### Step 3: Create Environment File

```bash
# Create .env file
nano .env

# Add the following (replace with your actual values):
NODE_ENV=production
JWT_SECRET=your-very-long-and-secure-secret-key-at-least-32-characters
DATABASE_URL=mysql://emfudweni_user:your-password@localhost:3306/emfudweni_school
FRONTEND_URL=https://your-frontend-domain.web.app
PORT=3001
HOST=0.0.0.0

# Save and exit (Ctrl+X, then Y, then Enter)
```

#### Step 4: Update PM2 Configuration

```bash
# Edit ecosystem.config.js
nano ecosystem.config.js

# Update the 'cwd' path to match your actual path:
cwd: '/home/root/emfudweni-high-school/backend',

# Save and exit
```

#### Step 5: Start Application with PM2

```bash
# Create logs directory
mkdir -p logs

# Start application
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Setup PM2 to start on system reboot
pm2 startup
# Copy and run the command that PM2 outputs

# Check application status
pm2 status

# View logs
pm2 logs emfudweni-backend
```

---

## Nginx Configuration

### Step 1: Create Nginx Config File

```bash
# SSH into VPS
ssh root@your-vps-ip

# Create Nginx configuration
nano /etc/nginx/sites-available/emfudweni-backend
```

### Step 2: Add Configuration

**For IP-based access (temporary):**

```nginx
server {
    listen 80;
    server_name your-vps-ip;  # e.g., 123.45.67.89

    client_max_body_size 10M;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

**For domain-based access (production):**

```nginx
server {
    listen 80;
    server_name api.emfudweni.co.za;  # Replace with your actual domain

    client_max_body_size 10M;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    location /api/health {
        proxy_pass http://localhost:3001/api/health;
        access_log off;
    }
}
```

### Step 3: Enable Configuration

```bash
# Create symbolic link to enable site
ln -s /etc/nginx/sites-available/emfudweni-backend /etc/nginx/sites-enabled/

# Remove default Nginx page (optional)
rm /etc/nginx/sites-enabled/default

# Test Nginx configuration
nginx -t

# If test passes, reload Nginx
systemctl reload nginx
```

### Step 4: Test Backend Access

```bash
# From VPS or local machine
curl http://your-vps-ip/api/health

# Expected response:
# {"status":"ok","message":"Server is running","environment":"production"}
```

---

## SSL Certificate Setup

### Using Let's Encrypt (Free SSL)

#### Step 1: Install Certbot

```bash
# Install Certbot
apt install -y certbot python3-certbot-nginx
```

#### Step 2: Obtain SSL Certificate

**Important**: Before running this, ensure:
- Your domain DNS points to your VPS IP
- Port 80 is accessible (firewall allows it)

```bash
# Obtain and install certificate
certbot --nginx -d api.emfudweni.co.za

# Follow prompts:
# - Enter email address
# - Agree to terms
# - Choose to redirect HTTP to HTTPS (recommended: YES)
```

#### Step 3: Auto-Renewal Setup

```bash
# Test renewal
certbot renew --dry-run

# Certbot automatically sets up a cron job for renewal
# Certificates will auto-renew before expiration
```

#### Step 4: Verify HTTPS

```bash
# Test HTTPS access
curl https://api.emfudweni.co.za/api/health
```

---

## Monitoring & Maintenance

### Check Application Status

```bash
# PM2 status
pm2 status

# View logs
pm2 logs emfudweni-backend

# View last 100 lines
pm2 logs emfudweni-backend --lines 100

# Monitor resources
pm2 monit
```

### Restart Application

```bash
# Restart application
pm2 restart emfudweni-backend

# Reload with zero downtime
pm2 reload emfudweni-backend
```

### Check Nginx Status

```bash
# Nginx status
systemctl status nginx

# Test configuration
nginx -t

# Reload configuration
systemctl reload nginx

# View access logs
tail -f /var/log/nginx/access.log

# View error logs
tail -f /var/log/nginx/error.log
```

### Check MySQL Status

```bash
# MySQL status
systemctl status mysql

# Login to MySQL
mysql -u root -p

# Check databases
SHOW DATABASES;

# Check tables
USE emfudweni_school;
SHOW TABLES;
```

### Database Backup

```bash
# Create backup directory
mkdir -p /home/root/backups

# Backup database
mysqldump -u emfudweni_user -p emfudweni_school > /home/root/backups/emfudweni_$(date +%Y%m%d_%H%M%S).sql

# Restore from backup
mysql -u emfudweni_user -p emfudweni_school < /home/root/backups/emfudweni_20240127_120000.sql
```

### Automated Backups (Cron Job)

```bash
# Edit crontab
crontab -e

# Add daily backup at 2 AM
0 2 * * * mysqldump -u emfudweni_user -pyour-password emfudweni_school > /home/root/backups/emfudweni_$(date +\%Y\%m\%d).sql

# Keep only last 7 days of backups
0 3 * * * find /home/root/backups -name "emfudweni_*.sql" -mtime +7 -delete
```

---

## Troubleshooting

### Application Won't Start

**Check PM2 logs:**
```bash
pm2 logs emfudweni-backend --lines 50
```

**Common issues:**
1. **Port 3001 already in use**
   ```bash
   # Find process using port
   lsof -i :3001

   # Kill process
   kill -9 <PID>
   ```

2. **Missing environment variables**
   ```bash
   # Check .env file exists
   ls -la /home/root/emfudweni-high-school/backend/.env

   # Verify contents
   cat /home/root/emfudweni-high-school/backend/.env
   ```

3. **Database connection failed**
   ```bash
   # Test MySQL connection
   mysql -u emfudweni_user -p emfudweni_school

   # Check MySQL is running
   systemctl status mysql
   ```

### Nginx 502 Bad Gateway

**Causes:**
- Node.js app is not running
- Wrong port in proxy_pass

**Solutions:**
```bash
# Check if Node.js is running
pm2 status

# Check Nginx error logs
tail -f /var/log/nginx/error.log

# Restart PM2 app
pm2 restart emfudweni-backend

# Restart Nginx
systemctl restart nginx
```

### Can't Access Website

**Check firewall:**
```bash
# Check UFW status
ufw status

# Allow port 80 and 443
ufw allow 80/tcp
ufw allow 443/tcp
```

**Check Nginx:**
```bash
# Test Nginx config
nginx -t

# Reload if needed
systemctl reload nginx
```

**Check DNS (if using domain):**
```bash
# Check if domain resolves to VPS IP
nslookup api.emfudweni.co.za

# Or use dig
dig api.emfudweni.co.za
```

### Database Connection Issues

**Error: "Access denied for user"**
```bash
# Reset MySQL user password
mysql -u root -p
ALTER USER 'emfudweni_user'@'localhost' IDENTIFIED BY 'new-password';
FLUSH PRIVILEGES;
EXIT;

# Update .env with new password
nano /home/root/emfudweni-high-school/backend/.env

# Restart app
pm2 restart emfudweni-backend
```

**Error: "Can't connect to MySQL server"**
```bash
# Check MySQL is running
systemctl status mysql

# Start MySQL if not running
systemctl start mysql

# Check DATABASE_URL format in .env
# Should be: mysql://user:password@localhost:3306/database
```

---

## Update/Redeploy Application

### Quick Update

```bash
# On local machine, run deployment script again
./deploy-hostinger.sh

# This will:
# - Upload new files
# - Install new dependencies
# - Restart application
```

### Manual Update

```bash
# SSH into VPS
ssh root@your-vps-ip

# Navigate to backend
cd /home/root/emfudweni-high-school/backend

# Pull latest code (if using Git)
git pull origin main

# Install dependencies
npm install --production

# Restart application
pm2 restart emfudweni-backend
```

---

## Performance Optimization

### Enable Nginx Caching

```nginx
# Add to Nginx config
proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=api_cache:10m max_size=100m inactive=60m;

location / {
    proxy_cache api_cache;
    proxy_cache_valid 200 5m;
    # ... rest of proxy settings
}
```

### PM2 Cluster Mode (for multiple CPU cores)

```javascript
// Update ecosystem.config.js
module.exports = {
  apps: [{
    name: 'emfudweni-backend',
    script: './server.js',
    instances: 2,  // Or 'max' to use all CPU cores
    exec_mode: 'cluster',
    // ... rest of config
  }]
};
```

### Monitor Resource Usage

```bash
# Install htop for better monitoring
apt install htop

# View resource usage
htop

# Check disk usage
df -h

# Check memory usage
free -h
```

---

## Security Best Practices

1. **Change default SSH port** (optional but recommended)
2. **Disable root SSH login** (create sudo user instead)
3. **Use SSH keys** instead of passwords
4. **Keep system updated**: `apt update && apt upgrade`
5. **Use strong passwords** for MySQL and admin accounts
6. **Enable fail2ban** to prevent brute force attacks
7. **Regular backups** of database and application
8. **Monitor logs** for suspicious activity

---

## Support & Resources

- **Hostinger Support**: https://www.hostinger.com/tutorials/vps
- **PM2 Documentation**: https://pm2.keymetrics.io/docs/
- **Nginx Documentation**: https://nginx.org/en/docs/
- **Let's Encrypt**: https://letsencrypt.org/getting-started/

---

## Quick Reference Commands

```bash
# Application Management
pm2 status                          # Check app status
pm2 restart emfudweni-backend      # Restart app
pm2 logs emfudweni-backend         # View logs
pm2 monit                          # Monitor resources

# Nginx Management
systemctl status nginx             # Check Nginx status
nginx -t                           # Test config
systemctl reload nginx             # Reload config

# MySQL Management
systemctl status mysql             # Check MySQL status
mysql -u emfudweni_user -p        # Login to MySQL

# System Management
ufw status                         # Check firewall
systemctl status                   # Check all services
htop                              # Monitor resources
df -h                             # Check disk space
```

---

**Deployment completed!** Your Emfudweni High School backend is now running on Hostinger VPS with MySQL. 🎉
