# Quick Start Guide

## Getting Started

### 1. Access the Application

Once deployed to Vercel, navigate to your deployment URL.

### 2. Create an Account

1. Click "Sign Up"
2. Enter your email and password
3. Click "Create Account"
4. You're automatically logged in and assigned to a new organization

### 3. Create Your First Assessment

1. From the dashboard, click "New Assessment"
2. **Step 1 - Assessment Details:**
   - Name: Give your assessment a meaningful name (e.g., "Q1 2024 Security Review")
   - Industry: Select your industry (Finance, Healthcare, Tech, etc.)
   - Compliance Frameworks: Check relevant frameworks (ISO 27001, NIST, SOC2, etc.)
   - Description: Add context about your organization

3. **Step 2 - Evaluate Threats:**
   - For each threat, rate your exposure from 0-5:
     - 0 = No exposure (not applicable)
     - 1 = Very low exposure
     - 2 = Low exposure
     - 3 = Medium exposure
     - 4 = High exposure
     - 5 = Very high exposure (critical)
   - Provide evidence for your ratings in the "Evidence" field
   - Note any existing mitigations

4. **Step 3 - Review & Submit:**
   - Review your ratings
   - Click "Submit Assessment"
   - System calculates risk scores automatically

### 4. Review Assessment Results

1. On the assessment details page, you'll see:
   - **Overall Risk Score** (0-100)
   - **Risk Distribution Chart** showing threat severity
   - **Individual Threat Cards** with:
     - Risk score and level (Critical/High/Medium/Low)
     - Exposure, Impact, and Likelihood scores
     - Color-coded severity indicator

### 5. Generate AI Explanations

1. Click "Actions" tab
2. Click "Generate Explanations"
3. System uses OpenAI to create:
   - Threat explanation in plain language
   - Industry-specific relevance analysis
   - Compliance impact assessment

### 6. Export Report

1. Click "Actions" tab
2. Select export format:
   - **CSV**: For spreadsheet analysis
   - **JSON**: For programmatic integration
   - **HTML**: For sharing and printing

### 7. Manage Users (Admin Only)

1. Go to "Admin" from sidebar
2. **Users Tab:**
   - View all organization members
   - Promote users to admin
   - Remove users from organization

3. **Audit Logs Tab:**
   - See all system activity
   - Track who created/modified assessments
   - Monitor user actions

### 8. Account Settings

1. Go to "Settings" from sidebar
2. **Account:**
   - View email and organization ID
   - Logout

3. **Security:**
   - Change password
   - View active sessions

4. **Notifications:**
   - Configure alerts (Critical/Weekly/etc.)
   - Choose notification methods

## Key Features Explained

### Risk Scoring

The system calculates risk using three factors:

```
Exposure Score: Your organization's exposure to the threat
Impact Score: Potential damage if compromised (CVSS-based)
Likelihood Score: Probability of occurrence given exposure

Overall Risk = (Exposure × Impact × Likelihood) / 100
```

### Risk Levels

- **Critical (75-100):** Immediate action required
- **High (50-74):** Address within 30 days
- **Medium (25-49):** Plan mitigation within 90 days
- **Low (0-24):** Monitor and document

### AI-Powered Analysis

For each threat, the system generates:
- **Explanation:** Why the threat matters
- **Industry Context:** How it affects your sector
- **Relevance Reasoning:** Why it's relevant to your organization

### Reports

Generate comprehensive risk reports in multiple formats:
- **CSV:** Import into Excel for analysis
- **JSON:** Integrate with other tools
- **HTML:** Share with stakeholders

## Workflow Example

### Scenario: Financial Institution

1. **Create Assessment**
   - Name: "Bank Security Audit Q1 2024"
   - Industry: Finance
   - Frameworks: SOC2, PCI-DSS, NIST

2. **Evaluate Threats**
   - Data Breach: Rate 4 (high exposure)
   - Ransomware: Rate 5 (critical)
   - DDoS: Rate 2 (low exposure)
   - Insider Threat: Rate 3 (medium exposure)

3. **Generate Report**
   - Export as CSV for stakeholder review
   - Use to prioritize security investments

4. **AI Analysis**
   - Get compliance-specific explanations
   - Understand impact on PCI-DSS requirements
   - Identify high-risk gaps

5. **Track Progress**
   - Monthly reassessments
   - Monitor risk score improvements
   - Share audit logs with compliance team

## Tips & Best Practices

### Assessment Tips
- Be honest in threat ratings - they drive your risk score
- Document evidence for each threat
- Note existing controls that mitigate risks
- Update assessments quarterly

### Organization Tips
- Add team members as needed
- Promote security-focused users to admin
- Review audit logs monthly
- Archive old assessments annually

### Report Tips
- Use JSON for detailed analysis
- Use CSV for stakeholder sharing
- Use HTML for executive briefings
- Generate before/after reports for comparison

## Common Questions

**Q: How often should I do assessments?**
A: Quarterly is recommended. Do ad-hoc assessments when:
- Major changes to infrastructure
- After a security incident
- Compliance audit preparation

**Q: What if I don't know a threat's exposure?**
A: Start with medium (3) and research the threat. You can edit assessments anytime.

**Q: Can I compare old and new assessments?**
A: Export both as CSV and use spreadsheet formulas to compare trend over time.

**Q: Are reports confidential?**
A: Yes. All data is encrypted and stored securely. Only your organization users can access it.

**Q: Can I integrate with other tools?**
A: Yes, use the JSON export to integrate with security tools, dashboards, or ticketing systems.

## Support

For issues:
1. Check assessment data for accuracy
2. Verify threat ratings are reasonable
3. Review audit logs to track changes
4. Contact system administrator for access issues

## Next Steps

- [ ] Create your first assessment
- [ ] Evaluate your organization's threats
- [ ] Generate AI explanations
- [ ] Export report for stakeholders
- [ ] Add team members
- [ ] Schedule monthly assessments
- [ ] Set up audit log reviews
