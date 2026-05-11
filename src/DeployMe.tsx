import { useState } from 'react';

type Status = 'idle' | 'sending' | 'success' | 'error';

const DeployMe = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;

    setStatus('sending');
    setErrorMsg('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recruiter_name: name,
          recruiter_email: email,
          message,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || 'Failed to send email');
      }

      setStatus('success');
      setName('');
      setEmail('');
      setMessage('');
    } catch (err: any) {
      setStatus('error');
      setErrorMsg(err.message);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '10px',
    padding: '12px 16px',
    color: 'var(--text-primary)',
    fontSize: '14px',
    outline: 'none',
    transition: 'border-color 0.2s ease',
  };

  return (
    <div className="glass-panel" style={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

      {/* Header */}
      <div style={{ padding: '24px', borderBottom: '1px solid var(--border-color)' }}>
        <h2 style={{ margin: 0, fontSize: '20px' }}>Deploy Me</h2>
        <p style={{ color: 'var(--text-secondary)', margin: '8px 0 0 0', fontSize: '14px' }}>
          Interested in working together? Drop me a message and I'll get back to you.
        </p>
      </div>

      {/* Body */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px', overflowY: 'auto' }}>
        <div style={{ width: '100%', maxWidth: '480px' }}>

          {/* Success state */}
          {status === 'success' ? (
            <div style={{
              textAlign: 'center',
              padding: '48px 32px',
              background: 'rgba(0,255,204,0.05)',
              border: '1px solid rgba(0,255,204,0.2)',
              borderRadius: '16px',
            }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>✅</div>
              <h3 style={{ color: 'var(--accent-primary)', margin: '0 0 8px 0' }}>Message Sent!</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.6 }}>
                Thanks for reaching out. Kumar will get back to you shortly at your email.
              </p>
              <button
                onClick={() => setStatus('idle')}
                style={{
                  marginTop: '24px',
                  padding: '10px 24px',
                  background: 'transparent',
                  border: '1px solid rgba(0,255,204,0.3)',
                  borderRadius: '8px',
                  color: 'var(--accent-primary)',
                  cursor: 'pointer',
                  fontSize: '13px',
                }}
              >
                Send Another
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

              {/* Card wrapper */}
              <div style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '16px',
                padding: '28px',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                  <span style={{ fontSize: '20px' }}>✉️</span>
                  <span style={{ fontWeight: 600, fontSize: '16px' }}>Email Kumar</span>
                </div>

                {/* Name */}
                <div>
                  <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Your Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g. Priya Sharma"
                    required
                    style={inputStyle}
                    onFocus={e => e.currentTarget.style.borderColor = 'rgba(0,255,204,0.4)'}
                    onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}
                  />
                </div>

                {/* Email */}
                <div>
                  <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Your Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="recruiter@company.com"
                    required
                    style={inputStyle}
                    onFocus={e => e.currentTarget.style.borderColor = 'rgba(0,255,204,0.4)'}
                    onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}
                  />
                </div>

                {/* Message */}
                <div>
                  <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Message
                  </label>
                  <textarea
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    placeholder="Hi Kumar, I came across your profile and would love to discuss an opportunity..."
                    required
                    rows={5}
                    style={{ ...inputStyle, resize: 'none', fontFamily: 'inherit' }}
                    onFocus={e => e.currentTarget.style.borderColor = 'rgba(0,255,204,0.4)'}
                    onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}
                  />
                </div>

                {/* Error */}
                {status === 'error' && (
                  <div style={{
                    fontSize: '13px',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    background: 'rgba(255,85,85,0.08)',
                    border: '1px solid rgba(255,85,85,0.25)',
                    color: '#ff5555',
                  }}>
                    ⚠ {errorMsg}
                  </div>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={status === 'sending'}
                  style={{
                    padding: '14px',
                    borderRadius: '10px',
                    border: 'none',
                    background: status === 'sending'
                      ? 'rgba(255,255,255,0.06)'
                      : 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
                    color: status === 'sending' ? 'var(--text-secondary)' : '#000',
                    fontWeight: 700,
                    fontSize: '15px',
                    cursor: status === 'sending' ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: status === 'sending' ? 'none' : '0 4px 20px rgba(0,255,204,0.25)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                  }}
                >
                  {status === 'sending' ? (
                    <>
                      <span style={{
                        width: '14px', height: '14px', borderRadius: '50%',
                        border: '2px solid #555', borderTopColor: 'transparent',
                        display: 'inline-block',
                        animation: 'spin 0.8s linear infinite',
                      }} />
                      Sending...
                    </>
                  ) : (
                    '📨 Send Message'
                  )}
                </button>
              </div>

              <p style={{ textAlign: 'center', fontSize: '12px', color: 'var(--text-secondary)' }}>
                Message goes directly to <span style={{ color: 'var(--accent-primary)' }}>gyanamc@gmail.com</span>
              </p>
            </form>
          )}
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default DeployMe;
