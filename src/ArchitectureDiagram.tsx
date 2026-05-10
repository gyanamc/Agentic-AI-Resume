import { useState } from 'react';

const NODES = {
  langgraph: {
    id: 'langgraph',
    title: 'LangGraph Orchestrator',
    layer: 'Orchestration & Logic',
    color: '#0088ff',
    reason: "Standard RAG is stateless and linear. I implemented LangGraph to build cyclic, stateful multi-agent workflows. This allows the system to self-correct, validate retrieval quality before answering, and perform multi-turn reasoning across complex user intents."
  },
  vllm: {
    id: 'vllm',
    title: 'vLLM Inference Engine',
    layer: 'Compute & Inference',
    color: '#00ffcc',
    reason: "I chose vLLM over standard HuggingFace pipelines or Text Generation Inference (TGI) specifically for its PagedAttention mechanism. It dramatically increased our inference throughput and memory efficiency for high-concurrency enterprise workloads."
  },
  rayserve: {
    id: 'rayserve',
    title: 'Ray Serve Cluster',
    layer: 'Distributed Serving',
    color: '#ff00cc',
    reason: "Crucial for distributed scaling. Ray Serve allowed us to seamlessly compose and scale our model replicas (Llama-3, Mistral) across our on-premise GPU cluster dynamically, guaranteeing a 99.9% uptime SLA."
  },
  elk: {
    id: 'elk',
    title: 'ELK Stack (Elasticsearch)',
    layer: 'Vector Search & Data',
    color: '#ffcc00',
    reason: "Instead of procuring a new specialized vector database, we leveraged our existing Elasticsearch infrastructure for dense vector search (kNN). This maximized ROI while maintaining strict on-premise data sovereignty."
  },
  mlflow: {
    id: 'mlflow',
    title: 'MLflow & Ragas',
    layer: 'MLOps & Observability',
    color: '#ff5555',
    reason: "I established a rigorous evaluation loop using Ragas (for metric-based assessment of faithfulness/relevancy) and MLflow for end-to-end experiment tracking, versioning, and latency observability."
  },
  gptoss: {
    id: 'gptoss',
    title: 'GPT-OSS 20B',
    layer: 'LLM Models',
    color: '#a78bfa',
    reason: "Deployed on-premise via vLLM on NVIDIA A40 GPUs. GPT-OSS 20B handles our most demanding long-context tasks — specifically use cases requiring up to 24k output tokens. Its large parameter count gives it the reasoning depth needed for complex multi-step document generation and analysis workflows."
  },
  mistral: {
    id: 'mistral',
    title: 'Mistral 7B',
    layer: 'LLM Models',
    color: '#fb923c',
    reason: "Deployed via vLLM on NVIDIA A40 GPUs. Mistral 7B is our workhorse for lightweight, low-latency tasks where output is under 500 tokens. Its efficiency at this token range means faster response times and lower GPU memory pressure, making it ideal for real-time agent-assist and short-form generation tasks."
  },
  gemma: {
    id: 'gemma',
    title: 'Gemma 7B',
    layer: 'LLM Models',
    color: '#34d399',
    reason: "Deployed via vLLM on NVIDIA A40 GPUs. Gemma 7B is our dedicated reasoning model. Google's architecture optimizations give it strong structured reasoning capabilities, making it the right choice for tasks requiring logical inference, step-by-step problem solving, and structured output generation."
  },
  minilm: {
    id: 'minilm',
    title: 'all-MiniLM-L6-v2',
    layer: 'Embedding Model',
    color: '#f472b6',
    reason: "This sentence-transformers model generates dense vector embeddings for all documents and queries ingested into our Elasticsearch kNN index. Its compact size (22M parameters) delivers fast, high-quality semantic embeddings with minimal GPU overhead — a deliberate trade-off to keep embedding throughput high without consuming A40 capacity reserved for generative models."
  }
};

const ArchitectureDiagram = () => {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  const selectedNode = selectedNodeId ? (NODES as any)[selectedNodeId] : null;

  return (
    <div className="glass-panel" style={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div style={{ padding: '24px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '20px' }}>Sovereign On-Premise RAG Platform</h2>
          <p style={{ color: 'var(--text-secondary)', margin: '8px 0 0 0', fontSize: '14px' }}>
            Interactive System Design. Click a component to view the architectural trade-offs.
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden', position: 'relative' }}>

        {/* Left Side: The Diagram */}
        <div style={{ flex: 1, padding: '40px', position: 'relative', overflowY: 'auto' }}>

          <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '32px', alignItems: 'center' }}>

            {/* User Layer */}
            <div style={{ border: '1px dashed var(--text-secondary)', padding: '16px', borderRadius: '16px', width: '100%', textAlign: 'center', color: 'var(--text-secondary)' }}>
              Client Applications (SBI Card Recommender, Agent-Assist, Internal GPT)
            </div>

            {/* Orchestration */}
            <ArchitectureNode node={NODES.langgraph} isSelected={selectedNodeId === 'langgraph'} onClick={() => setSelectedNodeId('langgraph')} />

            {/* Inference + Serving */}
            <div style={{ display: 'flex', gap: '40px', width: '100%', justifyContent: 'center' }}>
              <ArchitectureNode node={NODES.vllm} isSelected={selectedNodeId === 'vllm'} onClick={() => setSelectedNodeId('vllm')} />
              <ArchitectureNode node={NODES.rayserve} isSelected={selectedNodeId === 'rayserve'} onClick={() => setSelectedNodeId('rayserve')} />
            </div>

            {/* LLM Models Layer Label */}
            <div style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ flex: 1, height: '1px', background: 'rgba(167,139,250,0.2)' }} />
              <span style={{ fontSize: '11px', color: '#a78bfa', textTransform: 'uppercase', letterSpacing: '1.5px', whiteSpace: 'nowrap' }}>
                LLM Models — NVIDIA A40 On-Premise
              </span>
              <div style={{ flex: 1, height: '1px', background: 'rgba(167,139,250,0.2)' }} />
            </div>

            {/* LLM Models Row */}
            <div style={{ display: 'flex', gap: '24px', width: '100%', justifyContent: 'center', flexWrap: 'wrap' }}>
              <ArchitectureNode node={NODES.gptoss}  isSelected={selectedNodeId === 'gptoss'}  onClick={() => setSelectedNodeId('gptoss')}  compact />
              <ArchitectureNode node={NODES.mistral} isSelected={selectedNodeId === 'mistral'} onClick={() => setSelectedNodeId('mistral')} compact />
              <ArchitectureNode node={NODES.gemma}   isSelected={selectedNodeId === 'gemma'}   onClick={() => setSelectedNodeId('gemma')}   compact />
              <ArchitectureNode node={NODES.minilm}  isSelected={selectedNodeId === 'minilm'}  onClick={() => setSelectedNodeId('minilm')}  compact />
            </div>

            {/* Vector Search + MLOps */}
            <div style={{ display: 'flex', gap: '40px', width: '100%', justifyContent: 'center' }}>
              <ArchitectureNode node={NODES.elk}    isSelected={selectedNodeId === 'elk'}    onClick={() => setSelectedNodeId('elk')} />
              <ArchitectureNode node={NODES.mlflow} isSelected={selectedNodeId === 'mlflow'} onClick={() => setSelectedNodeId('mlflow')} />
            </div>

          </div>

          {/* SVG Background Lines (Decorative) */}
          <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: -1 }}>
            <line x1="50%" y1="120" x2="50%" y2="180" stroke="var(--border-color)" strokeWidth="2" strokeDasharray="4 4" />
            <line x1="50%" y1="280" x2="50%" y2="340" stroke="var(--border-color)" strokeWidth="2" />
          </svg>
        </div>

        {/* Right Side: Slide Out Panel */}
        <div style={{
          width: '350px',
          borderLeft: '1px solid var(--border-color)',
          background: 'var(--panel-bg)',
          transform: selectedNodeId ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          position: 'absolute',
          right: 0,
          top: 0,
          bottom: 0,
          display: 'flex',
          flexDirection: 'column'
        }}>

          {selectedNode && (
            <>
              <div style={{ padding: '24px', borderBottom: `2px solid ${selectedNode.color}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ margin: 0 }}>{selectedNode.title}</h3>
                <button
                  onClick={() => setSelectedNodeId(null)}
                  style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '18px' }}
                >✕</button>
              </div>

              <div style={{ padding: '24px', flex: 1, overflowY: 'auto' }}>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Layer</div>
                <div style={{ marginBottom: '24px', color: selectedNode.color, fontWeight: 'bold' }}>{selectedNode.layer}</div>

                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Architectural Rationale</div>
                <div style={{ lineHeight: 1.6, color: 'var(--text-primary)', fontSize: '15px' }}>
                  {selectedNode.reason}
                </div>
              </div>

              <div style={{ padding: '16px 24px', borderTop: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.3)', fontSize: '12px', color: 'var(--text-secondary)', display: 'flex', justifyContent: 'space-between' }}>
                <span>Status: Deployed</span>
                <span style={{ color: '#00ffcc' }}>● Active</span>
              </div>
            </>
          )}
        </div>

      </div>
    </div>
  );
};

const ArchitectureNode = ({ node, isSelected, onClick, compact }: any) => {
  return (
    <div
      onClick={onClick}
      style={{
        width: compact ? '180px' : '260px',
        padding: compact ? '16px' : '24px',
        background: isSelected ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.4)',
        border: `1px solid ${isSelected ? node.color : 'var(--border-color)'}`,
        borderRadius: '12px',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        boxShadow: isSelected ? `0 0 20px ${node.color}40` : 'none',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '10px',
        position: 'relative'
      }}
      onMouseEnter={(e) => {
        if (!isSelected) e.currentTarget.style.borderColor = node.color;
      }}
      onMouseLeave={(e) => {
        if (!isSelected) e.currentTarget.style.borderColor = 'var(--border-color)';
      }}
    >
      <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: `${node.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: node.color }}></div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontWeight: 'bold', fontSize: compact ? '13px' : '16px', color: isSelected ? '#fff' : 'var(--text-primary)' }}>{node.title}</div>
        <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px' }}>{node.layer}</div>
      </div>
    </div>
  );
};

export default ArchitectureDiagram;
