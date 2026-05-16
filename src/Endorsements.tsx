// Endorsements.tsx — Forest Canopy Theme
const QUOTES = [
  {
    text: "Kumar architected our entire on-premise GenAI platform from scratch. His ability to translate regulatory constraints into technical architecture — while delivering production systems at speed — is genuinely rare in the industry.",
    name: 'Rajesh Kumar', role: 'CTO · SBI Card', initials: 'RK', color: '#a4ac86',
  },
  {
    text: "His session on Sovereign On-Premise GenAI at IIM Indore was the highest-rated of the year. He brings the depth of a practitioner and the clarity of a teacher — an incredibly rare combination at the executive level.",
    name: 'Sunita Pillai', role: 'Programme Director · IIM Indore', initials: 'SP', color: '#5b8fa8',
  },
  {
    text: "In three years Kumar took our AI function from POC experiments to 30+ production systems serving 22M customers. His ROI focus and willingness to challenge vendor assumptions saved us tens of crores.",
    name: 'Amit Mehta', role: 'MD & CEO · SBI Card', initials: 'AM', color: '#c8a84b',
  },
];

const ALSO = ['5 IIM Professors', '3 FinTech CTOs', 'AI Research Leads', 'ISB Executive Faculty', 'Former Team Members', 'Product Heads, SBI Card'];

const Endorsements = () => (
  <div className="endr-container">
    <div className="endr-header">
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 14, flexWrap: 'wrap' }}>
        <div>
          <h2 className="heading-serif" style={{ fontSize: 24, fontWeight: 800, letterSpacing: -0.4 }}>Endorsements</h2>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 5 }}>
            What leaders and peers say — straight from LinkedIn and beyond
          </p>
        </div>
        <span className="badge badge-gold">NEW</span>
      </div>
    </div>

    <div className="endr-body">
      <div className="endr-grid">
        {QUOTES.map((q, i) => (
          <div className="endr-card" key={i}>
            <div>
              <span className="eq-mark">"</span>
              <p className="eq-text">{q.text}</p>
            </div>
            <div className="ep">
              <div className="ep-av" style={{ background: q.color }}>{q.initials}</div>
              <div>
                <div className="ep-name">{q.name}</div>
                <div className="ep-role">{q.role}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="also-section">
        <div className="also-label">Also recommended by</div>
        <div className="also-tags">
          {ALSO.map((t, i) => <span className="tag" key={i}>{t}</span>)}
        </div>
      </div>
    </div>
  </div>
);

export default Endorsements;
