import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

// Resolve the path to the canonical docs layer in the monorepo root
const docsDirectory = path.join(process.cwd(), '../../docs');

export interface DocMeta {
  slug: string;
  title: string;
  date?: string;
  excerpt?: string;
}

export function getDocSlugs() {
  if (!fs.existsSync(docsDirectory)) {
    return [];
  }
  return fs.readdirSync(docsDirectory).filter(file => file.endsWith('.md'));
}

export function getDocBySlug(slug: string, fields: string[] = []) {
  const realSlug = slug.replace(/\.md$/, '');
  const fullPath = path.join(docsDirectory, `${realSlug}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  
  const { data, content } = matter(fileContents);

  type Items = {
    [key: string]: string;
  };

  const items: Items = {};

  // Extract requested fields
  fields.forEach((field) => {
    if (field === 'slug') {
      items[field] = realSlug;
    }
    if (field === 'content') {
      items[field] = content;
    }

    if (typeof data[field] !== 'undefined') {
      items[field] = data[field];
    }
  });

  return items;
}

export function getAllDocs(fields: string[] = []) {
  const slugs = getDocSlugs();
  const docs = slugs
    .map((slug) => getDocBySlug(slug, fields))
    // Default sort by date if available
    .sort((post1, post2) => (post1.date > post2.date ? -1 : 1));
  return docs;
}
