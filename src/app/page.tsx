import Link from 'next/link';
import { getAllDocs } from '@/lib/docs';
import TopologyMap from '@/components/TopologyMap';
import { Network, Activity, Database, Shield, BookOpen, TerminalSquare } from 'lucide-react';

export default function Home() {
  const allDocs = getAllDocs(['title', 'slug', 'date', 'excerpt']);

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-200">
      {/* Top Nav / Status Bar */}
      <header className="border-b border-neutral-800 bg-neutral-950/80 backdrop-blur sticky top-0 z-50 p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Network className="text-emerald-400" />
            <h1 className="text-2xl font-bold text-emerald-400 tracking-tight">Spooky System</h1>
            <span className="px-2 py-0.5 rounded text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 ml-2">
              L2: NERVOUS SYSTEM
            </span>
          </div>
          <div className="flex gap-4 text-sm font-mono text-neutral-400">
            <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> KRK-OS: STABLE</span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6 md:p-8 space-y-12">

        {/* Topology Explorer Section */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="text-blue-400" />
            <h2 className="text-2xl font-semibold text-neutral-200">Doctrine Governance Topology</h2>
          </div>
          <p className="text-neutral-400 mb-4 max-w-2xl">
            Live export of compiled doctrine truth. The graph now reflects machine-readable policy state, visible enforcement boundaries, and the synchronized binding between doctrine, control-plane, and sandbox.
          </p>
          <TopologyMap />
        </section>

        {/* Operational Console Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="p-6 rounded-xl border border-neutral-800 bg-neutral-900/50">
            <Shield className="text-amber-400 mb-4 h-8 w-8" />
            <h3 className="text-lg font-bold mb-2">KRK Sandbox</h3>
            <p className="text-neutral-400 text-sm">Capabilities are strictly bounded. Zero external memory access without explicit policy override.</p>
          </div>
          <div className="p-6 rounded-xl border border-neutral-800 bg-neutral-900/50">
            <TerminalSquare className="text-emerald-400 mb-4 h-8 w-8" />
            <h3 className="text-lg font-bold mb-2">Kraken Click</h3>
            <p className="text-neutral-400 text-sm">Perception runtime operational. Computer-use cognition is mapped directly to the active swarm execution plane.</p>
          </div>
          <div className="p-6 rounded-xl border border-neutral-800 bg-neutral-900/50">
            <Database className="text-purple-400 mb-4 h-8 w-8" />
            <h3 className="text-lg font-bold mb-2">Memory Plane</h3>
            <p className="text-neutral-400 text-sm">Hermes/Memarch dual-store active. Causal event hashes are mathematically resolving idempotence.</p>
          </div>
        </div>

        {/* Documentation Section */}
        <section className="pt-8 border-t border-neutral-800">
          <div className="flex items-center gap-2 mb-8">
            <BookOpen className="text-emerald-400" />
            <h2 className="text-2xl font-semibold text-neutral-200">Canonical Intelligence Directory</h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {allDocs.map((doc) => (
              <Link
                key={doc.slug}
                href={`/docs/${doc.slug}`}
                className="flex flex-col p-6 rounded-xl border border-neutral-800 bg-neutral-900/30 hover:bg-neutral-800 hover:border-emerald-500/50 transition-all group h-full"
              >
                <h3 className="text-lg font-bold mb-2 group-hover:text-emerald-400 transition-colors line-clamp-2">
                  {doc.title || doc.slug.replace(/_/g, ' ')}
                </h3>
                <p className="text-neutral-500 text-xs mb-4 font-mono">{doc.slug}.md</p>
                {doc.excerpt && (
                  <p className="text-neutral-400 text-sm mt-auto line-clamp-3">{doc.excerpt}</p>
                )}
              </Link>
            ))}
          </div>
        </section>

      </main>
    </div>
  );
}
