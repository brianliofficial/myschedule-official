"use client";

import YouTubeEmbedIframe from "@/app/components/YouTubeEmbedIframe";
import type { AboutVideo } from "@/lib/siteData";
import { embedAutoplayMutedPlaylist } from "@/lib/youtube";
import Image from "next/image";
import { useEffect } from "react";

/** 對應 `pug/contact.pug` + `docs/js/contact.js`；`contact` 列無影片時用 About 第一支 */
type Props = { contactVideos: AboutVideo[]; aboutVideos: AboutVideo[] };

export default function ContactPage({ contactVideos, aboutVideos }: Props) {
  const v0 = contactVideos[0] ?? aboutVideos[0];

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const subject = String(fd.get("subject") ?? "");
    const body = String(fd.get("body") ?? "");
    window.location.href = `mailto:santana30541@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  useEffect(() => {
    const setHeight = () => {
      const footer = document.querySelector(".footer");
      if (!footer || window.innerWidth <= 960) return;
      const h = footer.getBoundingClientRect().height;
      const el = document.querySelector<HTMLElement>(".contact .contact-us");
      if (el) el.style.height = `calc(100vh - ${Math.round(h) + 1}px)`;
    };
    setHeight();
    window.addEventListener("resize", setHeight);
    return () => window.removeEventListener("resize", setHeight);
  }, []);

  return (
    <div className="contact">
      <div className="contact-us">
        <div className="contact-form">
          <form onSubmit={onSubmit}>
            <div className="text">
              <p>Subject:</p>
              <input id="subject" type="text" name="subject" />
            </div>
            <div className="text">
              <p>Message:</p>
              <textarea id="message" name="body" />
            </div>
            <input id="submit" type="submit" name="submit" value="Submit" />
          </form>
        </div>
        <div className="container">
          <div className="icon logo_icon">
            <Image src="/assets/logo.png" alt="" width={256} height={256} />
          </div>
          <p className="title">STAY IN THE LOOP</p>
          <p className="mob_title">santana30541@gmail.com</p>
          <p className="mob_subTitle">FOLLOW</p>
          <div className="share">
            <a className="icon" href="https://www.facebook.com/myschedule/?locale=zh_TW" target="_blank" rel="noreferrer">
              <i className="bi bi-facebook" />
            </a>
            <a className="icon" href="https://www.instagram.com/myschedule_ltd/" target="_blank" rel="noreferrer">
              <i className="bi bi-instagram" />
            </a>
            <a className="icon" href="https://www.youtube.com/channel/UCHsA8rgzjoV7DXtRX8V9Qag" target="_blank" rel="noreferrer">
              <i className="bi bi-youtube" />
            </a>
          </div>
          <p className="sub_title">2023 MY SCHEDULE @ ALL RIGHT RESERVED </p>
        </div>
      </div>
      <div className="videos-wrapper">
        <div className="iframe-videos">
          <YouTubeEmbedIframe
            title="contact-bg"
            className="video ms-yt-bg"
            src={v0 ? embedAutoplayMutedPlaylist(v0.url) || undefined : undefined}
            allow="autoplay; fullscreen"
            allowFullScreen
            frameBorder={0}
          />
        </div>
        <div className="blackScreen" />
      </div>
    </div>
  );
}
