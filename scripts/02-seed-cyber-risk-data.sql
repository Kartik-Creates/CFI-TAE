-- Insert seed data: sample threats
INSERT INTO cyber_risk.threats (threat_id, name, description, category, severity_base_score, attack_vector, privileges_required, impact_confidentiality, impact_integrity, impact_availability, affected_systems, mitigation_recommendations, reference_links) 
VALUES
('THREAT_001', 'Ransomware Attack', 'Malware that encrypts critical files and demands payment for decryption', 'malware', 9.5, 'Network', 'Low', 'High', 'High', 'High', ARRAY['file_servers', 'databases', 'workstations'], ARRAY['Implement offline backups', 'Deploy EDR solutions', 'Network segmentation'], ARRAY['https://www.cisa.gov/ransomware']);

INSERT INTO cyber_risk.threats (threat_id, name, description, category, severity_base_score, attack_vector, privileges_required, impact_confidentiality, impact_integrity, impact_availability, affected_systems, mitigation_recommendations, reference_links) 
VALUES
('THREAT_002', 'SQL Injection', 'Attackers inject malicious SQL to compromise databases', 'vulnerability', 8.5, 'Network', 'None', 'High', 'High', 'High', ARRAY['web_applications', 'databases'], ARRAY['Use parameterized queries', 'Input validation', 'WAF deployment'], ARRAY['https://owasp.org/www-community/attacks/SQL_Injection']);

INSERT INTO cyber_risk.threats (threat_id, name, description, category, severity_base_score, attack_vector, privileges_required, impact_confidentiality, impact_integrity, impact_availability, affected_systems, mitigation_recommendations, reference_links) 
VALUES
('THREAT_003', 'Phishing Campaign', 'Social engineering attacks via email to steal credentials', 'attack', 7.0, 'Adjacent Network', 'None', 'High', 'None', 'None', ARRAY['user_workstations', 'email'], ARRAY['Security awareness training', 'Email filtering', 'MFA implementation'], ARRAY['https://www.phishlabs.com']);

INSERT INTO cyber_risk.threats (threat_id, name, description, category, severity_base_score, attack_vector, privileges_required, impact_confidentiality, impact_integrity, impact_availability, affected_systems, mitigation_recommendations, reference_links) 
VALUES
('THREAT_004', 'Unpatched Systems', 'Known vulnerabilities in outdated software', 'vulnerability', 8.0, 'Network', 'Low', 'High', 'High', 'High', ARRAY['servers', 'workstations', 'applications'], ARRAY['Patch management program', 'Vulnerability scanning'], ARRAY['https://www.cisa.gov/known-exploited-vulnerabilities']);

INSERT INTO cyber_risk.threats (threat_id, name, description, category, severity_base_score, attack_vector, privileges_required, impact_confidentiality, impact_integrity, impact_availability, affected_systems, mitigation_recommendations, reference_links) 
VALUES
('THREAT_005', 'Weak Access Controls', 'Inadequate user authentication and authorization', 'policy', 7.5, 'Network', 'None', 'High', 'High', 'High', ARRAY['all_systems'], ARRAY['Implement MFA', 'IAM system', 'Regular access reviews'], ARRAY['https://csrc.nist.gov/publications/detail/sp/800-63/3']);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION cyber_risk.update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers
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
