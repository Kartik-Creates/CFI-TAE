-- Create schema for cyber risk assessment
CREATE SCHEMA IF NOT EXISTS cyber_risk;

-- Threats table: pre-curated list of cyber threats
CREATE TABLE IF NOT EXISTS cyber_risk.threats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  threat_id TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  severity_base_score DECIMAL(3,1) NOT NULL DEFAULT 5.0,
  attack_vector TEXT,
  attack_complexity TEXT,
  privileges_required TEXT,
  user_interaction TEXT,
  scope TEXT,
  impact_confidentiality TEXT,
  impact_integrity TEXT,
  impact_availability TEXT,
  affected_systems TEXT[],
  mitigation_recommendations TEXT[],
  references TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Risk Assessments: records of completed assessments
CREATE TABLE IF NOT EXISTS cyber_risk.assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES neon_auth.organization(id) ON DELETE CASCADE,
  assessment_name TEXT NOT NULL,
  description TEXT,
  created_by UUID NOT NULL REFERENCES neon_auth.user(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'in_progress',
  overall_risk_score DECIMAL(5,2),
  compliance_frameworks TEXT[],
  industry TEXT
);

-- Assessment Responses: individual threat responses during assessment
CREATE TABLE IF NOT EXISTS cyber_risk.assessment_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id UUID NOT NULL REFERENCES cyber_risk.assessments(id) ON DELETE CASCADE,
  threat_id UUID NOT NULL REFERENCES cyber_risk.threats(id),
  question_index INTEGER NOT NULL,
  question TEXT NOT NULL,
  response_value INTEGER NOT NULL,
  evidence TEXT,
  mitigated_by TEXT,
  risk_level TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Risk Scores: calculated scores for each threat per assessment
CREATE TABLE IF NOT EXISTS cyber_risk.risk_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id UUID NOT NULL REFERENCES cyber_risk.assessments(id) ON DELETE CASCADE,
  threat_id UUID NOT NULL REFERENCES cyber_risk.threats(id),
  threat_name TEXT NOT NULL,
  exposure_score DECIMAL(5,2),
  impact_score DECIMAL(5,2),
  likelihood_score DECIMAL(5,2),
  calculated_risk DECIMAL(5,2),
  relevance_score DECIMAL(5,2),
  risk_level TEXT,
  priority_rank INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(assessment_id, threat_id)
);

-- Risk Mitigations: recommended actions
CREATE TABLE IF NOT EXISTS cyber_risk.mitigations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  risk_score_id UUID NOT NULL REFERENCES cyber_risk.risk_scores(id) ON DELETE CASCADE,
  mitigation_text TEXT NOT NULL,
  priority TEXT DEFAULT 'medium',
  estimated_effort TEXT,
  responsible_team TEXT,
  status TEXT DEFAULT 'not_started',
  due_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Threat Explanations: AI-generated explanations for threats
CREATE TABLE IF NOT EXISTS cyber_risk.threat_explanations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  risk_score_id UUID NOT NULL REFERENCES cyber_risk.risk_scores(id) ON DELETE CASCADE,
  explanation TEXT,
  relevance_reasoning TEXT,
  industry_context TEXT,
  created_by TEXT DEFAULT 'ai-assistant',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Reports: generated risk reports
CREATE TABLE IF NOT EXISTS cyber_risk.reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id UUID NOT NULL REFERENCES cyber_risk.assessments(id) ON DELETE CASCADE,
  created_by UUID NOT NULL REFERENCES neon_auth.user(id),
  report_type TEXT NOT NULL,
  file_format TEXT NOT NULL,
  file_path TEXT,
  generated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  scheduled_generation BOOLEAN DEFAULT FALSE,
  next_scheduled_date DATE,
  recurrence TEXT
);

-- Audit Logs: track all user actions
CREATE TABLE IF NOT EXISTS cyber_risk.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES neon_auth.organization(id) ON DELETE CASCADE,
  user_id UUID REFERENCES neon_auth.user(id),
  action TEXT NOT NULL,
  entity_type TEXT,
  entity_id UUID,
  changes JSONB,
  ip_address INET,
  user_agent TEXT,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX idx_assessments_org_id ON cyber_risk.assessments(organization_id);
CREATE INDEX idx_assessments_status ON cyber_risk.assessments(status);
CREATE INDEX idx_risk_scores_assessment_id ON cyber_risk.risk_scores(assessment_id);
CREATE INDEX idx_risk_scores_threat_id ON cyber_risk.risk_scores(threat_id);
CREATE INDEX idx_assessment_responses_assessment_id ON cyber_risk.assessment_responses(assessment_id);
CREATE INDEX idx_mitigations_status ON cyber_risk.mitigations(status);
CREATE INDEX idx_audit_logs_org_id ON cyber_risk.audit_logs(organization_id);
CREATE INDEX idx_audit_logs_timestamp ON cyber_risk.audit_logs(timestamp);
CREATE INDEX idx_threats_category ON cyber_risk.threats(category);

-- Insert seed data: sample threats
INSERT INTO cyber_risk.threats (threat_id, name, description, category, severity_base_score, attack_vector, privileges_required, impact_confidentiality, impact_integrity, impact_availability, affected_systems, mitigation_recommendations, references) VALUES
('THREAT_001', 'Ransomware Attack', 'Malware that encrypts critical files and demands payment for decryption', 'malware', 9.5, 'Network', 'Low', 'High', 'High', 'High', ARRAY['file_servers', 'databases', 'workstations'], ARRAY['Implement offline backups', 'Deploy EDR solutions', 'Network segmentation'], ARRAY['https://www.cisa.gov/ransomware']);

INSERT INTO cyber_risk.threats (threat_id, name, description, category, severity_base_score, attack_vector, privileges_required, impact_confidentiality, impact_integrity, impact_availability, affected_systems, mitigation_recommendations, references) VALUES
('THREAT_002', 'SQL Injection', 'Attackers inject malicious SQL to compromise databases', 'vulnerability', 8.5, 'Network', 'None', 'High', 'High', 'High', ARRAY['web_applications', 'databases'], ARRAY['Use parameterized queries', 'Input validation', 'WAF deployment'], ARRAY['https://owasp.org/www-community/attacks/SQL_Injection']);

INSERT INTO cyber_risk.threats (threat_id, name, description, category, severity_base_score, attack_vector, privileges_required, impact_confidentiality, impact_integrity, impact_availability, affected_systems, mitigation_recommendations, references) VALUES
('THREAT_003', 'Phishing Campaign', 'Social engineering attacks via email to steal credentials', 'attack', 7.0, 'Adjacent Network', 'None', 'High', 'None', 'None', ARRAY['user_workstations', 'email'], ARRAY['Security awareness training', 'Email filtering', 'MFA implementation'], ARRAY['https://www.phishlabs.com']);

INSERT INTO cyber_risk.threats (threat_id, name, description, category, severity_base_score, attack_vector, privileges_required, impact_confidentiality, impact_integrity, impact_availability, affected_systems, mitigation_recommendations, references) VALUES
('THREAT_004', 'Unpatched Systems', 'Known vulnerabilities in outdated software', 'vulnerability', 8.0, 'Network', 'Low', 'High', 'High', 'High', ARRAY['servers', 'workstations', 'applications'], ARRAY['Patch management program', 'Vulnerability scanning'], ARRAY['https://www.cisa.gov/known-exploited-vulnerabilities']);

INSERT INTO cyber_risk.threats (threat_id, name, description, category, severity_base_score, attack_vector, privileges_required, impact_confidentiality, impact_integrity, impact_availability, affected_systems, mitigation_recommendations, references) VALUES
('THREAT_005', 'Weak Access Controls', 'Inadequate user authentication and authorization', 'policy', 7.5, 'Network', 'None', 'High', 'High', 'High', ARRAY['all_systems'], ARRAY['Implement MFA', 'IAM system', 'Regular access reviews'], ARRAY['https://csrc.nist.gov/publications/detail/sp/800-63/3']);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION cyber_risk.update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers to tables with updated_at
CREATE TRIGGER threats_update_timestamp BEFORE UPDATE ON cyber_risk.threats
FOR EACH ROW EXECUTE FUNCTION cyber_risk.update_timestamp();

CREATE TRIGGER assessments_update_timestamp BEFORE UPDATE ON cyber_risk.assessments
FOR EACH ROW EXECUTE FUNCTION cyber_risk.update_timestamp();

CREATE TRIGGER assessment_responses_update_timestamp BEFORE UPDATE ON cyber_risk.assessment_responses
FOR EACH ROW EXECUTE FUNCTION cyber_risk.update_timestamp();

CREATE TRIGGER risk_scores_update_timestamp BEFORE UPDATE ON cyber_risk.risk_scores
FOR EACH ROW EXECUTE FUNCTION cyber_risk.update_timestamp();

CREATE TRIGGER mitigations_update_timestamp BEFORE UPDATE ON cyber_risk.mitigations
FOR EACH ROW EXECUTE FUNCTION cyber_risk.update_timestamp();
