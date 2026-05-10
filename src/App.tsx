import { useState, useEffect, useRef } from 'react';
import './index.css';
import ReverseInterviewEngine from './ReverseInterviewEngine';
import ArchitectureDiagram from './ArchitectureDiagram';
import DeployMe from './DeployMe';
import ThoughtLeadership from './ThoughtLeadership';
import kumarPhoto from './assets/kumar.jpg';

// ── Animated counter hook ──────────────────────────────────────────────────
const useCounter = (target: number, duration = 1800) => {
  const [count, setCount] = useState(0);
  const started = useRef(false);
  useEffect(() => {
    if (started.current) return;
    started.current = true;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(current));
    }, duration / steps);
    return () => clearInterval(timer);
  }, [target, duration]);
  return count;
};

// ── Stats data ─────────────────────────────────────────────────────────────
const STATS = [
  { value: 22, suffix: 'M+', label: 'Users Served' },
  { value: 75, suffix: '+',  label: 'FTE Saved' },
  { value: 400, suffix: '%', label: 'Bill Pay Growth' },
  { value: 30, suffix: '+',  label: 'Prod AI Systems' },
];

const StatItem = ({ value, suffix, label }: { value: number; suffix: string; label: string }) => {
  const count = useCounter(value);
  return (
    <div style={{ textAlign: 'center', flex: 1 }}>
      <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--accent-primary)', lineHeight: 1 }}>
        {count}{suffix}
      </div>
      <div style={{ fontSize: '9px', color: 'var(--text-secondary)', marginTop: '3px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
        {label}
      </div>
    </div>
  );
};

// ── Ambient background canvas ──────────────────────────────────────────────
const AmbientBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Orbs
    const orbs = [
      { x: 0.15, y: 0.1,  r: 320, color: 'rgba(0,255,204,0.045)', dx: 0.00012, dy: 0.00008 },
      { x: 0.85, y: 0.2,  r: 280, color: 'rgba(0,136,255,0.04)',  dx: -0.0001, dy: 0.00012 },
      { x: 0.5,  y: 0.85, r: 350, color: 'rgba(167,139,250,0.03)', dx: 0.00008, dy: -0.0001 },
    ];

    let frame: number;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      orbs.forEach(orb => {
        orb.x += orb.dx;
        orb.y += orb.dy;
        if (orb.x < 0 || orb.x > 1) orb.dx *= -1;
        if (orb.y < 0 || orb.y > 1) orb.dy *= -1;
        const grd = ctx.createRadialGradient(
          orb.x * canvas.width, orb.y * canvas.height, 0,
          orb.x * canvas.width, orb.y * canvas.height, orb.r
        );
        grd.addColorStop(0, orb.color);
        grd.addColorStop(1, 'transparent');
        ctx.fillStyle = grd;
        ctx.beginPath();
        ctx.arc(orb.x * canvas.width, orb.y * canvas.height, orb.r, 0, Math.PI * 2);
        ctx.fill();
      });
      frame = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed', top: 0, left: 0,
        width: '100%', height: '100%',
        pointerEvents: 'none', zIndex: 0,
      }}
    />
  );
};

// ── Main App ───────────────────────────────────────────────────────────────
const App = () => {
  const [activeTab, setActiveTab] = useState('architecture');

  return (
    <div className="app-container" style={{ display: 'flex', width: '100%', height: '100%', position: 'relative' }}>
      <AmbientBackground />

      {/* Sidebar */}
      <aside className="glass-panel" style={{ width: '280px', margin: '16px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px', zIndex: 10, position: 'relative' }}>

        {/* Brand */}
        <div className="brand">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <img
              src={kumarPhoto}
              alt="Kumar Gyanam"
              style={{
                width: '56px', height: '56px', borderRadius: '50%',
                objectFit: 'cover', border: '2px solid var(--accent-primary)',
                boxShadow: '0 0 12px rgba(0, 255, 204, 0.35)', flexShrink: 0,
              }}
            />
            <div>
              <h1 className="text-gradient" style={{ fontSize: '20px', margin: 0, letterSpacing: '-0.5px' }}>KUMAR GYANAM</h1>
              <div style={{ fontSize: '11px', color: 'var(--accent-primary)', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: 'var(--accent-primary)', flexShrink: 0 }} className="animate-pulse" />
                SYSTEM ONLINE V2.5
              </div>
            </div>
          </div>

          {/* Animated Stats Bar */}
          <div style={{
            display: 'flex', gap: '4px', padding: '10px 8px',
            background: 'rgba(0,255,204,0.04)',
            border: '1px solid rgba(0,255,204,0.12)',
            borderRadius: '10px',
          }}>
            {STATS.map((s, i) => (
              <StatItem key={i} value={s.value} suffix={s.suffix} label={s.label} />
            ))}
          </div>
        </div>

        {/* Nav */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <NavItem icon={<TerminalIcon />}   label="Digital Twin"      isActive={activeTab === 'twin'}             onClick={() => window.open('https://resume-rewrite-production.up.railway.app/', '_blank')} />
          <NavItem icon={<RadarIcon />}      label="Match Engine"      isActive={activeTab === 'reverse_interview'} onClick={() => setActiveTab('reverse_interview')} />
          <NavItem icon={<NetworkIcon />}    label="Architecture"      isActive={activeTab === 'architecture'}      onClick={() => setActiveTab('architecture')} />
          <NavItem icon={<MicIcon />}        label="Thought Leadership" isActive={activeTab === 'thought'}          onClick={() => setActiveTab('thought')} />
          <NavItem icon={<RocketIcon />}     label="Deploy Me"         isActive={activeTab === 'deploy'}            onClick={() => setActiveTab('deploy')} />
        </nav>

        {/* Footer */}
        <div style={{ marginTop: 'auto', borderTop: '1px solid var(--border-color)', paddingTop: '20px' }}>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            CHIEF AI ARCHITECT<br />
            SBI CARD | GURGAON<br />
            <span style={{ color: 'var(--accent-primary)', fontSize: '11px' }}>Faculty: IIM Indore · ISB</span>
          </div>
          <div style={{ marginTop: '12px' }}>
            <input
              type="file" id="masterCvInput" accept="application/pdf"
              style={{ display: 'none' }}
              onChange={async (e) => {
                if (e.target.files && e.target.files[0]) {
                  const formData = new FormData();
                  formData.append('file', e.target.files[0]);
                  try {
                    const res = await fetch('/api/upload_cv', { method: 'POST', body: formData });
                    if (res.ok) alert('Master CV Updated Successfully!');
                    else alert('Failed to update CV');
                  } catch { alert('Error uploading CV'); }
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

      {/* Main Content */}
      <main style={{ flex: 1, margin: '16px 16px 16px 0', position: 'relative', overflow: 'hidden', zIndex: 10 }}>
        {activeTab === 'reverse_interview' && <ReverseInterviewEngine />}
        {activeTab === 'architecture'      && <ArchitectureDiagram />}
        {activeTab === 'thought'           && <ThoughtLeadership />}
        {activeTab === 'deploy'            && <DeployMe />}
        {!['reverse_interview','architecture','thought','deploy'].includes(activeTab) && (
          <div className="glass-panel" style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <h2 style={{ color: 'var(--text-secondary)' }}>Module "{activeTab}" coming soon.</h2>
          </div>
        )}
      </main>
    </div>
  );
};

// ── Icons ──────────────────────────────────────────────────────────────────
const TerminalIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg>;
const RadarIcon    = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/><line x1="12" y1="12" x2="19" y2="5"/></svg>;
const NetworkIcon  = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="16" y="16" width="6" height="6" rx="1"/><rect x="2" y="16" width="6" height="6" rx="1"/><rect x="9" y="2" width="6" height="6" rx="1"/><path d="M5 16v-3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3"/><path d="M12 12V8"/></svg>;
const RocketIcon   = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></svg>;
const MicIcon      = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>;

const NavItem = ({ icon, label, isActive, onClick }: any) => (
  <div
    onClick={onClick}
    style={{
      display: 'flex', alignItems: 'center', gap: '12px',
      padding: '11px 16px', borderRadius: '8px', cursor: 'pointer',
      background: isActive ? 'rgba(0, 255, 204, 0.1)' : 'transparent',
      border: isActive ? '1px solid rgba(0, 255, 204, 0.3)' : '1px solid transparent',
      color: isActive ? 'var(--accent-primary)' : 'var(--text-secondary)',
      transition: 'all 0.2s ease',
    }}
    onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
    onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
  >
    {icon}
    <span style={{ fontWeight: 500 }}>{label}</span>
  </div>
);

export default App;
