# HR Management System API

Backend API built with NestJS for HR Management System.

## 🚀 Quick Start (Local Development)

```bash
# Install dependencies
npm install

# Run in development mode
npm run start:dev

# Build for production
npm run build

# Run in production mode
npm run start:prod
```

The API will run on `http://localhost:3000`

## 📦 Production Deployment (Railway)

### Step 1: Configure Railway Settings

```
Root Directory: apps/api
Build Command: npm install && npm run build
Start Command: npm run start:prod
```

### Step 2: Set Environment Variables

Required variables in Railway:
```bash
NODE_ENV=production
PORT=3000
JWT_SECRET=your-super-secret-jwt-key-min-32-characters
JWT_EXPIRES_IN=7d
```

Optional (for email features):
```bash
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=noreply@yourcompany.com
```

### Step 3: Deploy

Railway will automatically build and deploy when you push to GitHub.

## 🔑 Default Users

After deployment, these users will be available:

**Admin:**
- Username: `admin`
- Password: `admin123`

**Employee:**
- Username: `employee1`
- Password: `emp123`

## 📚 API Endpoints

### Authentication
- `POST /auth/login` - Login
- `POST /auth/register` - Register new user

### Dashboard
- `GET /dashboard/stats` - Get dashboard statistics

### Employees
- `GET /employees` - List all employees
- `GET /employees/:id` - Get employee by ID
- `POST /employees` - Create new employee
- `PUT /employees/:id` - Update employee
- `DELETE /employees/:id` - Delete employee

### Payroll
- `GET /payroll` - Get payroll data
- `POST /payroll/calculate` - Calculate payroll

### Admin
- `GET /admin/leaves/pending` - Get pending leave requests
- `PUT /admin/leaves/:id/approve` - Approve leave
- `PUT /admin/leaves/:id/reject` - Reject leave

See [API_DOCUMENTATION.md](../../API_DOCUMENTATION.md) for complete API documentation.

## 🛠️ Tech Stack

- **Framework:** NestJS
- **Language:** TypeScript
- **Authentication:** JWT
- **Email:** Nodemailer
- **Database:** In-Memory (JSON-based)

## 📝 Notes

- The app uses an in-memory database that persists to `data/hr-database.json`
- CORS is enabled for all origins in development
- In production, set `CORS_ORIGIN` environment variable

## 🔗 Related

- [Frontend](../../frontend/) - Frontend application
- [Deployment Guide](../../DEPLOYMENT_GUIDE.md) - Full deployment instructions
