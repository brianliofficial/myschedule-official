"use client";

import type { IframeHTMLAttributes } from "react";

/** 背景／內嵌 YouTube iframe（不再做逾時自動重載）。 */
export default function YouTubeEmbedIframe({
  src,
  onLoad,
  ...rest
}: IframeHTMLAttributes<HTMLIFrameElement>) {
  if (!src) return null;

  return <iframe src={src} onLoad={onLoad} {...rest} />;
}
