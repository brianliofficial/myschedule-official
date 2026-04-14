"use client";

import type { ReactNode } from "react";

/** 對應 `pug/_dialog.pug`（影片 lightbox） */
type Props = {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
};

export default function VideoDialog({ open, onClose, children }: Props) {
  if (!open) return null;

  return (
    <div
      className="dialog"
      role="presentation"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="dialogFrame">
        <div className="close" onClick={onClose} role="button" tabIndex={0} onKeyDown={(e) => e.key === "Enter" && onClose()}>
          <div className="bi bi-plus-circle" />
        </div>
        <div id="dialog-wrapper" className="wrapper">
          {children}
        </div>
      </div>
    </div>
  );
}
