# Deploy Now - Quick Start

## 5-Minute Deployment Guide

### Step 1: Set Environment Variables in Vercel (2 min)

1. Go to your Vercel project
2. Navigate to **Settings > Environment Variables**
3. Add these variables:

```
DATABASE_URL = [Your Neon PostgreSQL URL from console.neon.tech]
SESSION_SECRET = [Generate random 32+ char string or use: $(openssl rand -base64 32)]
```

### Step 2: Trigger Redeploy (1 min)

Option A - Via Vercel Dashboard:
1. Go to **Deployments**
2. Click the **...** menu on latest deployment
3. Select **Redeploy**

Option B - Via Git:
1. Make a small change (e.g., update DEPLOY_NOW.md timestamp)
2. Push to GitHub
3. Vercel auto-deploys

### Step 3: Wait for Build (2 min)

- Monitor the build progress in Vercel dashboard
- Check for any red error messages
- Once it says "Ready", your app is live!

### Step 4: Test (1 min)

1. Visit your deployment URL
2. Click "Create Account"
3. Fill in email, password, name
4. Click "Create account"
5. If redirected to dashboard, success! ✅

## If You Get Errors

### "Cannot find module" or "DATABASE_URL not set"
- **Solution**: Check environment variables are saved in Vercel dashboard
- **Action**: Click "Save" after entering env vars, then redeploy

### "next: command not found" during build
- **Solution**: This shouldn't happen with Vercel (they handle npm install)
- **Action**: Click "Redeploy" again, check build logs

### 500 errors on API endpoints
- **Solution**: Check Vercel Function logs
- **Action**: Go to Deployments > select current > scroll down for Function logs

### "Invalid password" when logging in
- **Solution**: Make sure you just signed up with that email/password
- **Action**: Try signing up as a new user first

## What's Been Fixed

✅ Database schema alignment with Stack Auth  
✅ Password hashing and verification  
✅ Session management  
✅ API authentication  
✅ Environment configuration  

## Next Steps After Deployment

1. **Verify Core Features**:
   - Sign up works
   - Login works  
   - Dashboard loads
   - Create assessment works

2. **Add Optional AI Features** (if desired):
   - Get OpenAI API key from platform.openai.com
   - Add `OPENAI_API_KEY` to Vercel env vars
   - Add Hugging Face token for ML features

3. **Monitor** 
   - Check Vercel logs periodically
   - Watch for any 500 errors
   - Monitor database usage

## Common Env Variable Mistakes

❌ Missing: `DATABASE_URL=`  
✅ Correct: `DATABASE_URL=postgresql://...`

❌ Missing: `SESSION_SECRET=`  
✅ Correct: `SESSION_SECRET=random_32_character_string`

❌ Copying `postgresql://` twice  
✅ Correct: Full URL from Neon console only once

## If Still Stuck

1. Check `/TROUBLESHOOTING.md` for detailed help
2. Check `/DEPLOYMENT_CHECKLIST.md` for full checklist
3. Review `/FIXES_APPLIED.md` to understand what was fixed

---

**You're ready to deploy!** 🚀
