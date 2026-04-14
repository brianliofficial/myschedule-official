import type { SiteDataFieldKey } from "@/lib/siteDataFieldMeta";
import type { SiteData } from "@/lib/siteData";
import type { LoadCmsTablesResult } from "@/lib/cms/loadCmsTables";
import {
  parseAboutVideos,
  parseDrBeautyVideos,
  parseHomeVideos,
  parseMemberData,
  parseProfilo,
} from "@/lib/cms/payloadParsers";

/**
 * 將各 `cms_*` 表讀到的 `payload` 套入 `base`：僅在 parse 成功時替換該欄；否則保留內建預設。
 * `cms_contact` 的 payload 使用鍵 `contactVideos`（與 `SiteData.contactVideos` 一致）。
 */
export function mergeCmsIntoDefaults(
  base: SiteData,
  rows: LoadCmsTablesResult["rows"],
): { siteData: SiteData; remoteFields: SiteDataFieldKey[] } {
  const remoteFields: SiteDataFieldKey[] = [];
  let merged: SiteData = { ...base };

  const indexPayload = rows.cms_index?.payload;
  if (indexPayload) {
    const hv = parseHomeVideos(indexPayload.homeVideos);
    if (hv) {
      merged = { ...merged, homeVideos: hv };
      remoteFields.push("homeVideos");
    }
  }

  const aboutPayload = rows.cms_about?.payload;
  if (aboutPayload) {
    const av = parseAboutVideos(aboutPayload.aboutVideos);
    const mm = parseMemberData(aboutPayload.memberData);
    merged = {
      ...merged,
      ...(av ? { aboutVideos: av } : {}),
      ...(mm ? { memberData: mm } : {}),
    };
    if (av) remoteFields.push("aboutVideos");
    if (mm) remoteFields.push("memberData");
  }

  const contactPayload = rows.cms_contact?.payload;
  if (contactPayload) {
    const cv =
      parseAboutVideos(contactPayload.contactVideos) ??
      parseAboutVideos(contactPayload.aboutVideos);
    if (cv) {
      merged = { ...merged, contactVideos: cv };
      remoteFields.push("contactVideos");
    }
  }

  const drPayload = rows.cms_dr_beauty?.payload;
  if (drPayload) {
    const dv = parseDrBeautyVideos(drPayload.drBeautyVideos);
    if (dv) {
      merged = { ...merged, drBeautyVideos: dv };
      remoteFields.push("drBeautyVideos");
    }
  }

  const portfolioPayload = rows.cms_portfolio?.payload;
  if (portfolioPayload) {
    const pr = parseProfilo(portfolioPayload.profilo);
    if (pr) {
      merged = { ...merged, profilo: pr };
      remoteFields.push("profilo");
    }
  }

  return { siteData: merged, remoteFields };
}
