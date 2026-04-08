# Render Deployment Guide

## Environment Variables Required on Render

Set these in Render Dashboard → Environment:

```
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/tgimain
JWT_SECRET=your-secret-key-here
JWT_EXPIRE=7d
CLOUDINARY_CLOUD_NAME=your-cloudinary-name
CLOUDINARY_API_KEY=your-cloudinary-key
CLOUDINARY_API_SECRET=your-cloudinary-secret
FRONTEND_URL=https://tgi-india-main.vercel.app
ADMIN_EMAIL=admin@tgindia.com
ADMIN_PASSWORD=tgi@admin2024
SMTP_EMAIL=talentgroupofindia@gmail.com
SMTP_PASSWORD=your-gmail-app-password
```

## Deployment Steps

1. **Connect GitHub Repository**
   - Go to Render Dashboard
   - New → Web Service
   - Connect: `https://github.com/MayurTank07/TGI-India-backend.git`

2. **Configure Service**
   - Name: `tgi-india-backend`
   - Environment: `Node`
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Instance Type: Free

3. **Add Environment Variables**
   - Copy all variables from above
   - Paste in Render Environment section

4. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment to complete
   - Your backend will be live at: `https://tgi-india-backend.onrender.com`

## Verify Deployment

Test health endpoint:
```
https://tgi-india-backend.onrender.com/health
```

Should return:
```json
{
  "status": "OK",
  "message": "TGI Backend is running",
  "timestamp": "..."
}
```

## Auto-Deploy

Render automatically deploys when you push to `main` branch on GitHub.

## Troubleshooting

**CORS Errors:**
- Ensure `FRONTEND_URL=https://tgi-india-main.vercel.app` is set
- Check Render logs for errors

**Database Connection:**
- Verify MongoDB URI is correct
- Ensure MongoDB Atlas allows connections from anywhere (0.0.0.0/0)

**Server Not Starting:**
- Check Render logs
- Verify all environment variables are set
- Ensure `npm start` command works locally
