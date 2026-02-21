import { AuditItem } from './types';

export const OWASP_TOP_10 = [
  "A01:2021-Broken Access Control",
  "A02:2021-Cryptographic Failures",
  "A03:2021-Injection",
  "A04:2021-Insecure Design",
  "A05:2021-Security Misconfiguration",
  "A06:2021-Vulnerable and Outdated Components",
  "A07:2021-Identification and Authentication Failures",
  "A08:2021-Software and Data Integrity Failures",
  "A09:2021-Security Logging and Monitoring Failures",
  "A10:2021-Server-Side Request Forgery"
];

export const NIST_CSF_ITEMS: Omit<AuditItem, 'status'>[] = [
  { id: 'ID.AM-1', category: 'Identify', requirement: 'Physical devices and systems within the organization are inventoried.' },
  { id: 'ID.RA-1', category: 'Identify', requirement: 'Asset vulnerabilities are identified and documented.' },
  { id: 'PR.AC-1', category: 'Protect', requirement: 'Identities and credentials are managed and protected.' },
  { id: 'PR.DS-1', category: 'Protect', requirement: 'Data-at-rest is protected.' },
  { id: 'DE.AE-1', category: 'Detect', requirement: 'A baseline of network operations and expected data flows is established.' },
  { id: 'DE.CM-1', category: 'Detect', requirement: 'The network is monitored to detect potential cybersecurity events.' },
  { id: 'RS.RP-1', category: 'Respond', requirement: 'Response processes and procedures are maintained and tested.' },
  { id: 'RS.CO-1', category: 'Respond', requirement: 'Personnel know their roles and order of operations when a response is needed.' },
  { id: 'RC.RP-1', category: 'Recover', requirement: 'Recovery planning and processes are improved based on lessons learned.' },
  { id: 'RC.CO-1', category: 'Recover', requirement: 'Public relations are managed and reputation is repaired after an incident.' },
];
