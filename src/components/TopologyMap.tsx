'use client';

import { useEffect } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  type Edge,
  type Node,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { fallbackDoctrineGraph, type DoctrineGraphSnapshot, type DoctrineNodeSnapshot } from '@/lib/doctrine';
import { useDoctrineGraph } from '@/lib/useDoctrineGraph';

export default function TopologyMap() {
  const { data, error, isLoading } = useDoctrineGraph();
  const snapshot = data ?? fallbackDoctrineGraph;
  const [nodes, setNodes, onNodesChange] = useNodesState(buildNodes(snapshot));
  const [edges, setEdges, onEdgesChange] = useEdgesState(buildEdges(snapshot));

  useEffect(() => {
    setNodes(buildNodes(snapshot));
    setEdges(buildEdges(snapshot));
  }, [setEdges, setNodes, snapshot]);

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-4">
        <StatusCard label="System" value={snapshot.system.toUpperCase()} tone="emerald" />
        <StatusCard label="Sandbox" value={snapshot.policy_snapshot.sandbox.toUpperCase()} tone="amber" />
        <StatusCard label="Control Plane" value={snapshot.policy_snapshot.control_plane.toUpperCase()} tone="blue" />
        <StatusCard
          label="Doctrine"
          value={snapshot.policy_snapshot.doctrine_version.toUpperCase()}
          tone="rose"
          meta={isLoading ? 'SYNCING' : `T+${snapshot.timestamp}`}
        />
      </div>

      <div className="flex items-center justify-between text-xs font-mono text-neutral-400 px-1">
        <span>{error ? `FALLBACK MODE: ${error}` : 'LIVE SNAPSHOT ACTIVE'}</span>
        <span>{snapshot.edges.filter((edge) => edge.blocked_by).length} blocked edges visible</span>
      </div>

      <div className="w-full h-[600px] border border-neutral-800 rounded-xl overflow-hidden bg-neutral-950">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          fitView
          colorMode="dark"
        >
          <Controls className="bg-neutral-900 border-neutral-700 fill-neutral-300" />
          <MiniMap
            nodeColor={(node) => {
              if (typeof node.style?.background === 'string') {
                return node.style.background;
              }
              return '#262626';
            }}
            maskColor="rgba(0, 0, 0, 0.7)"
            className="bg-neutral-900"
          />
          <Background color="#333" gap={16} />
        </ReactFlow>
      </div>
    </div>
  );
}

function buildNodes(snapshot: DoctrineGraphSnapshot): Node[] {
  const lanes = new Map<string, number>();
  const laneCounts = new Map<string, number>();

  return snapshot.nodes.map((node) => {
    const lane = lanes.get(node.type) ?? lanes.size;
    lanes.set(node.type, lane);

    const indexInLane = laneCounts.get(node.type) ?? 0;
    laneCounts.set(node.type, indexInLane + 1);

    return {
      id: node.id,
      position: {
        x: 140 + indexInLane * 260,
        y: 80 + lane * 140,
      },
      data: {
        label: `${node.id}\n${node.state}`,
      },
      type: node.type === 'system' ? 'input' : undefined,
      style: {
        background: colorForState(node),
        color: '#f5f5f5',
        border: borderForType(node.type),
        borderRadius: 16,
        fontWeight: 700,
        width: 220,
        whiteSpace: 'pre-line',
        boxShadow: node.state === 'forbidden' || node.state === 'sandboxed'
          ? '0 0 0 1px rgba(248,113,113,0.5), 0 12px 30px rgba(127,29,29,0.25)'
          : '0 12px 30px rgba(0,0,0,0.25)',
      },
    };
  });
}

function buildEdges(snapshot: DoctrineGraphSnapshot): Edge[] {
  return snapshot.edges.map((edge) => ({
    id: `${edge.from}->${edge.to}`,
    source: edge.from,
    target: edge.to,
    animated: edge.enforced,
    label: edge.blocked_by ? `${edge.blocked_by}:${edge.weight.toFixed(2)}` : edge.weight.toFixed(2),
    style: {
      stroke: edge.blocked_by ? '#ef4444' : '#22c55e',
      strokeWidth: edge.blocked_by ? 2.6 : 1.8,
    },
    labelStyle: {
      fill: edge.blocked_by ? '#fca5a5' : '#86efac',
      fontWeight: 700,
    },
  }));
}

function colorForState(node: DoctrineNodeSnapshot): string {
  if (node.type === 'system') {
    return '#0f766e';
  }

  switch (node.state) {
    case 'allowed':
    case 'active':
      return '#166534';
    case 'sandboxed':
    case 'restricted':
      return '#92400e';
    case 'forbidden':
    case 'denied':
      return '#991b1b';
    default:
      return '#1f2937';
  }
}

function borderForType(nodeType: string): string {
  switch (nodeType) {
    case 'system':
      return '1px solid rgba(94, 234, 212, 0.65)';
    case 'execution':
      return '1px solid rgba(248, 113, 113, 0.5)';
    case 'memory':
      return '1px solid rgba(251, 191, 36, 0.5)';
    case 'agent':
      return '1px solid rgba(96, 165, 250, 0.5)';
    default:
      return '1px solid rgba(163, 163, 163, 0.35)';
  }
}

function StatusCard({
  label,
  value,
  tone,
  meta,
}: {
  label: string;
  value: string;
  tone: 'emerald' | 'amber' | 'blue' | 'rose';
  meta?: string;
}) {
  const toneClasses = {
    emerald: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300',
    amber: 'border-amber-500/30 bg-amber-500/10 text-amber-300',
    blue: 'border-blue-500/30 bg-blue-500/10 text-blue-300',
    rose: 'border-rose-500/30 bg-rose-500/10 text-rose-300',
  };

  return (
    <div className={`rounded-xl border p-4 ${toneClasses[tone]}`}>
      <div className="text-[11px] font-mono tracking-[0.24em] uppercase opacity-75">{label}</div>
      <div className="mt-2 text-lg font-semibold">{value}</div>
      {meta ? <div className="mt-1 text-[11px] font-mono opacity-70">{meta}</div> : null}
    </div>
  );
}
