# Next.js Chunk Error Prevention Guide

## Quick Fix Commands

If you encounter ChunkLoadError:

```bash
# Quick fix (recommended)
npm run fix:chunks

# Full fix with dependency reinstall
npm run fix:chunks:full

# Manual fix
rm -rf .next && npm cache clean --force && npm run dev
```

## What Causes Chunk Errors?

1. **Cache Corruption** - Most common cause
2. **Interrupted Builds** - Stopping server during compilation
3. **File System Issues** - Permissions, disk space, antivirus
4. **Network Timeouts** - Slow file system access

## Prevention Best Practices

### 1. Graceful Server Management
```bash
# ✅ Good - Graceful shutdown
Ctrl+C

# ❌ Bad - Force kill
kill -9 <process_id>
```

### 2. Wait for Compilation
```bash
# Wait for this message before making changes:
✓ Compiled /page in 2.3s
```

### 3. Regular Maintenance
```bash
# Weekly cache cleanup
npm run fix:chunks

# Monthly dependency update
npm update
```

### 4. Development Workflow
1. Start server: `npm run dev`
2. Wait for "Ready" message
3. Make changes only after compilation completes
4. Use Ctrl+C to stop server gracefully

## Troubleshooting Steps

### Level 1: Quick Fix
```bash
npm run fix:chunks
npm run dev
```

### Level 2: Cache Clear
```bash
rm -rf .next
npm cache clean --force
npm run dev
```

### Level 3: Full Reset
```bash
npm run fix:chunks:full
npm run dev
```

### Level 4: Complete Reinstall
```bash
rm -rf node_modules package-lock.json .next
npm install
npm run dev
```

## Monitoring Health

### Check Application Status
```bash
# Test all endpoints
node test-api.js

# Test admin access
node test-gbonsa-login.js
```

### Verify Chunks Generated
After starting dev server, check:
- `.next/static/chunks/app/layout.js` exists
- No errors in terminal
- Pages load without timeout

## Emergency Recovery

If nothing works:
1. Backup your code changes
2. Clone fresh repository
3. Copy your changes back
4. Run `npm install && npm run dev`

## File Structure Check

Ensure these files exist and are not corrupted:
- `app/layout.js` (not .tsx)
- `app/page.js` (not .tsx)
- `next.config.js` (if exists)
- `package.json`

## Common Error Messages

- "Loading chunk app/layout failed" → Run `npm run fix:chunks`
- "ChunkLoadError: Loading CSS chunk failed" → Clear cache
- "Timeout" errors → Check file system performance
- "Module not found" → Check imports and file extensions

## Success Indicators

✅ Server starts with "Ready in Xs"
✅ Pages compile without errors
✅ Chunks generate in `.next/static/chunks/`
✅ No timeout errors in browser
✅ Admin dashboard accessible
✅ API endpoints respond correctly
