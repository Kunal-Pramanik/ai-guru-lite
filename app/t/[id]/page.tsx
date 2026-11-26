import { notFound } from "next/navigation";
import { TopicView } from "@/components/TopicView";
import { TOPICS, isLang, topicById, type Lang } from "@/lib/content";

export function generateStaticParams() {
  return TOPICS.map((t) => ({ id: t.id }));
}

export default async function TopicPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ view?: string; lang?: string }> }) {
  const { id } = await params;
  const sp = await searchParams;
  const topic = topicById(id);
  if (!topic) notFound();
  const lang: Lang = isLang(sp.lang) ? sp.lang : "hi";
  const view = sp.view === "notes" ? "notes" : "video";
  return <TopicView key={topic.id} topic={topic} initialLang={lang} initialView={view} />;
}
