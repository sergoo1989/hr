# Railway Deployment Guide

## Deploy Backend to Railway

### 1. Go to Railway
Visit: https://railway.app

### 2. Login with GitHub

### 3. Create New Project
- Click "New Project"
- Select "Deploy from GitHub repo"
- Choose: **sergoo1989/hr**

### 4. Configure Settings

#### Root Directory:
```
apps/api
```

#### Build Command:
```
npm install && npm run build
```

#### Start Command:
```
npm run start:prod
```

### 5. Environment Variables
Add these in Railway Variables tab:

```
NODE_ENV=production
PORT=3000
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
JWT_SECRET=your-super-secret-jwt-key-change-this
```

### 6. Deploy
Click "Deploy" and wait 2-3 minutes

### 7. Get Your URL
After deployment, copy the URL:
```
https://your-app-production.up.railway.app
```

---

## Next: Update Frontend

After getting Railway URL, update frontend files to use the new API URL.
