# API Reference

Base URL: `https://your-domain.vercel.app`

All requests require valid session cookies. Return format: JSON

## Authentication Endpoints

### POST /api/auth/signup
Create a new user account

**Request:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "organizationId": "uuid"
  }
}
```

**Status Codes:**
- 201: User created
- 400: Invalid input
- 409: Email already exists

---

### POST /api/auth/login
Authenticate user

**Request:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "organizationId": "uuid"
  }
}
```

**Status Codes:**
- 200: Login successful
- 401: Invalid credentials
- 400: Missing email/password

---

### POST /api/auth/logout
Logout current user

**Response:**
```json
{
  "success": true
}
```

---

### GET /api/auth/session
Get current session

**Response:**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "organizationId": "uuid"
  }
}
```

**Status Codes:**
- 200: Session valid
- 401: Not authenticated

---

## Assessment Endpoints

### POST /api/assessments
Create new assessment

**Request:**
```json
{
  "assessment_name": "Q1 2024 Security Review",
  "description": "Quarterly risk assessment",
  "industry": "Finance",
  "compliance_frameworks": ["ISO27001", "SOC2"],
  "threat_ratings": [
    {
      "threat_id": "uuid",
      "response_value": 4,
      "evidence": "API exposed to internet"
    }
  ]
}
```

**Response:**
```json
{
  "assessment_id": "uuid",
  "overall_risk_score": 65.5,
  "risk_scores": [
    {
      "threat_id": "uuid",
      "threat_name": "Data Breach",
      "calculated_risk": 78.5,
      "risk_level": "High"
    }
  ]
}
```

**Status Codes:**
- 201: Assessment created
- 400: Invalid input
- 401: Unauthorized

---

### GET /api/assessments/list
List all assessments for organization

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `status` (optional): Filter by status (in_progress, completed, archived)

**Response:**
```json
{
  "assessments": [
    {
      "id": "uuid",
      "assessment_name": "Q1 2024 Security Review",
      "industry": "Finance",
      "overall_risk_score": 65.5,
      "status": "completed",
      "created_at": "2024-02-23T10:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 5
  }
}
```

---

### GET /api/assessments/[id]
Get specific assessment details

**Response:**
```json
{
  "id": "uuid",
  "assessment_name": "Q1 2024 Security Review",
  "industry": "Finance",
  "compliance_frameworks": ["ISO27001", "SOC2"],
  "overall_risk_score": 65.5,
  "status": "completed",
  "created_at": "2024-02-23T10:00:00Z",
  "description": "Quarterly risk assessment"
}
```

**Status Codes:**
- 200: Success
- 404: Assessment not found
- 401: Unauthorized

---

### GET /api/assessments/[id]/risk-scores
Get risk scores for assessment

**Response:**
```json
{
  "riskScores": [
    {
      "id": "uuid",
      "threat_id": "uuid",
      "threat_name": "Data Breach",
      "calculated_risk": 78.5,
      "risk_level": "High",
      "exposure_score": 85,
      "impact_score": 90,
      "likelihood_score": 85,
      "priority_rank": 1
    }
  ]
}
```

---

## Threat Endpoints

### GET /api/threats
Get threat catalog

**Query Parameters:**
- `category` (optional): Filter by category
- `severity` (optional): Filter by minimum severity

**Response:**
```json
{
  "threats": [
    {
      "id": "uuid",
      "threat_id": "THREAT_001",
      "name": "Data Breach",
      "description": "Unauthorized access to sensitive data",
      "category": "Confidentiality",
      "severity_base_score": 8.5,
      "attack_vector": "Network",
      "affected_systems": ["Database", "API"],
      "mitigation_recommendations": [...]
    }
  ]
}
```

---

### POST /api/threats/relevance
Calculate threat relevance for organization

**Request:**
```json
{
  "threats": [
    {
      "threat_id": "uuid",
      "threat_name": "Data Breach"
    }
  ],
  "industry": "Finance",
  "organization_size": "large"
}
```

**Response:**
```json
{
  "threats": [
    {
      "threat_id": "uuid",
      "relevance_score": 92.5,
      "reason": "High relevance for financial institutions"
    }
  ]
}
```

---

### POST /api/threats/explanations
Generate AI explanations for threats

**Request:**
```json
{
  "riskScoreId": "uuid",
  "threatName": "Data Breach",
  "threatDescription": "Unauthorized access to sensitive data",
  "riskScore": 78.5,
  "industry": "Finance",
  "complianceFrameworks": ["SOC2", "PCI-DSS"]
}
```

**Response:**
```json
{
  "success": true,
  "explanation": {
    "explanation": "Data breaches pose significant risk...",
    "relevanceReasoning": "Financial institutions are primary targets...",
    "industryContext": "In the finance sector, data breaches..."
  }
}
```

---

### GET /api/threats/explanations
Get stored explanations

**Query Parameters:**
- `riskScoreId`: Risk score to fetch explanation for

**Response:**
```json
{
  "explanation": {
    "explanation": "Data breaches pose significant risk...",
    "relevance_reasoning": "Financial institutions are primary targets...",
    "industry_context": "In the finance sector, data breaches...",
    "created_at": "2024-02-23T10:00:00Z"
  }
}
```

---

## Report Endpoints

### POST /api/reports
Generate assessment report

**Request:**
```json
{
  "assessmentId": "uuid",
  "reportType": "detailed",
  "fileFormat": "csv",
  "scheduledGeneration": false,
  "recurrence": null
}
```

**Response:**
```json
{
  "success": true,
  "report": {
    "filename": "assessment_Q1_2024_1708675200.csv",
    "content": "Assessment,Threat Name,Risk Level,Risk Score...",
    "mimeType": "text/csv",
    "fileFormat": "csv"
  }
}
```

**File Formats:**
- `csv`: Comma-separated values
- `json`: JSON document
- `pdf`: HTML for browser (future: actual PDF)

**Status Codes:**
- 200: Report generated
- 400: Invalid parameters
- 404: Assessment not found

---

### GET /api/reports
List reports for assessment

**Query Parameters:**
- `assessmentId`: Assessment ID

**Response:**
```json
{
  "reports": [
    {
      "id": "uuid",
      "report_type": "detailed",
      "file_format": "csv",
      "generated_at": "2024-02-23T10:00:00Z",
      "scheduled_generation": false
    }
  ]
}
```

---

## Admin Endpoints

### GET /api/admin/users
List organization users

**Query Parameters:**
- `page` (optional): Page number

**Response:**
```json
{
  "users": [
    {
      "id": "uuid",
      "email": "user@example.com",
      "role": "admin",
      "created_at": "2024-02-23T10:00:00Z",
      "last_login": "2024-02-23T15:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 5
  }
}
```

**Requires:** Admin role

---

### PUT /api/admin/users
Update user role

**Request:**
```json
{
  "userId": "uuid",
  "role": "admin"
}
```

**Response:**
```json
{
  "success": true
}
```

**Requires:** Admin role

---

### DELETE /api/admin/users
Remove user from organization

**Request:**
```json
{
  "userId": "uuid"
}
```

**Response:**
```json
{
  "success": true
}
```

**Status Codes:**
- 200: User deleted
- 400: Cannot delete self
- 403: Admin access required

---

### GET /api/admin/audit-logs
View audit logs

**Query Parameters:**
- `page` (optional): Page number
- `action` (optional): Filter by action
- `entityType` (optional): Filter by entity type

**Response:**
```json
{
  "logs": [
    {
      "id": "uuid",
      "user_id": "uuid",
      "action": "assessment_created",
      "entity_type": "assessment",
      "entity_id": "uuid",
      "changes": {
        "assessment_name": "Q1 2024"
      },
      "timestamp": "2024-02-23T10:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 147
  }
}
```

**Requires:** Admin role

---

## Error Responses

All errors follow this format:

```json
{
  "error": "Descriptive error message"
}
```

### Common Status Codes
- 400: Bad Request (invalid input)
- 401: Unauthorized (not authenticated)
- 403: Forbidden (insufficient permissions)
- 404: Not Found
- 500: Internal Server Error

### Error Examples

**Invalid Input:**
```json
{
  "error": "Missing required field: assessment_name"
}
```

**Unauthorized:**
```json
{
  "error": "Unauthorized"
}
```

**Forbidden:**
```json
{
  "error": "Admin access required"
}
```

---

## Rate Limiting

Current implementation: None (can be added via middleware)

Recommended limits:
- Authentication: 5 requests per minute per IP
- API: 100 requests per minute per user
- Report generation: 10 per hour per user

---

## Pagination

List endpoints support pagination:

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20, max: 100)

**Response includes:**
```json
{
  "items": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 147
  }
}
```

---

## Data Types

### Risk Levels
- `Critical`: 75-100
- `High`: 50-74
- `Medium`: 25-49
- `Low`: 0-24

### Industry Types
- Finance
- Healthcare
- Technology
- Government
- Retail
- Manufacturing
- Other

### Compliance Frameworks
- ISO27001
- NIST
- SOC2
- HIPAA
- PCI-DSS
- GDPR

---

## Webhooks (Future)

Planned webhook events:
- assessment.created
- assessment.completed
- risk_score.critical
- report.generated
- user.added
- user.removed

---

## SDK/Libraries

Currently available:
- JavaScript/TypeScript (via fetch)
- Python (via requests)

Future:
- Go
- Ruby
- PHP
