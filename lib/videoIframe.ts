export function pauseBackgroundVideos() {
  document.querySelectorAll<HTMLIFrameElement>("iframe.ms-yt-bg").forEach((iframe) => {
    iframe.contentWindow?.postMessage('{"event":"command","func":"pauseVideo","args":""}', "*");
  });
}

export function playBackgroundVideos() {
  document.querySelectorAll<HTMLIFrameElement>("iframe.ms-yt-bg").forEach((iframe) => {
    iframe.contentWindow?.postMessage('{"event":"command","func":"playVideo","args":""}', "*");
  });
}

export function stopDialogIframe(iframe: HTMLIFrameElement | null) {
  iframe?.contentWindow?.postMessage('{"event":"command","func":"stopVideo","args":""}', "*");
}
