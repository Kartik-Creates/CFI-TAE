-- Add foreign key constraints to cyber_risk tables

ALTER TABLE cyber_risk.assessments 
ADD CONSTRAINT fk_assessments_org FOREIGN KEY (organization_id) REFERENCES neon_auth.organization(id) ON DELETE CASCADE;

ALTER TABLE cyber_risk.assessments 
ADD CONSTRAINT fk_assessments_user FOREIGN KEY (created_by) REFERENCES neon_auth.user(id);

ALTER TABLE cyber_risk.assessment_responses 
ADD CONSTRAINT fk_responses_assessment FOREIGN KEY (assessment_id) REFERENCES cyber_risk.assessments(id) ON DELETE CASCADE;

ALTER TABLE cyber_risk.assessment_responses 
ADD CONSTRAINT fk_responses_threat FOREIGN KEY (threat_id) REFERENCES cyber_risk.threats(id);

ALTER TABLE cyber_risk.risk_scores 
ADD CONSTRAINT fk_risk_scores_assessment FOREIGN KEY (assessment_id) REFERENCES cyber_risk.assessments(id) ON DELETE CASCADE;

ALTER TABLE cyber_risk.risk_scores 
ADD CONSTRAINT fk_risk_scores_threat FOREIGN KEY (threat_id) REFERENCES cyber_risk.threats(id);

ALTER TABLE cyber_risk.mitigations 
ADD CONSTRAINT fk_mitigations_risk_score FOREIGN KEY (risk_score_id) REFERENCES cyber_risk.risk_scores(id) ON DELETE CASCADE;

ALTER TABLE cyber_risk.threat_explanations 
ADD CONSTRAINT fk_explanations_risk_score FOREIGN KEY (risk_score_id) REFERENCES cyber_risk.risk_scores(id) ON DELETE CASCADE;

ALTER TABLE cyber_risk.reports 
ADD CONSTRAINT fk_reports_assessment FOREIGN KEY (assessment_id) REFERENCES cyber_risk.assessments(id) ON DELETE CASCADE;

ALTER TABLE cyber_risk.reports 
ADD CONSTRAINT fk_reports_user FOREIGN KEY (created_by) REFERENCES neon_auth.user(id);

ALTER TABLE cyber_risk.audit_logs 
ADD CONSTRAINT fk_audit_org FOREIGN KEY (organization_id) REFERENCES neon_auth.organization(id) ON DELETE CASCADE;

ALTER TABLE cyber_risk.audit_logs 
ADD CONSTRAINT fk_audit_user FOREIGN KEY (user_id) REFERENCES neon_auth.user(id);
