# Emfundweni High School Website

A complete website for Emfundweni High School with an admin dashboard for managing content.

## Features

- **Public Website**: Hero section, Mission, About, Top 10 Grade 12 Students, and Contact sections
- **Admin Dashboard**: Secure login and CRUD operations for managing school information and top students
- **Powder Blue Color Scheme**: Professional design with powder blue theme
- **Responsive Design**: Works on all devices

## Tech Stack

- **Frontend**: React with TypeScript, Tailwind CSS
- **Backend**: Node.js with Express
- **Database**: SQLite
- **Authentication**: JWT-based authentication

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Start the server:
```bash
npm start
```

The backend server will run on `http://localhost:3001`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The frontend will run on `http://localhost:3000`

## Default Admin Credentials

- **Username**: `admin`
- **Password**: `emfu23579&`

**Important**: Change the default password after first login in production!

## API Endpoints

### Public Endpoints
- `GET /api/school-info` - Get school information
- `GET /api/top-students` - Get all top students
- `GET /api/top-students/year/:year` - Get top students for a specific year

### Protected Endpoints (Require Authentication)
- `PUT /api/school-info` - Update school information
- `POST /api/top-students` - Add new student
- `PUT /api/top-students/:id` - Update student
- `DELETE /api/top-students/:id` - Delete student
- `POST /api/auth/login` - Admin login
- `POST /api/auth/verify` - Verify JWT token

## Database Schema

### school_info
- id (INTEGER PRIMARY KEY)
- mission (TEXT)
- about (TEXT)
- contact_email (TEXT)
- contact_phone (TEXT)
- contact_address (TEXT)

### top_students
- id (INTEGER PRIMARY KEY)
- name (TEXT)
- year (INTEGER)
- position (INTEGER) - 1-10

### admin_users
- id (INTEGER PRIMARY KEY)
- username (TEXT UNIQUE)
- password_hash (TEXT)

## Color Scheme

- **Primary Color**: #B0E0E6 (powder blue)
- **Primary Dark**: #87CEEB (sky blue)
- **Primary Light**: #E0F7FA (light cyan)
- **Secondary Color**: #4682B4 (steel blue)
- **Accent Color**: #00CED1 (dark turquoise)

## Project Structure

```
emfudweni-high-school/
├── backend/
│   ├── server.js
│   ├── database.js
│   ├── routes/
│   │   ├── schoolInfo.js
│   │   ├── topStudents.js
│   │   └── auth.js
│   ├── middleware/
│   │   └── auth.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── App.tsx
│   │   ├── components/
│   │   │   ├── Hero.tsx
│   │   │   ├── Mission.tsx
│   │   │   ├── About.tsx
│   │   │   ├── TopStudents.tsx
│   │   │   └── Contact.tsx
│   │   ├── admin/
│   │   │   ├── Login.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   ├── EditSchoolInfo.tsx
│   │   │   └── ManageStudents.tsx
│   │   └── api.ts
│   ├── package.json
│   └── tailwind.config.js
└── README.md
```

## Development

- Backend runs on port 3001
- Frontend runs on port 3000
- Database file is created automatically at `backend/school.db`

## Production Deployment

See [PRODUCTION.md](./PRODUCTION.md) for detailed production deployment instructions.

**Quick Start:**
1. Set `JWT_SECRET` environment variable in `backend/.env` (REQUIRED)
2. Set `NODE_ENV=production` in `backend/.env`
3. Change default admin password after first login
4. Build frontend: `cd frontend && npm run build`
5. Use a reverse proxy (Nginx/Apache) with HTTPS
6. Set up process manager (PM2) for backend
7. Configure automated database backups

