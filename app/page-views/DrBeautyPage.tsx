"use client";

import YouTubeEmbedIframe from "@/app/components/YouTubeEmbedIframe";
import type { DrBeautyVideo } from "@/lib/siteData";
import { embedAutoplayMutedPlaylist, youtubeParser } from "@/lib/youtube";
import { pauseBackgroundVideos } from "@/lib/videoIframe";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { Swiper as SwiperType } from "swiper";
import { Pagination } from "swiper/modules";
import Swiper from "swiper";

/** 對應 `pug/drBeauty.pug` 的 container（`block header` 履歷另見 `DrBeautyBioDialog`）+ `docs/js/drBeauty.js` */
type Props = {
  onOpenVideoDialog: (embedSrc: string) => void;
  onOpenBio: () => void;
  drBeautyVideos: DrBeautyVideo[];
};

export default function DrBeautyPage({ onOpenVideoDialog, onOpenBio, drBeautyVideos }: Props) {
  const [slide, setSlide] = useState(0);
  const swiperRef = useRef<SwiperType | null>(null);

  const onDrSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const subject = String(fd.get("subject") ?? "");
    const body = String(fd.get("body") ?? "");
    window.location.href = `mailto:mssdrbeauty@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  useEffect(() => {
    const el = document.querySelector<HTMLElement>("#ms-page-dr-beauty .profilo-swiper");
    if (!el) return;

    const init = () => {
      swiperRef.current?.destroy(true, true);
      const pag = document.querySelector<HTMLElement>("#ms-dr-swiper-pagination");
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
                    `<div class="pagination-subtitle ${className}"><span class="text">${drBeautyVideos[index]?.title ?? ""}</span></div>`
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
  }, [drBeautyVideos]);

  return (
    <div id="ms-page-dr-beauty" className="drBeautyContent drBeautyPage">
      <div className="aboutDrBeauty1">
        <div className="blackScreen">
          <button type="button" className="button button-resume" onClick={onOpenBio}>
            <Image src="/assets/logo.png" alt="" width={50} height={50} />
          </button>
        </div>
      </div>
      <div className="beauty-short-description">
        <h6>LI BAOBI:</h6>
        <p>ARTIST </p>
        <p>RAPPER</p>
        <p>MUSIC PRODUCER</p>
        <p>HOST</p>
        <p>INFLUENCER</p>
        <p>YOUTUBER</p>
        <p>MASCOT.</p>
      </div>
      <div className="profilo">
        <div className="swiper profilo-swiper">
          <div className="swiper-wrapper">
            {drBeautyVideos.map((v, i) => {
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
                        title={`dr-${i}`}
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
          <div className="swiper-pagination" id="ms-dr-swiper-pagination" />
        </div>
      </div>
      <div className="contact-us">
        <div className="blackScreen" />
        <div className="container">
          <h5>BUSINESS INQUIRIES?</h5>
          <p>Please email to mssdrbeauty@gmail.com</p>
          <form onSubmit={onDrSubmit}>
            <div className="text">
              <p>Subject:</p>
              <input id="ms-dr-subject" type="text" name="subject" />
            </div>
            <div className="text">
              <p>Message:</p>
              <textarea id="ms-dr-message" name="body" />
            </div>
            <input id="ms-dr-submit" type="submit" name="submit" value="Submit" />
          </form>
        </div>
      </div>
    </div>
  );
}
