import { loadCmsTables } from "@/lib/cms/loadCmsTables";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * 輕量探活：並行讀取五張 `cms_*` 表，供 Vercel Cron 或監控定期呼叫，維持專案與 Supabase 連線路徑溫熱。
 * 若設定 `CRON_SECRET`，請求須帶 `Authorization: Bearer <CRON_SECRET>`（Vercel Cron 會自動帶入）。
 */
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const auth = request.headers.get("authorization");
    if (auth !== `Bearer ${secret}`) {
      return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
    }
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { ok: false, error: "supabase_not_configured", at: new Date().toISOString() },
      { status: 503 },
    );
  }

  try {
    const { rows, errors } = await loadCmsTables();
    const loaded = Object.values(rows).filter(Boolean).length;
    const errKeys = Object.keys(errors);
    return NextResponse.json({
      ok: errKeys.length === 0,
      at: new Date().toISOString(),
      cmsRowsLoaded: loaded,
      cmsTableErrors: errors,
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ ok: false, error: message, at: new Date().toISOString() }, { status: 500 });
  }
}
