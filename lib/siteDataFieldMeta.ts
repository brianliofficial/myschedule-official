/** 與 `SiteData` 欄位一一對應，供 provenance / 除錯用 */
export const SITE_DATA_FIELD_KEYS = [
  "homeVideos",
  "aboutVideos",
  "memberData",
  "contactVideos",
  "drBeautyVideos",
  "profilo",
] as const;

export type SiteDataFieldKey = (typeof SITE_DATA_FIELD_KEYS)[number];

/** `default` = 來自內建預設；`remote` = 該欄已由對應 `cms_*` 表之有效 payload 覆寫 */
export type SiteDataProvenance = Record<SiteDataFieldKey, "default" | "remote">;

export function defaultProvenance(): SiteDataProvenance {
  return {
    homeVideos: "default",
    aboutVideos: "default",
    memberData: "default",
    contactVideos: "default",
    drBeautyVideos: "default",
    profilo: "default",
  };
}

export function markRemote(
  base: SiteDataProvenance,
  fields: Iterable<SiteDataFieldKey>,
): SiteDataProvenance {
  const next = { ...base };
  for (const f of fields) {
    next[f] = "remote";
  }
  return next;
}
