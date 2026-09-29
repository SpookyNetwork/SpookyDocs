import fs from 'node:fs/promises';
import path from 'node:path';

import { fallbackDoctrineGraph, type DoctrineGraphSnapshot } from '@/lib/doctrine';

export const dynamic = 'force-dynamic';

const defaultSnapshotPath = path.join(
  /* turbopackIgnore: true */ process.cwd(),
  '../../system/krk-os/doctrine-export.json',
);

export async function GET() {
  const graph = await resolveDoctrineSnapshot();
  return Response.json(graph);
}

async function resolveDoctrineSnapshot(): Promise<DoctrineGraphSnapshot> {
  const exportUrl = process.env.DOCTRINE_EXPORT_URL;
  if (exportUrl) {
    try {
      const response = await fetch(exportUrl, { cache: 'no-store' });
      if (response.ok) {
        return (await response.json()) as DoctrineGraphSnapshot;
      }
    } catch {
      // Fall through to file or static fallback.
    }
  }

  const exportPath = process.env.DOCTRINE_EXPORT_PATH ?? defaultSnapshotPath;
  try {
    const payload = await fs.readFile(exportPath, 'utf8');
    return JSON.parse(payload) as DoctrineGraphSnapshot;
  } catch {
    return fallbackDoctrineGraph;
  }
}
