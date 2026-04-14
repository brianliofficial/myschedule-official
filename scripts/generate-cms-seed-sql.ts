/**
 * 依 `lib/siteData.ts` 的 `defaultSiteData` 產生 `supabase/cms_seed_defaults.sql`。
 * 執行：npx tsx scripts/generate-cms-seed-sql.ts
 */
import { writeFileSync } from "fs";
import { join } from "path";
import { defaultSiteData } from "../lib/siteData";

function dollarQuote(body: string, tag: string): string {
  const d = `$${tag}$`;
  if (body.includes(d)) {
    return dollarQuote(body, tag + "x");
  }
  return `${d}${body}${d}`;
}

function toJsonPayload(obj: unknown): string {
  return JSON.stringify(obj);
}

function main() {
  const indexPayload = { homeVideos: defaultSiteData.homeVideos };
  const aboutPayload = {
    aboutVideos: defaultSiteData.aboutVideos,
    memberData: defaultSiteData.memberData,
  };
  const contactPayload = { contactVideos: defaultSiteData.contactVideos };
  const drPayload = { drBeautyVideos: defaultSiteData.drBeautyVideos };
  const portfolioPayload = { profilo: defaultSiteData.profilo };

  const blocks: string[] = [
    "-- 由 scripts/generate-cms-seed-sql.ts 產生；可重複執行前先清空各表或略過已存在列。",
    "truncate public.cms_index, public.cms_about, public.cms_contact, public.cms_dr_beauty, public.cms_portfolio;",
    "",
    `insert into public.cms_index (payload) values (${dollarQuote(toJsonPayload(indexPayload), "cmsidx")}::jsonb);`,
    `insert into public.cms_about (payload) values (${dollarQuote(toJsonPayload(aboutPayload), "cmsab")}::jsonb);`,
    `insert into public.cms_contact (payload) values (${dollarQuote(toJsonPayload(contactPayload), "cmsco")}::jsonb);`,
    `insert into public.cms_dr_beauty (payload) values (${dollarQuote(toJsonPayload(drPayload), "cmsdr")}::jsonb);`,
    `insert into public.cms_portfolio (payload) values (${dollarQuote(toJsonPayload(portfolioPayload), "cmspf")}::jsonb);`,
  ];

  const outPath = join(process.cwd(), "supabase", "cms_seed_defaults.sql");
  writeFileSync(outPath, blocks.join("\n") + "\n", "utf8");
  console.log("Wrote", outPath);
}

main();
