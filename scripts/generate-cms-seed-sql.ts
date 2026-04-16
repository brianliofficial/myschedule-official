/**
 * 依 `lib/siteData.ts` 的 `defaultSiteData` 產生：
 * - `supabase/cms_seed_defaults.sql`（truncate + insert）
 * - `supabase/cms_update_latest_payload.sql`（只更新各表最新一列 payload，不 truncate）
 * 執行：npm run cms:seed-sql
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

  const idx = dollarQuote(toJsonPayload(indexPayload), "cmsidx");
  const ab = dollarQuote(toJsonPayload(aboutPayload), "cmsab");
  const co = dollarQuote(toJsonPayload(contactPayload), "cmsco");
  const dr = dollarQuote(toJsonPayload(drPayload), "cmsdr");
  const pf = dollarQuote(toJsonPayload(portfolioPayload), "cmspf");

  const updateBlocks: string[] = [
    "-- 由 scripts/generate-cms-seed-sql.ts 產生；不 truncate。",
    "-- 各表若至少有一列，會更新「updated_at 最新」那一列的 payload；若表為空則不會插入（請改用 cms_seed_defaults.sql）。",
    "",
    `update public.cms_index set payload = ${idx}::jsonb, updated_at = now()`,
    "where id = (select id from public.cms_index order by updated_at desc nulls last limit 1);",
    "",
    `update public.cms_about set payload = ${ab}::jsonb, updated_at = now()`,
    "where id = (select id from public.cms_about order by updated_at desc nulls last limit 1);",
    "",
    `update public.cms_contact set payload = ${co}::jsonb, updated_at = now()`,
    "where id = (select id from public.cms_contact order by updated_at desc nulls last limit 1);",
    "",
    `update public.cms_dr_beauty set payload = ${dr}::jsonb, updated_at = now()`,
    "where id = (select id from public.cms_dr_beauty order by updated_at desc nulls last limit 1);",
    "",
    `update public.cms_portfolio set payload = ${pf}::jsonb, updated_at = now()`,
    "where id = (select id from public.cms_portfolio order by updated_at desc nulls last limit 1);",
  ];

  const updatePath = join(process.cwd(), "supabase", "cms_update_latest_payload.sql");
  writeFileSync(updatePath, updateBlocks.join("\n") + "\n", "utf8");
  console.log("Wrote", updatePath);
}

main();
