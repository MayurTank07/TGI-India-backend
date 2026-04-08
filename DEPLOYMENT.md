# TGI Backend - Deployment Guide

Complete guide for deploying the TGI backend to Render.

## 📋 Pre-Deployment Checklist

### 1. MongoDB Atlas Setup

1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster (Free tier works for development)
3. Create database user:
   - Username: `tgi-admin`
   - Password: Generate strong password
4. Network Access:
   - Add IP: `0.0.0.0/0` (Allow from anywhere - required for Render)
5. Get connection string:
   - Click "Connect" → "Connect your application"
   - Copy connection string
   - Replace `<password>` with your database password
   - Example: `mongodb+srv://tgi-admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/tgi-recruitment`

### 2. Cloudinary Setup

1. Create account at [Cloudinary](https://cloudinary.com/)
2. Go to Dashboard
3. Copy credentials:
   - Cloud Name
   - API Key
   - API Secret

### 3. GitHub Repository

```bash
# Initialize git in backend folder
cd TGI-main-backend
git init
git add .
git commit -m "Initial backend setup"

# Create GitHub repo and push
git remote add origin https://github.com/YOUR_USERNAME/tgi-backend.git
git branch -M main
git push -u origin main
```

## 🚀 Deploy to Render

### Step 1: Create Web Service

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure:
   - **Name**: `tgi-backend` (or your preferred name)
   - **Region**: Choose closest to your users
   - **Branch**: `main`
   - **Root Directory**: Leave empty (or specify if backend is in subfolder)
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: 
     - Free (for testing)
     - Starter or higher (for production)

### Step 2: Add Environment Variables

Click **"Advanced"** → **"Add Environment Variable"**

Add the following variables:

```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://tgi-admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/tgi-recruitment
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters-long
JWT_EXPIRE=7d
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
FRONTEND_URL=https://your-frontend-domain.com
ADMIN_EMAIL=admin@tgindia.com
ADMIN_PASSWORD=your-secure-admin-password
```

**Important Notes:**
- Generate a strong JWT_SECRET (at least 32 characters)
- Use a secure ADMIN_PASSWORD
- Update FRONTEND_URL after deploying frontend

### Step 3: Deploy

1. Click **"Create Web Service"**
2. Wait for deployment (5-10 minutes)
3. Once deployed, you'll get a URL like: `https://tgi-backend.onrender.com`

### Step 4: Seed Database

After successful deployment:

1. Go to your service in Render
2. Click **"Shell"** tab
3. Run seed command:
```bash
npm run seed
```

This creates the admin user with credentials from environment variables.

### Step 5: Test Backend

Test the health endpoint:
```bash
curl https://tgi-backend.onrender.com/health
```

Expected response:
```json
{
  "status": "OK",
  "message": "TGI Backend is running",
  "timestamp": "2024-04-08T09:19:00.000Z"
}
```

Test admin login:
```bash
curl -X POST https://tgi-backend.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@tgindia.com","password":"your-admin-password"}'
```

## 🌐 Deploy Frontend to Render

### Step 1: Update Frontend Environment

Create `.env` file in frontend folder:

```env
VITE_API_URL=https://tgi-backend.onrender.com/api
```

Commit and push:
```bash
cd TGI-main
git add .env
git commit -m "Add production API URL"
git push
```

### Step 2: Create Static Site

1. Go to Render Dashboard
2. Click **"New +"** → **"Static Site"**
3. Connect your GitHub repository
4. Configure:
   - **Name**: `tgi-frontend`
   - **Branch**: `main`
   - **Root Directory**: `TGI-main` (if in subfolder)
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`

### Step 3: Add Environment Variable

Add environment variable:
```
VITE_API_URL=https://tgi-backend.onrender.com/api
```

### Step 4: Deploy

1. Click **"Create Static Site"**
2. Wait for deployment
3. You'll get a URL like: `https://tgi-frontend.onrender.com`

### Step 5: Update Backend CORS

1. Go to backend service in Render
2. Update `FRONTEND_URL` environment variable:
```
FRONTEND_URL=https://tgi-frontend.onrender.com
```
3. Service will auto-redeploy

## 🔒 Security Checklist

- ✅ Strong JWT_SECRET (32+ characters)
- ✅ Secure admin password
- ✅ MongoDB IP whitelist configured
- ✅ CORS properly configured
- ✅ Environment variables set
- ✅ HTTPS enabled (automatic on Render)
- ✅ Rate limiting enabled
- ✅ Helmet security headers enabled

## 📊 Monitoring

### Render Dashboard

Monitor your services:
- **Logs**: View real-time logs
- **Metrics**: CPU, Memory, Bandwidth usage
- **Events**: Deployment history

### Health Checks

Render automatically monitors:
- HTTP health endpoint: `/health`
- Auto-restart on failure

### Custom Monitoring

Add monitoring services:
- [UptimeRobot](https://uptimerobot.com/) - Free uptime monitoring
- [Sentry](https://sentry.io/) - Error tracking
- [LogRocket](https://logrocket.com/) - Session replay

## 🔄 Updates & Redeployment

### Automatic Deployment

Render auto-deploys on git push to main branch.

### Manual Deployment

1. Go to service in Render
2. Click **"Manual Deploy"** → **"Deploy latest commit"**

### Database Migrations

If you update models:
1. Deploy backend
2. Run migrations in Shell if needed
3. Test thoroughly

## 🐛 Troubleshooting

### Backend Won't Start

**Check logs:**
1. Go to service → Logs tab
2. Look for errors

**Common issues:**
- MongoDB connection failed → Check MONGODB_URI
- Port already in use → Render handles this automatically
- Missing environment variables → Check all are set

### Frontend Can't Connect to Backend

**Check:**
1. VITE_API_URL is correct
2. Backend CORS allows frontend URL
3. Backend is running (check health endpoint)
4. Network tab in browser DevTools for errors

### Database Connection Issues

**Check:**
1. MongoDB Atlas IP whitelist includes `0.0.0.0/0`
2. Database user credentials are correct
3. Connection string format is correct
4. Database cluster is running

### Cloudinary Upload Fails

**Check:**
1. Cloudinary credentials are correct
2. API limits not exceeded
3. Image size under 5MB
4. Valid image format

## 💰 Cost Optimization

### Free Tier Limitations

**Render Free Tier:**
- Spins down after 15 minutes of inactivity
- Spins up on first request (cold start ~30 seconds)
- 750 hours/month free

**MongoDB Atlas Free Tier:**
- 512MB storage
- Shared CPU
- No backups

### Upgrade Recommendations

**For Production:**
- Render Starter plan ($7/month) - No spin down
- MongoDB Atlas M10+ - Automated backups
- Cloudinary Pro - Higher limits

## 📈 Scaling

### Horizontal Scaling

Render supports:
- Multiple instances
- Load balancing
- Auto-scaling

### Database Scaling

MongoDB Atlas:
- Vertical scaling (upgrade cluster)
- Horizontal scaling (sharding)
- Read replicas

## 🔐 Backup Strategy

### Database Backups

**MongoDB Atlas:**
- Automated backups (paid tiers)
- Manual exports via mongodump

**Manual Backup:**
```bash
# From Render Shell
mongodump --uri="your-mongodb-uri" --out=/tmp/backup
```

### Code Backups

- GitHub repository (primary)
- Local clones (secondary)
- Render deployment history

## 📞 Support

### Render Support
- [Documentation](https://render.com/docs)
- [Community Forum](https://community.render.com/)
- Email support (paid plans)

### MongoDB Support
- [Documentation](https://docs.mongodb.com/)
- [Community Forum](https://www.mongodb.com/community/forums/)

### Cloudinary Support
- [Documentation](https://cloudinary.com/documentation)
- [Support](https://support.cloudinary.com/)

## ✅ Post-Deployment Checklist

- [ ] Backend health check passes
- [ ] Admin login works
- [ ] Frontend connects to backend
- [ ] Image upload to Cloudinary works
- [ ] Form submissions save to database
- [ ] Content updates persist
- [ ] All environment variables set
- [ ] CORS configured correctly
- [ ] SSL/HTTPS working
- [ ] Monitoring set up
- [ ] Backup strategy in place
- [ ] Custom domain configured (optional)

## 🎉 Success!

Your TGI platform is now live and ready for production use!

**Next Steps:**
1. Test all features thoroughly
2. Set up monitoring and alerts
3. Configure custom domain (optional)
4. Train admin users
5. Monitor performance and optimize
