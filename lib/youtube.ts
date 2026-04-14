const VIDEO_ID_RE = /^[a-zA-Z0-9_-]{11}$/;

function isValidVideoId(id: string): boolean {
  return VIDEO_ID_RE.test(id);
}

/**
 * 從任意 YouTube 網址取出 11 字元 video id；失敗回傳 `""`（勿把整段 URL 當成 id，否則 embed 會壞）。
 */
export function youtubeParser(url: string): string {
  if (!url?.trim()) return "";
  const u = url.trim();

  let m = /youtu\.be\/([a-zA-Z0-9_-]{11})(?:[?&#]|$)/.exec(u);
  if (m && isValidVideoId(m[1])) return m[1];

  m = /[?&]v=([a-zA-Z0-9_-]{11})/.exec(u);
  if (m && isValidVideoId(m[1])) return m[1];

  m = /\/embed\/([a-zA-Z0-9_-]{11})(?:[?&#]|$)/.exec(u);
  if (m && isValidVideoId(m[1])) return m[1];

  m = /\/shorts\/([a-zA-Z0-9_-]{11})(?:[?&#]|$)/.exec(u);
  if (m && isValidVideoId(m[1])) return m[1];

  m = /^https?:\/\/(?:www\.)?youtube\.com\/v\/([a-zA-Z0-9_-]{11})(?:[?&#]|$)/.exec(u);
  if (m && isValidVideoId(m[1])) return m[1];

  const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  const match = u.match(regExp);
  if (match?.[7] && isValidVideoId(match[7])) return match[7];

  const alt = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#&?]*).*/.exec(u);
  if (alt?.[2] && isValidVideoId(alt[2])) return alt[2];

  return "";
}

export function embedUrlFromAnyYoutube(url: string): string {
  const id = youtubeParser(url);
  if (!id) return "";
  return `https://www.youtube.com/embed/${id}`;
}

/**
 * 背景循環播放（與舊站參數一致）。解析失敗回傳 `""`，請勿把空字串設進 iframe `src`。
 * `playsinline` 有助行內播放；參數維持 SSR/CSR 一致，避免 iframe `src` hydration 不一致。
 */
export function embedAutoplayMutedPlaylist(url: string): string {
  const id = youtubeParser(url);
  if (!id) return "";
  return `https://www.youtube.com/embed/${id}?rel=0&loop=1&autoplay=1&mute=1&playsinline=1&enablejsapi=1&showinfo=0&playlist=${id}`;
}
