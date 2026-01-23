"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
// import { SplitText } from "gsap/SplitText"; // Premium plugin
import Lenis from "lenis";

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
  const spacerRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const heroSectionRef = useRef<HTMLDivElement>(null);
  const panel1Ref = useRef<HTMLDivElement>(null);
  const panel2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Ensure we are in a browser environment
    if (typeof window === "undefined") return;

    // Initialize Lenis smooth scroll
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.lagSmoothing(0);

    const ctx = gsap.context(() => {
      const track = trackRef.current;
      const section = sectionRef.current;
      const spacer = spacerRef.current;
      const container = containerRef.current;
      const heroSection = heroSectionRef.current;
      const panel1 = panel1Ref.current;
      const panel2 = panel2Ref.current;

      if (!container) return;
      if (!track || !section || !spacer) return;

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

      // 3. Theme transition - animate all sections to white when spacer comes into view
      const themeElements = [container, spacer, section, panel1, panel2].filter(Boolean);

      themeElements.forEach((element) => {
        gsap.to(element, {
          backgroundColor: "#ffffff",
          scrollTrigger: {
            trigger: spacer,
            start: "top bottom",
            end: "top center",
            scrub: 1,
            invalidateOnRefresh: true,
          },
        });
      });

      // 4. Animate text color in spacer
      const spacerText = spacer.querySelector("p");
      if (spacerText) {
        gsap.to(spacerText, {
          color: "#000000",
          scrollTrigger: {
            trigger: spacer,
            start: "top bottom",
            end: "top center",
            scrub: 1,
            invalidateOnRefresh: true,
          },
        });
      }

      // 5. Animate all text content in panels to dark colors
      if (panel1) {
        const panel1Text = panel1.querySelectorAll("p, h1, h2, h3, h4, h5, h6, span, div");
        panel1Text.forEach((text) => {
          gsap.to(text, {
            color: "#000000",
            scrollTrigger: {
              trigger: spacer,
              start: "top bottom",
              end: "top center",
              scrub: 1,
              invalidateOnRefresh: true,
            },
          });
        });
      }

      if (panel2) {
        const panel2Text = panel2.querySelectorAll("p, h1, h2, h3, h4, h5, h6, span, div");
        panel2Text.forEach((text) => {
          gsap.to(text, {
            color: "#000000",
            scrollTrigger: {
              trigger: spacer,
              start: "top bottom",
              end: "top center",
              scrub: 1,
              invalidateOnRefresh: true,
            },
          });
        });
      }

      // Work item animations
      const workItems = gsap.utils.toArray(".work-item");

      workItems.forEach((item: any) => {
        const img = item.querySelector(".work-item-img");
        const nameH1 = item.querySelector(".work-item-name h1");

        // Manual character split (alternative to SplitText)
        if (nameH1) {
          const text = nameH1.textContent || "";
          nameH1.innerHTML = "";

          const chars = text.split("").map((char: string) => {
            const span = document.createElement("span");
            span.textContent = char === " " ? "\u00A0" : char;
            span.style.display = "inline-block";
            span.style.overflow = "hidden";
            span.style.position = "relative";

            const inner = document.createElement("span");
            inner.textContent = char === " " ? "\u00A0" : char;
            inner.style.display = "inline-block";

            span.appendChild(inner);
            nameH1.appendChild(span);
            return inner;
          });

          // Set initial state for characters
          gsap.set(chars, { y: "125%" });

          // Animate each character
          chars.forEach((char: HTMLSpanElement, index: number) => {
            ScrollTrigger.create({
              trigger: item,
              start: `top+=${index * 25 - 250} top`,
              end: `top+=${index * 25 - 100} top`,
              scrub: 1,
              animation: gsap.fromTo(
                char,
                { y: "125%" },
                { y: "0%", ease: "none" }
              ),
            });
          });
        }

        if (img) {
          // Clip-path reveal animation on scroll down (entrance)
          ScrollTrigger.create({
            trigger: item,
            start: "top bottom",
            end: "top top",
            scrub: 0.5,
            animation: gsap.fromTo(
              img,
              { clipPath: "polygon(25% 25%, 75% 40%, 100% 100%, 0% 100%)" },
              { clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)", ease: "none" }
            ),
          });

          // Clip-path hide animation on scroll past (exit)
          ScrollTrigger.create({
            trigger: item,
            start: "bottom bottom",
            end: "bottom top",
            scrub: 0.5,
            animation: gsap.fromTo(
              img,
              { clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)" },
              { clipPath: "polygon(0% 0%, 100% 0%, 75% 60%, 25% 75%)", ease: "none" }
            ),
          });
        }
      });
    }, containerRef);

    return () => {
      lenis.destroy();
      ctx.revert();
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <div ref={containerRef} className="bg-[#202020] relative w-full min-h-screen">
      
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
          <div ref={panel1Ref} className="w-screen h-full flex-shrink-0 flex flex-col justify-center box-border">
            <Jagex />
          </div>

          {/* Panel 2: Introduction */}
          <div ref={panel2Ref} className="w-screen h-full flex-shrink-0 flex items-center justify-center bg-[#202020] box-border">
            <Introduction />
          </div>
        </div>
      </section>

      {/* Optional: Spacer / Next Content */}
      <div ref={spacerRef} className="h-[50vh] w-full bg-[#202020] flex items-center justify-center">
         <p className="text-white font-figtree opacity-50">Next Section</p>
      </div>

      {/* Work Items with Scroll Animations */}
      <section className="work-item">
        <div className="work-item-img">
          <img src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920&h=1080&fit=crop" alt="Carbon Edge" />
        </div>
        <div className="work-item-name">
          <h1>Carbon Edge</h1>
        </div>
      </section>

      <section className="work-item">
        <div className="work-item-img">
          <img src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920&h=1080&fit=crop&sat=-100" alt="Velocity Grid" />
        </div>
        <div className="work-item-name">
          <h1>Velocity Grid</h1>
        </div>
      </section>

      <section className="work-item">
        <div className="work-item-img">
          <img src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=1920&h=1080&fit=crop" alt="Aeroform" />
        </div>
        <div className="work-item-name">
          <h1>Aeroform</h1>
        </div>
      </section>

      {/* Outro Section */}
      <section className="outro h-screen w-full flex items-center justify-center bg-white">
        <h1 className="text-[5rem] font-[550] uppercase text-center">Back to base</h1>
      </section>
    </div>
  );
}