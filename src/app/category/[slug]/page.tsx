import { Metadata } from "next";

import { CategoryDetails } from "@/pages/category-page";
export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const { slug } = await params;
  return {
    title: `Read More about ${slug}`,
    description: `The best blog to read about ${slug}`,
  };
}

export default async function CategoryPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = await params;

  return <CategoryDetails slug={slug} />;
}
