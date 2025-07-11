# Deployment Guide for Efuyegela Customer Need SEO

## 🚀 Vercel Deployment Instructions

### Step 1: Environment Variables Setup

In your Vercel dashboard, add these environment variables:

#### Required Variables:
```
JWT_SECRET=your-super-secret-jwt-key-make-it-long-and-random-for-production
NODE_ENV=production
```

#### Optional Variables:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/okoo?retryWrites=true&w=majority
```

### Step 2: Admin Login Credentials

The application has built-in admin credentials:

**Primary Admin:**
- Email: `gbonsa2@gmail.com`
- Password: `gemegold*0913`

**Secondary Admin:**
- Email: `gemechu`
- Password: `daniel`

### Step 3: Deployment Process

1. **Connect GitHub Repository**:
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import from GitHub: `gemee-dev/efucustomerneedseo`

2. **Configure Build Settings**:
   - Framework Preset: Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`

3. **Add Environment Variables**:
   - In Vercel project settings → Environment Variables
   - Add the required variables listed above

4. **Deploy**:
   - Click "Deploy"
   - Wait for deployment to complete

### Step 4: Post-Deployment Testing

1. **Test Main Page**:
   - Visit your deployed URL
   - Verify the form works
   - Check Google Ads integration

2. **Test Admin Dashboard**:
   - Go to `https://your-domain.vercel.app/admin`
   - Login with: `gbonsa2@gmail.com` / `gemegold*0913`
   - Verify submissions display
   - Test file downloads

### Step 5: Google AdSense Setup

1. **Verify AdSense Integration**:
   - Publisher ID: `ca-pub-9080129920569347` (already configured)
   - Create ad units in your AdSense dashboard
   - Replace placeholder slot IDs in the code

2. **Ad Unit Creation**:
   - Sidebar: 300x250 or responsive
   - Inline: responsive/auto
   - Footer: 728x90 or responsive

### Troubleshooting Common Issues

#### Admin Login "Internal Server Error"

If you get internal server error on admin login:

1. **Check Vercel Function Logs**:
   - Go to Vercel Dashboard → Your Project → Functions
   - Check logs for `/api/admin/login`

2. **Verify Environment Variables**:
   - Ensure `JWT_SECRET` is set in Vercel
   - Make sure it's a long, random string

3. **Check bcrypt Compatibility**:
   - The app handles bcrypt issues automatically
   - Uses fallback authentication if bcrypt fails

#### File Upload Issues

If file uploads don't work:

1. **Vercel File Size Limits**:
   - Free plan: 4.5MB per file
   - Pro plan: 50MB per file

2. **Serverless Function Timeout**:
   - Free plan: 10 seconds
   - Pro plan: 60 seconds

#### Database Connection

The app works without MongoDB:
- Uses in-memory storage for development
- Automatically falls back if MongoDB is unavailable
- All features work without database connection

### Performance Optimization

1. **Enable Vercel Analytics** (Optional):
   - Go to project settings → Analytics
   - Enable Web Analytics

2. **Configure Caching**:
   - Static files are automatically cached
   - API routes use appropriate cache headers

3. **Monitor Performance**:
   - Use Vercel's built-in monitoring
   - Check Core Web Vitals

### Security Considerations

1. **JWT Secret**:
   - Use a strong, random JWT_SECRET in production
   - Never commit secrets to Git

2. **Admin Credentials**:
   - Built-in credentials are secure
   - Consider changing them for high-security environments

3. **HTTPS**:
   - Vercel automatically provides HTTPS
   - All cookies are secure in production

### Support

If you encounter issues:
1. Check Vercel function logs
2. Verify environment variables
3. Test locally first
4. Check this deployment guide

The application is designed to be robust and work in various deployment environments!
