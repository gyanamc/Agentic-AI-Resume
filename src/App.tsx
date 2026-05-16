import { useState, useEffect, useRef } from 'react';
import './index.css';
import './App.css';
import ReverseInterviewEngine from './ReverseInterviewEngine';
import ArchitectureDiagram    from './ArchitectureDiagram';
import DeployMe               from './DeployMe';
import ThoughtLeadership      from './ThoughtLeadership';
import LivePortfolio          from './LivePortfolio';
import CareerArc              from './CareerArc';
import SkillDNA               from './SkillDNA';
import Endorsements           from './Endorsements';
import AskAI                  from './AskAI';
import kumarPhoto             from './assets/kumar.jpg';

// ── Animated counter ───────────────────────────────────────
const useCounter = (target: number, duration = 1800) => {
  const [count, setCount]   = useState(0);
  const started             = useRef(false);
  useEffect(() => {
    if (started.current) return;
    started.current = true;
    const steps = 60, inc = target / steps;
    let cur = 0;
    const t = setInterval(() => {
      cur += inc;
      if (cur >= target) { setCount(target); clearInterval(t); }
      else setCount(Math.floor(cur));
    }, duration / steps);
    return () => clearInterval(t);
  }, [target, duration]);
  return count;
};

const STATS = [
  { value: 22,  suffix: 'M+', label: 'Users Served'    },
  { value: 75,  suffix: '+',  label: 'FTE Saved'        },
  { value: 400, suffix: '%',  label: 'Bill Pay Growth'  },
  { value: 30,  suffix: '+',  label: 'Prod AI Systems'  },
];

const StatCell = ({ value, suffix, label }: { value: number; suffix: string; label: string }) => {
  const count = useCounter(value);
  return (
    <div className="stat-cell">
      <div className="stat-val">{count}<span className="stat-suf">{suffix}</span></div>
      <div className="stat-lbl">{label}</div>
    </div>
  );
};

// ── Ambient canvas (Forest Canopy palette) ─────────────────
const AmbientBackground = () => {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const cv = ref.current; if (!cv) return;
    const ctx = cv.getContext('2d'); if (!ctx) return;
    const resize = () => { cv.width = innerWidth; cv.height = innerHeight; };
    resize(); addEventListener('resize', resize);
    const orbs = [
      { x: .14, y: .10, r: 420, c: 'rgba(45,74,43,0.32)',   dx:  .00008, dy:  .00006 },
      { x: .82, y: .22, r: 340, c: 'rgba(74,103,65,0.18)',   dx: -.00007, dy:  .00009 },
      { x: .50, y: .88, r: 460, c: 'rgba(45,74,43,0.22)',    dx:  .00005, dy: -.00007 },
      { x: .88, y: .70, r: 280, c: 'rgba(125,132,113,0.13)', dx: -.00009, dy: -.00005 },
      { x: .28, y: .50, r: 260, c: 'rgba(200,168,75,0.06)',  dx:  .00010, dy:  .00007 },
    ];
    let frame: number;
    const draw = () => {
      ctx.clearRect(0, 0, cv.width, cv.height);
      orbs.forEach(o => {
        o.x += o.dx; o.y += o.dy;
        if (o.x < -.1 || o.x > 1.1) o.dx *= -1;
        if (o.y < -.1 || o.y > 1.1) o.dy *= -1;
        const g = ctx.createRadialGradient(o.x * cv.width, o.y * cv.height, 0, o.x * cv.width, o.y * cv.height, o.r);
        g.addColorStop(0, o.c); g.addColorStop(1, 'transparent');
        ctx.fillStyle = g; ctx.beginPath();
        ctx.arc(o.x * cv.width, o.y * cv.height, o.r, 0, Math.PI * 2); ctx.fill();
      });
      frame = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(frame); removeEventListener('resize', resize); };
  }, []);
  return <canvas ref={ref} style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0 }} />;
};

// ── Nav config ─────────────────────────────────────────────
const NAV_ITEMS = [
  { color: '#a4ac86', label: 'Architecture',       tab: 'architecture'      },
  { color: '#8bb8d0', label: 'Match Engine',        tab: 'reverse_interview' },
  { color: '#c8a84b', label: 'Career Arc',          tab: 'career',  badge: 'NEW' },
  { color: '#a4ac86', label: 'Skill DNA',           tab: 'skills',  badge: 'NEW' },
  { color: '#c4a47e', label: 'Endorsements',        tab: 'endorse', badge: 'NEW' },
  { color: '#c8a84b', label: 'Thought Leadership',  tab: 'thought'           },
  { color: '#9da390', label: 'Live Portfolio',      tab: 'portfolio'         },
  { color: '#c4a47e', label: 'Deploy Me',           tab: 'deploy'            },
];

// ── Digital Twin Hero Card ─────────────────────────────────
const DigitalTwinHero = () => (
  <a
    href="https://resume-rewrite-production.up.railway.app/"
    target="_blank"
    rel="noopener noreferrer"
    className="dt-hero"
  >
    {/* Animated background shimmer */}
    <div className="dt-hero-shimmer" />

    {/* Top row: label + LIVE badge */}
    <div className="dt-hero-top">
      <span className="dt-hero-eyebrow">✦ FEATURED</span>
      <span className="dt-hero-live">
        <span className="dt-hero-live-dot" />
        LIVE
      </span>
    </div>

    {/* Title */}
    <div className="dt-hero-title">Digital Twin</div>
    <div className="dt-hero-sub">
      Talk to my AI. Ask anything about my career, skills, or fit for your role.
    </div>

    {/* CTA */}
    <div className="dt-hero-cta">
      Launch Experience
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M7 17L17 7M17 7H7M17 7v10" />
      </svg>
    </div>
  </a>
);
const App = () => {
  const [activeTab, setActiveTab]   = useState('architecture');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleNav = (tab: string) => {
    setActiveTab(tab);
    setSidebarOpen(false);
  };

  return (
    <div className="app-container">
      <AmbientBackground />

      {/* ── Mobile Header ── */}
      <header className="mobile-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <img src={kumarPhoto} alt="Kumar Gyanam" className="mobile-avatar" />
          <div>
            <h1 className="text-gradient heading-serif" style={{ fontSize: 15, margin: 0 }}>KUMAR GYANAM</h1>
            <div style={{ fontSize: 9.5, color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', gap: 4, fontFamily: 'DM Mono, monospace', letterSpacing: '.5px' }}>
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--accent-primary)', flexShrink: 0 }} className="animate-pulse" />
              SYSTEM ONLINE V2.5
            </div>
          </div>
        </div>
        <button className="hamburger" onClick={() => setSidebarOpen(s => !s)}>
          {sidebarOpen ? '✕' : '☰'}
        </button>
      </header>

      {sidebarOpen && <div className="drawer-overlay" onClick={() => setSidebarOpen(false)} />}

      {/* ── Sidebar ── */}
      <aside className={`glass-panel sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}>

        {/* Brand */}
        <div className="brand">
          <div className="brand-profile">
            <div className="brand-av-ring">
              <img src={kumarPhoto} alt="Kumar Gyanam" className="brand-av" />
              <div className="brand-online-dot" />
            </div>
            <div>
              <div className="brand-name">KUMAR <em>GYANAM</em></div>
              <div className="brand-sys">
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent-primary)', flexShrink: 0 }} className="animate-pulse" />
                SYSTEM ONLINE V2.5
              </div>
            </div>
          </div>
          <div className="brand-avail">
            <div className="brand-avail-dot" />
            Open to CAIO · Chief AI Architect
          </div>
        </div>

        {/* Stats */}
        <div className="stats-grid">
          {STATS.map((s, i) => <StatCell key={i} value={s.value} suffix={s.suffix} label={s.label} />)}
        </div>

        {/* Digital Twin Hero */}
        <DigitalTwinHero />

        {/* Nav */}
        <div className="nav-section">
          <div className="nav-label">Navigate</div>
          {NAV_ITEMS.map(item => (
            <NavItem
              key={item.tab}
              color={item.color}
              label={item.label}
              badge={item.badge}
              isActive={activeTab === item.tab}
              onClick={() => handleNav(item.tab)}
            />
          ))}
        </div>

        {/* Quick CTAs */}
        <div className="quick-ctas">
          <a
            href="/Kumar_Gyanam_Resume.pdf"
            download="Kumar_Gyanam_Resume.pdf"
            className="btn-primary-sidebar"
            style={{ textDecoration: 'none' }}
          >
            📄 Download Resume
          </a>
          <button className="btn-sec-sidebar">🗓 Book 15-min Call</button>
        </div>

        {/* Footer */}
        <div className="sidebar-footer">
          <strong>Chief AI Architect</strong><br />
          SBI Card · Gurgaon, India<br />
          <span className="sidebar-footer-badge">★ Faculty: IIM Indore · ISB</span>
        </div>

        {/* Master CV upload */}
        <div>
          <input type="file" id="masterCvInput" accept="application/pdf" style={{ display: 'none' }}
            onChange={async e => {
              if (e.target.files?.[0]) {
                const fd = new FormData(); fd.append('file', e.target.files[0]);
                try {
                  const res = await fetch('/api/upload_cv', { method: 'POST', body: fd });
                  alert(res.ok ? 'Master CV Updated!' : 'Failed to update CV');
                } catch { alert('Error uploading CV'); }
              }
            }}
          />
          <button onClick={() => document.getElementById('masterCvInput')?.click()}
            style={{ background: 'transparent', border: '1px dashed var(--border-color)', color: 'var(--text-secondary)', padding: '6px 12px', borderRadius: 4, cursor: 'pointer', fontSize: 11, width: '100%', fontFamily: 'DM Sans, sans-serif' }}>
            ⚙️ Update Master CV
          </button>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <main className="main-content" style={{ position: 'relative', zIndex: 1 }}>
        {activeTab === 'architecture'      && <ArchitectureDiagram />}
        {activeTab === 'reverse_interview' && <ReverseInterviewEngine />}
        {activeTab === 'career'            && <CareerArc />}
        {activeTab === 'skills'            && <SkillDNA />}
        {activeTab === 'endorse'           && <Endorsements />}
        {activeTab === 'thought'           && <ThoughtLeadership />}
        {activeTab === 'portfolio'         && <LivePortfolio />}
        {activeTab === 'deploy'            && <DeployMe />}
      </main>

      {/* ── Mobile Bottom Nav ── */}
      <nav className="mobile-bottom-nav">
        {NAV_ITEMS.slice(0, 5).map(item => (
          <MobileNavItem
            key={item.tab}
            color={item.color}
            label={item.label.split(' ')[0]}
            isActive={activeTab === item.tab}
            onClick={() => handleNav(item.tab)}
          />
        ))}
        <a
          href="https://resume-rewrite-production.up.railway.app/"
          target="_blank"
          rel="noopener noreferrer"
          className="mobile-dt-btn"
        >
          <span className="mobile-dt-dot" />
          Twin
        </a>
      </nav>

      {/* ── Floating AI Chat ── */}
      <AskAI />
    </div>
  );
};

// ── NavItem ────────────────────────────────────────────────
const NavItem = ({ color, label, badge, isActive, onClick }: { color: string; label: string; badge?: string; isActive: boolean; onClick: () => void }) => (
  <div className="nav-item"
    onClick={onClick}
    style={{
      background:   isActive ? `${color}14` : 'transparent',
      border:       isActive ? `1px solid ${color}38` : '1px solid transparent',
      color:        isActive ? color : 'var(--text-secondary)',
    }}
    onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLElement).style.background = 'rgba(164,172,134,0.05)'; }}
    onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
  >
    <div style={{
      width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
      background: isActive ? color : 'rgba(255,255,255,0.2)',
      boxShadow:  isActive ? `0 0 8px ${color}` : 'none',
      transition: 'all 0.2s',
    }} />
    <span style={{ fontWeight: 500, fontSize: 13, flex: 1 }}>{label}</span>
    {badge && (
      <span style={{
        fontSize: 7.5, fontFamily: 'DM Mono, monospace', padding: '2px 6px',
        borderRadius: 3, background: 'rgba(164,172,134,0.12)',
        border: '1px solid rgba(164,172,134,0.25)', color: 'var(--olive)', letterSpacing: '.3px',
      }}>{badge}</span>
    )}
  </div>
);

// ── MobileNavItem ──────────────────────────────────────────
const MobileNavItem = ({ color, label, isActive, onClick }: { color: string; label: string; isActive: boolean; onClick: () => void }) => (
  <button onClick={onClick} style={{
    flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
    justifyContent: 'center', gap: 3, padding: '8px 2px',
    background: 'transparent', border: 'none', cursor: 'pointer',
    color: isActive ? color : 'var(--text-secondary)',
    fontSize: 9, fontWeight: isActive ? 700 : 400, transition: 'color 0.2s',
  }}>
    <div style={{ width: 6, height: 6, borderRadius: '50%', background: isActive ? color : 'transparent', boxShadow: isActive ? `0 0 6px ${color}` : 'none', marginBottom: 2, transition: 'all 0.2s' }} />
    {label}
  </button>
);

export default App;
