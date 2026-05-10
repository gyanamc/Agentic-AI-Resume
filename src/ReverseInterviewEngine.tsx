import { useState, useRef, type ChangeEvent } from 'react';

const ReverseInterviewEngine = () => {
  const [jdText, setJdText] = useState('');
  const [jdFile, setJdFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setJdFile(e.target.files[0]);
      setJdText('');
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type === 'application/pdf') {
      setJdFile(file);
      setJdText('');
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

      const data = await response.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const scoreColor = result
    ? result.score >= 75
      ? '#00ffcc'
      : result.score >= 50
      ? '#0088ff'
      : '#ff5555'
    : '#00ffcc';

  return (
    <div className="h-full flex flex-col overflow-hidden rounded-2xl"
      style={{ background: 'rgba(10,10,20,0.7)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.08)' }}>

      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <div>
          <h2 className="text-white font-semibold text-lg tracking-tight">Match Engine</h2>
          <p className="text-xs mt-0.5" style={{ color: '#666' }}>
            Drop a JD or paste text — LangGraph scores your fit instantly
          </p>
        </div>
        <div className="flex gap-2">
          <span className="text-xs px-3 py-1 rounded-full font-medium"
            style={{ background: 'rgba(0,255,204,0.08)', color: '#00ffcc', border: '1px solid rgba(0,255,204,0.2)' }}>
            ● OpenAI
          </span>
          <span className="text-xs px-3 py-1 rounded-full font-medium"
            style={{ background: 'rgba(0,136,255,0.08)', color: '#0088ff', border: '1px solid rgba(0,136,255,0.2)' }}>
            ● LangGraph
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 overflow-hidden gap-0">

        {/* ── Left: Input ── */}
        <div className="flex flex-col gap-4 p-6 overflow-y-auto"
          style={{ width: '45%', borderRight: '1px solid rgba(255,255,255,0.06)' }}>

          {/* Drop Zone */}
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => !jdFile && fileInputRef.current?.click()}
            className="relative flex flex-col items-center justify-center gap-2 rounded-xl cursor-pointer transition-all duration-300"
            style={{
              height: '120px',
              border: `1.5px dashed ${isDragging ? '#00ffcc' : jdFile ? '#0088ff' : 'rgba(255,255,255,0.15)'}`,
              background: isDragging
                ? 'rgba(0,255,204,0.05)'
                : jdFile
                ? 'rgba(0,136,255,0.05)'
                : 'rgba(255,255,255,0.02)',
              boxShadow: isDragging ? '0 0 24px rgba(0,255,204,0.15)' : 'none',
            }}
          >
            <input type="file" accept="application/pdf" style={{ display: 'none' }}
              ref={fileInputRef} onChange={handleFileUpload} />

            {jdFile ? (
              <>
                <div className="text-2xl">📄</div>
                <p className="text-sm font-medium" style={{ color: '#0088ff' }}>{jdFile.name}</p>
                <button
                  onClick={(e) => { e.stopPropagation(); clearFile(); }}
                  className="text-xs px-3 py-1 rounded-full transition-all"
                  style={{ background: 'rgba(255,85,85,0.1)', color: '#ff5555', border: '1px solid rgba(255,85,85,0.3)' }}>
                  Remove
                </button>
              </>
            ) : (
              <>
                <div className="text-2xl opacity-40">⬆️</div>
                <p className="text-sm" style={{ color: '#555' }}>
                  Drop PDF here or <span style={{ color: '#00ffcc' }}>browse</span>
                </p>
              </>
            )}
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.07)' }} />
            <span className="text-xs" style={{ color: '#444' }}>or paste text</span>
            <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.07)' }} />
          </div>

          {/* Textarea */}
          <textarea
            value={jdText}
            onChange={(e) => setJdText(e.target.value)}
            disabled={!!jdFile}
            placeholder="Paste the Job Description here..."
            className="flex-1 rounded-xl p-4 text-sm resize-none outline-none transition-all duration-200 font-mono"
            style={{
              minHeight: '180px',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
              color: jdFile ? '#333' : '#ccc',
              caretColor: '#00ffcc',
            }}
            onFocus={(e) => e.currentTarget.style.borderColor = 'rgba(0,255,204,0.3)'}
            onBlur={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'}
          />

          {/* CTA Button */}
          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing || (!jdText.trim() && !jdFile)}
            className="relative w-full py-3.5 rounded-xl font-bold text-sm tracking-wide transition-all duration-300 overflow-hidden"
            style={{
              background: isAnalyzing || (!jdText.trim() && !jdFile)
                ? 'rgba(255,255,255,0.05)'
                : 'linear-gradient(135deg, #00ffcc, #0088ff)',
              color: isAnalyzing || (!jdText.trim() && !jdFile) ? '#444' : '#000',
              boxShadow: isAnalyzing || (!jdText.trim() && !jdFile)
                ? 'none'
                : '0 4px 24px rgba(0,255,204,0.3)',
              cursor: isAnalyzing || (!jdText.trim() && !jdFile) ? 'not-allowed' : 'pointer',
            }}
          >
            {isAnalyzing ? (
              <span className="flex items-center justify-center gap-2">
                <span className="inline-block w-4 h-4 rounded-full border-2 border-t-transparent animate-spin"
                  style={{ borderColor: '#555', borderTopColor: 'transparent' }} />
                Analyzing via LangGraph...
              </span>
            ) : (
              '⚡ Generate Match & Strategy'
            )}
          </button>

          {error && (
            <div className="text-xs px-4 py-3 rounded-xl"
              style={{ background: 'rgba(255,85,85,0.08)', color: '#ff5555', border: '1px solid rgba(255,85,85,0.2)' }}>
              ⚠ {error}
            </div>
          )}
        </div>

        {/* ── Right: Output ── */}
        <div className="flex-1 p-6 overflow-y-auto flex flex-col gap-4">

          {/* Idle state */}
          {!isAnalyzing && !result && (
            <div className="flex-1 flex flex-col items-center justify-center gap-3 opacity-30">
              <div className="text-5xl">🎯</div>
              <p className="text-sm text-center" style={{ color: '#555' }}>
                Results will appear here<br />after analysis
              </p>
            </div>
          )}

          {/* Loading skeleton */}
          {isAnalyzing && (
            <div className="flex flex-col gap-4 animate-pulse">
              <div className="h-28 rounded-2xl" style={{ background: 'rgba(255,255,255,0.04)' }} />
              <div className="h-20 rounded-2xl" style={{ background: 'rgba(255,255,255,0.03)' }} />
              <div className="h-36 rounded-2xl" style={{ background: 'rgba(255,255,255,0.03)' }} />
            </div>
          )}

          {/* Result */}
          {result && (
            <div className="flex flex-col gap-4" style={{ animation: 'fadeSlideIn 0.5s ease' }}>

              {/* Score Card */}
              <div className="rounded-2xl p-5 flex items-center gap-5"
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: `1px solid ${scoreColor}30`,
                  boxShadow: `0 0 32px ${scoreColor}15`,
                }}>
                {/* Circular score */}
                <div className="relative flex-shrink-0" style={{ width: '88px', height: '88px' }}>
                  <svg width="88" height="88" viewBox="0 0 88 88">
                    <circle cx="44" cy="44" r="36" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="6" />
                    <circle
                      cx="44" cy="44" r="36" fill="none"
                      stroke={scoreColor} strokeWidth="6"
                      strokeLinecap="round"
                      strokeDasharray={`${2 * Math.PI * 36}`}
                      strokeDashoffset={`${2 * Math.PI * 36 * (1 - result.score / 100)}`}
                      transform="rotate(-90 44 44)"
                      style={{ transition: 'stroke-dashoffset 1s ease', filter: `drop-shadow(0 0 6px ${scoreColor})` }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="font-bold text-xl" style={{ color: scoreColor }}>{result.score}%</span>
                  </div>
                </div>

                <div>
                  <div className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: scoreColor }}>
                    Match Score
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: '#bbb' }}>
                    {result.matchReason}
                  </p>
                </div>
              </div>

              {/* Strategy Header */}
              <div className="flex items-center gap-2 px-1">
                <span className="text-sm font-semibold" style={{ color: '#888' }}>⚡ 30-60-90 Day Strategy</span>
                <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />
              </div>

              {/* Strategy Cards */}
              {[
                { day: '30', text: result.strategy.day30, color: '#00ffcc', label: 'Onboard & Audit' },
                { day: '60', text: result.strategy.day60, color: '#0088ff', label: 'Build & Integrate' },
                { day: '90', text: result.strategy.day90, color: '#ff00cc', label: 'Scale & Deliver' },
              ].map(({ day, text, color, label }) => (
                <div key={day} className="rounded-xl p-4 flex gap-4"
                  style={{
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    borderLeft: `3px solid ${color}`,
                  }}>
                  <div className="flex-shrink-0 text-center" style={{ minWidth: '48px' }}>
                    <div className="text-xs font-bold" style={{ color }}>DAY</div>
                    <div className="text-2xl font-black leading-none" style={{ color }}>{day}</div>
                    <div className="text-xs mt-1" style={{ color: '#444' }}>{label}</div>
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: '#aaa' }}>{text}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .animate-spin { animation: spin 0.8s linear infinite; }
      `}</style>
    </div>
  );
};

export default ReverseInterviewEngine;
