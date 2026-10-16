import fs from "fs";
import { join } from "path";

import matter from "gray-matter";

import type { Blog } from "@/types/blog";

const postsDirectory = join(process.cwd(), "markdown/blogs");

export function getPost(slug: string) {
  const realSlug = slug.replace(/\.mdx$/, "");
  const source = fs.readFileSync(join(postsDirectory, `${realSlug}.mdx`), "utf8");
  const { data, content } = matter(source);
  return { ...data, slug: realSlug, content } as Record<string, any>;
}

export function getBlogs(): Blog[] {
  return fs
    .readdirSync(postsDirectory)
    .map(getPost)
    .sort((firstPost, secondPost) => (firstPost.date > secondPost.date ? -1 : 1))
    .map((post) => ({
      title: String(post.title),
      date: String(post.date),
      excerpt: String(post.excerpt),
      coverImage: String(post.coverImage),
      slug: String(post.slug),
      detail: String(post.detail),
      tag: String(post.tag),
    }));
}
