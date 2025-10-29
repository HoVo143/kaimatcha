import ContactForm from "../../components/contact-form";
import Prose from "../../components/prose";
import { getPage, getPolicy } from "../../lib/shopify";
import { Metadata } from "next";
import { notFound } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: { page: string };
}): Promise<Metadata> {
  const { page } = await params; // ✅ thêm await ở đây

  // Ưu tiên page → policy
  let data;

  data =await getPage(page);

  if (!data) {
    data = await getPolicy(page);
  }

  if (!data) return notFound();

  return {
    title: data.seo?.title || data.title,
    description: data.seo?.description || data.bodySummary,
    openGraph: {
      publishedTime: data.createdAt,
      modifiedTime: data.updatedAt,
      type: "article",
    },
  };
}

export default async function Page({ params }: { params: { page: string } }) {
  const { page } = await params; // ✅ thêm await ở đây

  let data;
  
  data =await getPage(page);

  if (!data) {
    data = await getPolicy(page);
  }

  if (!data) return notFound();

  return (
    <>
      <h1 className="mb-8 text-5xl font-bold">{data.title}</h1>
      {/* <Prose className="mb-8" html={data.body as string} /> */}

      {/* Nếu là contact page → show form riêng */}
      {page === "contact" ? (
        <ContactForm />
      ) : (
        <Prose className="mb-8" html={data.body as string} />
      )}

      <p className="text-sm italic">
        {`This document was last updated on ${new Intl.DateTimeFormat(
          undefined,
          {
            year: "numeric",
            month: "long",
            day: "numeric",
          }
        ).format(new Date(data.updatedAt|| Date.now()))}.`}
      </p>
    </>
  );
}


