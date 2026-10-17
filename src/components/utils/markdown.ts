import fs from "fs";
import { join } from "path";

import matter from "gray-matter";

import type { Blog } from "@/types/blog";

const postsDirectory = join(process.cwd(), "markdown/blogs");

export type Post = {
  slug: string;
  content: string;
  title: string;
  excerpt: string;
  date: Date;
  coverImage: string;
  author: string;
  authorImage: string;
  detail: string;
  tag: string;
};

export function getPost(slug: string): Post {
  const realSlug = slug.replace(/\.mdx$/, "");
  const source = fs.readFileSync(
    join(postsDirectory, `${realSlug}.mdx`),
    "utf8",
  );
  const { data, content } = matter(source);
  const field = (name: string) => String(data[name] ?? "");
  return {
    slug: realSlug,
    content,
    title: field("title"),
    excerpt: field("excerpt"),
    date: data.date instanceof Date ? data.date : new Date(field("date")),
    coverImage: field("coverImage"),
    author: field("author"),
    authorImage: field("authorImage"),
    detail: field("detail"),
    tag: field("tag"),
  };
}

export function getBlogs(): Blog[] {
  return fs
    .readdirSync(postsDirectory)
    .map(getPost)
    .toSorted((firstPost, secondPost) =>
      firstPost.date > secondPost.date ? -1 : 1,
    )
    .map((post) => ({
      title: post.title,
      date: post.date.toISOString(),
      excerpt: post.excerpt,
      coverImage: post.coverImage,
      slug: post.slug,
      detail: post.detail,
      tag: post.tag,
    }));
}
