import { Home } from "@/components/Home";
import { isLang } from "@/lib/content";

export default async function Page({ searchParams }: { searchParams: Promise<{ lang?: string }> }) {
  const sp = await searchParams;
  return <Home initialLang={isLang(sp.lang) ? sp.lang : null} />;
}
