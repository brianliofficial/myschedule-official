import MyScheduleApp from "./components/MyScheduleApp";
import { fetchSiteData } from "@/lib/fetchSiteData";

/** 每次請求向 Supabase 取最新 CMS */
export const dynamic = "force-dynamic";

export default async function Home() {
  const pack = await fetchSiteData();

  if (process.env.NODE_ENV === "development") {
    console.info("[fetchSiteData/server]", {
      loadInfo: pack.loadInfo,
      provenance: pack.provenance,
    });
  }

  return <MyScheduleApp initialSiteData={pack.siteData} provenance={pack.provenance} loadInfo={pack.loadInfo} />;
}
