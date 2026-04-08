# Render Deployment Checklist

## Critical Environment Variables

Ensure these are set in Render Dashboard → Environment:

```bash
NODE_ENV=production
PORT=10000
MONGODB_URI=mongodb+srv://dextermorgan:dexysexy@dextermorgan.3qzejt5.mongodb.net/tgimain?appName=DexterMorgan
JWT_SECRET=TGISECREAT9876KEY123
JWT_EXPIRE=7d
CLOUDINARY_CLOUD_NAME=djld7zzuo
CLOUDINARY_API_KEY=286753134271948
CLOUDINARY_API_SECRET=3B7wiwOZ-fWZHQndnLycbogOSXI
FRONTEND_URL=https://tgi-india-main.vercel.app
ADMIN_EMAIL=admin@tgindia.com
ADMIN_PASSWORD=tgi@admin2024
SMTP_EMAIL=talentgroupofindia@gmail.com
SMTP_PASSWORD=your-gmail-app-password
SERVER_URL=https://tgi-india-backend.onrender.com
```

## Deployment Steps

1. **Push to GitHub** (already done)
2. **Render Auto-Deploy** (triggered automatically)
3. **Wait 2-3 minutes** for build to complete
4. **Check Logs** in Render Dashboard

## Verify Deployment

### Test Endpoints:

1. **Root:** https://tgi-india-backend.onrender.com/
   - Should return API info

2. **Health:** https://tgi-india-backend.onrender.com/health
   - Should return: `{"status":"OK",...}`

3. **Content:** https://tgi-india-backend.onrender.com/api/content
   - Should return content data

### Check Logs:

Look for these messages in Render logs:
```
🔒 CORS Allowed Origins: [...]
✅ MongoDB Connected: ...
🚀 Server running in production mode
📡 Port: 10000
🔄 Keep-alive started - pinging every 14 minutes
```

## Troubleshooting

### CORS Errors:
- Verify `FRONTEND_URL=https://tgi-india-main.vercel.app` is set
- Check logs for "CORS: Origin blocked" messages
- Ensure latest code is deployed

### 521 Errors:
- Server might be starting (wait 30 seconds)
- Check Render logs for errors
- Verify MongoDB connection string is correct
- Ensure PORT is set to 10000 (Render default)

### Server Not Starting:
- Check for build errors in Render logs
- Verify all environment variables are set
- Check MongoDB Atlas allows connections from 0.0.0.0/0

### Keep-Alive Not Working:
- Only runs in production (NODE_ENV=production)
- Check logs after 14 minutes for ping messages
- Verify SERVER_URL is set correctly

## Post-Deployment

After successful deployment:

1. **Test from Vercel frontend**
2. **Test admin login**
3. **Verify content loads**
4. **Check performance** (should be fast with cache)

## Important Notes

- Render free tier may sleep after 15 minutes of inactivity
- Keep-alive pings every 14 minutes to prevent sleep
- First request after sleep may take 30 seconds (cold start)
- Subsequent requests should be fast (< 500ms)
