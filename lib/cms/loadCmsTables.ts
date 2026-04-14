import { createClient } from "@/lib/supabase/client";

/** 與 [`SectionId`](/lib/sectionTypes.ts) 對應之一頁一表 */
export const CMS_TABLES = [
  "cms_index",
  "cms_about",
  "cms_contact",
  "cms_dr_beauty",
  "cms_portfolio",
] as const;

export type CmsTableName = (typeof CMS_TABLES)[number];

export type CmsRow = {
  id: string;
  payload: Record<string, unknown>;
  updated_at?: string;
};

export type LoadCmsTablesResult = {
  /** 各表第一列（若無則 null） */
  rows: Record<CmsTableName, CmsRow | null>;
  /** 各表錯誤訊息（無則 undefined） */
  errors: Partial<Record<CmsTableName, string>>;
};

/**
 * 自各 `cms_*` 表讀取至多一列（依 `updated_at` 最新）。表不存在或查詢失敗時該欄為 null 並記錄錯誤。
 */
export async function loadCmsTables(): Promise<LoadCmsTablesResult> {
  const supabase = createClient();
  const rows = {} as Record<CmsTableName, CmsRow | null>;
  const errors: Partial<Record<CmsTableName, string>> = {};

  await Promise.all(
    CMS_TABLES.map(async (table) => {
      const { data, error } = await supabase
        .from(table)
        .select("id,payload,updated_at")
        .order("updated_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        errors[table] = error.message;
        rows[table] = null;
        return;
      }
      if (!data || typeof data.payload !== "object" || data.payload === null || Array.isArray(data.payload)) {
        rows[table] = null;
        return;
      }
      rows[table] = {
        id: String(data.id),
        payload: data.payload as Record<string, unknown>,
        updated_at: data.updated_at as string | undefined,
      };
    }),
  );

  return { rows, errors };
}
