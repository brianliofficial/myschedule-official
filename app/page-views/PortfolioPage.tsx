"use client";

import YouTubeEmbedIframe from "@/app/components/YouTubeEmbedIframe";
import type { ProfiloCategory } from "@/lib/siteData";
import { embedAutoplayMutedPlaylist, youtubeParser } from "@/lib/youtube";
import { pauseBackgroundVideos } from "@/lib/videoIframe";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { Swiper as SwiperType } from "swiper";
import { Pagination } from "swiper/modules";
import Swiper from "swiper";

type Props = {
  onOpenVideoDialog: (embedSrc: string) => void;
  profilo: ProfiloCategory[];
};

/**
 * 分類選單用 React state；作品區與 DrBeauty（`DrBeautyPage`）相同：
 * 垂直 Swiper + Pagination（dynamicBullets、寬螢幕 renderBullet 標題）。
 */
export default function PortfolioPage({ onOpenVideoDialog, profilo }: Props) {
  const [cat, setCat] = useState(0);
  const [slide, setSlide] = useState(0);
  const swiperRef = useRef<SwiperType | null>(null);

  useEffect(() => {
    setCat((c) => {
      if (profilo.length === 0) return 0;
      return Math.min(c, profilo.length - 1);
    });
  }, [profilo.length]);

  useEffect(() => {
    setSlide(0);
  }, [cat]);

  const item = profilo[cat];
  const videos = item?.profilo ?? [];
  const isLoop = videos.length < 5;

  const portfolioSwiperKey = item ? `${item.name}:${videos.map((v) => v.id).join(",")}` : "";

  useEffect(() => {
    const currentItem = profilo[cat];
    const vlist = currentItem?.profilo ?? [];
    if (!currentItem || vlist.length === 0) return;

    const el = document.querySelector<HTMLElement>("#ms-portfolio-video-swiper");
    if (!el) return;

    const titles = vlist.map((v) => v.title);

    const init = () => {
      swiperRef.current?.destroy(true, true);
      const pag = document.querySelector<HTMLElement>("#ms-portfolio-swiper-pagination");
      const wide = window.innerWidth >= 988;
      swiperRef.current = new Swiper(el, {
        modules: [Pagination],
        direction: "vertical",
        slidesPerView: 1,
        spaceBetween: 0,
        pagination: pag
          ? {
              el: pag,
              clickable: true,
              dynamicBullets: true,
              renderBullet: wide
                ? (index, className) =>
                    `<div class="pagination-subtitle ${className}"><span class="text">${titles[index] ?? ""}</span></div>`
                : undefined,
            }
          : undefined,
        on: {
          slideChange: (sw) => setSlide(sw.activeIndex),
        },
      });
    };

    init();
    let t: ReturnType<typeof setTimeout>;
    const onResize = () => {
      clearTimeout(t);
      t = setTimeout(init, 300);
    };
    window.addEventListener("resize", onResize);
    return () => {
      clearTimeout(t);
      window.removeEventListener("resize", onResize);
      swiperRef.current?.destroy(true, true);
      swiperRef.current = null;
    };
  }, [portfolioSwiperKey]);

  if (profilo.length === 0 || !item) {
    return null;
  }

  return (
    <div id="ms-page-portfolio">
      <div id="portfolio-header">
        <div className="profilo-swiper" key={profilo.map((p) => p.name).join("|")}>
          <div className="swiper-wrapper">
            {profilo.map((p, i) => (
              <div className="swiper-slide" key={p.name}>
                <button
                  type="button"
                  className={cat === i ? "active" : ""}
                  data-id={p.name}
                  data-index={i}
                  onClick={() => setCat(i)}
                >
                  {p.name}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="profilo portfolio-videos">
        <div className="swiper profilo-swiper" id="ms-portfolio-video-swiper" key={portfolioSwiperKey}>
          <div className="swiper-wrapper">
            {videos.map((v, i) => {
              const mutedEmbed = embedAutoplayMutedPlaylist(v.url);
              return (
                <div className="swiper-slide" key={v.id}>
                  <div className={`wrapper wrapper${i}`}>
                    <div className="blackScreen">
                      <button
                        type="button"
                        className="button"
                        data-set={i}
                        onClick={() => {
                          pauseBackgroundVideos();
                          const id = youtubeParser(v.url);
                          if (!id) return;
                          onOpenVideoDialog(`https://www.youtube.com/embed/${id}?rel=0&loop=1&autoplay=1&mute=0&enablejsapi=1&showinfo=0`);
                        }}
                      >
                        <Image src="/assets/logo.png" alt="" width={50} height={50} />
                      </button>
                    </div>
                    <div className="video-container">
                      <YouTubeEmbedIframe
                        key={slide === i ? `embed-${v.id}-${slide}` : `idle-${i}`}
                        className="video ms-yt-bg"
                        title={`pv-${item.name}-${v.id}`}
                        allow="autoplay; encrypted-media; fullscreen"
                        allowFullScreen
                        frameBorder={0}
                        src={slide === i ? mutedEmbed || undefined : undefined}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div
            className={`swiper-pagination${isLoop ? " auto-height-pagination" : ""}`}
            id="ms-portfolio-swiper-pagination"
          />
        </div>
      </div>
    </div>
  );
}
