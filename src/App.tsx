import { useState, useEffect, useRef } from 'react';
import './index.css';
import ReverseInterviewEngine from './ReverseInterviewEngine';
import ArchitectureDiagram from './ArchitectureDiagram';
import DeployMe from './DeployMe';
import ThoughtLeadership from './ThoughtLeadership';
import LivePortfolio from './LivePortfolio';
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
          <NavItem color="#00ffcc" label="Digital Twin"       isActive={activeTab === 'twin'}             onClick={() => window.open('https://resume-rewrite-production.up.railway.app/', '_blank')} />
          <NavItem color="#0088ff" label="Match Engine"       isActive={activeTab === 'reverse_interview'} onClick={() => setActiveTab('reverse_interview')} />
          <NavItem color="#a78bfa" label="Architecture"       isActive={activeTab === 'architecture'}      onClick={() => setActiveTab('architecture')} />
          <NavItem color="#fb923c" label="Thought Leadership" isActive={activeTab === 'thought'}           onClick={() => setActiveTab('thought')} />
          <NavItem color="#34d399" label="Live Portfolio"     isActive={activeTab === 'portfolio'}         onClick={() => setActiveTab('portfolio')} />
          <NavItem color="#f472b6" label="Deploy Me"          isActive={activeTab === 'deploy'}            onClick={() => setActiveTab('deploy')} />
        </nav>

        {/* Footer */}
        <div style={{ marginTop: 'auto', borderTop: '1px solid var(--border-color)', paddingTop: '20px' }}>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            CHIEF AI ARCHITECT<br />
            SBI CARD | GURGAON<br />
            <span style={{ color: 'var(--accent-primary)', fontSize: '11px' }}>Faculty: IIM Indore · ISB</span>
          </div>
          <a
            href="https://chromewebstore.google.com/detail/ai-job-assistant/jfjimnkeogmhmgcigcecemijmhjgoppb"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex', alignItems: 'center', gap: '8px', marginTop: '10px',
              padding: '7px 10px', borderRadius: '8px', textDecoration: 'none',
              background: 'rgba(0,136,255,0.08)', border: '1px solid rgba(0,136,255,0.2)',
              color: '#0088ff', fontSize: '11px', fontWeight: 600,
              transition: 'background 0.2s ease',
            }}
            onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(0,136,255,0.15)'}
            onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(0,136,255,0.08)'}
          >
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#0088ff', boxShadow: '0 0 6px #0088ff', flexShrink: 0, display: 'inline-block' }} />
            AI Job Assistant — Chrome
          </a>
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
        {activeTab === 'portfolio'         && <LivePortfolio />}
        {activeTab === 'deploy'            && <DeployMe />}
        {!['reverse_interview','architecture','thought','portfolio','deploy'].includes(activeTab) && (
          <div className="glass-panel" style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <h2 style={{ color: 'var(--text-secondary)' }}>Module "{activeTab}" coming soon.</h2>
          </div>
        )}
      </main>
    </div>
  );
};

// ── Icons ──────────────────────────────────────────────────────────────────
const NavItem = ({ color, label, isActive, onClick }: { color: string; label: string; isActive: boolean; onClick: () => void }) => (
  <div
    onClick={onClick}
    style={{
      display: 'flex', alignItems: 'center', gap: '12px',
      padding: '11px 16px', borderRadius: '8px', cursor: 'pointer',
      background: isActive ? `${color}18` : 'transparent',
      border: isActive ? `1px solid ${color}40` : '1px solid transparent',
      color: isActive ? color : 'var(--text-secondary)',
      transition: 'all 0.2s ease',
    }}
    onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
    onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
  >
    {/* Dot icon */}
    <div style={{
      width: '28px', height: '28px', borderRadius: '7px', flexShrink: 0,
      background: isActive ? `${color}25` : 'rgba(255,255,255,0.04)',
      border: `1px solid ${isActive ? color + '50' : 'rgba(255,255,255,0.08)'}`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      transition: 'all 0.2s ease',
    }}>
      <div style={{
        width: '8px', height: '8px', borderRadius: '50%',
        background: isActive ? color : 'rgba(255,255,255,0.25)',
        boxShadow: isActive ? `0 0 6px ${color}` : 'none',
        transition: 'all 0.2s ease',
      }} />
    </div>
    <span style={{ fontWeight: 500, fontSize: '14px' }}>{label}</span>
  </div>
);

export default App;
