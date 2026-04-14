"use client";

import { useCallback, useEffect, useState } from "react";

/** 對應 `docs/js/common.js`：桌面 hover 展開選單、手機點擊切換、寬度 780px 分界 */
export function useCommonMenu() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [toggleOn, setToggleOn] = useState(false);
  const [desktopWide, setDesktopWide] = useState(true);

  const updateWidth = useCallback(() => {
    if (typeof window === "undefined") return;
    setDesktopWide(window.innerWidth > 780);
  }, []);

  useEffect(() => {
    updateWidth();
    let t: ReturnType<typeof setTimeout>;
    const debounced = () => {
      clearTimeout(t);
      t = setTimeout(updateWidth, 150);
    };
    window.addEventListener("resize", debounced);
    return () => {
      clearTimeout(t);
      window.removeEventListener("resize", debounced);
    };
  }, [updateWidth]);

  const onToggleEnter = useCallback(() => {
    if (desktopWide) {
      setToggleOn(true);
      setMenuOpen(true);
    }
  }, [desktopWide]);

  const onHeaderLeave = useCallback(() => {
    if (desktopWide) {
      setToggleOn(false);
      setMenuOpen(false);
    }
  }, [desktopWide]);

  const onToggleClick = useCallback(() => {
    if (!desktopWide) {
      setToggleOn((v) => !v);
      setMenuOpen((v) => !v);
    }
  }, [desktopWide]);

  const closeMenu = useCallback(() => {
    setMenuOpen(false);
    setToggleOn(false);
  }, []);

  return {
    menuOpen,
    toggleOn,
    desktopWide,
    onToggleEnter,
    onHeaderLeave,
    onToggleClick,
    closeMenu,
  };
}
