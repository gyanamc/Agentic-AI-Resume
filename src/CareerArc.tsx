// CareerArc.tsx — Forest Canopy Theme
const TIMELINE = [
  {
    year: '2021 — Present',
    role: 'Chief AI Architect',
    org: 'SBI Card · Gurgaon, India',
    color: '#c8a84b',
    tags: ['30+ Prod AI Systems', '22M+ Users', '400% Bill Pay Growth', '75+ FTE Saved', 'On-Prem GenAI', 'Sovereign RAG', 'Air-Gapped Deployment'],
  },
  {
    year: '2022 — Present',
    role: 'Guest Faculty — AI Strategy & Governance',
    org: 'IIM Indore · ISB Hyderabad',
    color: '#a4ac86',
    tags: ['AI Strategy', 'AI Governance', 'Enterprise GenAI', 'Responsible AI', 'Executive Education'],
  },
  {
    year: '2018 — 2021',
    role: 'Senior AI / ML Lead',
    org: 'Enterprise Financial Services',
    color: '#5b8fa8',
    tags: ['LangGraph', 'RAG Pipelines', 'Recommendation Engines', 'NLP', 'MLOps'],
  },
  {
    year: '2014 — 2018',
    role: 'Data Science & ML Engineering',
    org: 'Product & Analytics Roles',
    color: '#7d8471',
    tags: ['ML Modeling', 'Python', 'Predictive Analytics', 'SVM / RF / Neural Nets', 'Feature Engineering'],
  },
  {
    year: '2009 — 2014',
    role: 'Technology Foundations',
    org: 'Software Engineering & Systems Design',
    color: 'rgba(125,132,113,0.45)',
    tags: ['Software Architecture', 'Systems Design', 'Java / Python'],
  },
];

const CareerArc = () => (
  <div className="career-container">
    <div className="career-header">
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 14, flexWrap: 'wrap' }}>
        <div>
          <h2 className="heading-serif" style={{ fontSize: 24, fontWeight: 800, letterSpacing: -0.4 }}>Career Arc</h2>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 5 }}>
            15+ years of progressive AI leadership — from ML engineering to enterprise Chief AI Architect
          </p>
        </div>
        <span className="badge badge-gold">NEW</span>
      </div>
    </div>

    <div className="career-body">
      <div className="timeline">
        <div className="tl-line" />
        {TIMELINE.map((item, i) => (
          <div className="tl-item" key={i}>
            <div className="tl-dot" style={{ background: item.color, boxShadow: `0 0 10px ${item.color}` }} />
            <div className="tl-year" style={{ color: item.color }}>{item.year}</div>
            <div className="tl-role">{item.role}</div>
            <div className="tl-org">{item.org}</div>
            <div className="tl-tags">
              {item.tags.map((t, j) => <span className="tag" key={j}>{t}</span>)}
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default CareerArc;
