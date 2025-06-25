# Customer Need SEO - Troubleshooting Guide

## Next.js ChunkLoadError Resolution

### Problem
If you encounter a `ChunkLoadError` with messages like:
- "Loading chunk app/layout failed"
- "Loading CSS chunk failed"
- Timeout errors when loading chunks from `/_next/static/chunks/`

### Quick Fix
Run our automated fix script:
```bash
node scripts/fix-chunk-errors.js
```

### Manual Fix Steps

1. **Stop the development server** (Ctrl+C)

2. **Clear Next.js cache:**
   ```bash
   rm -rf .next
   # or on Windows:
   Remove-Item -Recurse -Force .next
   ```

3. **Clear npm cache:**
   ```bash
   npm cache clean --force
   ```

4. **Clear node_modules cache (if exists):**
   ```bash
   rm -rf node_modules/.cache
   ```

5. **Restart development server:**
   ```bash
   npm run dev
   ```

### Advanced Fix (if problem persists)

1. **Complete dependency reinstall:**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   npm run dev
   ```

2. **Check for file system issues:**
   - Ensure you have sufficient disk space
   - Check file permissions
   - Verify antivirus isn't blocking files

### Prevention Measures

1. **Graceful server shutdown:**
   - Always use Ctrl+C to stop the dev server
   - Avoid force-killing the process

2. **Avoid editing during compilation:**
   - Wait for compilation to complete before making changes
   - Watch for "✓ Compiled" messages in the terminal

3. **Keep dependencies updated:**
   ```bash
   npm update
   ```

4. **Regular cache cleanup:**
   - Run the fix script weekly: `node scripts/fix-chunk-errors.js`

### Common Causes

- **Cache corruption:** Most common cause, fixed by clearing .next directory
- **Interrupted compilation:** Stopping server during build process
- **File system issues:** Permissions, disk space, antivirus interference
- **Network timeouts:** Slow file system or network issues
- **Outdated dependencies:** Old Next.js or React versions

### Admin Dashboard Access

After fixing chunk errors, verify admin access:
- **URL:** http://localhost:3000/admin
- **gbonsa:** gbonsa2@gmail.com / gemegold*0913
- **gemechu:** gemechu@customerneedseo.com / admin123!@#
- **daniel:** daniel@customerneedseo.com / admin123!@#

### API Endpoints Testing

Test all endpoints are working:
```bash
node test-api.js
node test-gbonsa-login.js
```

### Support

If issues persist:
1. Check the development server logs for specific errors
2. Verify all files are properly saved
3. Ensure no TypeScript syntax in JavaScript files
4. Check for duplicate function definitions
5. Verify import/export statements are correct

### Environment Requirements

- Node.js 18+ 
- npm 8+
- Next.js 14.2.16
- Sufficient disk space (>1GB free)
- No antivirus blocking .next directory
