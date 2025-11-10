# 🔒 Security Checklist for Production

## ⚠️ CRITICAL - Do Before Deploying

### 1. Change Default Admin Password
- [ ] The default password is `change_me_123` - **CHANGE IT IMMEDIATELY**
- [ ] Use a strong, unique password
- [ ] Consider implementing password change functionality in the admin UI

### 2. Generate New Session Secret
- [ ] Never use the example SESSION_SECRET in production
- [ ] Generate a new one: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
- [ ] Add it to your production environment variables (not in the repo!)

### 3. Environment Variables
- [ ] Create `.env.local` file (already in .gitignore)
- [ ] Never commit `.env.local` to git
- [ ] Set `NODE_ENV=production` in production
- [ ] Configure your hosting provider with environment variables

### 4. Database Security
- [ ] The `/data` directory is in `.gitignore` - NEVER commit it
- [ ] Database contains:
  - Admin passwords (hashed)
  - All your content
  - Custom links
- [ ] Set up regular database backups
- [ ] Store backups securely (not in repo)

### 5. Git Repository
- [ ] Run `git status` to ensure no sensitive files are staged
- [ ] Verify `.env.local` is NOT tracked
- [ ] Verify `data/` directory is NOT tracked
- [ ] Verify `*.db` files are NOT tracked

## ✅ Already Protected

These are already in `.gitignore`:
- ✓ `.env.local` and all `.env.*` files
- ✓ `/data` directory (contains nheek.db)
- ✓ `*.db` and `*.sqlite` files
- ✓ `*.backup` files

## 🔐 Files That Are Safe to Commit

These files are safe because they contain no secrets:
- ✓ `.env.local.example` - template only, no real secrets
- ✓ Documentation files (*.md) - contain default credentials that should be changed
- ✓ Migration scripts - create default user, but you'll change the password
- ✓ API routes - no secrets hardcoded
- ✓ Admin UI pages - credentials display hidden in production (NODE_ENV check)

## 📝 Quick Security Check

Run this command to check for sensitive files:
\`\`\`bash
git ls-files | grep -E "(\.env\.local|data/|\.db|\.sqlite)"
\`\`\`

Should output: *nothing* or "No sensitive files tracked"

If it shows any files, run:
\`\`\`bash
git rm --cached <file>
\`\`\`

## 🚀 Production Deployment Checklist

1. **Before First Deploy:**
   - [ ] Generate new SESSION_SECRET
   - [ ] Set NODE_ENV=production
   - [ ] Run migration: `npm run migrate`
   - [ ] Change default admin password immediately after first login

2. **For Your Hosting Provider:**
   - [ ] Set environment variable: `SESSION_SECRET=your_generated_secret`
   - [ ] Set environment variable: `NODE_ENV=production`
   - [ ] Configure persistent storage for `/data` directory
   - [ ] Set up SSL/HTTPS
   - [ ] Configure database backups

3. **After Deploy:**
   - [ ] Test login works
   - [ ] Change admin password via admin panel
   - [ ] Verify default credentials are hidden on login page
   - [ ] Test admin functionality

## 🛡️ Additional Security Recommendations

1. **Rate Limiting:**
   - Consider adding rate limiting to `/api/auth/login` to prevent brute force attacks

2. **Password Change Feature:**
   - Implement password change UI in admin dashboard
   - Force password change on first login

3. **Session Management:**
   - Sessions expire after 7 days (configurable in `lib/session.ts`)
   - Consider shorter expiry for production

4. **HTTPS Only:**
   - Always use HTTPS in production
   - Set secure cookie flags (already configured for production)

5. **Database Backups:**
   - Set up automated daily backups of `/data/nheek.db`
   - Store backups in secure location (AWS S3, etc.)
   - Test restore process regularly

## ❌ Never Commit These

- ❌ `.env.local` - contains SESSION_SECRET
- ❌ `data/` or `data/nheek.db` - contains passwords and all data
- ❌ Any file with actual passwords or secrets
- ❌ Backup files with `.backup` extension

## ✅ Safe to Commit

- ✅ `.env.local.example` - template with placeholder values
- ✅ All code files
- ✅ Documentation
- ✅ Migration scripts (they create default user only)

---

**Remember:** The default password `change_me_123` is publicly visible in this repo. You MUST change it after first login!
