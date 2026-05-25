import { Icon } from "@iconify/react";
import { format } from "date-fns";
import Image from "next/image";
import Link from "next/link";

import { getAllPosts, getPostBySlug } from "@/components/utils/markdown";
import markdownToHtml from "@/components/utils/markdownToHtml";

type Props = {
  params: { slug: string };
};

export async function generateMetadata({ params }: any) {
  const data = await params;
  const posts = getAllPosts(["title", "date", "excerpt", "coverImage", "slug"]);
  const post = getPostBySlug(data.slug, ["title", "author", "content", "metadata"]);

  const siteName = process.env.SITE_NAME || "Your Site Name";
  const authorName = process.env.AUTHOR_NAME || "Your Author Name";

  if (post) {
    const metadata = {
      title: `${post.title || "Single Post Page"} | ${siteName}`,
      author: authorName,
      robots: {
        index: true,
        follow: true,
        nocache: true,
        googleBot: {
          index: true,
          follow: false,
          "max-video-preview": -1,
          "max-image-preview": "large",
          "max-snippet": -1,
        },
      },
    };

    return metadata;
  } else {
    return {
      title: "Not Found",
      description: "No blog article has been found",
      author: authorName,
      robots: {
        index: false,
        follow: false,
        nocache: false,
        googleBot: {
          index: false,
          follow: false,
          "max-video-preview": -1,
          "max-image-preview": "large",
          "max-snippet": -1,
        },
      },
    };
  }
}

export default async function Post({ params }: any) {
  const data = await params;
  const posts = getAllPosts(["title", "date", "excerpt", "coverImage", "slug"]);
  const post = getPostBySlug(data.slug, [
    "title",
    "author",
    "authorImage",
    "content",
    "coverImage",
    "date",
    "tag",
    "detail",
  ]);

  const content = await markdownToHtml(post.content || "");

  return (
    <>
      <section className="relative !pt-44 pb-0!">
        <div className="max-w-8xl container mx-auto px-4 md:px-0">
          <div>
            <div>
              <Link
                href="/blogs"
                className="bg-primary hover:bg-dark flex w-fit items-center gap-3 rounded-full px-4 py-3 text-white duration-300"
              >
                <Icon icon={"ph:arrow-left"} width={20} height={20} className="" />
                <span>Go Back</span>
              </Link>
              <h2 className="text-dark md:text-52 text-40 pt-7 leading-[1.2] font-semibold dark:text-white">
                {post.title}
              </h2>
              <h6 className="text-xm text-dark mt-5 dark:text-white">{post.detail}</h6>
            </div>
            <div className="mt-12 flex items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <Image
                  src={post.authorImage}
                  alt="image"
                  className="inline-block !h-12 !w-12 rounded-full bg-contain bg-no-repeat"
                  width={48}
                  height={48}
                  quality={100}
                  unoptimized={true}
                />
                <div>
                  <span className="text-xm text-dark dark:text-white">{post.author}</span>
                </div>
              </div>
              <div className="flex items-center gap-7">
                <div className="flex items-center gap-4">
                  <Icon icon={"ph:clock"} width={20} height={20} className="" />
                  <span className="text-dark text-base font-medium dark:text-white">
                    {format(new Date(post.date), "MMM dd, yyyy")}
                  </span>
                </div>
                <div className="bg-dark/5 rounded-full px-5 py-2.5 dark:bg-white/15">
                  <p className="text-dark text-sm font-semibold dark:text-white">{post.tag}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="z-20 mt-12 overflow-hidden rounded">
            <Image
              src={post.coverImage}
              alt="image"
              width={1170}
              height={766}
              quality={100}
              className="h-full w-full rounded-3xl object-cover object-center"
            />
          </div>
        </div>
      </section>
      <section className="pt-12!">
        <div className="max-w-8xl container mx-auto px-4">
          <div className="-mx-4 flex flex-wrap justify-center">
            <div className="blog-details markdown xl:pr-10">
              <div dangerouslySetInnerHTML={{ __html: content }}></div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
