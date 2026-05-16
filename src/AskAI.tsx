// AskAI.tsx — Floating AI Chat Widget (Forest Canopy Theme)
import { useState, useRef, useEffect } from 'react';

interface Msg { role: 'ai' | 'user'; text: string }

const KB: Record<string, string> = {
  vllm: "Yes — Kumar has deep production experience with vLLM, including PagedAttention optimisation on SBI Card's on-premise GPU cluster. This resolved KV cache fragmentation under high concurrency and significantly improved throughput while keeping all data sovereign under RBI guidelines.",
  langgraph: "Absolutely. Kumar has been building with LangGraph since v0.1 and has 15+ production agentic workflows running at enterprise scale. He pioneered stateful multi-agent RAG at SBI Card — replacing single-pass pipelines with cyclic, self-correcting graphs.",
  caio: "Kumar is a strong CAIO candidate. He has already run an enterprise AI function at scale — 30+ production systems, 22M users, measurable business outcomes. His faculty roles at IIM Indore and ISB demonstrate executive communication and strategic thinking at board level.",
  leadership: "Kumar builds through technical credibility. He has grown a cross-functional AI team, managed GPU infrastructure vendors, established RBI-compliant AI governance, and regularly presents AI strategy to C-suite. Former team members consistently cite his clarity of direction and mentorship.",
  rag: "Kumar designed and deployed a full sovereign RAG platform on-premise for SBI Card — using Elasticsearch for vector kNN, LangGraph for stateful orchestration, and Guardrails.ai for pre/post validation. Fully air-gapped, RBI-compliant, serving 22M users.",
  default: "Based on Kumar's background he has direct production experience in that area. For a precise alignment score, use the Match Engine tab — paste your JD and get a tailored 30-60-90 day strategy.",
};

function getAnswer(q: string): string {
  const l = q.toLowerCase();
  if (l.includes('vllm') || l.includes('inference')) return KB.vllm;
  if (l.includes('langgraph') || l.includes('agentic') || l.includes('agent')) return KB.langgraph;
  if (l.includes('caio') || l.includes('chief ai') || l.includes('fit') || l.includes('suitable')) return KB.caio;
  if (l.includes('leader') || l.includes('manag') || l.includes('team')) return KB.leadership;
  if (l.includes('rag') || l.includes('retrieval') || l.includes('sovereign')) return KB.rag;
  return KB.default;
}

const SUGGESTIONS = [
  "Does Kumar have vLLM production experience?",
  "Is he a fit for a CAIO role at a bank?",
  "What is his leadership and team style?",
];

const AskAI = () => {
  const [open, setOpen]       = useState(false);
  const [msgs, setMsgs]       = useState<Msg[]>([
    { role: 'ai', text: "Hi! I'm Kumar's AI assistant. Ask me anything about his experience, tech stack, or fit for your role. 🌿" },
  ]);
  const [typing, setTyping]   = useState(false);
  const [input, setInput]     = useState('');
  const bottomRef             = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [msgs, typing]);

  const send = (q: string) => {
    if (!q.trim()) return;
    setMsgs(m => [...m, { role: 'user', text: q }]);
    setInput('');
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMsgs(m => [...m, { role: 'ai', text: getAnswer(q) }]);
    }, 950);
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
                <div key={i} className={`chat-msg ${m.role}`}>{m.text}</div>
              ))}
              {msgs.length === 1 && (
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
              <div ref={bottomRef} />
            </div>

            <div className="chat-modal-footer">
              <input
                className="chat-input"
                placeholder="Ask about Kumar's skills, experience..."
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && send(input)}
              />
              <button className="chat-send-btn" onClick={() => send(input)}>Send</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AskAI;
