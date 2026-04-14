"use client";

import type { SectionId } from "@/lib/sectionTypes";
import { NAV_LABEL } from "@/lib/sectionTypes";

type Props = {
  section: SectionId;
  onNavigate: (s: SectionId) => void;
  menuOpen: boolean;
  toggleOn: boolean;
  onToggleEnter: () => void;
  onHeaderLeave: () => void;
  onToggleClick: () => void;
};

/** 對應 `pug/_header.pug` */
export default function SiteHeader({
  section,
  onNavigate,
  menuOpen,
  toggleOn,
  onToggleEnter,
  onHeaderLeave,
  onToggleClick,
}: Props) {
  return (
    <header className={`header${menuOpen ? " openMenu" : ""}`} onMouseLeave={onHeaderLeave}>
      <div className="menu-btn">
        <div
          id="toggle"
          className={toggleOn ? "on" : ""}
          onMouseEnter={onToggleEnter}
          onClick={onToggleClick}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && onToggleClick()}
        >
          <span> </span>
          <span> </span>
          <span />
        </div>
        <div id="toggle-link">
          <span>{NAV_LABEL[section]}</span>
        </div>
      </div>
      <div className="open-link">
        <nav className="menu">
          {(Object.keys(NAV_LABEL) as SectionId[]).map((id) => (
            <a
              key={id}
              href={`#${id}`}
              data-slide={id}
              className={section === id ? "active" : undefined}
              onClick={(e) => {
                e.preventDefault();
                onNavigate(id);
              }}
            >
              {NAV_LABEL[id]}
            </a>
          ))}
        </nav>
      </div>
      <div className="share-wrapper">
        <p className="share-link-title">Follow</p>
        <div className="share-link">
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
    </header>
  );
}
