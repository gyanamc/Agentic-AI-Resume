const DotIcon = ({ color }: { color: string }) => (
  <div style={{
    width: '40px', height: '40px', borderRadius: '10px',
    background: `${color}18`, border: `1px solid ${color}35`,
    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  }}>
    <div style={{ width: '11px', height: '11px', borderRadius: '50%', background: color, boxShadow: `0 0 8px ${color}` }} />
  </div>
);

const ITEMS = [
  {
    title: 'Live AI Portfolio',
    subtitle: 'ai-showcase-site-production.up.railway.app',
    description: '30+ production AI systems built and deployed — spanning Agentic RAG, conversational AI, recommendation engines, automation workflows, and enterprise GenAI platforms. Real systems. Real scale. Real impact.',
    color: '#00ffcc',
    tags: ['30+ Systems', 'Production', 'Agentic AI', 'RAG', 'LangGraph', 'n8n', 'Railway'],
    cta: 'View Live Portfolio →',
    href: 'https://ai-showcase-site-production.up.railway.app',
    badge: 'LIVE',
    badgeColor: '#00ffcc',
  },
  {
    title: 'AI Job Assistant',
    subtitle: 'Chrome Web Store — Free Extension',
    description: 'An Agentic AI Chrome extension that supercharges job searching. Analyses job listings in real-time, matches them against your profile, auto-tailors your CV for each role, and assists with application workflows — all without leaving your browser tab.',
    color: '#0088ff',
    tags: ['Chrome Extension', 'Agentic AI', 'LangGraph', 'CV Tailoring', 'Job Matching', 'Real-time'],
    cta: 'Add to Chrome — Free →',
    href: 'https://chromewebstore.google.com/detail/ai-job-assistant/jfjimnkeogmhmgcigcecemijmhjgoppb',
    badge: 'CHROME STORE',
    badgeColor: '#0088ff',
  },
];

const LivePortfolio = () => {
  return (
    <div className="glass-panel" style={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

      {/* Header */}
      <div style={{ padding: '24px', borderBottom: '1px solid var(--border-color)' }}>
        <h2 style={{ margin: 0, fontSize: '20px' }}>Live Portfolio</h2>
        <p style={{ color: 'var(--text-secondary)', margin: '8px 0 0 0', fontSize: '14px' }}>
          Production systems and public products — built, deployed, and live.
        </p>
      </div>

      {/* Cards */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '32px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {ITEMS.map((item) => (
          <div
            key={item.title}
            style={{
              padding: '28px',
              background: 'rgba(255,255,255,0.02)',
              border: `1px solid ${item.color}20`,
              borderRadius: '16px',
              transition: 'box-shadow 0.25s ease, border-color 0.25s ease',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLDivElement).style.borderColor = `${item.color}45`;
              (e.currentTarget as HTMLDivElement).style.boxShadow = `0 0 32px ${item.color}12`;
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLDivElement).style.borderColor = `${item.color}20`;
              (e.currentTarget as HTMLDivElement).style.boxShadow = 'none';
            }}
          >
            {/* Card header */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '18px', marginBottom: '18px' }}>
              <DotIcon color={item.color} />
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '4px' }}>
                  <span style={{ fontWeight: 700, fontSize: '17px', color: '#fff' }}>{item.title}</span>
                  <span style={{
                    fontSize: '10px', fontWeight: 700, padding: '2px 8px', borderRadius: '4px',
                    background: `${item.badgeColor}15`, color: item.badgeColor,
                    border: `1px solid ${item.badgeColor}30`, letterSpacing: '0.8px',
                  }}>{item.badge}</span>
                </div>
                <div style={{ fontSize: '12px', color: item.color, opacity: 0.8 }}>{item.subtitle}</div>
              </div>
            </div>

            {/* Description */}
            <p style={{ margin: '0 0 18px 0', fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.75 }}>
              {item.description}
            </p>

            {/* Tags */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '22px' }}>
              {item.tags.map(tag => (
                <span key={tag} style={{
                  fontSize: '11px', padding: '3px 10px', borderRadius: '4px',
                  background: `${item.color}0d`, color: item.color,
                  border: `1px solid ${item.color}25`,
                }}>{tag}</span>
              ))}
            </div>

            {/* CTA */}
            <a
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                padding: '11px 22px',
                background: `linear-gradient(135deg, ${item.color}, ${item.color}aa)`,
                color: item.color === '#00ffcc' ? '#000' : '#fff',
                borderRadius: '9px', fontWeight: 700,
                fontSize: '13px', textDecoration: 'none',
                boxShadow: `0 4px 18px ${item.color}25`,
                transition: 'opacity 0.2s ease',
              }}
              onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.opacity = '0.85'}
              onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.opacity = '1'}
            >
              {item.cta}
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LivePortfolio;
