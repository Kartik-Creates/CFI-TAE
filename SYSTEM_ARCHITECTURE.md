# Cyber Crime Risk Assessment System - Architecture Document

## Executive Summary

This is a full-stack web application for enterprise cyber risk management. Organizations can create risk assessments, evaluate threats using a structured wizard, receive AI-powered threat explanations, and generate compliance reports.

## System Layers

### 1. Presentation Layer (Frontend)

**Technology:** React 19, Next.js 16, Shadcn/UI, Tailwind CSS v4

**Pages:**
- `(auth)/login` - User login
- `(auth)/signup` - User registration
- `dashboard/` - Main dashboard with risk cards
- `dashboard/assessments/new` - Assessment wizard
- `dashboard/assessments/[id]` - Assessment details with visualizations
- `dashboard/assessments/` - Assessment list
- `dashboard/admin/` - Admin panel for user management
- `dashboard/settings/` - User account settings

**Components:**
- `Sidebar` - Navigation menu
- `TopNav` - User menu and logout
- `RiskCard` - Visual risk indicator
- `StepIndicator` - Wizard progress
- Chart components using Recharts

### 2. Business Logic Layer (Backend API)

**Technology:** Next.js API Routes, Serverless Functions

**Risk Scoring Engine** (`lib/risk-scoring.ts`):
```
Risk Score = (Exposure × Impact × Likelihood) / 100
- Exposure: 0-100 (how likely to be attacked)
- Impact: 0-100 (consequence severity)
- Likelihood: 0-100 (probability given exposure)
- Result: 0-100 risk score with color coding
```

**AI Integration:**
- OpenAI API for threat explanations and context
- Hugging Face embeddings for threat relevance scoring
- Cached explanations for performance

**Report Generation:**
- CSV format for spreadsheet import
- JSON for programmatic access
- HTML for browser viewing
- Future: PDF scheduling

### 3. Data Access Layer

**Technology:** Neon PostgreSQL via from '@/lib/db'

**Data Flow:**
```
User Request
    ↓
Next.js API Route
    ↓
SQL Query (parameterized)
    ↓
Neon PostgreSQL
    ↓
Response Processing
    ↓
Client Response
```

### 4. Authentication & Authorization

**Session Management:**
- Iron-session for HTTP-only cookies
- Stateless sessions (no session store needed)
- Automatic expiration after 24 hours
- Secure by default

**User Roles:**
- `user` - Can view assessments
- `admin` - Can manage users and view audit logs

**Protected Routes:**
- Middleware checks session validity
- API routes verify user ownership of resources
- Organization-level data isolation

## Data Model

### Core Entities

```
Organization (via Neon Auth)
├── Users (via Neon Auth)
├── Assessments
│   ├── Assessment Responses (threat ratings)
│   ├── Risk Scores (calculated metrics)
│   │   ├── Mitigations
│   │   └── Threat Explanations (AI)
│   └── Reports (CSV/JSON/HTML)
└── Audit Logs
```

### Key Relationships

- 1 Assessment has many Risk Scores
- 1 Risk Score has many Mitigations
- 1 Risk Score has 1 Threat Explanation
- 1 Assessment has many Reports

## Request/Response Flow

### Assessment Creation Example

```
1. User clicks "New Assessment"
   ↓
2. Frontend navigates to /dashboard/assessments/new
   ↓
3. StepIndicator shows 3 steps
   ↓
4. Step 1: User enters assessment details
   ↓
5. Step 2: GET /api/threats (fetch threat catalog)
   ↓
6. User rates each threat (0-5 scale)
   ↓
7. Frontend calculates initial risk scores
   ↓
8. Step 3: POST /api/assessments (save to database)
   ↓
9. Database creates:
   - Assessment record
   - Assessment responses
   - Risk scores (calculated)
   - Audit log entry
   ↓
10. User redirected to /dashboard/assessments/[id]
    ↓
11. Assessment details page loads
    ↓
12. Frontend shows risk cards, chart, threat list
```

### AI Explanation Generation

```
1. User clicks "Generate AI Explanations"
   ↓
2. For each threat:
   - POST /api/threats/explanations
   ↓
3. Explanation generator:
   - Constructs OpenAI prompt
   - Includes threat details
   - Includes organization industry
   - Includes compliance frameworks
   ↓
4. OpenAI API responds with analysis
   ↓
5. Response stored in threat_explanations table
   ↓
6. Frontend fetches and displays in real-time
```

### Report Generation

```
1. User selects report format (CSV/JSON/HTML)
   ↓
2. POST /api/reports with format preference
   ↓
3. Server fetches assessment and risk data
   ↓
4. Report generator formats data
   ↓
5. Response includes:
   - File content (as string)
   - MIME type
   - Suggested filename
   ↓
6. Frontend triggers download
   ↓
7. Database logs report generation in audit_logs
```

## Security Architecture

### Input Validation
- Frontend: Zod schemas
- Backend: Re-validation of all inputs
- Database: Foreign keys prevent invalid references

### SQL Injection Prevention
- Parameterized queries throughout
- from '@/lib/db' handles escaping
- No string concatenation in queries

### Cross-Site Scripting (XSS)
- React automatically escapes JSX
- Sanitize user input for display
- Content Security Policy headers (configurable)

### Authentication
- Passwords hashed with bcryptjs (10 rounds)
- Salting prevents rainbow table attacks
- Comparison is constant-time

### Session Management
- HTTP-only cookies prevent JS access
- Secure flag set in production
- SameSite policy prevents CSRF
- Session rotation on login

### Data Isolation
- All queries filtered by organization_id
- Users only see their organization's data
- Admin endpoints verify admin role

## Scalability Strategy

### Stateless Design
- No server state (all in secure cookies)
- Multiple deployments can serve same user
- Automatic horizontal scaling on Vercel

### Database Optimization
- Indexes on frequently queried columns:
  - organization_id
  - assessment_id
  - created_at
- Connection pooling via Neon
- Read replicas possible for analytics

### Caching Strategy
- Static threat catalog (rarely changes)
- Client-side caching with SWR
- Response caching headers

### Rate Limiting
- Can be implemented in middleware
- Per-user or per-IP
- Prevents API abuse

## Testing Strategy

### Unit Tests
- Risk scoring algorithm
- Report generation formatting
- Authentication utilities

### Integration Tests
- API endpoint workflows
- Database transactions
- Authentication flow

### E2E Tests
- Assessment creation flow
- Report generation and download
- Admin panel operations

## Deployment Pipeline

```
Code Push to GitHub
    ↓
Vercel Detects Changes
    ↓
Build Process (Next.js)
    ↓
Run Tests
    ↓
Database Migrations (if any)
    ↓
Deploy to Production
    ↓
Health Checks
    ↓
Live
```

## Monitoring & Observability

### Metrics to Track
- Assessment completion time
- AI API response times
- Report generation success rate
- User authentication success rate

### Logging
- API request/response logging
- Error logging with stack traces
- Audit logs for compliance
- Performance logging

### Alerts
- Database connection failures
- API response time > 5s
- Error rate > 1%
- AI API failures

## Future Enhancements

### Short Term
- PDF report generation
- Email report delivery
- Scheduled assessments
- Bulk threat import

### Medium Term
- Real-time collaboration on assessments
- Threat intelligence integration
- Custom risk scoring models
- Compliance framework templates

### Long Term
- Mobile app
- API for third-party integrations
- Advanced analytics
- Machine learning risk prediction

## Disaster Recovery

### Backup Strategy
- Neon provides automated daily backups
- 30-day retention
- Point-in-time recovery available

### Recovery Procedures
1. Contact Neon support for database restore
2. Redeploy application (no data loss)
3. Verify audit logs for recovery confirmation

### RTO/RPO
- RTO: < 1 hour
- RPO: < 1 hour
