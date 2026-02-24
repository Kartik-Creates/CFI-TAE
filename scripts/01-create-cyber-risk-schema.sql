-- Create schema for cyber risk assessment
CREATE SCHEMA IF NOT EXISTS cyber_risk;

-- Threats table: pre-curated list of cyber threats
CREATE TABLE cyber_risk.threats (
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
  reference_links TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Risk Assessments
CREATE TABLE cyber_risk.assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL,
  assessment_name TEXT NOT NULL,
  description TEXT,
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'in_progress',
  overall_risk_score DECIMAL(5,2),
  compliance_frameworks TEXT[],
  industry TEXT
);

-- Assessment Responses
CREATE TABLE cyber_risk.assessment_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id UUID NOT NULL,
  threat_id UUID NOT NULL,
  question_index INTEGER NOT NULL,
  question TEXT NOT NULL,
  response_value INTEGER NOT NULL,
  evidence TEXT,
  mitigated_by TEXT,
  risk_level TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Risk Scores
CREATE TABLE cyber_risk.risk_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id UUID NOT NULL,
  threat_id UUID NOT NULL,
  threat_name TEXT NOT NULL,
  exposure_score DECIMAL(5,2),
  impact_score DECIMAL(5,2),
  likelihood_score DECIMAL(5,2),
  calculated_risk DECIMAL(5,2),
  relevance_score DECIMAL(5,2),
  risk_level TEXT,
  priority_rank INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Risk Mitigations
CREATE TABLE cyber_risk.mitigations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  risk_score_id UUID NOT NULL,
  mitigation_text TEXT NOT NULL,
  priority TEXT DEFAULT 'medium',
  estimated_effort TEXT,
  responsible_team TEXT,
  status TEXT DEFAULT 'not_started',
  due_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Threat Explanations
CREATE TABLE cyber_risk.threat_explanations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  risk_score_id UUID NOT NULL,
  explanation TEXT,
  relevance_reasoning TEXT,
  industry_context TEXT,
  created_by TEXT DEFAULT 'ai-assistant',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Reports
CREATE TABLE cyber_risk.reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id UUID NOT NULL,
  created_by UUID NOT NULL,
  report_type TEXT NOT NULL,
  file_format TEXT NOT NULL,
  file_path TEXT,
  generated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  scheduled_generation BOOLEAN DEFAULT FALSE,
  next_scheduled_date DATE,
  recurrence TEXT
);

-- Audit Logs
CREATE TABLE cyber_risk.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL,
  user_id UUID,
  action TEXT NOT NULL,
  entity_type TEXT,
  entity_id UUID,
  changes JSONB,
  ip_address INET,
  user_agent TEXT,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
