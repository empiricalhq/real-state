import { Icon } from "@iconify/react";
import Link from "next/link";
import React from "react";

import BlogCard from "@/components/shared/Blog/blogCard";
import { getBlogs } from "@/components/utils/markdown";

const BlogSmall: React.FC = () => {
  const posts = getBlogs().slice(0, 3);

  return (
    <section>
      <div className="max-w-8xl container mx-auto px-5 2xl:px-0">
        <div className="mb-10 flex flex-col items-start justify-between md:flex-row md:items-end">
          <div>
            <p className="text-dark/75 flex gap-2 text-base font-semibold dark:text-white/75">
              <Icon
                icon="ph:house-simple-fill"
                className="text-primary text-2xl"
                aria-label="Home icon"
              />
              Blog
            </p>
            <h2 className="lg:text-52 text-40 font-medium dark:text-white">Real estate insights</h2>
            <p className="text-dark/50 text-xm dark:text-white/50">
              Stay ahead in the property market with expert advice and updates
            </p>
          </div>
          <Link
            href="/blogs"
            className="bg-dark dark:text-dark hover:bg-primary rounded-full px-8 py-4 text-white duration-300 dark:bg-white"
            aria-label="Read all blog articles"
          >
            Read all articles
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((blog, i) => (
            <div key={i} className="w-full">
              <BlogCard blog={blog} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlogSmall;
