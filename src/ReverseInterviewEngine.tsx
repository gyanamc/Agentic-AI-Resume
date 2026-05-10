import { useState, useRef, type ChangeEvent } from 'react';

const ReverseInterviewEngine = () => {
  const [jdText, setJdText] = useState('');
  const [jdFile, setJdFile] = useState<File | null>(null);
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

  const handleAnalyze = async () => {
    if (!jdText.trim() && !jdFile) return;
    setIsAnalyzing(true);
    setResult(null);
    setError(null);
    setLogs(['[SYSTEM] Initiating Reverse Interview Protocol...', '[LANGGRAPH] Connecting to Backend...', '[AGENT] Parsing Job Description...']);

    try {
      let response;
      if (jdFile) {
        const formData = new FormData();
        formData.append("file", jdFile);
        response = await fetch('/api/match_file', {
          method: 'POST',
          body: formData,
        });
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
    <div className="glass-panel" style={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div style={{ padding: '24px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '20px' }}>Match Engine (Live AI)</h2>
          <p style={{ color: 'var(--text-secondary)', margin: '8px 0 0 0', fontSize: '14px' }}>
            Paste text or upload a JD PDF. LangGraph will process it against my master CV.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <span style={{ background: 'rgba(0, 255, 204, 0.1)', color: 'var(--accent-primary)', padding: '4px 12px', borderRadius: '16px', fontSize: '12px', border: '1px solid rgba(0, 255, 204, 0.3)' }}>
            OpenAI Active
          </span>
          <span style={{ background: 'rgba(0, 136, 255, 0.1)', color: 'var(--accent-secondary)', padding: '4px 12px', borderRadius: '16px', fontSize: '12px', border: '1px solid rgba(0, 136, 255, 0.3)' }}>
            LangGraph Router
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Left Side: Input */}
        <div style={{ width: '50%', padding: '24px', borderRight: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          <div style={{ display: 'flex', gap: '8px' }}>
            <input 
              type="file" 
              accept="application/pdf" 
              style={{ display: 'none' }} 
              ref={fileInputRef} 
              onChange={handleFileUpload} 
            />
            <button 
              onClick={() => fileInputRef.current?.click()}
              style={{ padding: '8px 16px', background: 'var(--panel-bg)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)', cursor: 'pointer' }}>
              📄 Upload JD (PDF)
            </button>
            {jdFile && (
              <button onClick={clearFile} style={{ padding: '8px 16px', background: 'transparent', border: '1px solid red', color: 'red', borderRadius: '8px', cursor: 'pointer' }}>
                Clear File
              </button>
            )}
          </div>

          <textarea
            value={jdText}
            onChange={(e) => setJdText(e.target.value)}
            disabled={jdFile !== null}
            placeholder={jdFile ? '' : "Or paste the Job Description text here..."}
            style={{
              flex: 1,
              background: 'rgba(0,0,0,0.3)',
              border: '1px solid var(--border-color)',
              borderRadius: '8px',
              padding: '16px',
              color: 'var(--text-primary)',
              fontFamily: 'monospace',
              fontSize: '14px',
              resize: 'none',
              outline: 'none',
              opacity: jdFile ? 0.5 : 1
            }}
          />
          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing || (!jdText && !jdFile)}
            style={{
              padding: '16px',
              background: isAnalyzing ? 'var(--border-color)' : 'var(--accent-primary)',
              color: isAnalyzing ? 'var(--text-secondary)' : '#000',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 'bold',
              fontSize: '16px',
              cursor: isAnalyzing ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: isAnalyzing ? 'none' : '0 4px 14px rgba(0, 255, 204, 0.4)'
            }}
          >
            {isAnalyzing ? 'Analyzing via LangGraph...' : 'Generate Match & Strategy'}
          </button>

          {error && <div style={{ color: 'red', fontSize: '14px', marginTop: '8px' }}>{error}</div>}
        </div>

        {/* Right Side: Output */}
        <div style={{ width: '50%', padding: '24px', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
          {!isAnalyzing && !result && logs.length === 0 && (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', textAlign: 'center' }}>
              <div>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--border-color)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '16px' }}><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
                <p>Waiting for JD Input.<br/>System Idle.</p>
              </div>
            </div>
          )}

          {logs.length > 0 && !result && (
            <div style={{ flex: 1, background: '#000', borderRadius: '8px', padding: '16px', fontFamily: 'monospace', fontSize: '13px', border: '1px solid var(--border-color)', overflowY: 'auto' }}>
              {logs.filter(Boolean).map((log, i) => (
                <div key={i} style={{ color: log.includes('ERROR') ? 'red' : log.includes('SYSTEM') ? 'var(--text-secondary)' : 'var(--accent-primary)', marginBottom: '8px' }}>
                  <span style={{ opacity: 0.5 }}>{new Date().toISOString().split('T')[1].slice(0,8)}</span> {log}
                </div>
              ))}
              <div className="animate-pulse" style={{ color: 'var(--accent-secondary)', marginTop: '8px' }}>_</div>
            </div>
          )}

          {result && (
            <div style={{ animation: 'fadeIn 0.5s ease' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                <div style={{ width: '80px', height: '80px', borderRadius: '50%', border: '4px solid var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: 'bold', color: 'var(--accent-primary)' }}>
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
