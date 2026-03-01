"use client";

import { useState, useEffect } from "react";

interface UseIsMobileOptions {
  breakpoint?: number;
  checkTouch?: boolean;
}

export function useIsMobile(options: UseIsMobileOptions = {}): boolean {
  const { breakpoint = 768, checkTouch = false } = options;
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const widthCheck = window.innerWidth < breakpoint;
      const touchCheck = checkTouch ? "ontouchstart" in window : false;
      setIsMobile(widthCheck || touchCheck);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, [breakpoint, checkTouch]);

  return isMobile;
}
