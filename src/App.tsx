/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  LayoutDashboard, 
  ShieldAlert, 
  ClipboardCheck, 
  FileText, 
  Database, 
  Building2, 
  LogOut,
  Shield,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  ChevronRight,
  Plus,
  Trash2,
  Upload,
  Download
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { Page, Organization, Asset, Vulnerability, AuditItem } from './types';
import { OWASP_TOP_10, NIST_CSF_ITEMS } from './constants';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('login');
  const [user, setUser] = useState<{ name: string } | null>(null);
  
  // State for the platform
  const [org, setOrg] = useState<Organization>({
    name: 'University Cyber Lab',
    industry: 'Education',
    size: '100-500',
    contactEmail: 'security@university.edu'
  });

  const [assets, setAssets] = useState<Asset[]>([
    { id: '1', name: 'Main Database Server', type: 'Hardware', criticality: 'Critical' },
    { id: '2', name: 'Student Portal', type: 'Software', criticality: 'High' },
    { id: '3', name: 'Research Data', type: 'Data', criticality: 'Critical' }
  ]);

  const [vulnerabilities, setVulnerabilities] = useState<Vulnerability[]>([]);
  
  const [auditItems, setAuditItems] = useState<AuditItem[]>(
    NIST_CSF_ITEMS.map(item => ({ ...item, status: 'Non-Compliant' }))
  );

  // Derived stats
  const complianceScore = useMemo(() => {
    const compliantCount = auditItems.filter(item => item.status === 'Compliant').length;
    const partialCount = auditItems.filter(item => item.status === 'Partially Compliant').length;
    return Math.round(((compliantCount + partialCount * 0.5) / auditItems.length) * 100);
  }, [auditItems]);

  const riskStats = useMemo(() => {
    return vulnerabilities.map(v => ({
      name: v.name.substring(0, 10) + '...',
      score: v.riskScore
    }));
  }, [vulnerabilities]);

  const auditStats = useMemo(() => {
    const categories = ['Identify', 'Protect', 'Detect', 'Respond', 'Recover'];
    return categories.map(cat => {
      const items = auditItems.filter(i => i.category === cat);
      const score = items.reduce((acc, curr) => {
        if (curr.status === 'Compliant') return acc + 1;
        if (curr.status === 'Partially Compliant') return acc + 0.5;
        return acc;
      }, 0);
      return { name: cat, score: Math.round((score / items.length) * 100) };
    });
  }, [auditItems]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setUser({ name: 'Admin User' });
    setCurrentPage('dashboard');
  };

  const addAsset = () => {
    const newAsset: Asset = {
      id: Math.random().toString(36).substr(2, 9),
      name: 'New Asset',
      type: 'Hardware',
      criticality: 'Medium'
    };
    setAssets([...assets, newAsset]);
  };

  const updateAsset = (id: string, field: keyof Asset, value: string) => {
    setAssets(assets.map(a => a.id === id ? { ...a, [field]: value } : a));
  };

  const removeAsset = (id: string) => {
    setAssets(assets.filter(a => a.id !== id));
  };

  const addVulnerability = () => {
    const newVuln: Vulnerability = {
      id: Math.random().toString(36).substr(2, 9),
      name: OWASP_TOP_10[0],
      likelihood: 3,
      impact: 3,
      riskScore: 9
    };
    setVulnerabilities([...vulnerabilities, newVuln]);
  };

  const updateVuln = (id: string, field: keyof Vulnerability, value: string | number) => {
    setVulnerabilities(vulnerabilities.map(v => {
      if (v.id === id) {
        const updated = { ...v, [field]: value };
        updated.riskScore = updated.likelihood * updated.impact;
        return updated;
      }
      return v;
    }));
  };

  const removeVuln = (id: string) => {
    setVulnerabilities(vulnerabilities.filter(v => v.id !== id));
  };

  const updateAuditStatus = (id: string, status: AuditItem['status']) => {
    setAuditItems(auditItems.map(item => item.id === id ? { ...item, status } : item));
  };

  if (currentPage === 'login') {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4 font-sans">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-2xl"
        >
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center border border-emerald-500/20">
              <Shield className="w-8 h-8 text-emerald-500" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white text-center mb-2">CyberAudit Pro</h1>
          <p className="text-zinc-400 text-center mb-8">University Prototype Platform</p>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1.5">Username</label>
              <input 
                type="text" 
                defaultValue="admin"
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1.5">Password</label>
              <input 
                type="password" 
                defaultValue="password"
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
              />
            </div>
            <button 
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-3 rounded-xl transition-colors shadow-lg shadow-emerald-900/20"
            >
              Sign In
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-xs text-zinc-500 uppercase tracking-widest">Demo Credentials: admin / password</p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-100 flex font-sans">
      {/* Sidebar */}
      <aside className="w-64 border-r border-zinc-800 flex flex-col fixed h-full bg-[#0a0a0a] z-10">
        <div className="p-6 flex items-center gap-3">
          <Shield className="w-6 h-6 text-emerald-500" />
          <span className="font-bold text-lg tracking-tight">CyberAudit</span>
        </div>
        
        <nav className="flex-1 px-4 space-y-1">
          <NavItem 
            active={currentPage === 'dashboard'} 
            onClick={() => setCurrentPage('dashboard')}
            icon={<LayoutDashboard size={20} />}
            label="Dashboard"
          />
          <NavItem 
            active={currentPage === 'profile'} 
            onClick={() => setCurrentPage('profile')}
            icon={<Building2 size={20} />}
            label="Organization"
          />
          <NavItem 
            active={currentPage === 'assets'} 
            onClick={() => setCurrentPage('assets')}
            icon={<Database size={20} />}
            label="Assets"
          />
          <NavItem 
            active={currentPage === 'risk'} 
            onClick={() => setCurrentPage('risk')}
            icon={<ShieldAlert size={20} />}
            label="Risk Assessment"
          />
          <NavItem 
            active={currentPage === 'audit'} 
            onClick={() => setCurrentPage('audit')}
            icon={<ClipboardCheck size={20} />}
            label="Security Audit"
          />
          <NavItem 
            active={currentPage === 'report'} 
            onClick={() => setCurrentPage('report')}
            icon={<FileText size={20} />}
            label="Audit Report"
          />
        </nav>

        <div className="p-4 border-t border-zinc-800">
          <div className="flex items-center gap-3 px-3 py-2 mb-4">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500 font-bold text-xs">
              AU
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">Admin User</p>
              <p className="text-xs text-zinc-500 truncate">Lead Auditor</p>
            </div>
          </div>
          <button 
            onClick={() => setCurrentPage('login')}
            className="w-full flex items-center gap-3 px-3 py-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-all"
          >
            <LogOut size={18} />
            <span className="text-sm">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
          >
            {currentPage === 'dashboard' && (
              <div className="space-y-8">
                <header>
                  <h2 className="text-3xl font-bold tracking-tight">Security Dashboard</h2>
                  <p className="text-zinc-400">Overview of your organization's security posture.</p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <StatCard 
                    label="Compliance Score" 
                    value={`${complianceScore}%`} 
                    subValue="NIST CSF Framework"
                    icon={<CheckCircle2 className="text-emerald-500" />}
                  />
                  <StatCard 
                    label="Active Risks" 
                    value={vulnerabilities.length.toString()} 
                    subValue="OWASP Top 10"
                    icon={<AlertTriangle className="text-amber-500" />}
                  />
                  <StatCard 
                    label="Total Assets" 
                    value={assets.length.toString()} 
                    subValue="Inventoried"
                    icon={<Database className="text-blue-500" />}
                  />
                  <StatCard 
                    label="Audit Status" 
                    value="In Progress" 
                    subValue="Last updated today"
                    icon={<Clock className="text-zinc-400" />}
                  />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                    <h3 className="text-lg font-semibold mb-6">Compliance by NIST Category</h3>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={auditStats}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                          <XAxis dataKey="name" stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
                          <YAxis stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '8px' }}
                            itemStyle={{ color: '#10b981' }}
                          />
                          <Bar dataKey="score" fill="#10b981" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                    <h3 className="text-lg font-semibold mb-6">Top Identified Risks</h3>
                    {vulnerabilities.length > 0 ? (
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={riskStats} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" horizontal={false} />
                            <XAxis type="number" stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis dataKey="name" type="category" stroke="#71717a" fontSize={10} tickLine={false} axisLine={false} width={80} />
                            <Tooltip 
                              contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '8px' }}
                              itemStyle={{ color: '#f59e0b' }}
                            />
                            <Bar dataKey="score" fill="#f59e0b" radius={[0, 4, 4, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    ) : (
                      <div className="h-64 flex items-center justify-center text-zinc-500 italic">
                        No risks identified yet.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {currentPage === 'profile' && (
              <div className="max-w-2xl space-y-8">
                <header>
                  <h2 className="text-3xl font-bold tracking-tight">Organization Profile</h2>
                  <p className="text-zinc-400">Define the scope of the security audit.</p>
                </header>

                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 space-y-6">
                  <div className="grid grid-cols-1 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-zinc-400 mb-2">Organization Name</label>
                      <input 
                        type="text" 
                        value={org.name}
                        onChange={(e) => setOrg({...org, name: e.target.value})}
                        className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-zinc-400 mb-2">Industry Sector</label>
                      <select 
                        value={org.industry}
                        onChange={(e) => setOrg({...org, industry: e.target.value})}
                        className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                      >
                        <option>Education</option>
                        <option>Finance</option>
                        <option>Healthcare</option>
                        <option>Technology</option>
                        <option>Government</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-zinc-400 mb-2">Organization Size</label>
                      <select 
                        value={org.size}
                        onChange={(e) => setOrg({...org, size: e.target.value})}
                        className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                      >
                        <option>1-10</option>
                        <option>11-100</option>
                        <option>101-500</option>
                        <option>501-2000</option>
                        <option>2000+</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-zinc-400 mb-2">Security Contact Email</label>
                      <input 
                        type="email" 
                        value={org.contactEmail}
                        onChange={(e) => setOrg({...org, contactEmail: e.target.value})}
                        className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                      />
                    </div>
                  </div>
                  <div className="pt-4">
                    <button className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2.5 rounded-xl font-medium transition-colors">
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            )}

            {currentPage === 'assets' && (
              <div className="space-y-8">
                <header className="flex justify-between items-end">
                  <div>
                    <h2 className="text-3xl font-bold tracking-tight">Asset Inventory</h2>
                    <p className="text-zinc-400">Manage hardware, software, and data assets.</p>
                  </div>
                  <button 
                    onClick={addAsset}
                    className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors"
                  >
                    <Plus size={18} />
                    Add Asset
                  </button>
                </header>

                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-zinc-800/50 border-bottom border-zinc-800">
                        <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-500">Asset Name</th>
                        <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-500">Type</th>
                        <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-500">Criticality</th>
                        <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-500 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800">
                      {assets.map((asset) => (
                        <tr key={asset.id} className="hover:bg-zinc-800/30 transition-colors">
                          <td className="px-6 py-4">
                            <input 
                              type="text" 
                              value={asset.name}
                              onChange={(e) => updateAsset(asset.id, 'name', e.target.value)}
                              className="bg-transparent border-none focus:ring-0 text-white w-full"
                            />
                          </td>
                          <td className="px-6 py-4">
                            <select 
                              value={asset.type}
                              onChange={(e) => updateAsset(asset.id, 'type', e.target.value as any)}
                              className="bg-zinc-800 border border-zinc-700 rounded-lg px-2 py-1 text-sm text-white focus:outline-none"
                            >
                              <option>Hardware</option>
                              <option>Software</option>
                              <option>Data</option>
                              <option>Personnel</option>
                            </select>
                          </td>
                          <td className="px-6 py-4">
                            <select 
                              value={asset.criticality}
                              onChange={(e) => updateAsset(asset.id, 'criticality', e.target.value as any)}
                              className={`rounded-lg px-2 py-1 text-xs font-bold uppercase ${
                                asset.criticality === 'Critical' ? 'bg-red-500/20 text-red-500' :
                                asset.criticality === 'High' ? 'bg-orange-500/20 text-orange-500' :
                                asset.criticality === 'Medium' ? 'bg-yellow-500/20 text-yellow-500' :
                                'bg-blue-500/20 text-blue-500'
                              }`}
                            >
                              <option className="bg-zinc-900">Low</option>
                              <option className="bg-zinc-900">Medium</option>
                              <option className="bg-zinc-900">High</option>
                              <option className="bg-zinc-900">Critical</option>
                            </select>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button 
                              onClick={() => removeAsset(asset.id)}
                              className="text-zinc-500 hover:text-red-500 transition-colors"
                            >
                              <Trash2 size={18} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {currentPage === 'risk' && (
              <div className="space-y-8">
                <header className="flex justify-between items-end">
                  <div>
                    <h2 className="text-3xl font-bold tracking-tight">Risk Assessment</h2>
                    <p className="text-zinc-400">Identify vulnerabilities and calculate risk scores.</p>
                  </div>
                  <button 
                    onClick={addVulnerability}
                    className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors"
                  >
                    <Plus size={18} />
                    Identify Vulnerability
                  </button>
                </header>

                <div className="grid grid-cols-1 gap-6">
                  {vulnerabilities.map((vuln) => (
                    <div key={vuln.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                      <div className="flex justify-between items-start mb-6">
                        <div className="flex-1 mr-4">
                          <select 
                            value={vuln.name}
                            onChange={(e) => updateVuln(vuln.id, 'name', e.target.value)}
                            className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2 text-white focus:outline-none"
                          >
                            {OWASP_TOP_10.map(item => <option key={item}>{item}</option>)}
                          </select>
                        </div>
                        <button 
                          onClick={() => removeVuln(vuln.id)}
                          className="text-zinc-500 hover:text-red-500 p-2"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div>
                          <label className="block text-sm font-medium text-zinc-400 mb-4">Likelihood (1-5)</label>
                          <input 
                            type="range" min="1" max="5" 
                            value={vuln.likelihood}
                            onChange={(e) => updateVuln(vuln.id, 'likelihood', parseInt(e.target.value))}
                            className="w-full accent-emerald-500"
                          />
                          <div className="flex justify-between text-xs text-zinc-500 mt-2">
                            <span>Rare</span>
                            <span>Likely</span>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-zinc-400 mb-4">Impact (1-5)</label>
                          <input 
                            type="range" min="1" max="5" 
                            value={vuln.impact}
                            onChange={(e) => updateVuln(vuln.id, 'impact', parseInt(e.target.value))}
                            className="w-full accent-emerald-500"
                          />
                          <div className="flex justify-between text-xs text-zinc-500 mt-2">
                            <span>Insignificant</span>
                            <span>Catastrophic</span>
                          </div>
                        </div>
                        <div className="bg-zinc-800/50 rounded-xl p-4 flex flex-col items-center justify-center border border-zinc-700">
                          <span className="text-xs uppercase tracking-widest text-zinc-500 mb-1">Risk Score</span>
                          <span className={`text-4xl font-black ${
                            vuln.riskScore >= 16 ? 'text-red-500' :
                            vuln.riskScore >= 9 ? 'text-orange-500' :
                            'text-yellow-500'
                          }`}>
                            {vuln.riskScore}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                  {vulnerabilities.length === 0 && (
                    <div className="bg-zinc-900 border border-zinc-800 border-dashed rounded-2xl p-12 text-center">
                      <ShieldAlert className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
                      <p className="text-zinc-500">No vulnerabilities identified yet. Click "Identify Vulnerability" to start.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {currentPage === 'audit' && (
              <div className="space-y-8">
                <header>
                  <h2 className="text-3xl font-bold tracking-tight">Security Audit Checklist</h2>
                  <p className="text-zinc-400">NIST Cybersecurity Framework (CSF) Audit.</p>
                </header>

                <div className="space-y-6">
                  {['Identify', 'Protect', 'Detect', 'Respond', 'Recover'].map((category) => (
                    <div key={category} className="space-y-4">
                      <h3 className="text-xl font-bold flex items-center gap-2">
                        <div className="w-2 h-6 bg-emerald-500 rounded-full" />
                        {category}
                      </h3>
                      <div className="grid grid-cols-1 gap-4">
                        {auditItems.filter(item => item.category === category).map((item) => (
                          <div key={item.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-xs font-mono text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded">{item.id}</span>
                              </div>
                              <p className="text-white font-medium">{item.requirement}</p>
                            </div>
                            
                            <div className="flex flex-wrap items-center gap-4">
                              <div className="flex items-center gap-2">
                                <button className="p-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-zinc-400 transition-colors" title="Upload Evidence">
                                  <Upload size={18} />
                                </button>
                                <span className="text-xs text-zinc-500">No evidence uploaded</span>
                              </div>
                              
                              <select 
                                value={item.status}
                                onChange={(e) => updateAuditStatus(item.id, e.target.value as any)}
                                className={`rounded-xl px-4 py-2 text-sm font-semibold focus:outline-none ${
                                  item.status === 'Compliant' ? 'bg-emerald-500/20 text-emerald-500 border border-emerald-500/30' :
                                  item.status === 'Partially Compliant' ? 'bg-amber-500/20 text-amber-500 border border-amber-500/30' :
                                  item.status === 'Non-Compliant' ? 'bg-red-500/20 text-red-500 border border-red-500/30' :
                                  'bg-zinc-800 text-zinc-400 border border-zinc-700'
                                }`}
                              >
                                <option className="bg-zinc-900">Compliant</option>
                                <option className="bg-zinc-900">Partially Compliant</option>
                                <option className="bg-zinc-900">Non-Compliant</option>
                                <option className="bg-zinc-900">Not Applicable</option>
                              </select>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {currentPage === 'report' && (
              <div className="space-y-8 max-w-4xl mx-auto">
                <header className="flex justify-between items-end">
                  <div>
                    <h2 className="text-3xl font-bold tracking-tight">Audit Report</h2>
                    <p className="text-zinc-400">Final security assessment summary.</p>
                  </div>
                  <button 
                    onClick={() => window.print()}
                    className="flex items-center gap-2 bg-zinc-100 hover:bg-white text-black px-4 py-2 rounded-xl text-sm font-bold transition-colors"
                  >
                    <Download size={18} />
                    Export PDF
                  </button>
                </header>

                <div className="bg-white text-black p-12 rounded-2xl shadow-2xl space-y-12 print:p-0 print:shadow-none">
                  <div className="flex justify-between items-start border-b-2 border-zinc-100 pb-8">
                    <div>
                      <h1 className="text-4xl font-black uppercase tracking-tighter mb-2">Security Audit Report</h1>
                      <p className="text-zinc-500 font-medium">Generated on {new Date().toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-xl">{org.name}</p>
                      <p className="text-zinc-500">{org.industry} Sector</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-8">
                    <div className="bg-zinc-50 p-6 rounded-2xl border border-zinc-100">
                      <p className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-1">Compliance Score</p>
                      <p className="text-4xl font-black text-emerald-600">{complianceScore}%</p>
                    </div>
                    <div className="bg-zinc-50 p-6 rounded-2xl border border-zinc-100">
                      <p className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-1">Identified Risks</p>
                      <p className="text-4xl font-black text-amber-600">{vulnerabilities.length}</p>
                    </div>
                    <div className="bg-zinc-50 p-6 rounded-2xl border border-zinc-100">
                      <p className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-1">Asset Count</p>
                      <p className="text-4xl font-black text-blue-600">{assets.length}</p>
                    </div>
                  </div>

                  <section className="space-y-6">
                    <h3 className="text-2xl font-bold border-b border-zinc-100 pb-2">Executive Summary</h3>
                    <p className="text-zinc-700 leading-relaxed">
                      The security audit for <strong>{org.name}</strong> was conducted based on the NIST Cybersecurity Framework and OWASP Top 10 standards. 
                      The organization currently maintains a compliance score of <strong>{complianceScore}%</strong>. 
                      Key areas of concern include <strong>{vulnerabilities.length}</strong> identified vulnerabilities that require immediate remediation.
                    </p>
                  </section>

                  <section className="space-y-6">
                    <h3 className="text-2xl font-bold border-b border-zinc-100 pb-2">Top Audit Findings</h3>
                    <div className="space-y-4">
                      {vulnerabilities.slice(0, 3).map((v, i) => (
                        <div key={v.id} className="flex gap-4 items-start">
                          <div className="w-8 h-8 rounded-full bg-zinc-900 text-white flex items-center justify-center font-bold flex-shrink-0">
                            {i + 1}
                          </div>
                          <div>
                            <p className="font-bold text-lg">{v.name}</p>
                            <p className="text-zinc-600">Risk Score: {v.riskScore} ({v.riskScore >= 16 ? 'Critical' : v.riskScore >= 9 ? 'High' : 'Medium'})</p>
                          </div>
                        </div>
                      ))}
                      {vulnerabilities.length === 0 && <p className="text-zinc-500 italic">No significant findings reported.</p>}
                    </div>
                  </section>

                  <div className="pt-12 border-t border-zinc-100 flex justify-between items-end">
                    <div>
                      <div className="w-48 h-12 border-b border-black mb-2" />
                      <p className="font-bold">Lead Auditor Signature</p>
                      <p className="text-zinc-500 text-sm">Admin User</p>
                    </div>
                    <div className="text-right text-zinc-400 text-xs">
                      <p>CyberAudit Pro v1.0</p>
                      <p>Internal Use Only</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

function NavItem({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
        active 
          ? 'bg-emerald-500/10 text-emerald-500 font-semibold' 
          : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
      }`}
    >
      {icon}
      <span className="text-sm">{label}</span>
      {active && <motion.div layoutId="activeNav" className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-500" />}
    </button>
  );
}

function StatCard({ label, value, subValue, icon }: { label: string, value: string, subValue: string, icon: React.ReactNode }) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 hover:border-zinc-700 transition-colors group">
      <div className="flex justify-between items-start mb-4">
        <span className="text-sm font-medium text-zinc-400">{label}</span>
        <div className="p-2 bg-zinc-800 rounded-lg group-hover:scale-110 transition-transform">
          {icon}
        </div>
      </div>
      <div className="space-y-1">
        <p className="text-3xl font-bold text-white">{value}</p>
        <p className="text-xs text-zinc-500 font-medium">{subValue}</p>
      </div>
    </div>
  );
}
