import React, { useState } from 'react';
import './index.css';
import ReverseInterviewEngine from './ReverseInterviewEngine';

const App = () => {
  const [activeTab, setActiveTab] = useState('reverse_interview');

  return (
    <div className="app-container" style={{ display: 'flex', width: '100%', height: '100%' }}>
      {/* Sidebar */}
      <aside className="glass-panel" style={{ width: '280px', margin: '16px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div className="brand" style={{ marginBottom: '16px' }}>
          <h1 className="text-gradient" style={{ fontSize: '24px', margin: 0, letterSpacing: '-0.5px' }}>AGENT_KUMAR</h1>
          <div style={{ fontSize: '12px', color: 'var(--accent-primary)', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--accent-primary)' }} className="animate-pulse"></span>
            SYSTEM ONLINE V2.5
          </div>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <NavItem 
            icon={<TerminalIcon />} 
            label="Digital Twin" 
            isActive={activeTab === 'twin'} 
            onClick={() => window.open('https://resume-rewrite-production.up.railway.app/', '_blank')} 
          />
          <NavItem 
            icon={<RadarIcon />} 
            label="Match Engine" 
            isActive={activeTab === 'reverse_interview'} 
            onClick={() => setActiveTab('reverse_interview')} 
          />
          <NavItem 
            icon={<NetworkIcon />} 
            label="Architecture" 
            isActive={activeTab === 'architecture'} 
            onClick={() => setActiveTab('architecture')} 
          />
          <NavItem 
            icon={<RocketIcon />} 
            label="Deploy Me" 
            isActive={activeTab === 'deploy'} 
            onClick={() => setActiveTab('deploy')} 
          />
        </nav>

        <div style={{ marginTop: 'auto', borderTop: '1px solid var(--border-color)', paddingTop: '24px' }}>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
            CHIEF AI ARCHITECT<br/>
            SBI CARD | GURGAON
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main style={{ flex: 1, margin: '16px 16px 16px 0', position: 'relative' }}>
        {activeTab === 'reverse_interview' && <ReverseInterviewEngine />}
        {activeTab !== 'reverse_interview' && (
          <div className="glass-panel" style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <h2 style={{ color: 'var(--text-secondary)' }}>Module "{activeTab}" coming soon.</h2>
          </div>
        )}
      </main>
    </div>
  );
};

// Simple Icon Components
const TerminalIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="4 17 10 11 4 5"></polyline><line x1="12" y1="19" x2="20" y2="19"></line></svg>;
const RadarIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle><line x1="12" y1="12" x2="19" y2="5"></line></svg>;
const NetworkIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="16" y="16" width="6" height="6" rx="1"></rect><rect x="2" y="16" width="6" height="6" rx="1"></rect><rect x="9" y="2" width="6" height="6" rx="1"></rect><path d="M5 16v-3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3"></path><path d="M12 12V8"></path></svg>;
const RocketIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"></path><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"></path><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"></path><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"></path></svg>;

const NavItem = ({ icon, label, isActive, onClick }: any) => {
  return (
    <div 
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '12px 16px',
        borderRadius: '8px',
        cursor: 'pointer',
        background: isActive ? 'rgba(0, 255, 204, 0.1)' : 'transparent',
        border: isActive ? '1px solid rgba(0, 255, 204, 0.3)' : '1px solid transparent',
        color: isActive ? 'var(--accent-primary)' : 'var(--text-secondary)',
        transition: 'all 0.2s ease'
      }}
      onMouseEnter={(e) => {
        if (!isActive) e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
      }}
      onMouseLeave={(e) => {
        if (!isActive) e.currentTarget.style.background = 'transparent';
      }}
    >
      {icon}
      <span style={{ fontWeight: 500 }}>{label}</span>
    </div>
  );
};

export default App;
