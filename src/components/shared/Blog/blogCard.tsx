import { format } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import React, { FC } from "react";

import { Blog } from "@/types/blog";

const BlogCard: FC<{ blog: Blog }> = ({ blog }) => {
  const { title, coverImage, date, slug, tag } = blog;
  return (
    <Link
      href={`/blogs/${slug}`}
      aria-label="blog cover 5xl:h-full 5xl:inline-block"
      className="group gap-4"
    >
      <div className="flex-shrink-0 overflow-hidden rounded-2xl">
        <Image
          src={coverImage!}
          alt="image"
          className="transition group-hover:scale-110"
          width={190}
          height={163}
          style={{ width: "100%", height: "100%" }}
          unoptimized={true}
        />
      </div>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-dark group-hover:text-primary mt-2 text-xl font-medium dark:text-white">
            {title}
          </h3>
          <span className="text-dark/50 text-base leading-loose font-medium dark:text-white/50">
            {format(new Date(date), "MMM dd, yyyy")}
          </span>
        </div>
        <div className="bg-dark/5 rounded-full px-5 py-2.5 dark:bg-white/15">
          <p className="text-dark text-sm font-semibold dark:text-white">{tag}</p>
        </div>
      </div>
    </Link>
  );
};

export default BlogCard;
