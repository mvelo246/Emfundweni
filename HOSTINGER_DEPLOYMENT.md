# Emfudweni High School - Hostinger Business Hosting Deployment

## How It Works

Your app deploys as a **single Node.js application** on Hostinger Business hosting:
- The backend (Express API) handles `/api/*` requests
- The same server serves the React frontend for all other routes
- MySQL database is created through hPanel
- Hostinger manages the server — no SSH, Nginx, or PM2 needed

```
Your Hostinger App
├── server.js          ← Express backend (entry point)
├── public/            ← React build (served automatically)
│   ├── index.html
│   └── static/
├── routes/
├── middleware/
├── database.js
├── .env
└── package.json
```

---

## Step 1: Claim Your Free Domain

1. Go to **Hostinger hPanel** → **Domains**
2. Claim your free domain (included with Business plan)
3. Or connect an existing domain by updating nameservers

---

## Step 2: Create MySQL Database

1. Go to **hPanel** → **Databases** → **MySQL Databases**
2. Create a new database:
   - Database name: `emfudweni_school`
   - Database user: `emfudweni_user`
   - Password: (choose a strong password — **save it!**)
3. Note the **database host** — it's usually something like `mysql.hostinger.com` or shown on the database page (NOT `localhost` on shared hosting)

---

## Step 3: Build the Project Locally

On your computer, open terminal in the project folder and run:

```bash
npm run build:deploy
```

This builds the React frontend and copies it into `backend/public/` so the backend can serve it.

---

## Step 4: Deploy via hPanel

### Option A: GitHub (Recommended — Auto-redeploy)

1. Push your code to GitHub
2. Go to **hPanel** → **Website** → **Advanced** → **Node.js**
3. Click **Create App** or **Add Application**
4. Click **Authorize** to connect your GitHub account
5. Select your repository and branch (`main`)
6. Set these settings:
   - **Root directory**: `backend`
   - **Build command**: `npm install --production`
   - **Start command**: `node server.js`
   - **Node.js version**: 20.x
7. Click **Deploy**

### Option B: File Upload (Manual)

1. Create a zip of the `backend/` folder (make sure `public/` is inside it from Step 3):
   ```bash
   cd backend
   zip -r ../emfudweni-deploy.zip . -x "node_modules/*" ".env" "logs/*" "__tests__/*" "coverage/*"
   ```
2. Go to **hPanel** → **Website** → **Advanced** → **Node.js**
3. Click **Create App** → **Upload**
4. Upload `emfudweni-deploy.zip`
5. Set:
   - **Start command**: `node server.js`
   - **Node.js version**: 20.x
6. Click **Deploy**

---

## Step 5: Set Environment Variables

In **hPanel** → your Node.js app → **Environment Variables** (or Settings):

| Variable | Value |
|----------|-------|
| `NODE_ENV` | `production` |
| `PORT` | `3001` (or whatever Hostinger assigns) |
| `HOST` | `0.0.0.0` |
| `JWT_SECRET` | (generate: run `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"` on your computer) |
| `DATABASE_URL` | `mysql://emfudweni_user:YOUR_PASSWORD@DATABASE_HOST:3306/emfudweni_school` |
| `FRONTEND_URL` | `https://yourdomain.co.za` |

**Important:** The `DATABASE_HOST` is NOT `localhost` on shared hosting. Find it in **hPanel** → **Databases** → **MySQL Databases** (it looks like `mysqlXX.hostinger.com` or an IP address).

---

## Step 6: Create Admin User

You'll need to run the admin setup script. In hPanel:

1. Go to **hPanel** → **Advanced** → **SSH Access** (if available on Business plan)
2. SSH in and run:
   ```bash
   cd ~/path-to-your-app/backend
   node reset-admin.js
   ```

If SSH is not available, you can temporarily add this to server.js before deploying, then remove it after:
```javascript
// Add temporarily after database init, then REMOVE after first use
app.get('/setup-admin', async (req, res) => {
  const bcrypt = require('bcrypt');
  const db = require('./database').getDatabase();
  const hash = await bcrypt.hash('admin123', 10);
  db.query('INSERT INTO admin_users (username, password_hash) VALUES (?, ?) ON DUPLICATE KEY UPDATE password_hash = ?',
    ['admin', hash, hash],
    (err) => {
      if (err) return res.json({ error: err.message });
      res.json({ message: 'Admin created. Username: admin, Password: admin123. CHANGE THIS NOW and remove this route!' });
    });
});
```

---

## Step 7: Verify

Visit these URLs:
- **Website**: `https://yourdomain.co.za`
- **API health**: `https://yourdomain.co.za/api/health`
- **Admin login**: Navigate to admin section and log in

---

## Re-deploying After Code Changes

### If using GitHub:
Just push to `main` — Hostinger auto-redeploys.

```bash
npm run build:deploy
git add .
git commit -m "update"
git push
```

### If using file upload:
1. Run `npm run build:deploy`
2. Zip the backend folder again
3. Upload through hPanel

---

## Troubleshooting

**"Cannot connect to database"**
- Check DATABASE_URL in environment variables
- Make sure the database host is correct (not `localhost`)
- Verify username/password match what you created in hPanel

**"502 Bad Gateway"**
- Check Node.js app logs in hPanel
- Make sure PORT matches what Hostinger expects

**"API works but website shows blank page"**
- Make sure you ran `npm run build:deploy` before deploying
- Check that `backend/public/index.html` exists

**"CORS error"**
- Update FRONTEND_URL env variable to match your actual domain
