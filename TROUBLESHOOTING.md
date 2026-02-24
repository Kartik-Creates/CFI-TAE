# Troubleshooting Guide

## Common Issues and Solutions

### 1. "next: command not found"
**Cause**: Dependencies not installed
**Solution**: 
```bash
npm install
# or
yarn install
# or
pnpm install
```

### 2. DATABASE_URL not set
**Cause**: Environment variable missing in Vercel/deployment
**Solution**: 
- Go to your Vercel project Settings > Environment Variables
- Add `DATABASE_URL` with your Neon PostgreSQL connection string
- Redeploy the project

### 3. Session Secret not configured
**Cause**: SESSION_SECRET environment variable missing
**Solution**:
- Generate a random 32+ character string
- Add to environment variables: `SESSION_SECRET`
- Required for secure session management

### 4. Authentication failing
**Possible causes**:
- Database tables not created (run migrations)
- Environment variables not set
- User doesn't exist in database

**Solution**:
1. Verify database is connected: `npm run check-db`
2. Check auth tables exist: Query `neon_auth.user` table
3. Verify SESSION_SECRET is set
4. Check browser console for specific errors

### 5. API returning 500 errors
**Debugging**:
1. Check server logs in Vercel dashboard
2. Look for specific error messages
3. Verify DATABASE_URL connection string is correct
4. Ensure Neon database is active

### 6. Assessments not saving
**Check**:
1. Verify organization_id is set in session
2. Confirm cyber_risk schema tables exist
3. Check if user has permission to insert data
4. Verify all required fields are provided

### 7. "Module not found" errors
**Solution**:
- Clear `.next` folder: `rm -rf .next`
- Reinstall dependencies: `npm install`
- Rebuild: `npm run build`

## Environment Variables Checklist

Required for production:
- [ ] DATABASE_URL
- [ ] SESSION_SECRET
- [ ] OPENAI_API_KEY (for AI features)
- [ ] HUGGINGFACE_API_KEY (for ML features)

## Verification Steps

1. **Check Database Connection**:
   ```sql
   SELECT COUNT(*) FROM cyber_risk.threats;
   ```

2. **Verify Tables Exist**:
   ```sql
   SELECT table_name FROM information_schema.tables WHERE table_schema = 'cyber_risk';
   ```

3. **Check User Creation**:
   ```sql
   SELECT * FROM neon_auth.user WHERE email = 'test@example.com';
   ```

4. **Test API Endpoints**:
   ```bash
   curl -X GET http://localhost:3000/api/threats
   curl -X GET http://localhost:3000/api/auth/session
   ```

## Development vs Production

### Development
- SESSION_SECRET can be default (dev-secret)
- Missing env vars show warnings
- Hot reload enabled

### Production
- All env vars required
- SESSION_SECRET must be set (secure random string)
- HTTPS enforced
- Strict error handling

## Performance Issues

### Slow Database Queries
1. Check Neon database logs
2. Verify indexes are created
3. Consider query optimization
4. Monitor connection pooling

### High Memory Usage
1. Check for memory leaks in API routes
2. Verify proper cleanup in event handlers
3. Monitor background jobs

## Security Checklist

- [ ] DATABASE_URL uses SSL connection
- [ ] SESSION_SECRET is 32+ characters
- [ ] API routes validate authentication
- [ ] Input validation on all endpoints
- [ ] SQL injection prevention (parameterized queries)
- [ ] CSRF protection enabled
- [ ] Sensitive data not logged

## Support Resources

- **Neon Documentation**: https://neon.tech/docs
- **Next.js Documentation**: https://nextjs.org/docs
- **Vercel Support**: https://vercel.com/help
- **Debug Logs**: Check Vercel project logs in dashboard

## Getting Help

If issues persist:
1. Collect error logs from Vercel dashboard
2. Check browser console for client-side errors
3. Verify all environment variables are set
4. Ensure database migrations ran successfully
5. Review the project deployment settings
