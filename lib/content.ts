import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface ChapterMetadata {
  title: string;
  chapter: string;
  order: number;
  tags: string[];
  figures: string[];
}

export interface Chapter {
  slug: string;
  metadata: ChapterMetadata;
  content: string;
}

const chaptersDirectory = path.join(process.cwd(), 'content', 'chapters');

export function getAllChapters(): Chapter[] {
  try {
    const fileNames = fs.readdirSync(chaptersDirectory);
    const chapters = fileNames
      .filter((fileName) => fileName.endsWith('.mdx'))
      .map((fileName) => {
        const slug = fileName.replace(/\.mdx$/, '');
        const fullPath = path.join(chaptersDirectory, fileName);
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const { data, content } = matter(fileContents);

        return {
          slug,
          metadata: data as ChapterMetadata,
          content,
        };
      })
      .sort((a, b) => a.metadata.order - b.metadata.order);

    return chapters;
  } catch (error) {
    console.error('Error reading chapters:', error);
    return [];
  }
}

export function getChapterBySlug(slug: string): Chapter | null {
  try {
    const fullPath = path.join(chaptersDirectory, `${slug}.mdx`);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    return {
      slug,
      metadata: data as ChapterMetadata,
      content,
    };
  } catch (error) {
    console.error(`Error reading chapter ${slug}:`, error);
    return null;
  }
}

// Extract headings from MDX content for sidebar navigation
export function extractHeadings(content: string): Array<{ level: number; text: string; id: string }> {
  const headingRegex = /^(#{1,3})\s+(.+)$/gm;
  const headings: Array<{ level: number; text: string; id: string }> = [];

  let match;
  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length;
    const text = match[2].trim();
    const id = text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');

    headings.push({ level, text, id });
  }

  return headings;
}
