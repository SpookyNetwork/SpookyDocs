import { getDocBySlug, getDocSlugs } from '@/lib/docs';
import { MDXRemote } from 'next-mdx-remote/rsc';
import Link from 'next/link';

// Configure custom components for MDX (this is where Mermaid, Telemetry gauges, etc. will go)
const components = {
  h1: (props: any) => <h1 className="text-4xl font-bold mt-8 mb-4 text-emerald-400" {...props} />,
  h2: (props: any) => <h2 className="text-3xl font-semibold mt-8 mb-4 text-neutral-200 border-b border-neutral-800 pb-2" {...props} />,
  h3: (props: any) => <h3 className="text-2xl font-medium mt-6 mb-3 text-neutral-300" {...props} />,
  p: (props: any) => <p className="text-neutral-400 mb-4 leading-relaxed" {...props} />,
  ul: (props: any) => <ul className="list-disc list-inside text-neutral-400 mb-4 space-y-2" {...props} />,
  li: (props: any) => <li className="text-neutral-400" {...props} />,
  strong: (props: any) => <strong className="font-bold text-neutral-200" {...props} />,
  table: (props: any) => (
    <div className="overflow-x-auto my-6">
      <table className="w-full text-left border-collapse" {...props} />
    </div>
  ),
  th: (props: any) => <th className="border-b border-neutral-700 py-3 px-4 font-semibold text-neutral-300 bg-neutral-900/50" {...props} />,
  td: (props: any) => <td className="border-b border-neutral-800 py-3 px-4 text-neutral-400" {...props} />,
  code: (props: any) => {
    // If it has a language className, it's a block, otherwise inline
    const isInline = !props.className;
    return isInline ? (
      <code className="bg-neutral-800 text-emerald-300 px-1.5 py-0.5 rounded text-sm font-mono" {...props} />
    ) : (
      <code className="block bg-neutral-900 p-4 rounded-lg overflow-x-auto text-sm font-mono text-neutral-300 border border-neutral-800 mb-4" {...props} />
    );
  },
  pre: (props: any) => <pre className="bg-transparent m-0 p-0" {...props} />,
  hr: (props: any) => <hr className="my-8 border-neutral-800" {...props} />,
};

export async function generateStaticParams() {
  const slugs = getDocSlugs();
  return slugs.map((slug) => ({
    slug: slug.replace(/\.md$/, ''),
  }));
}

export default async function DocPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const doc = getDocBySlug(slug, ['title', 'content']);

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-200 p-8">
      <div className="max-w-4xl mx-auto">
        <nav className="mb-8 font-mono text-sm text-neutral-500">
          <Link href="/" className="hover:text-emerald-400 transition-colors">← Back to Overview</Link>
          <span className="mx-2">/</span>
          <span className="text-neutral-400">{slug}.md</span>
        </nav>
        
        <article className="prose prose-invert max-w-none">
          <MDXRemote 
            source={doc.content || ''} 
            components={components} 
            options={{ mdxOptions: { format: 'md' } }} 
          />
        </article>
      </div>
    </div>
  );
}
