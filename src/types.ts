export type Page = 'login' | 'dashboard' | 'profile' | 'assets' | 'risk' | 'audit' | 'report';

export interface Organization {
  name: string;
  industry: string;
  size: string;
  contactEmail: string;
}

export interface Asset {
  id: string;
  name: string;
  type: 'Hardware' | 'Software' | 'Data' | 'Personnel';
  criticality: 'Low' | 'Medium' | 'High' | 'Critical';
}

export interface Vulnerability {
  id: string;
  name: string;
  likelihood: number; // 1-5
  impact: number; // 1-5
  riskScore: number;
}

export interface AuditItem {
  id: string;
  category: 'Identify' | 'Protect' | 'Detect' | 'Respond' | 'Recover';
  requirement: string;
  status: 'Compliant' | 'Partially Compliant' | 'Non-Compliant' | 'Not Applicable';
  evidence?: string;
}
