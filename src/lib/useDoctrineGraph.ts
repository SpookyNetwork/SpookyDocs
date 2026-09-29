'use client';

import { useEffect, useState } from 'react';

import { DoctrineGraphSnapshot, fallbackDoctrineGraph } from '@/lib/doctrine';

interface DoctrineGraphState {
  data: DoctrineGraphSnapshot;
  error: string | null;
  isLoading: boolean;
}

export function useDoctrineGraph(): DoctrineGraphState {
  const [data, setData] = useState<DoctrineGraphSnapshot>(fallbackDoctrineGraph);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        const response = await fetch('/api/doctrine/live', { cache: 'no-store' });
        if (!response.ok) {
          throw new Error(`Doctrine graph request failed with ${response.status}`);
        }

        const nextData = (await response.json()) as DoctrineGraphSnapshot;
        if (!mounted) {
          return;
        }

        setData(nextData);
        setError(null);
      } catch (err) {
        if (!mounted) {
          return;
        }

        setError(err instanceof Error ? err.message : 'Unknown doctrine graph error');
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    void load();
    const intervalId = window.setInterval(() => {
      void load();
    }, 1000);

    return () => {
      mounted = false;
      window.clearInterval(intervalId);
    };
  }, []);

  return { data, error, isLoading };
}
