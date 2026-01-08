"use client";

import React, { useState, useRef, useLayoutEffect } from "react";
import gsap from "gsap";

const imgVector = "/assets/logo.svg";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Initial Load Animation
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        headerRef.current,
        { y: -20, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: "power3.out" }
      );
    });
    return () => ctx.revert();
  }, []);

  // Menu Toggle Animation
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      if (isMenuOpen) {
        // Animate Mobile Items In
        gsap.fromTo(
          ".mobile-nav-item",
          { y: 10, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.4, stagger: 0.05, ease: "back.out(1.2)" }
        );
      } else {
        // Animate Desktop Panel Items In (Breadcrumbs + Cards)
        gsap.fromTo(
          ".desktop-panel-item",
          { y: 10, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, stagger: 0.05, ease: "power2.out" }
        );
      }
    }, contentRef); // Scope to the content container

    return () => ctx.revert();
  }, [isMenuOpen]);

  return (
    <div ref={headerRef} className="px-4 md:px-8 lg:px-[132px] pt-[63px] pb-12 w-full max-w-[1920px] mx-auto relative z-20 opacity-0">
      <div className="flex flex-col items-start w-full rounded-bl-[24px] rounded-br-[24px] overflow-hidden shadow-2xl bg-white transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]">
        
        {/* Top Nav */}
        <div className="bg-white border-[#e9e9e9] border-b flex flex-wrap items-center justify-between px-6 md:px-[48px] py-4 md:py-[24px] w-full relative z-30">
          <div className="relative shrink-0 size-[37px]">
            <img alt="" className="block w-full h-full" src={imgVector} />
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex gap-6 lg:gap-[48px] items-center text-[#202020] text-[18px]">
            {["home", "home", "home", "home", "home"].map((text, i) => (
              <p key={i} className="font-figtree font-normal cursor-pointer hover:opacity-70 transition-opacity">
                {text}
              </p>
            ))}
          </div>

          {/* Mobile Burger Menu Button */}
          <button 
            className="md:hidden p-2 -mr-2 text-[#202020] focus:outline-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              // Close Icon (X)
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            ) : (
              // Burger Icon
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            )}
          </button>
        </div>

        {/* Conditional Content Area */}
        <div ref={contentRef} className="w-full bg-white">
          {isMenuOpen ? (
            // Mobile Navigation List
            <div className="flex flex-col px-6 py-6 gap-4 text-[#202020]">
              {[1, 2, 3, 4, 5].map((_, i) => (
                <p key={i} className="mobile-nav-item font-figtree font-semibold text-[24px] cursor-pointer border-b border-gray-100 pb-2">
                  home
                </p>
              ))}
            </div>
          ) : (
            // Desktop Sub Nav / Breadcrumbs
            <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between px-6 md:px-[48px] py-6 gap-6 w-full">
              <p className="desktop-panel-item font-figtree font-semibold text-[#202020] text-[28px] md:text-[34px]">
                / home
              </p>

              <div className="flex flex-wrap gap-4 md:gap-[24px] items-center w-full xl:w-auto">
                {/* Card 1 */}
                <div className="desktop-panel-item flex flex-col gap-2 justify-center px-4 py-3 min-w-[200px] flex-1 md:flex-none">
                  <div className="flex gap-4 items-center">
                    <div className="relative size-[24px]">
                      <img alt="" className="block w-full h-full" src="/assets/activity-icon.svg" />
                    </div>
                    <p className="font-figtree font-semibold text-[#202020] text-[18px]">home</p>
                  </div>
                  <div className="pl-10">
                    <p className="font-figtree font-normal text-[#202020] text-[14px] md:text-[16px] leading-tight opacity-70">
                      easy payments in all transport modes
                    </p>
                  </div>
                </div>

                {/* Card 2 - Highlighted */}
                <div className="desktop-panel-item bg-[#f9f9f9] flex flex-col gap-2 justify-center px-4 py-3 rounded-[8px] min-w-[200px] flex-1 md:flex-none">
                  <div className="flex gap-4 items-center">
                    <div className="relative size-[8px]">
                      <img alt="" className="block w-full h-full" src="/assets/dot-icon.svg" />
                    </div>
                    <p className="font-figtree font-semibold text-[#202020] text-[18px]">home</p>
                  </div>
                  <div className="pl-6">
                    <p className="font-figtree font-normal text-[#202020] text-[14px] md:text-[16px] leading-tight opacity-70">
                      easy payments in all transport modes
                    </p>
                  </div>
                </div>

                {/* Card 3 */}
                <div className="desktop-panel-item flex flex-col gap-2 justify-center px-4 py-3 min-w-[200px] flex-1 md:flex-none">
                  <div className="flex gap-4 items-center">
                    <div className="relative size-[8px]">
                      <img alt="" className="block w-full h-full" src="/assets/dot-icon.svg" />
                    </div>
                    <p className="font-figtree font-semibold text-[#202020] text-[18px]">home</p>
                  </div>
                  <div className="pl-6">
                    <p className="font-figtree font-normal text-[#202020] text-[14px] md:text-[16px] leading-tight opacity-70">
                      easy payments in all transport modes
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
