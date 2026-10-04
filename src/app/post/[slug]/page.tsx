import { Metadata } from "next";
import { PostDetailPage } from "@/pages/post-details";
import { getPostBySlug, posts } from "@/data";

// metadata
export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) {
    return {
      title: "Post Not Found",
      description: "The requested post could not be found.",
    };
  }
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      url: `https://devlog//post/${post.slug}`,
      // images: [
      //     {
      //       url: post.coverImage,
      //       width: 1200,
      //       height: 630,
      //     }
      // ]
    },
  };
}

// generate static params
export async function generateStaticParams() {
  return posts.map((post: { slug: string; title: string }) => ({
    slug: post.slug,
    title: post.title,
  }));
}

export default async function PostDetails({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = await params;

  return <PostDetailPage slug={slug} />;
}
