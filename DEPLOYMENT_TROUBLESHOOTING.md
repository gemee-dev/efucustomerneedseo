# Vercel Deployment Troubleshooting Guide

## 🚨 Common Vercel Errors & Solutions

### 1. FUNCTION_INVOCATION_FAILED (500)
**Cause**: API routes failing due to environment variables or database connection
**Solution**:
- Check all environment variables are set in Vercel dashboard
- Verify MongoDB connection string is correct
- Check function logs in Vercel dashboard

### 2. FUNCTION_INVOCATION_TIMEOUT (504)
**Cause**: MongoDB connection timeout in serverless environment
**Solution**:
- MongoDB connection optimized for Vercel (already implemented)
- Increase function timeout in vercel.json (already set to 30s)

### 3. DEPLOYMENT_NOT_READY_REDIRECTING (303)
**Cause**: Deployment still building
**Solution**: Wait for build to complete (usually 2-3 minutes)

## 🔧 Environment Variables Checklist

Ensure these are set in Vercel Dashboard → Settings → Environment Variables:

```
MONGODB_URI=mongodb+srv://gemegold:gemegold@cluster0.eashhao.mongodb.net/efuyegela?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=efu-super-secret-jwt-key-2024-production-gemegold-efuyegela-secure-token-12345
ADMIN_EMAIL=gemechu
ADMIN_PASSWORD=daniel
NEXT_PUBLIC_APP_URL=https://customerneedseo.vercel.app
SMTP_USER=
SMTP_PASS=
FROM_EMAIL=noreply@efuyegela.com
```

## 🚀 Deployment Steps

1. **Push to GitHub** (already done)
2. **Import to Vercel**:
   - Go to vercel.com
   - Click "New Project"
   - Import `Zemenaytech/customerneedseo`
3. **Add Environment Variables** (copy from above)
4. **Deploy**

## 🔍 Debugging Steps

### Check Build Logs
1. Go to Vercel Dashboard
2. Click on your deployment
3. Check "Functions" tab for errors
4. Check "Build Logs" for compilation issues

### Test API Endpoints
After deployment, test these endpoints:
- `GET /api/advertisements` - Should return empty array or sample ads
- `POST /api/admin/login` - Test with admin credentials
- `GET /api/admin/dashboard` - Should work after login

### MongoDB Connection Test
If database errors occur:
1. Check MongoDB Atlas network access (allow all IPs: 0.0.0.0/0)
2. Verify database user permissions
3. Test connection string in MongoDB Compass

## 🛠️ Quick Fixes

### If Admin Login Fails:
1. Check JWT_SECRET is set
2. Verify ADMIN_EMAIL and ADMIN_PASSWORD
3. Run database initialization script

### If Advertisements Don't Show:
1. Check MongoDB connection
2. Create sample ads via admin dashboard
3. Verify API endpoint `/api/advertisements` works

### If Form Submission Fails:
1. Check MongoDB connection
2. Verify all required fields are present
3. Check API logs in Vercel dashboard

## 📞 Support

If issues persist:
1. Check Vercel function logs
2. Test locally with `npm run dev`
3. Verify all environment variables match exactly
4. Contact support with specific error codes

## 🎯 Success Indicators

✅ Build completes without errors
✅ All API endpoints return 200 status
✅ Admin login works
✅ Form submission works
✅ Advertisements display on homepage
