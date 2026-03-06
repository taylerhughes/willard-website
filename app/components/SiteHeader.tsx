"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";

const imgLogo = "/assets/logo.svg";

interface SiteHeaderProps {
  showColorBar?: boolean;
  showBreadcrumb?: boolean;
  variant?: "default" | "simple";
}

export default function SiteHeader({
  showColorBar = true,
  showBreadcrumb = true,
  variant = "default"
}: SiteHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="">
      {/* Header */}
      <header className={`bg-white px-4 md:px-8 lg:px-12 py-4 md:py-6 flex items-center justify-between rounded-t-3xl relative`}>
        {/* Logo and Rating */}
        <Link href="/" className="flex gap-3 md:gap-6 items-center">
          <div className="relative h-[32px] w-[32px] md:h-[37px] md:w-[37px]">
            <Image
              src={imgLogo}
              alt="Willard"
              fill
              className="object-contain"
            />
          </div>
          {variant === "default" && (
            <div className="hidden lg:flex gap-4 items-center">
              <p className="text-[22px] text-black">5.0</p>
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="#FFD700"/>
                  </svg>
                ))}
              </div>
              <div className="h-[20px] w-[71px] relative">
              </div>
            </div>
          )}
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex gap-8 xl:gap-12 items-center text-[16px] xl:text-[18px] text-[#202020]">
          <Link href="/" className="hover:opacity-70 transition-opacity">Home</Link>
          <Link href="/signal-engine" className="hover:opacity-70 transition-opacity">Signal Engine™</Link>
          <Link href="/work" className="hover:opacity-70 transition-opacity">Work</Link>
          <a href="/Tayler_Hughes_Resume.pdf" target="_blank" rel="noopener noreferrer" className="hover:opacity-70 transition-opacity flex items-center gap-1.5">
            Resume
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="size-4">
              <path fillRule="evenodd" d="M4.22 11.78a.75.75 0 0 1 0-1.06L9.44 5.5H5.75a.75.75 0 0 1 0-1.5h5.5a.75.75 0 0 1 .75.75v5.5a.75.75 0 0 1-1.5 0V6.56l-5.22 5.22a.75.75 0 0 1-1.06 0Z" clipRule="evenodd" />
            </svg>
          </a>
          <a href="https://linkedin.com/in/taylerhughes" target="_blank" rel="noopener noreferrer" className="hover:opacity-70 transition-opacity flex items-center gap-1.5">
            LinkedIn
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="size-4">
              <path fillRule="evenodd" d="M4.22 11.78a.75.75 0 0 1 0-1.06L9.44 5.5H5.75a.75.75 0 0 1 0-1.5h5.5a.75.75 0 0 1 .75.75v5.5a.75.75 0 0 1-1.5 0V6.56l-5.22 5.22a.75.75 0 0 1-1.06 0Z" clipRule="evenodd" />
            </svg>
          </a>
          <Link href="/contact" className="bg-gradient-to-b from-[#242424] to-[#131313] text-white rounded-xl px-6 py-2.5 hover:from-[#2f2f2f] hover:to-[#1a1a1a] transition-all">Contact</Link>
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
              <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
              <path fillRule="evenodd" d="M3 6.75A.75.75 0 013.75 6h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 6.75zM3 12a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 12zm0 5.25a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75a.75.75 0 01-.75-.75z" clipRule="evenodd" />
            </svg>
          )}
        </button>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <nav className="lg:hidden absolute top-full left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50 rounded-b-3xl">
            <div className="flex flex-col p-4 gap-2">
              <Link href="/" onClick={() => setMobileMenuOpen(false)} className="px-4 py-3 hover:bg-gray-100 rounded-lg transition-colors text-[16px] text-[#202020]">Home</Link>
              <Link href="/signal-engine" onClick={() => setMobileMenuOpen(false)} className="px-4 py-3 hover:bg-gray-100 rounded-lg transition-colors text-[16px] text-[#202020]">Signal Engine™</Link>
              <Link href="/work" onClick={() => setMobileMenuOpen(false)} className="px-4 py-3 hover:bg-gray-100 rounded-lg transition-colors text-[16px] text-[#202020]">Work</Link>
              <a href="/Tayler_Hughes_Resume.pdf" target="_blank" rel="noopener noreferrer" onClick={() => setMobileMenuOpen(false)} className="px-4 py-3 hover:bg-gray-100 rounded-lg transition-colors text-[16px] text-[#202020] flex items-center gap-1.5">
                Resume
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="size-4">
                  <path fillRule="evenodd" d="M4.22 11.78a.75.75 0 0 1 0-1.06L9.44 5.5H5.75a.75.75 0 0 1 0-1.5h5.5a.75.75 0 0 1 .75.75v5.5a.75.75 0 0 1-1.5 0V6.56l-5.22 5.22a.75.75 0 0 1-1.06 0Z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="https://linkedin.com/in/taylerhughes" target="_blank" rel="noopener noreferrer" onClick={() => setMobileMenuOpen(false)} className="px-4 py-3 hover:bg-gray-100 rounded-lg transition-colors text-[16px] text-[#202020] flex items-center gap-1.5">
                LinkedIn
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="size-4">
                  <path fillRule="evenodd" d="M4.22 11.78a.75.75 0 0 1 0-1.06L9.44 5.5H5.75a.75.75 0 0 1 0-1.5h5.5a.75.75 0 0 1 .75.75v5.5a.75.75 0 0 1-1.5 0V6.56l-5.22 5.22a.75.75 0 0 1-1.06 0Z" clipRule="evenodd" />
                </svg>
              </a>
              <Link href="/contact" onClick={() => setMobileMenuOpen(false)} className="bg-gradient-to-b from-[#242424] to-[#131313] text-white rounded-xl px-6 py-3 hover:from-[#2f2f2f] hover:to-[#1a1a1a] transition-all text-center mt-2">Contact</Link>
            </div>
          </nav>
        )}
      </header>

      {/* Color Bar */}
      {showColorBar && (
        <div className="h-1.5 md:h-2 flex">
          <div className="bg-[#06144b] w-[20px] md:w-[39px]" />
          <div className="bg-[#011f90] w-[20px] md:w-[40px]" />
          <div className="bg-[#0028b7] flex-1" />
          <div className="bg-[#0133eb] w-[20px] md:w-[39px]" />
          <div className="bg-[#006cfd] w-[20px] md:w-[40px]" />
          <div className="bg-[#6cabff] w-[20px] md:w-[39px]" />
          <div className="bg-[#c3e0fd] w-[20px] md:w-[39px]" />
          <div className="bg-[#ff4e31] w-[20px] md:w-[40px]" />
          <div className="bg-[#ff7353] w-[20px] md:w-[39px]" />
          <div className="bg-[#ffa075] w-[20px] md:w-[40px]" />
          <div className="bg-black w-[100px] md:w-[462px]" />
          <div className="bg-[#2a292e] w-[20px] md:w-[40px]" />
          <div className="bg-[#959499] w-[20px] md:w-[39px]" />
          <div className="bg-[#c1c1c3] w-[20px] md:w-[40px]" />
          <div className="bg-[#e2e2e2] w-[20px] md:w-[39px]" />
        </div>
      )}

      {/* Breadcrumb Section */}
      {showBreadcrumb && (
        <div className="bg-white px-4 md:px-8 lg:px-12 py-4 md:py-6 flex flex-col md:flex-row items-start md:justify-between gap-4 md:gap-4 rounded-b-3xl">
          <h1 className="font-bebas text-[28px] md:text-[34px] font-semibold text-[#202020]">/ home</h1>

          <div className="flex gap-4 md:gap-6 items-center w-full md:w-auto m-width-[40%] w-auto">
            {/* Signal Engine Tab */}
            <div className="flex flex-col gap-2 px-3 md:px-4 py-2 md:py-3">
              <div className="flex gap-3 md:gap-4 items-center">
                <Image src="/assets/activity-icon.svg" alt="" width={20} height={20} className="md:w-[24px] md:h-[24px]" />
                <p className="font-semibold text-[16px] md:text-[18px] text-[#202020]">Signal Engine™</p>
              </div>
              <p className="text-[14px] md:text-[16px] text-[#202020] pl-8 md:pl-10 max-w-[400px] leading-tight">
                The Signal Engine™ is our proprietary framework for turning user research into confident product decisions — without slowing teams down.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
