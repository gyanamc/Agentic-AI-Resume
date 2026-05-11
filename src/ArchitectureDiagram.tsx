import { useState } from 'react';

const NODES = {
  fastapi: {
    id: 'fastapi',
    title: 'FastAPI Gateway',
    layer: 'API Layer',
    color: '#06b6d4',
    reason: "FastAPI serves as the primary integration layer connecting the RAG platform with SBI Card's broader enterprise ecosystem. It exposes RESTful endpoints that receive queries from internal systems — including the Card Recommender engine, Agent-Assist platform, and Internal GPT portal. It handles request validation, authentication, rate limiting, and async routing before forwarding clean payloads to the LangGraph orchestrator. On the response side, it serializes and returns structured outputs back to the calling systems. Chosen for its async-first design, automatic OpenAPI documentation, and Pydantic-based schema validation which aligns with our strict data contract requirements.",
  },
  langgraph: {
    id: 'langgraph',
    title: 'LangGraph Orchestrator',
    layer: 'Orchestration & Logic',
    color: '#0088ff',
    reason: 'Standard RAG is stateless and linear. I implemented LangGraph to build cyclic, stateful multi-agent workflows. This allows the system to self-correct, validate retrieval quality before answering, and perform multi-turn reasoning across complex user intents.',
  },
  vllm: {
    id: 'vllm',
    title: 'vLLM Inference Engine',
    layer: 'Compute & Inference',
    color: '#00ffcc',
    reason: 'I chose vLLM over standard HuggingFace pipelines or Text Generation Inference (TGI) specifically for its PagedAttention mechanism. It dramatically increased our inference throughput and memory efficiency for high-concurrency enterprise workloads.',
  },
  rayserve: {
    id: 'rayserve',
    title: 'Ray Serve Cluster',
    layer: 'Distributed Serving',
    color: '#ff00cc',
    reason: 'Crucial for distributed scaling. Ray Serve allowed us to seamlessly compose and scale our model replicas (Llama-3, Mistral) across our on-premise GPU cluster dynamically, guaranteeing a 99.9% uptime SLA.',
  },
  elk: {
    id: 'elk',
    title: 'ELK Stack (Elasticsearch)',
    layer: 'Vector Search & Data',
    color: '#ffcc00',
    reason: 'Instead of procuring a new specialized vector database, we leveraged our existing Elasticsearch infrastructure for dense vector search (kNN). This maximized ROI while maintaining strict on-premise data sovereignty.',
  },
  mlflow: {
    id: 'mlflow',
    title: 'MLflow & Ragas',
    layer: 'MLOps & Observability',
    color: '#ff5555',
    reason: 'I established a rigorous evaluation loop using Ragas (for metric-based assessment of faithfulness/relevancy) and MLflow for end-to-end experiment tracking, versioning, and latency observability.',
  },
  pre_guardrail: {
    id: 'pre_guardrail',
    title: 'Pre-Guardrail',
    layer: 'Guardrails.ai — Input Validation',
    color: '#f97316',
    reason: "Before any user input reaches the LLM, it passes through Guardrails.ai's pre-guardrail pipeline. This validates the incoming data against multiple policies in parallel: PII detection (names, Aadhaar, PAN, account numbers), toxicity & hate speech screening, prompt injection attempts, and policy violations across multiple languages including Hindi and regional Indian languages. Only clean, policy-compliant input is forwarded to the LLM routing layer. Any violation triggers an immediate rejection with a safe fallback response — the LLM never sees the offending input.",
  },
  post_guardrail: {
    id: 'post_guardrail',
    title: 'Post-Guardrail',
    layer: 'Guardrails.ai — Output Validation',
    color: '#fb923c',
    reason: "After the LLM generates a response, it passes through Guardrails.ai's post-guardrail pipeline before being returned to the client. This checks for hallucination (verifying factual claims against the retrieved context), output toxicity, PII leakage in the generated text, and format/schema conformance. If the output fails validation, the system either triggers a re-generation with corrective instructions or returns a safe fallback — ensuring the end user always receives a grounded, policy-compliant response.",
  },
  gptoss: {
    id: 'gptoss',
    title: 'GPT-OSS 20B',
    layer: 'LLM Models',
    color: '#a78bfa',
    reason: 'Deployed on-premise via vLLM on NVIDIA A40 GPUs. GPT-OSS 20B handles our most demanding long-context tasks — specifically use cases requiring up to 24k output tokens. Its large parameter count gives it the reasoning depth needed for complex multi-step document generation and analysis workflows.',
  },
  mistral: {
    id: 'mistral',
    title: 'Mistral 7B',
    layer: 'LLM Models',
    color: '#fb923c',
    reason: 'Deployed via vLLM on NVIDIA A40 GPUs. Mistral 7B is our workhorse for lightweight, low-latency tasks where output is under 500 tokens. Its efficiency at this token range means faster response times and lower GPU memory pressure, making it ideal for real-time agent-assist and short-form generation tasks.',
  },
  gemma: {
    id: 'gemma',
    title: 'Gemma 7B',
    layer: 'LLM Models',
    color: '#34d399',
    reason: "Deployed via vLLM on NVIDIA A40 GPUs. Gemma 7B is our dedicated reasoning model. Google's architecture optimizations give it strong structured reasoning capabilities, making it the right choice for tasks requiring logical inference, step-by-step problem solving, and structured output generation.",
  },
  minilm: {
    id: 'minilm',
    title: 'all-MiniLM-L6-v2',
    layer: 'Embedding Model',
    color: '#f472b6',
    reason: 'This sentence-transformers model generates dense vector embeddings for all documents and queries ingested into our Elasticsearch kNN index. Its compact size (22M parameters) delivers fast, high-quality semantic embeddings with minimal GPU overhead — a deliberate trade-off to keep embedding throughput high without consuming A40 capacity reserved for generative models.',
  },
};

const ArchitectureDiagram = () => {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const selectedNode = selectedNodeId ? (NODES as any)[selectedNodeId] : null;

  const toggle = (id: string) => setSelectedNodeId(prev => prev === id ? null : id);

  return (
    <div className="glass-panel arch-container">
      {/* Header */}
      <div className="arch-header">
        <div>
          <h2 style={{ margin: 0, fontSize: '20px' }}>Sovereign On-Premise RAG Platform</h2>
          <p style={{ color: 'var(--text-secondary)', margin: '8px 0 0 0', fontSize: '14px' }}>
            Interactive System Design. Tap a component to view the architectural trade-offs.
          </p>
        </div>
      </div>

      {/* Body */}
      <div className="arch-body">
        {/* Diagram */}
        <div className="arch-diagram">
          <div className="arch-nodes-wrapper">

            {/* Client layer */}
            <div className="arch-client-layer">
              Client Applications (SBI Card Recommender, Agent-Assist, Internal GPT)
            </div>

            {/* FastAPI */}
            <ArchitectureNode node={NODES.fastapi} isSelected={selectedNodeId === 'fastapi'} onClick={() => toggle('fastapi')} />

            {/* LangGraph */}
            <ArchitectureNode node={NODES.langgraph} isSelected={selectedNodeId === 'langgraph'} onClick={() => toggle('langgraph')} />

            {/* Pre-Guardrail */}
            <GuardrailNode node={NODES.pre_guardrail} isSelected={selectedNodeId === 'pre_guardrail'} onClick={() => toggle('pre_guardrail')} label="INPUT" />

            {/* Inference + Serving */}
            <div className="arch-row">
              <ArchitectureNode node={NODES.vllm}     isSelected={selectedNodeId === 'vllm'}     onClick={() => toggle('vllm')} />
              <ArchitectureNode node={NODES.rayserve} isSelected={selectedNodeId === 'rayserve'} onClick={() => toggle('rayserve')} />
            </div>

            {/* LLM Models label */}
            <div style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ flex: 1, height: '1px', background: 'rgba(167,139,250,0.2)' }} />
              <span style={{ fontSize: '11px', color: '#a78bfa', textTransform: 'uppercase', letterSpacing: '1.5px', whiteSpace: 'nowrap' }}>
                LLM Models — NVIDIA A40 On-Premise
              </span>
              <div style={{ flex: 1, height: '1px', background: 'rgba(167,139,250,0.2)' }} />
            </div>

            {/* LLM Models row */}
            <div className="arch-row">
              <ArchitectureNode node={NODES.gptoss}  isSelected={selectedNodeId === 'gptoss'}  onClick={() => toggle('gptoss')}  compact />
              <ArchitectureNode node={NODES.mistral} isSelected={selectedNodeId === 'mistral'} onClick={() => toggle('mistral')} compact />
              <ArchitectureNode node={NODES.gemma}   isSelected={selectedNodeId === 'gemma'}   onClick={() => toggle('gemma')}   compact />
              <ArchitectureNode node={NODES.minilm}  isSelected={selectedNodeId === 'minilm'}  onClick={() => toggle('minilm')}  compact />
            </div>

            {/* Post-Guardrail */}
            <GuardrailNode node={NODES.post_guardrail} isSelected={selectedNodeId === 'post_guardrail'} onClick={() => toggle('post_guardrail')} label="OUTPUT" />

            {/* Vector Search + MLOps */}
            <div className="arch-row">
              <ArchitectureNode node={NODES.elk}    isSelected={selectedNodeId === 'elk'}    onClick={() => toggle('elk')} />
              <ArchitectureNode node={NODES.mlflow} isSelected={selectedNodeId === 'mlflow'} onClick={() => toggle('mlflow')} />
            </div>

          </div>
        </div>

        {/* Desktop slide-out panel */}
        <div
          className="arch-side-panel"
          style={{ transform: selectedNodeId ? 'translateX(0)' : 'translateX(100%)' }}
        >
          {selectedNode && <NodeDetail node={selectedNode} onClose={() => setSelectedNodeId(null)} />}
        </div>
      </div>

      {/* Mobile bottom sheet */}
      {selectedNode && (
        <div className="arch-bottom-sheet">
          <NodeDetail node={selectedNode} onClose={() => setSelectedNodeId(null)} />
        </div>
      )}
    </div>
  );
};

// ── Shared detail panel ────────────────────────────────────────────────────
const NodeDetail = ({ node, onClose }: { node: any; onClose: () => void }) => (
  <>
    <div style={{ padding: '20px 24px', borderBottom: `2px solid ${node.color}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <h3 style={{ margin: 0, fontSize: '16px' }}>{node.title}</h3>
      <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '18px' }}>✕</button>
    </div>
    <div style={{ padding: '20px 24px', flex: 1, overflowY: 'auto' }}>
      <div style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>Layer</div>
      <div style={{ marginBottom: '20px', color: node.color, fontWeight: 'bold' }}>{node.layer}</div>
      <div style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>Architectural Rationale</div>
      <div style={{ lineHeight: 1.6, color: 'var(--text-primary)', fontSize: '14px' }}>{node.reason}</div>
    </div>
    <div style={{ padding: '12px 24px', borderTop: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.3)', fontSize: '12px', color: 'var(--text-secondary)', display: 'flex', justifyContent: 'space-between' }}>
      <span>Status: Deployed</span>
      <span style={{ color: '#00ffcc' }}>● Active</span>
    </div>
  </>
);

// ── Architecture Node ──────────────────────────────────────────────────────
const ArchitectureNode = ({ node, isSelected, onClick, compact }: any) => (
  <div
    onClick={onClick}
    className={`arch-node ${compact ? 'arch-node-compact' : ''}`}
    style={{
      background: isSelected ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.4)',
      border: `1px solid ${isSelected ? node.color : 'var(--border-color)'}`,
      boxShadow: isSelected ? `0 0 20px ${node.color}40` : 'none',
    }}
    onMouseEnter={e => { if (!isSelected) e.currentTarget.style.borderColor = node.color; }}
    onMouseLeave={e => { if (!isSelected) e.currentTarget.style.borderColor = 'var(--border-color)'; }}
  >
    <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: `${node.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: node.color }} />
    </div>
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontWeight: 'bold', fontSize: compact ? '13px' : '15px', color: isSelected ? '#fff' : 'var(--text-primary)' }}>{node.title}</div>
      <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px' }}>{node.layer}</div>
    </div>
  </div>
);

// ── Guardrail Node ─────────────────────────────────────────────────────────
const GuardrailNode = ({ node, isSelected, onClick, label }: any) => (
  <div
    onClick={onClick}
    className="arch-guardrail-node"
    style={{
      background: isSelected ? `${node.color}15` : 'rgba(0,0,0,0.3)',
      border: `1px solid ${isSelected ? node.color : node.color + '40'}`,
      boxShadow: isSelected ? `0 0 20px ${node.color}30` : 'none',
    }}
    onMouseEnter={e => { if (!isSelected) e.currentTarget.style.borderColor = node.color; }}
    onMouseLeave={e => { if (!isSelected) e.currentTarget.style.borderColor = node.color + '40'; }}
  >
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: node.color, boxShadow: `0 0 6px ${node.color}`, flexShrink: 0 }} />
      <span style={{ fontWeight: 600, fontSize: '14px', color: node.color }}>{node.title}</span>
      <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Guardrails.ai</span>
    </div>
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
      <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '1px', padding: '3px 8px', borderRadius: '4px', background: `${node.color}20`, color: node.color, border: `1px solid ${node.color}40` }}>
        {label}
      </span>
      <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
        {label === 'INPUT'
          ? 'PII · Toxicity · Prompt Injection · Policy'
          : 'Hallucination · PII Leak · Format · Toxicity'}
      </span>
    </div>
  </div>
);

export default ArchitectureDiagram;
