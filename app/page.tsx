"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

import Header from "./components/Header";
import Hero from "./components/Hero";
import Jagex from "./components/Jagex";
import Introduction from "./components/Introduction";

// Register ScrollTrigger
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const imgImage28 = "/assets/background-gradient.png";

export default function Frame() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Ensure we are in a browser environment
    if (typeof window === "undefined") return;

    const ctx = gsap.context(() => {
      const track = trackRef.current;
      const section = sectionRef.current;

      if (!track || !section) return;

      // Calculate how far we need to move horizontally
      // Since we have 2 panels of 100vw, the track is 200vw.
      // We need to move it left by 100vw (which is 50% of the 200vw track).
      const scrollWidth = track.scrollWidth;
      const viewportWidth = window.innerWidth;
      const horizontalScrollLength = scrollWidth - viewportWidth;

      // 1. Pin the section
      ScrollTrigger.create({
        trigger: section,
        pin: true,
        start: "top top",
        end: () => `+=${horizontalScrollLength}`,
        scrub: 1,
        invalidateOnRefresh: true,
      });

      // 2. Animate the track horizontally
      gsap.to(track, {
        x: () => -horizontalScrollLength,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${horizontalScrollLength}`,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });
    }, sectionRef);

    return () => {
      ctx.revert();
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <div className="bg-[#202020] relative w-full min-h-screen">
      
      {/* Top Section: Header & Hero with Background */}
      <div className="relative w-full">
        {/* Absolute Background Layers for this section only */}
        <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
          <div className="absolute blur-[2px] filter w-full h-full">
            <div aria-hidden="true" className="absolute inset-0">
              <img alt="" className="absolute inset-0 w-full h-full object-cover opacity-60" src={imgImage28} />
              <div className="absolute inset-0" style={{ backgroundImage: "linear-gradient(rgba(32, 32, 32, 0.5) 58.38%, rgb(32, 32, 32) 100%), linear-gradient(127.843deg, rgba(32, 32, 32, 0.5) 11.346%, rgb(32, 32, 32) 84.287%)" }} />
            </div>
          </div>
          <div className="absolute backdrop-blur-[30px] backdrop-filter bg-[rgba(0,0,0,0.01)] w-full h-full" />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col w-full h-screen pb-24 md:pb-32">
          <Header />
          <div className="pt-12 md:pt-24 px-8">
            <Hero />
          </div>
        </div>
      </div>

      {/* Horizontal Scroll Area (Solid Background) */}
      <section 
        ref={sectionRef} 
        className="relative w-full h-screen overflow-hidden bg-[#202020]"
      >
        {/* Horizontal Track */}
        <div 
          ref={trackRef} 
          className="flex h-full w-fit flex-nowrap"
        >
          {/* Panel 1: Jagex */}
          <div className="w-screen h-full flex-shrink-0 flex flex-col justify-center box-border">
            <Jagex />
          </div>

          {/* Panel 2: Introduction */}
          <div className="w-screen h-full flex-shrink-0 flex items-center justify-center bg-[#202020] box-border">
            <Introduction />
          </div>
        </div>
      </section>

      {/* Optional: Spacer / Next Content */}
      <div className="h-[50vh] w-full bg-neutral-900 flex items-center justify-center">
         <p className="text-white font-figtree opacity-50">Next Section</p>
      </div>
    </div>
  );
}