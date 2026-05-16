// SkillDNA.tsx — Forest Canopy Theme
import { useEffect, useRef, useState } from 'react';

const SKILLS = [
  { name: 'Agentic AI / LangGraph',       pct: 98, color: '#a4ac86', desc: 'Production LangGraph since v0.1 · 15+ agentic workflows at enterprise scale' },
  { name: 'LLM Inference & Optimisation', pct: 95, color: '#c8a84b', desc: 'vLLM · Ray Serve · PagedAttention · On-prem GPU cluster management' },
  { name: 'Enterprise AI Architecture',   pct: 93, color: '#9da390', desc: 'Sovereign RAG · Air-gapped deployments · RBI-compliant FinTech systems' },
  { name: 'MLOps & Evaluation',           pct: 90, color: '#5b8fa8', desc: 'MLflow · Ragas · A/B evaluation · Model versioning at scale' },
  { name: 'AI Strategy & Leadership',     pct: 92, color: '#8b6343', desc: 'IIM Indore · ISB Faculty · CAIO-level roadmap & C-suite engagement' },
  { name: 'Measurable Business Impact',   pct: 88, color: '#7dd47f', desc: '400% revenue growth · 22M users · 75 FTE saved — quantified ROI every time' },
];

const RADAR_LABELS = ['Agentic AI', 'Inference', 'Architecture', 'MLOps', 'Strategy', 'Impact'];
const RADAR_VALS   = [0.98, 0.95, 0.93, 0.90, 0.92, 0.88];
const RADAR_COLORS = ['#a4ac86', '#c8a84b', '#9da390', '#5b8fa8', '#8b6343', '#7dd47f'];

const SkillDNA = () => {
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 120);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const cv = canvasRef.current;
    if (!cv) return;
    const ctx = cv.getContext('2d');
    if (!ctx) return;
    const cx = 140, cy = 140, R = 108, n = RADAR_LABELS.length;
    const ang = (i: number) => (Math.PI * 2 / n) * i - Math.PI / 2;
    ctx.clearRect(0, 0, 280, 280);
    // rings
    for (let r = 1; r <= 5; r++) {
      const rr = R * (r / 5);
      ctx.beginPath();
      for (let i = 0; i < n; i++) {
        const a = ang(i);
        i === 0 ? ctx.moveTo(cx + rr * Math.cos(a), cy + rr * Math.sin(a))
                : ctx.lineTo(cx + rr * Math.cos(a), cy + rr * Math.sin(a));
      }
      ctx.closePath();
      ctx.strokeStyle = 'rgba(164,172,134,0.09)'; ctx.lineWidth = 1; ctx.stroke();
    }
    // spokes
    for (let i = 0; i < n; i++) {
      const a = ang(i);
      ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + R * Math.cos(a), cy + R * Math.sin(a));
      ctx.strokeStyle = 'rgba(164,172,134,0.1)'; ctx.lineWidth = 1; ctx.stroke();
    }
    // fill
    ctx.beginPath();
    RADAR_VALS.forEach((v, i) => {
      const a = ang(i), x = cx + R * v * Math.cos(a), y = cy + R * v * Math.sin(a);
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    });
    ctx.closePath();
    ctx.fillStyle = 'rgba(164,172,134,0.1)'; ctx.fill();
    ctx.strokeStyle = 'rgba(164,172,134,0.5)'; ctx.lineWidth = 2; ctx.stroke();
    // dots
    RADAR_VALS.forEach((v, i) => {
      const a = ang(i), x = cx + R * v * Math.cos(a), y = cy + R * v * Math.sin(a);
      ctx.beginPath(); ctx.arc(x, y, 4.5, 0, Math.PI * 2);
      ctx.fillStyle = RADAR_COLORS[i]; ctx.fill();
    });
    // labels
    ctx.font = '600 10.5px DM Sans, sans-serif'; ctx.textAlign = 'center';
    RADAR_LABELS.forEach((lbl, i) => {
      const a = ang(i), lx = cx + (R + 22) * Math.cos(a), ly = cy + (R + 22) * Math.sin(a);
      ctx.fillStyle = RADAR_COLORS[i]; ctx.fillText(lbl, lx, ly + 4);
    });
  }, []);

  return (
    <div className="skill-container">
      <div className="skill-header">
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 14, flexWrap: 'wrap' }}>
          <div>
            <h2 className="heading-serif" style={{ fontSize: 24, fontWeight: 800, letterSpacing: -0.4 }}>Skill DNA</h2>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 5 }}>
              Depth of expertise across domains — 15+ years of production AI delivery
            </p>
          </div>
          <span className="badge badge-green">NEW</span>
        </div>
      </div>

      <div className="skill-body">
        <div className="skill-grid">
          <div className="glass-panel skill-radar-card">
            <div className="skill-section-label">Domain Radar</div>
            <canvas ref={canvasRef} width={280} height={280} />
          </div>
          <div className="glass-panel skill-bars-card">
            <div className="skill-section-label">Proficiency Depth</div>
            {SKILLS.map((s, i) => (
              <div className="sb-row" key={i}>
                <div className="sb-head">
                  <span className="sb-name">{s.name}</span>
                  <span className="sb-pct" style={{ color: s.color }}>{s.pct}%</span>
                </div>
                <div className="sb-track">
                  <div className="sb-fill" style={{ background: s.color, width: animated ? `${s.pct}%` : '0%' }} />
                </div>
                <span className="sb-desc">{s.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillDNA;
