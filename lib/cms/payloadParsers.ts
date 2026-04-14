/**
 * 將各 `cms_*` 表之 `payload` jsonb 解析成 `SiteData` 欄位；失敗回 `null`（不覆寫預設）。
 */
import type {
  AboutVideo,
  DrBeautyVideo,
  HomeVideo,
  MemberItem,
  ProfiloCategory,
} from "@/lib/siteData";

function isNonEmptyString(v: unknown): v is string {
  return typeof v === "string" && v.trim().length > 0;
}

export function parseHomeVideos(raw: unknown): HomeVideo[] | null {
  if (!Array.isArray(raw) || raw.length === 0) return null;
  const out: HomeVideo[] = [];
  for (const x of raw) {
    if (typeof x !== "object" || x === null) return null;
    const o = x as Record<string, unknown>;
    if (!isNonEmptyString(o.id) || !isNonEmptyString(o.url)) return null;
    out.push({ id: o.id.trim(), url: o.url.trim() });
  }
  return out;
}

/** About / Contact 背景影片與首頁相同結構（id + url） */
export function parseAboutVideos(raw: unknown): AboutVideo[] | null {
  return parseHomeVideos(raw) as AboutVideo[] | null;
}

export function parseMemberData(raw: unknown): MemberItem[] | null {
  if (!Array.isArray(raw) || raw.length === 0) return null;
  const out: MemberItem[] = [];
  for (const x of raw) {
    if (typeof x !== "object" || x === null) return null;
    const o = x as Record<string, unknown>;
    if (!isNonEmptyString(o.id) || !isNonEmptyString(o.title)) return null;
    out.push({
      id: o.id.trim(),
      title: o.title.trim(),
      ...(isNonEmptyString(o.member) ? { member: o.member.trim() } : {}),
      ...(isNonEmptyString(o.jobPos) ? { jobPos: o.jobPos.trim() } : {}),
    });
  }
  return out;
}

export function parseDrBeautyVideos(raw: unknown): DrBeautyVideo[] | null {
  if (!Array.isArray(raw) || raw.length === 0) return null;
  const out: DrBeautyVideo[] = [];
  for (const x of raw) {
    if (typeof x !== "object" || x === null) return null;
    const o = x as Record<string, unknown>;
    if (!isNonEmptyString(o.id) || !isNonEmptyString(o.title) || !isNonEmptyString(o.url)) return null;
    out.push({ id: o.id.trim(), title: o.title.trim(), url: o.url.trim() });
  }
  return out;
}

export function parseProfilo(raw: unknown): ProfiloCategory[] | null {
  if (!Array.isArray(raw) || raw.length === 0) return null;
  const out: ProfiloCategory[] = [];
  for (const cat of raw) {
    if (typeof cat !== "object" || cat === null) return null;
    const c = cat as Record<string, unknown>;
    if (!isNonEmptyString(c.name) || !Array.isArray(c.profilo)) return null;
    const items: ProfiloCategory["profilo"] = [];
    for (const p of c.profilo) {
      if (typeof p !== "object" || p === null) return null;
      const it = p as Record<string, unknown>;
      if (!isNonEmptyString(it.id) || !isNonEmptyString(it.title) || !isNonEmptyString(it.url)) return null;
      const author = isNonEmptyString(it.author) ? it.author.trim() : "";
      const date = typeof it.date === "number" && Number.isFinite(it.date) ? it.date : Number(it.date) || 0;
      const item: ProfiloCategory["profilo"][number] = {
        id: it.id.trim(),
        title: it.title.trim(),
        url: it.url.trim(),
        author,
        date,
      };
      if (isNonEmptyString(it.chinese_title)) item.chinese_title = it.chinese_title.trim();
      items.push(item);
    }
    out.push({ name: c.name.trim(), profilo: items });
  }
  return out;
}
