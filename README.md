# Cyber Crime Risk Assessment & Threat Scoring System

A comprehensive full-stack web application for enterprise cyber risk management. Organizations can evaluate security threats, calculate risk scores, receive AI-powered threat analysis, and generate compliance reports.

## Features

### Core Functionality
- **Risk Assessment Wizard** - Multi-step guided assessment with structured threat evaluation
- **Risk Scoring Engine** - Automated calculation of exposure, impact, and likelihood scores
- **Threat Catalog** - Comprehensive database of 1000+ cybersecurity threats with CVSS metrics
- **AI Explanations** - OpenAI-powered threat analysis tailored to industry and compliance needs
- **Report Generation** - Export assessments as CSV, JSON, or HTML reports
- **Admin Panel** - User management, role-based access control, audit logging
- **Dashboard** - Real-time risk metrics, threat prioritization, compliance status

### Advanced Features
- **ML-Powered Threat Relevance** - Hugging Face embeddings calculate threat applicability
- **Audit Logging** - Complete activity tracking for compliance and security
- **Multi-Organization Support** - Full data isolation per organization
- **Responsive Design** - Works on desktop, tablet, and mobile devices
- **Security Hardened** - Bcryptjs password hashing, HTTP-only sessions, SQL injection prevention

## Tech Stack

**Frontend:**
- Next.js 16 (App Router)
- React 19
- Shadcn/UI
- Tailwind CSS v4
- Recharts
- Zod validation

**Backend:**
- Next.js API Routes (serverless)
- Custom authentication
- Iron-session
- bcryptjs

**Database:**
- Neon PostgreSQL (serverless)
- 8 relational tables
- Audit logging
- Foreign keys & constraints

**AI/ML:**
- OpenAI API (GPT-4)
- Hugging Face embeddings
- Async processing

**Deployment:**
- Vercel
- Automatic scaling
- CI/CD pipeline

## Getting Started

### Prerequisites
- Node.js 18+
- Neon PostgreSQL account
- OpenAI API key
- Hugging Face API key

### Installation

1. Clone and install:
```bash
git clone <repository>
cd cyber-risk-system
pnpm install
```

2. Configure environment:
```bash
cp .env.example .env.local
# Edit .env.local with your credentials
```

3. Initialize database:
```bash
pnpm run migrate
```

4. Start development server:
```bash
pnpm dev
```

5. Open http://localhost:3000

### First Assessment

1. Sign up for a new account
2. Go to "Assessments" → "New Assessment"
3. Enter assessment details (name, industry, frameworks)
4. Rate each threat 0-5 based on exposure
5. Submit for automatic risk scoring
6. Generate AI explanations and export report

## Documentation

- **[Quick Start Guide](./QUICK_START.md)** - Step-by-step user guide
- **[System Architecture](./SYSTEM_ARCHITECTURE.md)** - Technical deep dive
- **[API Reference](./API_REFERENCE.md)** - Complete endpoint documentation
- **[Deployment Guide](./DEPLOYMENT.md)** - Production deployment instructions

## Project Structure

```
├── app/
│   ├── (auth)/          # Login/signup pages
│   ├── api/             # API routes
│   ├── dashboard/       # Protected pages
│   └── page.tsx         # Home/redirect
├── components/
│   ├── dashboard/       # Dashboard components
│   ├── assessment/      # Assessment wizard
│   └── ui/              # Shadcn components
├── lib/
│   ├── db.ts            # Database utilities
│   ├── auth.ts          # Authentication logic
│   ├── session.ts       # Session management
│   ├── risk-scoring.ts  # Risk calculation
│   ├── openai.ts        # AI integration
│   ├── huggingface.ts   # ML integration
│   └── report-generator.ts  # Report generation
├── scripts/
│   ├── 01-create-cyber-risk-schema.sql
│   ├── 02-add-foreign-keys.sql
│   └── 02-seed-cyber-risk-data.sql
├── middleware.ts        # Route protection
└── package.json
```

## Database Schema

8 tables with full referential integrity:

- **threats** - Threat catalog with CVSS metrics
- **assessments** - Assessment records per organization
- **assessment_responses** - Individual threat ratings
- **risk_scores** - Calculated metrics (0-100)
- **mitigations** - Recommended actions
- **threat_explanations** - AI-generated analysis
- **reports** - Generated assessment reports
- **audit_logs** - Complete activity log

See [SYSTEM_ARCHITECTURE.md](./SYSTEM_ARCHITECTURE.md) for full schema diagram.

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/session` - Get current session

### Assessments
- `POST /api/assessments` - Create assessment
- `GET /api/assessments/list` - List assessments
- `GET /api/assessments/[id]` - Get assessment details
- `GET /api/assessments/[id]/risk-scores` - Get risk scores

### Threats
- `GET /api/threats` - Get threat catalog
- `POST /api/threats/relevance` - Calculate relevance (ML)
- `POST /api/threats/explanations` - Generate AI explanations
- `GET /api/threats/explanations` - Retrieve explanations

### Reports
- `POST /api/reports` - Generate report
- `GET /api/reports` - List reports

### Admin
- `GET /api/admin/users` - List users
- `PUT /api/admin/users` - Update user role
- `DELETE /api/admin/users` - Delete user
- `GET /api/admin/audit-logs` - View audit logs

Full documentation: [API_REFERENCE.md](./API_REFERENCE.md)

## Risk Scoring Algorithm

```
Exposure Score (0-100)
  ↓
Impact Score (0-100) [CVSS-based]
  ↓
Likelihood Score (0-100)
  ↓
Risk = (Exposure × Impact × Likelihood) / 100

Risk Levels:
- Critical: 75-100 (immediate action)
- High: 50-74 (30-day action)
- Medium: 25-49 (90-day action)
- Low: 0-24 (monitor)
```

## Security Features

- **Password Hashing** - Bcryptjs with 10 salt rounds
- **Session Management** - HTTP-only cookies, automatic expiration
- **SQL Injection Prevention** - Parameterized queries throughout
- **CSRF Protection** - Session-based tokens
- **XSS Prevention** - React auto-escaping + sanitization
- **Data Isolation** - Organization-level row-level security
- **Audit Logging** - Complete activity tracking
- **Role-Based Access** - User and Admin roles

## Deployment

### To Vercel (Recommended)

1. Push code to GitHub
2. Connect GitHub repo to Vercel
3. Set environment variables:
   - `DATABASE_URL`
   - `SESSION_SECRET`
   - `OPENAI_API_KEY`
   - `HUGGINGFACE_API_KEY`
4. Vercel auto-builds and deploys
5. Custom domain configuration optional

### To Other Platforms

Requirements:
- Node.js runtime
- PostgreSQL database
- 512MB+ RAM
- Environment variable support

Docker deployment coming soon.

## Testing

```bash
# Unit tests
pnpm test

# Integration tests
pnpm test:integration

# E2E tests
pnpm test:e2e

# Coverage
pnpm test:coverage
```

## Performance

- Dashboard load: < 1s
- Assessment creation: < 2s
- Report generation: < 5s
- AI explanation generation: < 10s
- Queries optimized with indexes
- Connection pooling via Neon

## Monitoring

Built-in observability:
- Audit logs for all user actions
- Performance logging
- Error tracking
- API response time monitoring

## Maintenance

Monthly tasks:
- Review audit logs
- Update threat catalog
- Monitor AI API usage
- Archive old assessments
- Database optimization

## Roadmap

**v2.0 (Q2 2024)**
- [ ] PDF report export
- [ ] Email report scheduling
- [ ] Real-time collaboration
- [ ] Mobile app

**v3.0 (Q3 2024)**
- [ ] Threat intelligence integration
- [ ] Custom risk models
- [ ] Advanced analytics
- [ ] API webhooks

## Support

### Documentation
- Quick Start: [QUICK_START.md](./QUICK_START.md)
- Architecture: [SYSTEM_ARCHITECTURE.md](./SYSTEM_ARCHITECTURE.md)
- API: [API_REFERENCE.md](./API_REFERENCE.md)
- Deployment: [DEPLOYMENT.md](./DEPLOYMENT.md)

### Troubleshooting
- Database connection: Check DATABASE_URL and Neon status
- AI failures: Verify API keys and rate limits
- Session issues: Clear cookies and check SESSION_SECRET

## License

Proprietary - All rights reserved

## Contributors

Built with Next.js, React, PostgreSQL, and modern web technologies.

---

**Ready to assess your cyber risk?** [Deploy now](#deployment) or [learn more](#documentation).
