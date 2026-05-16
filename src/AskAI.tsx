// AskAI.tsx — Floating AI Chat Widget with real backend + markdown rendering
import { useState, useRef, useEffect } from 'react';

interface Msg { role: 'ai' | 'user'; text: string }

const SUGGESTIONS = [
  "What is Kumar's biggest achievement?",
  "Is he a fit for a CAIO role at a bank?",
  "What LLMs has Kumar worked with in production?",
  "Tell me about his RAG platform at SBI Card",
];

// ── Minimal markdown renderer ──────────────────────────────
// Handles: **bold**, `code`, # headers, bullet lists, line breaks
function renderMarkdown(text: string): React.ReactNode[] {
  const lines = text.split('\n');
  const nodes: React.ReactNode[] = [];

  lines.forEach((line, li) => {
    // Heading
    if (/^#{1,3}\s/.test(line)) {
      const content = line.replace(/^#{1,3}\s/, '');
      nodes.push(
        <div key={li} style={{ fontFamily: 'Playfair Display, serif', fontWeight: 700, fontSize: 13.5, color: 'var(--ivory)', marginTop: 10, marginBottom: 2 }}>
          {inlineFormat(content)}
        </div>
      );
    }
    // Bullet
    else if (/^[-*•]\s/.test(line)) {
      const content = line.replace(/^[-*•]\s/, '');
      nodes.push(
        <div key={li} style={{ display: 'flex', gap: 7, marginBottom: 3 }}>
          <span style={{ color: 'var(--olive)', flexShrink: 0, marginTop: 1 }}>•</span>
          <span>{inlineFormat(content)}</span>
        </div>
      );
    }
    // Empty line → spacer
    else if (line.trim() === '') {
      nodes.push(<div key={li} style={{ height: 6 }} />);
    }
    // Normal paragraph
    else {
      nodes.push(<div key={li} style={{ marginBottom: 2 }}>{inlineFormat(line)}</div>);
    }
  });

  return nodes;
}

function inlineFormat(text: string): React.ReactNode {
  // Split on **bold** and `code`
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
  return parts.map((part, i) => {
    if (/^\*\*[^*]+\*\*$/.test(part)) {
      return <strong key={i} style={{ color: 'var(--ivory)', fontWeight: 600 }}>{part.slice(2, -2)}</strong>;
    }
    if (/^`[^`]+`$/.test(part)) {
      return <code key={i} style={{ fontFamily: 'DM Mono, monospace', fontSize: 11, background: 'rgba(164,172,134,0.12)', padding: '1px 5px', borderRadius: 3, color: 'var(--olive)' }}>{part.slice(1, -1)}</code>;
    }
    return part;
  });
}

const AskAI = () => {
  const [open, setOpen]     = useState(false);
  const [msgs, setMsgs]     = useState<Msg[]>([
    { role: 'ai', text: "Hi! I'm Kumar's AI assistant.\n\nAsk me anything about his **experience**, **tech stack**, or **fit for your role**. 🌿" },
  ]);
  const [typing, setTyping] = useState(false);
  const [input, setInput]   = useState('');
  const [error, setError]   = useState<string | null>(null);
  const bottomRef           = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [msgs, typing]);

  const send = async (q: string) => {
    if (!q.trim() || typing) return;
    setMsgs(m => [...m, { role: 'user', text: q }]);
    setInput('');
    setTyping(true);
    setError(null);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: q }),
      });
      if (!res.ok) throw new Error('API error');
      const data = await res.json();
      setMsgs(m => [...m, { role: 'ai', text: data.answer }]);
    } catch {
      setError('Something went wrong. Please try again.');
      setMsgs(m => [...m, { role: 'ai', text: 'Sorry, I ran into an issue. Please try again or reach Kumar directly at **gyanamc@gmail.com**' }]);
    } finally {
      setTyping(false);
    }
  };

  return (
    <>
      <button className="ask-fab" onClick={() => setOpen(o => !o)} aria-label="Ask AI about Kumar">💬</button>
      <div className="ask-fab-tip">Ask AI about Kumar</div>

      {open && (
        <div className="chat-overlay" onClick={e => { if (e.target === e.currentTarget) setOpen(false); }}>
          <div className="chat-modal">
            <div className="chat-modal-head">
              <div className="chat-modal-title">
                <div style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--olive)', boxShadow: '0 0 6px var(--olive)', animation: 'pulseGlow 1.8s infinite' }} />
                Ask AI about Kumar
              </div>
              <button className="chat-modal-close" onClick={() => setOpen(false)}>✕</button>
            </div>

            <div className="chat-body">
              {msgs.map((m, i) => (
                <div key={i} className={`chat-msg ${m.role}`}>
                  {m.role === 'ai' ? renderMarkdown(m.text) : m.text}
                </div>
              ))}

              {/* Show suggestions only after the first AI message */}
              {msgs.length === 1 && !typing && (
                <div className="chat-suggestions">
                  {SUGGESTIONS.map((s, i) => (
                    <button key={i} className="chat-sq" onClick={() => send(s)}>{s}</button>
                  ))}
                </div>
              )}

              {typing && (
                <div className="chat-typing">
                  <span /><span /><span />
                </div>
              )}

              {error && (
                <div style={{ fontSize: 11, color: '#f87171', padding: '4px 8px' }}>{error}</div>
              )}

              <div ref={bottomRef} />
            </div>

            <div className="chat-modal-footer">
              <input
                className="chat-input"
                placeholder="Ask about Kumar's skills, experience..."
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && send(input)}
                disabled={typing}
              />
              <button className="chat-send-btn" onClick={() => send(input)} disabled={typing}>
                {typing ? '...' : 'Send'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AskAI;
