import { useState } from 'react';

const NODES = {
  langgraph: {
    id: 'langgraph',
    title: 'LangGraph Orchestrator',
    layer: 'Orchestration & Logic',
    color: '#0088ff',
    reason:
      'Standard RAG is stateless and linear. I implemented LangGraph to build cyclic, stateful multi-agent workflows. This allows the system to self-correct, validate retrieval quality before answering, and perform multi-turn reasoning across complex user intents.',
  },
  vllm: {
    id: 'vllm',
    title: 'vLLM Inference Engine',
    layer: 'Compute & Inference',
    color: '#00ffcc',
    reason:
      'I chose vLLM over standard HuggingFace pipelines or Text Generation Inference (TGI) specifically for its PagedAttention mechanism. It dramatically increased our inference throughput and memory efficiency for high-concurrency enterprise workloads.',
  },
  rayserve: {
    id: 'rayserve',
    title: 'Ray Serve Cluster',
    layer: 'Distributed Serving',
    color: '#ff00cc',
    reason:
      'Crucial for distributed scaling. Ray Serve allowed us to seamlessly compose and scale our model replicas (Llama-3, Mistral) across our on-premise GPU cluster dynamically, guaranteeing a 99.9% uptime SLA.',
  },
  elk: {
    id: 'elk',
    title: 'ELK Stack (Elasticsearch)',
    layer: 'Vector Search & Data',
    color: '#ffcc00',
    reason:
      'Instead of procuring a new specialized vector database, we leveraged our existing Elasticsearch infrastructure for dense vector search (kNN). This maximized ROI while maintaining strict on-premise data sovereignty.',
  },
  mlflow: {
    id: 'mlflow',
    title: 'MLflow & Ragas',
    layer: 'MLOps & Observability',
    color: '#ff5555',
    reason:
      'I established a rigorous evaluation loop using Ragas (for metric-based assessment of faithfulness/relevancy) and MLflow for end-to-end experiment tracking, versioning, and latency observability.',
  },
};

const ArchitectureDiagram = () => {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const selectedNode = selectedNodeId ? (NODES as any)[selectedNodeId] : null;

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

      {/* Diagram area */}
      <div className="arch-body">
        <div className="arch-diagram">
          <div className="arch-nodes-wrapper">
            {/* Client layer */}
            <div className="arch-client-layer">
              Client Applications (SBI Card Recommender, Agent-Assist, Internal GPT)
            </div>

            {/* Orchestration */}
            <ArchitectureNode
              node={NODES.langgraph}
              isSelected={selectedNodeId === 'langgraph'}
              onClick={() => setSelectedNodeId(selectedNodeId === 'langgraph' ? null : 'langgraph')}
            />

            {/* Middle row */}
            <div className="arch-row">
              <ArchitectureNode node={NODES.vllm} isSelected={selectedNodeId === 'vllm'} onClick={() => setSelectedNodeId(selectedNodeId === 'vllm' ? null : 'vllm')} />
              <ArchitectureNode node={NODES.rayserve} isSelected={selectedNodeId === 'rayserve'} onClick={() => setSelectedNodeId(selectedNodeId === 'rayserve' ? null : 'rayserve')} />
            </div>

            {/* Bottom row */}
            <div className="arch-row">
              <ArchitectureNode node={NODES.elk} isSelected={selectedNodeId === 'elk'} onClick={() => setSelectedNodeId(selectedNodeId === 'elk' ? null : 'elk')} />
              <ArchitectureNode node={NODES.mlflow} isSelected={selectedNodeId === 'mlflow'} onClick={() => setSelectedNodeId(selectedNodeId === 'mlflow' ? null : 'mlflow')} />
            </div>
          </div>
        </div>

        {/* Desktop: slide-out side panel */}
        <div
          className="arch-side-panel"
          style={{ transform: selectedNodeId ? 'translateX(0)' : 'translateX(100%)' }}
        >
          {selectedNode && <NodeDetail node={selectedNode} onClose={() => setSelectedNodeId(null)} />}
        </div>
      </div>

      {/* Mobile: bottom sheet */}
      {selectedNode && (
        <div className="arch-bottom-sheet">
          <NodeDetail node={selectedNode} onClose={() => setSelectedNodeId(null)} />
        </div>
      )}
    </div>
  );
};

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

const ArchitectureNode = ({ node, isSelected, onClick }: any) => (
  <div
    onClick={onClick}
    className="arch-node"
    style={{
      background: isSelected ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.4)',
      border: `1px solid ${isSelected ? node.color : 'var(--border-color)'}`,
      boxShadow: isSelected ? `0 0 20px ${node.color}40` : 'none',
    }}
    onMouseEnter={(e) => { if (!isSelected) e.currentTarget.style.borderColor = node.color; }}
    onMouseLeave={(e) => { if (!isSelected) e.currentTarget.style.borderColor = 'var(--border-color)'; }}
  >
    <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: `${node.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: node.color }}></div>
    </div>
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontWeight: 'bold', fontSize: '15px', color: isSelected ? '#fff' : 'var(--text-primary)' }}>{node.title}</div>
      <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>{node.layer}</div>
    </div>
  </div>
);

export default ArchitectureDiagram;
