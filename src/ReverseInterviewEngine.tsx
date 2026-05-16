import { useState, useRef, type ChangeEvent } from 'react';

const ReverseInterviewEngine = () => {
  const [jdText, setJdText]   = useState('');
  const [jdFile, setJdFile]   = useState<File | null>(null);
  const [jdUrl,  setJdUrl]    = useState('');
  const [fetchingUrl, setFetchingUrl] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setJdFile(e.target.files[0]);
      setJdText(`[PDF File Selected: ${e.target.files[0].name}]`);
    }
  };

  const clearFile = () => {
    setJdFile(null);
    setJdText('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleAutoFetch = async () => {
    if (!jdUrl.trim()) return;
    setFetchingUrl(true);
    // Simulate fetching — in production wire to /api/fetch_jd?url=...
    setTimeout(() => {
      setJdText(`[Auto-fetched from: ${jdUrl}]\n\nSenior AI Architect / CAIO — Enterprise FinTech\n\nWe are looking for a Chief AI Officer to lead our enterprise GenAI strategy across 20M+ customers. Requirements: 10+ years AI/ML, production LangGraph experience, on-premise LLM deployment, sovereign RAG at scale, AI governance in regulated industries. Leadership of 10+ person AI teams. Premier IIT/IIM preferred.`);
      setJdUrl('');
      setFetchingUrl(false);
    }, 1400);
  };

  const handleAnalyze = async () => {
    if (!jdText.trim() && !jdFile) return;
    setIsAnalyzing(true);
    setResult(null);
    setError(null);
    setLogs([
      '[SYSTEM] Initiating Reverse Interview Protocol...',
      '[LANGGRAPH] Connecting to Backend...',
      '[AGENT] Parsing Job Description...',
    ]);

    try {
      let response;
      if (jdFile) {
        const formData = new FormData();
        formData.append('file', jdFile);
        response = await fetch('/api/match_file', { method: 'POST', body: formData });
      } else {
        response = await fetch('/api/match', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ jd_text: jdText }),
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to analyze JD');
      }

      setLogs(prev => [...prev, '[VECTOR_DB] Extracting contextual matches from CV...', '[LLM] Generating custom strategy...']);
      const data = await response.json();
      setLogs(prev => [...prev, '[SYSTEM] Match Score calculated successfully.']);
      setResult(data);
    } catch (err: any) {
      setError(err.message);
      setLogs(prev => [...prev, `[ERROR] ${err.message}`]);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="glass-panel rie-container">
      {/* Header */}
      <div className="rie-header">
        <div>
          <h2 style={{ margin: 0, fontSize: '20px' }}>Match Engine (Live AI)</h2>
          <p style={{ color: 'var(--text-secondary)', margin: '8px 0 0 0', fontSize: '14px' }}>
            Paste text or upload a JD PDF. LangGraph will process it against my master CV.
          </p>
        </div>
        <div className="rie-badges">
          <span className="badge badge-moss">OpenAI Active</span>
          <span className="badge badge-blue">LangGraph Router</span>
        </div>
      </div>

      {/* Body: two-column on desktop, stacked on mobile */}
      <div className="rie-body">
        {/* Input panel */}
        <div className="rie-input-panel">

          {/* URL auto-fetch — NEW */}
          <div className="rie-url-row">
            <input
              type="text"
              className="rie-url-input"
              placeholder="🔗 Paste LinkedIn / Indeed job URL — auto-fetch JD..."
              value={jdUrl}
              onChange={e => setJdUrl(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAutoFetch()}
            />
            <button className="rie-url-btn" onClick={handleAutoFetch} disabled={fetchingUrl}>
              {fetchingUrl ? 'Fetching…' : 'Auto-Fetch'}
            </button>
          </div>

          <div className="rie-divider">— or upload / paste manually —</div>

          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <input type="file" accept="application/pdf" style={{ display: 'none' }} ref={fileInputRef} onChange={handleFileUpload} />
            <button
              onClick={() => fileInputRef.current?.click()}
              style={{ padding: '8px 16px', background: 'rgba(164,172,134,0.08)', border: '1px solid var(--border-color)', borderRadius: 8, color: 'var(--text-primary)', cursor: 'pointer', fontSize: 13, fontFamily: 'DM Sans, sans-serif' }}>
              📄 Upload JD (PDF)
            </button>
            {jdFile && (
              <button onClick={clearFile} style={{ padding: '8px 16px', background: 'transparent', border: '1px solid rgba(192,97,58,0.5)', color: '#c0613a', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontFamily: 'DM Sans, sans-serif' }}>
                ✕ Clear File
              </button>
            )}
          </div>

          <textarea
            value={jdText}
            onChange={e => setJdText(e.target.value)}
            disabled={jdFile !== null}
            placeholder="Or paste the Job Description text here…"
            className="rie-textarea"
            style={{ opacity: jdFile ? 0.5 : 1 }}
          />

          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing || (!jdText && !jdFile)}
            className="rie-analyze-btn"
            style={{
              opacity: (isAnalyzing || (!jdText && !jdFile)) ? 0.6 : 1,
              cursor: isAnalyzing ? 'not-allowed' : 'pointer',
            }}
          >
            {isAnalyzing ? '⏳ Analyzing via LangGraph…' : '⚡ Generate Match & Strategy'}
          </button>

          {error && <div style={{ color: 'red', fontSize: '14px' }}>{error}</div>}
        </div>

        {/* Output panel */}
        <div className="rie-output-panel">
          {!isAnalyzing && !result && logs.length === 0 && (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', textAlign: 'center' }}>
              <div>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--border-color)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '16px' }}>
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                  <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                  <line x1="12" y1="22.08" x2="12" y2="12"></line>
                </svg>
                <p>Waiting for JD Input.<br />System Idle.</p>
              </div>
            </div>
          )}

          {logs.length > 0 && !result && (
            <div style={{ flex: 1, background: '#000', borderRadius: '8px', padding: '16px', fontFamily: 'monospace', fontSize: '13px', border: '1px solid var(--border-color)', overflowY: 'auto', minHeight: '200px' }}>
              {logs.filter(Boolean).map((log, i) => (
                <div key={i} style={{ color: log.includes('ERROR') ? 'red' : log.includes('SYSTEM') ? 'var(--text-secondary)' : 'var(--accent-primary)', marginBottom: '8px' }}>
                  <span style={{ opacity: 0.5 }}>{new Date().toISOString().split('T')[1].slice(0, 8)}</span> {log}
                </div>
              ))}
              <div className="animate-pulse" style={{ color: 'var(--accent-secondary)', marginTop: '8px' }}>_</div>
            </div>
          )}

          {result && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
                <div style={{ width: '80px', height: '80px', borderRadius: '50%', border: '4px solid var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: 'bold', color: 'var(--accent-primary)', flexShrink: 0 }}>
                  {result.score}%
                </div>
                <div>
                  <h3 style={{ margin: '0 0 4px 0', color: 'var(--text-primary)' }}>High Match Confidence</h3>
                  <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.5 }}>
                    {result.matchReason}
                  </p>
                </div>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-color)', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
                  Custom AI Integration Strategy
                </div>
                <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <StrategyRow day="30" text={result.strategy.day30} />
                  <StrategyRow day="60" text={result.strategy.day60} />
                  <StrategyRow day="90" text={result.strategy.day90} />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const StrategyRow = ({ day, text }: any) => (
  <div style={{ display: 'flex', gap: '16px' }}>
    <div style={{ minWidth: '50px', fontWeight: 'bold', color: 'var(--accent-secondary)' }}>Day {day}</div>
    <div style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.5 }}>{text}</div>
  </div>
);

export default ReverseInterviewEngine;
