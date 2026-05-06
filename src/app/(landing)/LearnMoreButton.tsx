"use client";

import React from "react";

export default function LearnMoreButton() {
  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault();
    const target = document.getElementById("features");
    if (!target) return;

    const targetPosition = target.getBoundingClientRect().top + window.scrollY;
    const startPosition = window.scrollY;
    const distance = targetPosition - startPosition;
    const duration = 800;
    let start: number | null = null;

    // ease-in-out timing function (cubic)
    const easeInOutCubic = (t: number, b: number, c: number, d: number) => {
      t /= d / 2;
      if (t < 1) return (c / 2) * t * t * t + b;
      t -= 2;
      return (c / 2) * (t * t * t + 2) + b;
    };

    const animation = (currentTime: number) => {
      if (start === null) start = currentTime;
      const timeElapsed = currentTime - start;
      const run = easeInOutCubic(timeElapsed, startPosition, distance, duration);
      window.scrollTo(0, run);
      if (timeElapsed < duration) requestAnimationFrame(animation);
    };

    requestAnimationFrame(animation);
  };

  return (
    <a
      href="#features"
      onClick={handleScroll}
      className="inline-block w-full sm:w-auto text-center bg-zinc-800 hover:bg-zinc-700 text-white px-8 py-3 rounded-lg font-semibold text-lg transition-colors border border-zinc-700 cursor-pointer"
    >
      Learn More
    </a>
  );
}
