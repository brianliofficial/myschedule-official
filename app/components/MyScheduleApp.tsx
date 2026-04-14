"use client";

import AboutPage from "@/app/page-views/AboutPage";
import ContactPage from "@/app/page-views/ContactPage";
import DrBeautyPage from "@/app/page-views/DrBeautyPage";
import IndexPage from "@/app/page-views/IndexPage";
import PortfolioPage from "@/app/page-views/PortfolioPage";
import type { FetchSiteDataLoadInfo } from "@/lib/fetchSiteData";
import type { SiteDataProvenance } from "@/lib/siteDataFieldMeta";
import type { SiteData } from "@/lib/siteData";
import DrBeautyBioDialog from "./DrBeautyBioDialog";
import SiteFooter from "./SiteFooter";
import SiteHeader from "./SiteHeader";
import VideoDialog from "./VideoDialog";
import { useCommonMenu } from "@/hooks/useCommonMenu";
import type { SectionId } from "@/lib/sectionTypes";
import { playBackgroundVideos, stopDialogIframe } from "@/lib/videoIframe";
import { useEffect, useState } from "react";

type Props = {
  initialSiteData: SiteData;
  provenance: SiteDataProvenance;
  loadInfo: FetchSiteDataLoadInfo;
};

/** 開發時依目前區塊輸出：畫面上的資料／影片來自 default 或 remote（Supabase） */
function logSectionCms(
  section: SectionId,
  data: SiteData,
  provenance: SiteDataProvenance,
  loadInfo: FetchSiteDataLoadInfo,
) {
  if (process.env.NODE_ENV !== "development") return;

  const base = { loadInfo, section };

  switch (section) {
    case "index":
      console.info("[CMS][Index / HOME]", {
        ...base,
        homeVideos: data.homeVideos,
        source: provenance.homeVideos,
      });
      break;
    case "about":
      console.info("[CMS][About]", {
        ...base,
        aboutVideos: data.aboutVideos,
        memberData: data.memberData,
        aboutVideosSource: provenance.aboutVideos,
        memberDataSource: provenance.memberData,
      });
      break;
    case "contact":
      console.info("[CMS][Contact]", {
        ...base,
        contactVideos: data.contactVideos,
        aboutFallbackForContact: data.aboutVideos,
        contactVideosSource: provenance.contactVideos,
        aboutVideosSource: provenance.aboutVideos,
      });
      break;
    case "drBeauty":
      console.info("[CMS][DrBeauty]", {
        ...base,
        drBeautyVideos: data.drBeautyVideos,
        source: provenance.drBeautyVideos,
      });
      break;
    case "portfolio":
      console.info("[CMS][Portfolio]", {
        ...base,
        profilo: data.profilo,
        source: provenance.profilo,
      });
      break;
    default:
      break;
  }
}

/** 對應 `pug/_layout.pug`：header + dialog + 各頁 block */
export default function MyScheduleApp({ initialSiteData, provenance, loadInfo }: Props) {
  const [section, setSection] = useState<SectionId>("index");
  const [siteDataState] = useState<SiteData>(initialSiteData);
  const { menuOpen, toggleOn, desktopWide, onToggleEnter, onHeaderLeave, onToggleClick, closeMenu } = useCommonMenu();

  const [videoDialogOpen, setVideoDialogOpen] = useState(false);
  const [videoDialogSrc, setVideoDialogSrc] = useState<string | null>(null);
  const [drBioOpen, setDrBioOpen] = useState(false);

  useEffect(() => {
    logSectionCms(section, siteDataState, provenance, loadInfo);
  }, [section, siteDataState, provenance, loadInfo]);

  useEffect(() => {
    document.body.classList.add("ms-site-body");
    return () => document.body.classList.remove("ms-site-body");
  }, []);

  useEffect(() => {
    if (!desktopWide && menuOpen) {
      document.body.classList.add("ms-mobile-lock");
    } else {
      document.body.classList.remove("ms-mobile-lock");
    }
    return () => document.body.classList.remove("ms-mobile-lock");
  }, [menuOpen, desktopWide]);

  useEffect(() => {
    document.querySelectorAll(".swiper-pagination").forEach((el) => {
      if (!desktopWide && menuOpen) el.classList.add("openMenu");
      else el.classList.remove("openMenu");
    });
  }, [menuOpen, desktopWide]);

  useEffect(() => {
    if (drBioOpen) document.body.classList.add("overflow");
    else document.body.classList.remove("overflow");
    return () => document.body.classList.remove("overflow");
  }, [drBioOpen]);

  const navigate = (s: SectionId) => {
    setSection(s);
    closeMenu();
  };

  const openVideoDialog = (src: string) => {
    setVideoDialogSrc(src);
    setVideoDialogOpen(true);
  };

  const closeVideoDialog = () => {
    document.querySelectorAll<HTMLIFrameElement>("iframe.dialogvideo").forEach(stopDialogIframe);
    playBackgroundVideos();
    setVideoDialogOpen(false);
    setVideoDialogSrc(null);
  };

  const showFooter = section === "about" || section === "contact" || section === "drBeauty" || section === "portfolio";

  return (
    <>
      <SiteHeader
        section={section}
        onNavigate={navigate}
        menuOpen={menuOpen}
        toggleOn={toggleOn}
        onToggleEnter={onToggleEnter}
        onHeaderLeave={onHeaderLeave}
        onToggleClick={onToggleClick}
      />

      <VideoDialog open={videoDialogOpen} onClose={closeVideoDialog}>
        {videoDialogSrc ? (
          <iframe title="dialog" className="dialogvideo" src={videoDialogSrc} allow="autoplay; fullscreen" allowFullScreen frameBorder={0} />
        ) : null}
      </VideoDialog>

      {section === "drBeauty" && <DrBeautyBioDialog open={drBioOpen} onClose={() => setDrBioOpen(false)} />}

      {section === "index" && <IndexPage onOpenVideoDialog={openVideoDialog} homeVideos={siteDataState.homeVideos} />}
      {section === "about" && (
        <AboutPage
          onOpenVideoDialog={openVideoDialog}
          aboutVideos={siteDataState.aboutVideos}
          memberData={siteDataState.memberData}
        />
      )}
      {section === "contact" && (
        <ContactPage contactVideos={siteDataState.contactVideos} aboutVideos={siteDataState.aboutVideos} />
      )}
      {section === "drBeauty" && (
        <DrBeautyPage
          onOpenVideoDialog={openVideoDialog}
          onOpenBio={() => setDrBioOpen(true)}
          drBeautyVideos={siteDataState.drBeautyVideos}
        />
      )}
      {section === "portfolio" && <PortfolioPage onOpenVideoDialog={openVideoDialog} profilo={siteDataState.profilo} />}

      {showFooter && <SiteFooter />}
    </>
  );
}
