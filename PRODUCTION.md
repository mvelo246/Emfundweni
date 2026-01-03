# Production Deployment Guide

## Pre-Deployment Checklist

### 1. Environment Variables

Create a `.env` file in the `backend` directory with the following:

```env
# REQUIRED: Strong JWT secret (generate with: openssl rand -base64 32)
JWT_SECRET=your-strong-random-secret-key-here

# REQUIRED: Set to production
NODE_ENV=production

# Optional: Server port (defaults to 3001)
PORT=3001

# Optional: Frontend URL for CORS (if different from default)
FRONTEND_URL=https://yourdomain.com

# Optional: Database path (defaults to ./school.db)
# DB_PATH=./school.db
```

### 2. Security Requirements

- ✅ **JWT_SECRET**: Must be set in production (application will exit if not set)
- ✅ **Change Default Admin Password**: Login and change the default `admin`/`admin123` password immediately
- ✅ **HTTPS**: Use HTTPS in production (configure reverse proxy with SSL)
- ✅ **CORS**: Update `FRONTEND_URL` in `.env` to match your frontend domain
- ✅ **Database Backup**: Regularly backup `backend/school.db` file

### 3. Build Frontend

```bash
cd frontend
npm install
npm run build
```

The built files will be in `frontend/build/` directory.

### 4. Backend Setup

```bash
cd backend
npm install --production
npm start
```

### 5. Reverse Proxy Setup (Recommended)

Use Nginx or Apache as a reverse proxy:

#### Nginx Example:

```nginx
server {
    listen 80;
    server_name yourdomain.com;
    
    # Redirect to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com;
    
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    
    # Frontend
    location / {
        root /path/to/frontend/build;
        try_files $uri $uri/ /index.html;
    }
    
    # Backend API
    location /api {
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

### 6. Process Manager (PM2)

Install and use PM2 to keep the backend running:

```bash
npm install -g pm2
cd backend
pm2 start server.js --name emfundweni-backend
pm2 save
pm2 startup
```

### 7. Database Migration

If upgrading from an existing database, the application will automatically:
- Add new columns if they don't exist
- Migrate existing data with default values
- Preserve all existing data

### 8. Monitoring

- Monitor server logs: `pm2 logs emfundweni-backend`
- Monitor server status: `pm2 status`
- Set up log rotation for production logs
- Monitor database file size and backup regularly

### 9. Backup Strategy

**Database Backup:**
```bash
# Backup database
cp backend/school.db backend/backups/school-$(date +%Y%m%d-%H%M%S).db

# Restore database
cp backend/backups/school-YYYYMMDD-HHMMSS.db backend/school.db
```

**Automated Backup Script:**
```bash
#!/bin/bash
BACKUP_DIR="backend/backups"
mkdir -p $BACKUP_DIR
cp backend/school.db "$BACKUP_DIR/school-$(date +%Y%m%d-%H%M%S).db"
# Keep only last 30 days of backups
find $BACKUP_DIR -name "school-*.db" -mtime +30 -delete
```

### 10. Performance Optimization

- Enable gzip compression in reverse proxy
- Use CDN for static assets
- Enable browser caching for static files
- Monitor database performance
- Consider database connection pooling for high traffic

### 11. Security Headers

The application includes security headers:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Strict-Transport-Security` (HTTPS only in production)

### 12. Error Handling

- All errors are logged to console (use proper logging service in production)
- Database errors return generic messages (no sensitive data exposed)
- Input validation prevents SQL injection and XSS attacks

## Post-Deployment

1. **Test Admin Login**: Verify you can login with admin credentials
2. **Change Admin Password**: Immediately change the default password
3. **Test All Features**: Verify CRUD operations work correctly
4. **Monitor Logs**: Check for any errors in the first 24 hours
5. **Set Up Backups**: Configure automated database backups
6. **Monitor Performance**: Watch server resources and response times

## Troubleshooting

### Application won't start
- Check if `JWT_SECRET` is set in `.env`
- Verify database file permissions
- Check if port 3001 is available

### Database errors
- Verify database file exists and is readable/writable
- Check file permissions: `chmod 644 backend/school.db`
- Restore from backup if corrupted

### CORS errors
- Update `FRONTEND_URL` in `.env` to match your frontend domain
- Verify reverse proxy configuration

### Authentication fails
- Verify `JWT_SECRET` matches between restarts
- Clear browser localStorage and login again
- Check token expiration (default: 24 hours)

