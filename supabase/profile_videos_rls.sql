-- Optional: rename a primary key constraint if it was created with spaces (tooling-friendly snake_case).
-- ALTER TABLE public.profile_videos RENAME CONSTRAINT "Profile videos_pkey" TO profile_videos_pkey;

-- Speeds up grouping and ordering for the portfolio page.
CREATE INDEX IF NOT EXISTS profile_videos_type_order_idx
  ON public.profile_videos (type, profile_order NULLS LAST, id);

-- Row Level Security: public site only needs SELECT on published rows.
ALTER TABLE public.profile_videos ENABLE ROW LEVEL SECURITY;

-- Open read for all rows (adjust if you add is_published).
CREATE POLICY "Allow public read profile_videos"
  ON public.profile_videos
  FOR SELECT
  USING (true);

-- When you add is_published boolean, replace the policy with e.g.:
-- DROP POLICY IF EXISTS "Allow public read profile_videos" ON public.profile_videos;
-- CREATE POLICY "Allow public read profile_videos"
--   ON public.profile_videos
--   FOR SELECT
--   USING (coalesce(is_published, true));
