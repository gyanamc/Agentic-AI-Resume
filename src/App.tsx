import { useState } from 'react';
import './index.css';
import './App.css';
import ReverseInterviewEngine from './ReverseInterviewEngine';
import ArchitectureDiagram from './ArchitectureDiagram';
import heroImg from './assets/hero.png';

const App = () => {
  const [activeTab, setActiveTab] = useState('architecture');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="app-container">
      {/* Mobile Header */}
      <header className="mobile-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img src={heroImg} alt="Kumar Gyanam" className="mobile-avatar" />
          <div>
            <h1 className="text-gradient" style={{ fontSize: '16px', margin: 0 }}>KUMAR GYANAM</h1>
            <div style={{ fontSize: '10px', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: 'var(--accent-primary)' }} className="animate-pulse"></span>
              SYSTEM ONLINE V2.5
            </div>
          </div>
        </div>
        <button className="hamburger" onClick={() => setSidebarOpen(!sidebarOpen)} aria-label="Toggle menu">
          {sidebarOpen ? '✕' : '☰'}
        </button>
      </header>

      {/* Mobile Drawer Overlay */}
      {sidebarOpen && (
        <div className="drawer-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`glass-panel sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <div className="brand">
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <img src={heroImg} alt="Kumar Gyanam" style={{ width: '64px', height: '64px', borderRadius: '50%', border: '2px solid var(--accent-primary)', objectFit: 'cover' }} />
            <div>
              <h1 className="text-gradient" style={{ fontSize: '20px', margin: 0, letterSpacing: '-0.5px' }}>KUMAR GYANAM</h1>
              <div style={{ fontSize: '11px', color: 'var(--accent-primary)', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--accent-primary)' }} className="animate-pulse"></span>
                SYSTEM ONLINE V2.5
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
            <a href="/Kumar_Gyanam_Resume.pdf" download style={{ flex: 1, padding: '8px', background: 'rgba(0, 255, 204, 0.1)', border: '1px solid var(--accent-primary)', color: 'var(--accent-primary)', borderRadius: '6px', textAlign: 'center', textDecoration: 'none', fontSize: '12px', fontWeight: 'bold', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px', transition: 'all 0.2s' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
              Resume
            </a>
            <a href="https://www.linkedin.com/in/kumar-gyanam/" target="_blank" rel="noreferrer" style={{ padding: '8px 12px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', borderRadius: '6px', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
            </a>
          </div>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <NavItem
            icon={<TerminalIcon />}
            label="Digital Twin"
            isActive={activeTab === 'twin'}
            onClick={() => { window.open('https://resume-rewrite-production.up.railway.app/', '_blank'); setSidebarOpen(false); }}
          />
          <NavItem
            icon={<RadarIcon />}
            label="Match Engine"
            isActive={activeTab === 'reverse_interview'}
            onClick={() => { setActiveTab('reverse_interview'); setSidebarOpen(false); }}
          />
          <NavItem
            icon={<NetworkIcon />}
            label="Architecture"
            isActive={activeTab === 'architecture'}
            onClick={() => { setActiveTab('architecture'); setSidebarOpen(false); }}
          />
          <NavItem
            icon={<RocketIcon />}
            label="Deploy Me"
            isActive={activeTab === 'deploy'}
            onClick={() => { setActiveTab('deploy'); setSidebarOpen(false); }}
          />
        </nav>

        <div style={{ marginTop: 'auto', borderTop: '1px solid var(--border-color)', paddingTop: '24px' }}>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
            CHIEF AI ARCHITECT<br />
            SBI CARD | GURGAON
          </div>
          <div style={{ marginTop: '16px' }}>
            <input
              type="file"
              id="masterCvInput"
              accept="application/pdf"
              style={{ display: 'none' }}
              onChange={async (e) => {
                if (e.target.files && e.target.files[0]) {
                  const formData = new FormData();
                  formData.append('file', e.target.files[0]);
                  try {
                    const res = await fetch('/api/upload_cv', { method: 'POST', body: formData });
                    if (res.ok) alert('Master CV Updated Successfully!');
                    else alert('Failed to update CV');
                  } catch (err) { alert('Error uploading CV'); }
                }
              }}
            />
            <button
              onClick={() => document.getElementById('masterCvInput')?.click()}
              style={{ background: 'transparent', border: '1px dashed var(--border-color)', color: 'var(--text-secondary)', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '11px', width: '100%' }}>
              ⚙️ Update Master CV
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="main-content">
        {activeTab === 'reverse_interview' && <ReverseInterviewEngine />}
        {activeTab === 'architecture' && <ArchitectureDiagram />}
        {activeTab !== 'reverse_interview' && activeTab !== 'architecture' && (
          <div className="glass-panel" style={{ height: '100%', minHeight: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <h2 style={{ color: 'var(--text-secondary)' }}>Module "{activeTab}" coming soon.</h2>
          </div>
        )}
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="mobile-bottom-nav">
        <MobileNavItem icon={<TerminalIcon />} label="Twin" isActive={activeTab === 'twin'} onClick={() => window.open('https://resume-rewrite-production.up.railway.app/', '_blank')} />
        <MobileNavItem icon={<RadarIcon />} label="Match" isActive={activeTab === 'reverse_interview'} onClick={() => setActiveTab('reverse_interview')} />
        <MobileNavItem icon={<NetworkIcon />} label="Arch" isActive={activeTab === 'architecture'} onClick={() => setActiveTab('architecture')} />
        <MobileNavItem icon={<RocketIcon />} label="Deploy" isActive={activeTab === 'deploy'} onClick={() => setActiveTab('deploy')} />
      </nav>
    </div>
  );
};

// Icon Components
const TerminalIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="4 17 10 11 4 5"></polyline><line x1="12" y1="19" x2="20" y2="19"></line></svg>;
const RadarIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle><line x1="12" y1="12" x2="19" y2="5"></line></svg>;
const NetworkIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="16" y="16" width="6" height="6" rx="1"></rect><rect x="2" y="16" width="6" height="6" rx="1"></rect><rect x="9" y="2" width="6" height="6" rx="1"></rect><path d="M5 16v-3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3"></path><path d="M12 12V8"></path></svg>;
const RocketIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"></path><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"></path><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"></path><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"></path></svg>;

const NavItem = ({ icon, label, isActive, onClick }: any) => (
  <div
    onClick={onClick}
    style={{
      display: 'flex', alignItems: 'center', gap: '12px',
      padding: '12px 16px', borderRadius: '8px', cursor: 'pointer',
      background: isActive ? 'rgba(0, 255, 204, 0.1)' : 'transparent',
      border: isActive ? '1px solid rgba(0, 255, 204, 0.3)' : '1px solid transparent',
      color: isActive ? 'var(--accent-primary)' : 'var(--text-secondary)',
      transition: 'all 0.2s ease'
    }}
    onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'; }}
    onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
  >
    {icon}
    <span style={{ fontWeight: 500 }}>{label}</span>
  </div>
);

const MobileNavItem = ({ icon, label, isActive, onClick }: any) => (
  <button
    onClick={onClick}
    style={{
      flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', gap: '4px', padding: '8px 4px',
      background: 'transparent', border: 'none', cursor: 'pointer',
      color: isActive ? 'var(--accent-primary)' : 'var(--text-secondary)',
      fontSize: '10px', fontWeight: isActive ? 'bold' : 'normal',
      transition: 'color 0.2s ease'
    }}
  >
    {icon}
    {label}
  </button>
);

export default App;
