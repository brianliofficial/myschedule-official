"use client";

import YouTubeEmbedIframe from "@/app/components/YouTubeEmbedIframe";
import type { HomeVideo } from "@/lib/siteData";
import { embedAutoplayMutedPlaylist, youtubeParser } from "@/lib/youtube";
import Image from "next/image";
import { useEffect, useRef } from "react";
import type { Swiper as SwiperType } from "swiper";
import { Mousewheel } from "swiper/modules";
import Swiper from "swiper";

/** 對應 `pug/index.pug` + `docs/js/index.js` */
type Props = {
  onOpenVideoDialog: (embedSrc: string) => void;
  homeVideos: HomeVideo[];
};

export default function IndexPage({ onOpenVideoDialog, homeVideos }: Props) {
  const swiperRef = useRef<SwiperType | null>(null);

  useEffect(() => {
    const el = document.querySelector<HTMLElement>(".indexSwiper");
    if (!el) return;
    swiperRef.current?.destroy(true, true);
    swiperRef.current = new Swiper(el, {
      modules: [Mousewheel],
      direction: "vertical",
      slidesPerView: 1,
      spaceBetween: 0,
      mousewheel: true,
      autoHeight: true,
    });
    return () => {
      swiperRef.current?.destroy(true, true);
      swiperRef.current = null;
    };
  }, [homeVideos.length]);

  return (
    <>
      <div className="mob-context">
        <p>THIS IS MY SCHEDULE LTD.</p>
        <p>WE ARE A CREATIVE VIDEO.</p>
        <p>PRODUCTION COMPANY</p>
        <p>BASED IN TAIPEI, TAIWAN.</p>
        <p>OPERATING GLOBALLY, WE</p>
        <p>ARE DEDICATED TO</p>
        <p>PRODUCING TOP-QUALITY</p>
        <p>VARIETY OF VIDEO</p>
        <p>PRODUCTIONS, INCLUDING</p>
        <p>MOVIES, MUSIC VIDEOS,</p>
        <p>TELEVISION SHOWS,</p>
        <p>COMMERCIALS, AND</p>
        <p>OCCASIONALLY</p>
        <p>UNCONVENTIONAL YOUTUBE</p>
        <p>CONTENT.</p>
      </div>
      <div className="container-fluid">
        <div className="swiper indexSwiper">
          <div className="swiper-wrapper">
            {homeVideos.map((v, i) => {
              const id = youtubeParser(v.url);
              const bgSrc = embedAutoplayMutedPlaylist(v.url);
              return (
                <div className="swiper-slide" key={v.id}>
                  <div className="wrapper">
                    <div className="blackScreen">
                      <button
                        type="button"
                        className="button"
                        data-set={i}
                        onClick={() => {
                          if (!id) return;
                          onOpenVideoDialog(
                            `https://www.youtube.com/embed/${id}?rel=0&loop=1&autoplay=1&mute=0&enablejsapi=1&showinfo=0`,
                          );
                        }}
                      >
                        <Image src="/assets/logo.png" alt="" width={50} height={50} />
                      </button>
                    </div>
                    <YouTubeEmbedIframe
                      title={`home-${i}`}
                      className="video ms-yt-bg"
                      src={bgSrc || undefined}
                      allow="autoplay; fullscreen"
                      allowFullScreen
                      frameBorder={0}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
