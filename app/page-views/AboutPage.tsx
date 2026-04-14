"use client";

import YouTubeEmbedIframe from "@/app/components/YouTubeEmbedIframe";
import type { AboutVideo, MemberItem } from "@/lib/siteData";
import { embedAutoplayMutedPlaylist, embedUrlFromAnyYoutube } from "@/lib/youtube";
import Image from "next/image";

import { pauseBackgroundVideos } from "@/lib/videoIframe";

/** 對應 `pug/about.pug` + `docs/js/about.js` */
type Props = {
  onOpenVideoDialog: (embedSrc: string) => void;
  aboutVideos: AboutVideo[];
  memberData: MemberItem[];
};

export default function AboutPage({ onOpenVideoDialog, aboutVideos, memberData }: Props) {
  const v0 = aboutVideos[0];
  const v1 = aboutVideos[1];

  const openAboutDialog = (embedSrc: string) => {
    pauseBackgroundVideos();
    onOpenVideoDialog(embedSrc);
  };

  return (
    <div className="member">
      <div className="videos-wrapper aboutVideos1">
        <div className="blackScreen">
          <button
            type="button"
            className="button"
            data-set={0}
            onClick={() => {
              const base = embedUrlFromAnyYoutube(v0.url);
              if (!base) return;
              openAboutDialog(`${base}?rel=0&autoplay=1&loop=1&enablejsapi=1&showinfo=0`);
            }}
          >
            <Image
              src="/assets/logo.png"
              alt=""
              width={350}
              height={350}
              sizes="350px"
              quality={100}
              loading="eager"
            />
          </button>
          <div className="about-us">
            <p>
              This is MY SCHEDULE LTD. We are a creative video production company based in Taipei, Taiwan. Operating globally, we are dedicated to producing top-quality visuals. Our creative team specializes in a variety of video productions, including movies, music videos, television shows, commercials, and occasionally unconventional YouTube content.
            </p>
          </div>
        </div>
        <div className="iframe-videos">
          <YouTubeEmbedIframe
            title="about-1"
            className="video ms-yt-bg"
            src={embedAutoplayMutedPlaylist(v0.url) || undefined}
            allow="autoplay; fullscreen"
            allowFullScreen
            frameBorder={0}
          />
        </div>
      </div>
      <div className="aboutMember">
        <div className="member-container">
          {memberData.map((m, i) => (
            <div className="member" key={m.id}>
              <div className={`member-profile member-profile${i + 1}`} />
              <p className="title">{m.title}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="videos-wrapper aboutVideos2">
        <h2>OFFICE TOUR</h2>
        <div className="blackScreen">
          <button
            type="button"
            className="button"
            data-set={1}
            onClick={() => {
              const base = embedUrlFromAnyYoutube(v1.url);
              if (!base) return;
              openAboutDialog(`${base}?rel=0&autoplay=1&loop=1&enablejsapi=1&showinfo=0`);
            }}
          >
            <h2 className="mob"> OFFICE TOUR</h2>
            <Image src="/assets/logo.png" alt="" width={50} height={50} />
          </button>
        </div>
        <div className="iframe-videos">
          <YouTubeEmbedIframe
            title="about-2"
            className="video ms-yt-bg"
            src={embedAutoplayMutedPlaylist(v1.url) || undefined}
            allow="autoplay; fullscreen"
            allowFullScreen
            frameBorder={0}
          />
        </div>
        <div className="mob-member-bg" />
      </div>
      <div className="contact-us">
        <div className="container">
          <p className="title">STAY IN THE LOOP</p>
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
        </div>
      </div>
    </div>
  );
}
