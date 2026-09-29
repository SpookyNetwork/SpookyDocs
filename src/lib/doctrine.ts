export interface DoctrineNodeSnapshot {
  id: string;
  type: string;
  state: string;
}

export interface DoctrineEdgeSnapshot {
  from: string;
  to: string;
  weight: number;
  enforced: boolean;
  blocked_by: string | null;
}

export interface DoctrinePolicySnapshot {
  sandbox: string;
  control_plane: string;
  doctrine_version: string;
}

export interface DoctrineGraphSnapshot {
  timestamp: number;
  system: string;
  nodes: DoctrineNodeSnapshot[];
  edges: DoctrineEdgeSnapshot[];
  policy_snapshot: DoctrinePolicySnapshot;
  ast?: unknown;
}

export const fallbackDoctrineGraph: DoctrineGraphSnapshot = {
  timestamp: 0,
  system: 'krk-os',
  nodes: [
    { id: 'system:krk-os', type: 'system', state: 'active' },
    { id: 'memory:read:allowed', type: 'memory', state: 'allowed' },
    { id: 'memory:write:sandboxed', type: 'memory', state: 'sandboxed' },
    { id: 'execution:external:forbidden', type: 'execution', state: 'forbidden' },
  ],
  edges: [
    {
      from: 'system:krk-os',
      to: 'memory:read:allowed',
      weight: 1,
      enforced: true,
      blocked_by: null,
    },
    {
      from: 'system:krk-os',
      to: 'memory:write:sandboxed',
      weight: 1,
      enforced: true,
      blocked_by: 'doctrine',
    },
    {
      from: 'system:krk-os',
      to: 'execution:external:forbidden',
      weight: 1,
      enforced: true,
      blocked_by: 'doctrine',
    },
  ],
  policy_snapshot: {
    sandbox: 'active',
    control_plane: 'active',
    doctrine_version: 'v0.1',
  },
};
