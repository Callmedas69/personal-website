export interface FeedItem {
  id: string;
  title: string;
  subtitle: string;
  date: string; // YYYY.MM.DD
  type: "BLOG" | "VIDEO" | "EVENT";
  topics: string[];
  url: string;
  excerpt?: string;
}

interface ParagraphPost {
  id: string;
  title: string;
  subtitle?: string;
  slug: string;
  publishedAt?: number | string;
  updatedAt?: number | string;
  categories?: string[];
}

const PARAGRAPH_PROFILE = "0x168d8b4f50bb3aa67d05a6937b643004257118ed";

export function mapPost(post: ParagraphPost): FeedItem {
  let timestamp = Number(post.publishedAt || post.updatedAt);
  if (timestamp < 10000000000) timestamp = timestamp * 1000;
  const dateObj = new Date(timestamp);
  const date = isNaN(dateObj.getTime())
    ? "2026.06.02"
    : `${dateObj.getFullYear()}.${String(dateObj.getMonth() + 1).padStart(2, "0")}.${String(dateObj.getDate()).padStart(2, "0")}`;

  const cats = post.categories || [];
  let type: FeedItem["type"] = "BLOG";
  if (cats.some((c) => c.toLowerCase().includes("video"))) {
    type = "VIDEO";
  } else if (cats.some((c) => c.toLowerCase().includes("event") || c.toLowerCase().includes("meetup"))) {
    type = "EVENT";
  }

  const topics = cats.map((c) => c.trim().toUpperCase()).filter(Boolean);

  return {
    id: post.id,
    title: post.title,
    subtitle: post.subtitle || "",
    date,
    type,
    topics: topics.length ? topics : ["AI"],
    url: `https://paragraph.xyz/@${PARAGRAPH_PROFILE}/${post.slug}`,
    excerpt: post.subtitle || "Click to read the full article on Paragraph.",
  };
}

/** Server-side fetch of latest published posts. Returns [] on any failure — content is never gated on this. */
export async function getRecentPosts(limit = 8): Promise<FeedItem[]> {
  const apiKey = process.env.PARAGRAPH_API_KEY;
  if (!apiKey) return [];

  try {
    const res = await fetch(
      `https://public.api.paragraph.com/api/v1/posts?status=published&limit=${limit}`,
      {
        headers: { Authorization: `Bearer ${apiKey}` },
        next: { revalidate: 300 },
      }
    );
    if (!res.ok) return [];
    const data = await res.json();
    const items: ParagraphPost[] = data.items ?? [];
    return items.map(mapPost).sort((a, b) => b.date.localeCompare(a.date));
  } catch {
    return [];
  }
}
