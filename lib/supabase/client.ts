import { createClient as createSupabaseClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * 與 `fetchSiteData` / `isSupabaseConfigured` 使用相同解析。
 * **優先 `SUPABASE_*`（僅伺服端）**：部署／執行期注入的讀取較可靠；`NEXT_PUBLIC_*` 可能在 build 時被內嵌，若當時未設會變成永遠空。
 * 再後備 `NEXT_PUBLIC_SUPABASE_*`（本機與需給瀏覽器 bundle 時）。
 */
export function resolveSupabaseUrl(): string {
  return (process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL)?.trim() ?? "";
}

/**
 * 匿名／公開 API key（JWT `anon` 或相容格式）。
 * 常見命名不一：`NEXT_PUBLIC_ANON_KEY`、`NEXT_PUBLIC_SUPABASE_KEY` 等一併支援。
 */
export function resolveSupabaseAnonKey(): string {
  return (
    process.env.SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_KEY
  )?.trim() ?? "";
}

export function isSupabaseConfigured(): boolean {
  return Boolean(resolveSupabaseUrl() && resolveSupabaseAnonKey());
}

export function createClient(): SupabaseClient {
  const url = resolveSupabaseUrl();
  const key = resolveSupabaseAnonKey();
  if (!url || !key) {
    throw new Error(
      "Missing Supabase URL or anon key (SUPABASE_ANON_KEY / NEXT_PUBLIC_SUPABASE_ANON_KEY / NEXT_PUBLIC_ANON_KEY / NEXT_PUBLIC_SUPABASE_KEY, plus SUPABASE_URL or NEXT_PUBLIC_SUPABASE_URL)",
    );
  }
  return createSupabaseClient(url, key);
}
