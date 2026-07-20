import { marked } from "marked";

export interface Post {
  slug: string;
  title: string;
  description: string;
  date: string; // ISO (YYYY-MM-DD)
  category: string;
  image: string;
  author: string;
  readMinutes: number;
  html: string;
}

// Alle indlæg ligger som Markdown med frontmatter i src/content/posts/.
// Et nyt indlæg = én ny .md-fil — filnavnet bliver slug/URL.
const files = import.meta.glob("../content/posts/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

function parseFrontmatter(raw: string): {
  meta: Record<string, string>;
  body: string;
} {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/.exec(raw);
  if (!match) return { meta: {}, body: raw };
  const meta: Record<string, string> = {};
  for (const line of match[1].split(/\r?\n/)) {
    const idx = line.indexOf(":");
    if (idx === -1) continue;
    meta[line.slice(0, idx).trim()] = line.slice(idx + 1).trim();
  }
  return { meta, body: raw.slice(match[0].length) };
}

function readMinutes(body: string): number {
  const words = body.replace(/[#>*`\-|]/g, " ").split(/\s+/).filter(Boolean);
  return Math.max(2, Math.round(words.length / 200));
}

export const POSTS: Post[] = Object.entries(files)
  .map(([path, raw]) => {
    const slug = path.split("/").pop()!.replace(/\.md$/, "");
    const { meta, body } = parseFrontmatter(raw);
    return {
      slug,
      title: meta.title ?? slug,
      description: meta.description ?? "",
      date: meta.date ?? "1970-01-01",
      category: meta.category ?? "Guides",
      image: meta.image ?? "",
      author: meta.author ?? "MinBilPris",
      readMinutes: readMinutes(body),
      html: marked.parse(body) as string,
    };
  })
  .sort((a, b) => b.date.localeCompare(a.date));

export function getPost(slug: string): Post | undefined {
  return POSTS.find((p) => p.slug === slug);
}

export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("da-DK", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(iso));
}
