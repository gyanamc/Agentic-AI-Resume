const INSTITUTIONS = [
  {
    name: 'IIM Indore',
    role: 'Guest Faculty',
    topics: ['AI Strategy', 'Technology Leadership', 'AI Governance'],
    color: '#00ffcc',
    logo: '🎓',
  },
  {
    name: 'ISB (Indian School of Business)',
    role: 'Guest Faculty',
    topics: ['Generative AI for Business', 'Enterprise AI Transformation', 'Responsible AI'],
    color: '#0088ff',
    logo: '🏛️',
  },
];

const SPEAKING_TOPICS = [
  {
    title: 'Sovereign On-Premise GenAI',
    desc: 'Building air-gapped, financially-regulated AI infrastructure without compromising capability.',
    icon: '🔒',
    color: '#00ffcc',
  },
  {
    title: 'Agentic RAG at Scale',
    desc: 'Moving beyond static RAG pipelines to stateful, self-correcting multi-agent workflows using LangGraph.',
    icon: '🤖',
    color: '#0088ff',
  },
  {
    title: 'AI Governance & Compliance',
    desc: 'Designing board-approved AI roadmaps, guardrail frameworks, and HITL architectures for regulated industries.',
    icon: '⚖️',
    color: '#a78bfa',
  },
  {
    title: 'LLM Inference Optimisation',
    desc: 'Practical trade-offs between GPT-OSS, Mistral, and Gemma for enterprise workloads — cost, latency, and accuracy.',
    icon: '⚡',
    color: '#fb923c',
  },
  {
    title: 'AI-Driven Business Transformation',
    desc: '400% growth in bill payments, 75+ FTE savings — translating AI architecture into measurable business outcomes.',
    icon: '📈',
    color: '#34d399',
  },
  {
    title: 'Human-in-the-Loop Systems',
    desc: 'Engineering HITL frameworks that allow real-time correction of model bias without breaking production SLAs.',
    icon: '🧠',
    color: '#f472b6',
  },
];

const PUBLICATIONS_QUOTES = [
  {
    quote: "I built an Agentic AI bot to deprecate my own traditional resume. Instead of reading, talk to it.",
    context: "Personal AI Portfolio — gyanam.store",
    color: '#00ffcc',
  },
  {
    quote: "Sovereign AI isn't a constraint — it's a competitive advantage. When your data never leaves your walls, trust becomes your moat.",
    context: "AI Strategy, SBI Card",
    color: '#0088ff',
  },
  {
    quote: "The best AI systems aren't the ones with the biggest models. They're the ones that know when to say no.",
    context: "On Guardrails & Responsible AI",
    color: '#a78bfa',
  },
];

const ThoughtLeadership = () => {
  return (
    <div className="glass-panel" style={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

      {/* Header */}
      <div style={{ padding: '24px', borderBottom: '1px solid var(--border-color)' }}>
        <h2 style={{ margin: 0, fontSize: '20px' }}>Thought Leadership</h2>
        <p style={{ color: 'var(--text-secondary)', margin: '8px 0 0 0', fontSize: '14px' }}>
          Faculty · Speaking Topics · Perspectives on Enterprise AI
        </p>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '28px', display: 'flex', flexDirection: 'column', gap: '32px' }}>

        {/* Faculty Section */}
        <section>
          <SectionLabel label="Academic Leadership" />
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginTop: '16px' }}>
            {INSTITUTIONS.map((inst) => (
              <div key={inst.name} style={{
                flex: '1 1 220px',
                padding: '20px',
                background: 'rgba(255,255,255,0.02)',
                border: `1px solid ${inst.color}30`,
                borderLeft: `3px solid ${inst.color}`,
                borderRadius: '12px',
              }}>
                <div style={{ fontSize: '28px', marginBottom: '10px' }}>{inst.logo}</div>
                <div style={{ fontWeight: 700, fontSize: '15px', color: inst.color }}>{inst.name}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px', marginBottom: '12px' }}>{inst.role}</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {inst.topics.map(t => (
                    <span key={t} style={{
                      fontSize: '11px', padding: '3px 8px', borderRadius: '4px',
                      background: `${inst.color}15`, color: inst.color,
                      border: `1px solid ${inst.color}30`,
                    }}>{t}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Speaking Topics */}
        <section>
          <SectionLabel label="Speaking Topics" />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '14px', marginTop: '16px' }}>
            {SPEAKING_TOPICS.map((topic) => (
              <div key={topic.title} style={{
                padding: '18px',
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: '12px',
                transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
                cursor: 'default',
              }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = topic.color + '60';
                  (e.currentTarget as HTMLDivElement).style.boxShadow = `0 0 16px ${topic.color}15`;
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.07)';
                  (e.currentTarget as HTMLDivElement).style.boxShadow = 'none';
                }}
              >
                <div style={{ fontSize: '22px', marginBottom: '10px' }}>{topic.icon}</div>
                <div style={{ fontWeight: 600, fontSize: '14px', color: topic.color, marginBottom: '6px' }}>{topic.title}</div>
                <div style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{topic.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Quotes / Perspectives */}
        <section>
          <SectionLabel label="Perspectives" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '16px' }}>
            {PUBLICATIONS_QUOTES.map((q, i) => (
              <div key={i} style={{
                padding: '20px 24px',
                background: 'rgba(255,255,255,0.02)',
                borderLeft: `3px solid ${q.color}`,
                borderRadius: '0 12px 12px 0',
                border: `1px solid rgba(255,255,255,0.06)`,
                borderLeftColor: q.color,
              }}>
                <p style={{ margin: '0 0 10px 0', fontSize: '15px', color: 'var(--text-primary)', lineHeight: 1.7, fontStyle: 'italic' }}>
                  "{q.quote}"
                </p>
                <span style={{ fontSize: '12px', color: q.color }}>— {q.context}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Live Portfolio CTA */}
        <section>
          <div style={{
            padding: '24px',
            background: 'rgba(0,255,204,0.04)',
            border: '1px solid rgba(0,255,204,0.15)',
            borderRadius: '14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px',
          }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: '15px', color: 'var(--accent-primary)' }}>30+ Production AI Systems</div>
              <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                Live portfolio at gyanam.store — real systems, real scale, real impact.
              </div>
            </div>
            <a
              href="https://gyanam.store"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                padding: '10px 20px',
                background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
                color: '#000',
                borderRadius: '8px',
                fontWeight: 700,
                fontSize: '13px',
                textDecoration: 'none',
                whiteSpace: 'nowrap',
                boxShadow: '0 4px 16px rgba(0,255,204,0.2)',
              }}
            >
              View Live Portfolio →
            </a>
          </div>
        </section>

      </div>
    </div>
  );
};

const SectionLabel = ({ label }: { label: string }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
    <span style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1.5px', whiteSpace: 'nowrap' }}>
      {label}
    </span>
    <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.07)' }} />
  </div>
);

export default ThoughtLeadership;
