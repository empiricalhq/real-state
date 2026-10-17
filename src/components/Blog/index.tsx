import React from "react";

import BlogCard from "@/components/shared/Blog/blogCard";
import { getBlogs } from "@/components/utils/markdown";

const BlogList: React.FC = () => {
  const posts = getBlogs();

  return (
    <section className="pt-0!">
      <div className="max-w-8xl container mx-auto px-5 2xl:px-0">
        <div className="grid grid-cols-2 gap-12 lg:grid-cols-3">
          {posts.map((blog) => (
            <div key={blog.slug} className="w-full">
              <BlogCard blog={blog} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlogList;
