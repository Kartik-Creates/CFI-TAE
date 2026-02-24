# Deployment Checklist

## Pre-Deployment Steps

### 1. Local Setup
- [ ] Run `npm install` or `yarn install`
- [ ] Copy `.env.example` to `.env.local`
- [ ] Fill in `DATABASE_URL` from Neon
- [ ] Set `SESSION_SECRET` to a random 32+ character string
- [ ] Run `npm run dev` and verify no errors
- [ ] Test signup: http://localhost:3000/signup
- [ ] Test login: http://localhost:3000/login
- [ ] Test dashboard: http://localhost:3000/dashboard

### 2. Database Preparation
- [ ] Verify Neon database is active
- [ ] Check migrations ran successfully
- [ ] Verify `cyber_risk` schema tables exist:
  - [ ] `threats`
  - [ ] `assessments`
  - [ ] `assessment_responses`
  - [ ] `risk_scores`
  - [ ] `reports`
  - [ ] `audit_logs`
  - [ ] `mitigations`
  - [ ] `threat_explanations`
- [ ] Verify sample threat data is populated

### 3. Environment Variables
- [ ] DATABASE_URL is correct for your Neon project
- [ ] SESSION_SECRET is set (32+ characters, production: use secure random string)
- [ ] OPENAI_API_KEY added (if using AI features)
- [ ] HUGGINGFACE_API_KEY added (if using ML features)

## Deployment to Vercel

### 1. Connect Repository
- [ ] Push code to GitHub
- [ ] Go to https://vercel.com/new
- [ ] Connect your GitHub repository
- [ ] Select the project root folder

### 2. Environment Variables in Vercel
- [ ] Go to Project Settings > Environment Variables
- [ ] Add `DATABASE_URL` from Neon
- [ ] Add `SESSION_SECRET` (use secure random generator)
- [ ] Add `OPENAI_API_KEY` (if applicable)
- [ ] Add `HUGGINGFACE_API_KEY` (if applicable)
- [ ] Make sure variables are set for all environments (Development, Preview, Production)

### 3. Build Settings
- [ ] Framework: Next.js
- [ ] Build command: `npm run build` (default)
- [ ] Install command: `npm install` (default)
- [ ] Output directory: `.next` (default)

### 4. Deploy
- [ ] Click "Deploy"
- [ ] Wait for build to complete
- [ ] Check build logs for errors
- [ ] Verify deployment URL works

## Post-Deployment Verification

### 1. Test Core Functionality
- [ ] Home page loads: https://your-deployment.vercel.app
- [ ] Signup works with new user
- [ ] Login works with created user
- [ ] Dashboard displays without errors
- [ ] Can create new assessment
- [ ] Can view threats list

### 2. Monitor for Errors
- [ ] Check Vercel dashboard logs
- [ ] Monitor browser console for client errors
- [ ] Test all main features work
- [ ] Verify database queries are successful

### 3. Security Check
- [ ] HTTPS is enforced
- [ ] No sensitive data in logs
- [ ] SESSION_SECRET is production-ready
- [ ] DATABASE_URL doesn't appear in client code
- [ ] API routes validate authentication

## Troubleshooting During Deployment

### Build Fails with "next: command not found"
- **Cause**: Dependencies not installed
- **Fix**: Vercel should auto-install, but check `npm install` in build logs
- **Alternative**: Delete `node_modules` locally and reinstall

### Database Connection Error
- **Cause**: DATABASE_URL not set or incorrect
- **Fix**: Double-check env var in Vercel dashboard
- **Verify**: Test connection string in your Neon dashboard

### API 500 Errors
- **Cause**: Missing env vars or schema issues
- **Fix**: Check Vercel logs, verify all env vars are set
- **Check**: Database migrations completed successfully

### Authentication Not Working
- **Cause**: SESSION_SECRET missing or session cookie issues
- **Fix**: Verify SESSION_SECRET is set in all environments
- **Note**: Might need to log out and back in after deploy

## Scaling Considerations

### Database
- Monitor Neon query performance
- Consider enabling query optimization
- Set up alerts for connection pool exhaustion

### API Rates
- OpenAI API has rate limits
- Implement caching for threat explanations
- Consider async processing for ML relevance scores

### CDN & Caching
- Vercel provides automatic edge caching
- Static assets are optimized by default
- API responses can be cached with `revalidateTag()`

## Post-Launch Maintenance

- [ ] Set up error monitoring (Sentry recommended)
- [ ] Enable database backups in Neon
- [ ] Review security logs regularly
- [ ] Monitor API usage and costs
- [ ] Update dependencies regularly
- [ ] Backup database before major updates

## Rollback Plan

If deployment has critical issues:
1. Go to Vercel Dashboard > Deployments
2. Find previous working deployment
3. Click "Promote to Production"
4. Or use `vercel --prod --confirm` to rollback locally

## Support & Resources

- **Vercel Docs**: https://vercel.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **Neon Docs**: https://neon.tech/docs
- **Vercel Support**: https://vercel.com/help
