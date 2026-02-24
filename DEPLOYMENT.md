# Cyber Crime Risk Assessment System - Deployment Guide

## System Overview

This is a production-ready cyber risk assessment platform built with Next.js 16, React 19, and PostgreSQL. The system enables organizations to evaluate cyber threats, calculate risk scores, and generate compliance reports.

## Architecture

### Core Components

**Frontend:**
- Next.js 16 App Router with React 19
- Shadcn/UI components with Tailwind CSS v4
- Recharts for data visualization
- Client-side form validation with Zod

**Backend:**
- Next.js API Routes (serverless functions)
- Neon serverless PostgreSQL database
- Custom authentication with bcryptjs
- Iron-session for secure session management

**AI/ML:**
- OpenAI GPT-4 for threat explanations
- Hugging Face embeddings for threat relevance scoring

## Environment Variables

Required environment variables (set in Vercel dashboard):

```
DATABASE_URL=postgresql://...
SESSION_SECRET=<generate a secure random string>
OPENAI_API_KEY=<your OpenAI API key>
HUGGINGFACE_API_KEY=<your Hugging Face API key>
```

Generate a secure `SESSION_SECRET`:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Database Schema

The system uses 8 main tables:

- `threats` - Threat catalog with CVSS metrics
- `assessments` - Risk assessment records
- `assessment_responses` - Individual threat evaluations
- `risk_scores` - Calculated risk metrics per threat
- `mitigations` - Recommended actions
- `threat_explanations` - AI-generated threat analysis
- `reports` - Generated assessment reports
- `audit_logs` - System activity tracking

All tables include proper foreign keys, indexes, and timestamps.

## Deployment to Vercel

### Prerequisites

1. Neon PostgreSQL database (serverless)
2. OpenAI API key
3. Hugging Face API key
4. Vercel account

### Steps

1. **Push to GitHub:**
```bash
git push origin main
```

2. **Connect to Vercel:**
- Go to vercel.com
- Click "Add New" → "Project"
- Select your GitHub repository
- Vercel will auto-detect Next.js configuration

3. **Set Environment Variables:**
In Vercel dashboard → Settings → Environment Variables:
- `DATABASE_URL` - From Neon
- `SESSION_SECRET` - Generated locally
- `OPENAI_API_KEY` - From OpenAI
- `HUGGINGFACE_API_KEY` - From Hugging Face

4. **Deploy:**
- Click "Deploy"
- Vercel automatically builds and deploys

### Database Setup

The migration scripts in `/scripts` have already created the database schema. If deploying to a fresh database:

1. Connect to your Neon database
2. Run the migration scripts in order:
   - `01-create-cyber-risk-schema.sql`
   - `02-add-foreign-keys.sql`
   - `02-seed-cyber-risk-data.sql`

## API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/session` - Get current session

### Assessments
- `GET /api/assessments/list` - List assessments
- `GET /api/assessments/[id]` - Get assessment details
- `GET /api/assessments/[id]/risk-scores` - Get threat risk scores
- `POST /api/assessments` - Create assessment

### Threats
- `GET /api/threats` - Get threat catalog
- `POST /api/threats/relevance` - Calculate threat relevance (ML)
- `POST /api/threats/explanations` - Generate AI explanations
- `GET /api/threats/explanations` - Retrieve explanations

### Reports
- `POST /api/reports` - Generate report (CSV/JSON/HTML)
- `GET /api/reports` - List reports

### Admin
- `GET /api/admin/users` - List organization users
- `PUT /api/admin/users` - Update user role
- `DELETE /api/admin/users` - Delete user
- `GET /api/admin/audit-logs` - View audit logs

## Security Features

### Authentication
- Bcryptjs password hashing (10 salt rounds)
- HTTP-only session cookies
- CSRF protection via session tokens
- Automatic session expiration

### Database
- Foreign key constraints for data integrity
- Parameterized queries prevent SQL injection
- Row-level security ready
- Audit logging of all actions

### API
- Protected routes require valid session
- Admin-only endpoints check user roles
- Organization-level data isolation
- Rate limiting ready (implement in middleware)

## Performance Optimizations

- Database connection pooling (Neon serverless)
- Response caching with Recharts
- Optimized bundle size (Turbopack)
- Static asset caching
- Image optimization

## Monitoring & Logging

- Audit logs track all user actions
- Error logging in API routes
- Session tracking for user activity
- Report generation timestamps

## Scaling Considerations

### Horizontal Scaling
- Stateless API routes scale automatically
- Session data stored in secure cookies (no session store needed)
- Database query optimization for high-volume assessments

### Vertical Scaling
- Upgrade Neon database plan for larger datasets
- Increase function timeout in Vercel if needed
- Cache threat catalog (static data)

## Maintenance

### Regular Tasks
- Review audit logs monthly
- Archive old assessments
- Update threat catalog
- Monitor AI API costs

### Database Maintenance
- Create indexes on frequently queried columns
- Vacuum and analyze tables (Neon handles this)
- Backup regularly (Neon provides automated backups)

## Troubleshooting

### Database Connection Issues
- Verify `DATABASE_URL` is set correctly
- Check Neon database status
- Ensure IP allowlisting if applicable

### AI API Failures
- Verify API keys are correct
- Check rate limiting
- Monitor API usage in dashboard

### Session Issues
- Verify `SESSION_SECRET` is set
- Clear browser cookies
- Check session middleware configuration

## Production Checklist

- [ ] Environment variables configured
- [ ] Database migrations executed
- [ ] SSL certificate configured
- [ ] Email notifications setup
- [ ] Monitoring configured
- [ ] Backup strategy in place
- [ ] Disaster recovery plan documented
- [ ] Load testing completed
- [ ] Security audit completed
- [ ] Legal/compliance review completed

## Support

For issues or questions:
1. Check the API documentation
2. Review server logs in Vercel dashboard
3. Check database connection in Neon console
4. Enable debug logging in development

## License

This software is proprietary and confidential.
