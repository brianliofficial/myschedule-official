import { mergeCmsIntoDefaults } from "@/lib/cms/mergeCmsIntoDefaults";
import { CMS_TABLES, loadCmsTables, type CmsTableName } from "@/lib/cms/loadCmsTables";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { defaultProvenance, markRemote, type SiteDataProvenance } from "@/lib/siteDataFieldMeta";
import { cloneDefaultSiteData, type SiteData } from "@/lib/siteData";

/** 明確關閉遠端，只用內建預設（深拷貝）。 */
function forceStaticOnly(): boolean {
  return process.env.NEXT_PUBLIC_SITE_DATA_SOURCE === "static";
}

export type FetchSiteDataLoadInfo = {
  /** 為何整包仍等同預設（僅載入層；各欄仍以 `provenance` 為準） */
  fallback: "none" | "static" | "not_configured" | "exception";
  supabaseConfigured: boolean;
  /** 至少有一筆 payload 的 `cms_*` 表數量（0–5） */
  cmsRowsLoaded: number;
  /** 任一表查詢失敗時彙整；全成功為 null */
  supabaseQueryError: string | null;
  /** 各表錯誤訊息（表不存在、RLS、網路等） */
  cmsTableErrors: Partial<Record<CmsTableName, string>>;
};

export type FetchSiteDataResult = {
  siteData: SiteData;
  provenance: SiteDataProvenance;
  loadInfo: FetchSiteDataLoadInfo;
};

function loadInfoBase(
  partial: Partial<FetchSiteDataLoadInfo> & Pick<FetchSiteDataLoadInfo, "fallback">,
): FetchSiteDataLoadInfo {
  return {
    supabaseConfigured: partial.supabaseConfigured ?? isSupabaseConfigured(),
    cmsRowsLoaded: partial.cmsRowsLoaded ?? 0,
    supabaseQueryError: partial.supabaseQueryError ?? null,
    cmsTableErrors: partial.cmsTableErrors ?? {},
    fallback: partial.fallback,
  };
}

function countCmsRows(
  rows: Partial<Record<CmsTableName, { payload: Record<string, unknown> } | null>>,
): number {
  let n = 0;
  for (const t of CMS_TABLES) {
    if (rows[t]) n += 1;
  }
  return n;
}

/**
 * 載入前台資料：自 Supabase `public.cms_*` 五表合併；失敗或未設定時為內建預設深拷貝。
 */
export async function fetchSiteData(): Promise<FetchSiteDataResult> {
  const configured = isSupabaseConfigured();

  if (forceStaticOnly()) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[fetchSiteData] NEXT_PUBLIC_SITE_DATA_SOURCE=static：略過 Supabase，僅使用內建 defaultSiteData。");
    }
    const siteData = cloneDefaultSiteData();
    return {
      siteData,
      provenance: defaultProvenance(),
      loadInfo: loadInfoBase({ fallback: "static", supabaseConfigured: configured }),
    };
  }

  if (!configured) {
    if (process.env.NODE_ENV === "development") {
      console.warn(
        "[fetchSiteData] Supabase 未設定：請在 .env.local 設定 SUPABASE_URL 與 SUPABASE_ANON_KEY（或 NEXT_PUBLIC_SUPABASE_URL 與 NEXT_PUBLIC_SUPABASE_ANON_KEY）。見 .env.example。",
      );
    }
    const siteData = cloneDefaultSiteData();
    return {
      siteData,
      provenance: defaultProvenance(),
      loadInfo: loadInfoBase({ fallback: "not_configured", supabaseConfigured: false }),
    };
  }

  try {
    const { rows, errors } = await loadCmsTables();
    const { siteData, remoteFields } = mergeCmsIntoDefaults(cloneDefaultSiteData(), rows);
    const provenance = markRemote(defaultProvenance(), remoteFields);

    const cmsTableErrors = { ...errors };
    const errEntries = Object.entries(cmsTableErrors).filter(([, m]) => m);
    const supabaseQueryError =
      errEntries.length === 0 ? null : errEntries.map(([t, m]) => `${t}: ${m}`).join("; ");

    return {
      siteData,
      provenance,
      loadInfo: loadInfoBase({
        fallback: "none",
        supabaseConfigured: true,
        cmsRowsLoaded: countCmsRows(rows),
        supabaseQueryError,
        cmsTableErrors,
      }),
    };
  } catch {
    const siteData = cloneDefaultSiteData();
    return {
      siteData,
      provenance: defaultProvenance(),
      loadInfo: loadInfoBase({ fallback: "exception", supabaseConfigured: configured }),
    };
  }
}
