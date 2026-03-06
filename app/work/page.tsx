"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import SiteHeader from "../components/SiteHeader";
import Footer from "../components/Footer";

// Asset URLs
const imgJagexCaseStudy = "/assets/jagex-case-study.png";
const imgStudyStreamMockup = "/assets/studystream-mockup.png";
const imgJagexBackgroundBlur = "/assets/jagex-background-blur.png";
const imgJagexBackgroundDark = "/assets/jagex-background-dark.png";
const imgYCLogo = "/assets/yc-logo-proper.png";
const imgJagexLogo = "/assets/jagex-logo.svg";
const imgArrowNav = "/assets/arrow-nav.svg";
const imgStudyStreamLogo = "/assets/studystream-logo.svg";

export default function WorkPage() {
  return (
    <div className="max-w-[1920px] mx-auto">
      <SiteHeader showColorBar={true} showBreadcrumb={false} variant="simple" />

      {/* Hero Section */}
      <section className="px-4 md:px-12 lg:px-24 py-12 md:py-16 lg:py-24 max-w-[1400px] mx-auto">
        <div className="flex flex-col gap-6 md:gap-8">
          <h1 className="font-bebas text-[48px] sm:text-[64px] md:text-[96px] lg:text-[128px] leading-[0.9] tracking-[-2px] md:tracking-[-3px] text-black">
            Selected Work
          </h1>
          <p className="text-[18px] md:text-[22px] lg:text-[24px] leading-[1.5] text-[#6b6b6b] max-w-[800px]">
            Case studies showcasing product design, user research, and strategic thinking across early-stage startups and established companies.
          </p>
        </div>
      </section>

      {/* Case Studies Grid */}
      <section className="px-4 md:px-12 lg:px-24 pb-16 md:pb-24 max-w-[1400px] mx-auto">
        <div className="flex flex-col gap-8 md:gap-12">

          {/* StudyStream Case Study */}
          <Link href="/studystream" className="group block w-full lg:w-[60%]">
            <div className="bg-[#f2f2f2] rounded-2xl md:rounded-3xl overflow-hidden cursor-pointer hover:bg-[#ebebeb] transition-colors">
              {/* Header */}
              <div className="flex gap-4 items-center pt-6 px-6 pb-16 md:px-8 md:pt-8 md:pb-16">
                <div className="bg-white p-2 rounded-lg w-10 h-10 flex items-center justify-center">
                  <div className="relative w-4 h-[25px]">
                    <Image src={imgStudyStreamLogo} alt="StudyStream" fill sizes="16px" className="object-contain" />
                  </div>
                </div>
                <p className="font-poppins font-medium text-[21px] tracking-[-0.42px] text-black leading-[1.795] whitespace-nowrap">
                  StudyStream
                </p>
                <div className="bg-[#ff7939] h-8 rounded flex items-center pr-4 overflow-hidden">
                  <div className="w-8 h-8 flex items-center justify-center">
                    <div className="relative w-8 h-8 scale-y-[-1] rotate-180">
                      <Image src={imgYCLogo} alt="YCombinator" fill sizes="32px" className="object-contain" />
                    </div>
                  </div>
                  <p className="font-figtree font-semibold text-[13px] text-white uppercase text-center whitespace-nowrap pl-3">
                    combinator
                  </p>
                </div>
              </div>

              {/* Content */}
              <div className="px-6 md:px-20 pb-6 md:pb-20">
                <h2 className="font-bebas text-[32px] md:text-[48px] lg:text-[56px] leading-[0.9] tracking-[-1px] md:tracking-[-2px] text-black mb-4">
                  From a Zoom call to 3 million students
                </h2>
                <p className="text-[14px] md:text-[16px] lg:text-[18px] text-[#6b6b6b] leading-[1.5] mb-6">
                  Leading product design for a YC-backed startup from concept to product-market fit at global scale.
                </p>
                <div className="flex flex-wrap gap-4 text-[14px] md:text-[16px] text-[#6b6b6b]">
                  <span className="bg-white/80 px-3 py-1.5 rounded-lg">Lead Product Designer</span>
                  <span className="bg-white/80 px-3 py-1.5 rounded-lg">2.5 years</span>
                  <span className="bg-white/80 px-3 py-1.5 rounded-lg">0 → 3M+ users</span>
                </div>
              </div>

              {/* StudyStream Mockup */}
              <div className="w-full px-8">
                <Image
                  src={imgStudyStreamMockup}
                  alt="StudyStream Case Study"
                  width={1280}
                  height={800}
                  className="object-cover w-full h-auto"
                />
              </div>
            </div>
          </Link>

          {/* Jagex Case Study */}
          <Link href="/jagex" className="group cursor-pointer w-full lg:w-[60%] lg:ml-auto">
            <div className="bg-[#03060f] rounded-2xl md:rounded-3xl overflow-hidden hover:opacity-90 transition-opacity relative">
              {/* Dark Background Layer */}
              <div className="absolute -translate-x-1/2 bottom-[-290px] left-1/2 top-0 aspect-[2752/1536] pointer-events-none">
                <div className="absolute inset-0">
                  <Image
                    src={imgJagexBackgroundDark}
                    alt=""
                    fill
                    className="object-cover"
                  />
                  <div className="absolute bg-[#03060f]/50 inset-0" />
                </div>
              </div>

              {/* Blurred Background */}
              <div className="absolute blur-[74px] h-full left-0 top-0 w-full pointer-events-none">
                <Image
                  src={imgJagexBackgroundBlur}
                  alt=""
                  fill
                  className="object-cover"
                />
              </div>

              {/* Header */}
              <div className="relative z-10 flex items-center gap-4 p-6 md:pt-8 md:px-8 md:pb-20">
                <div className="bg-white p-2 rounded-lg w-10 h-10 flex items-center justify-center">
                  <Image src={imgJagexLogo} alt="Jagex" width={24} height={24} />
                </div>
                <p className="font-poppins font-medium text-[21px] tracking-[-0.42px] text-white whitespace-nowrap">
                  Jagex (RuneScape IP)
                </p>
              </div>

              {/* Content */}
              <div className="relative z-10 px-6 md:px-20 pb-6 md:pb-20">
                <h2 className="font-bebas text-[32px] md:text-[48px] lg:text-[56px] leading-[0.9] tracking-[-1px] md:tracking-[-2px] text-white mb-4">
                  Designing for one of gaming's most iconic IPs
                </h2>
                <p className="text-[14px] md:text-[16px] lg:text-[18px] text-white/90 leading-[1.5] mb-6">
                  Product design and research for RuneScape, serving millions of players worldwide.
                </p>
                <div className="flex flex-wrap gap-4 text-[14px] md:text-[16px] text-white">
                  <span className="bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-lg">Product Designer</span>
                  <span className="bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-lg">Live Service</span>
                </div>
              </div>

              {/* Case Study Image */}
              <div className="relative w-full px-8">
                <Image
                  src={imgJagexCaseStudy}
                  alt="Jagex Case Study"
                  width={1280}
                  height={800}
                  className="object-cover w-full h-auto"
                />
              </div>
            </div>
          </Link>

        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 md:px-12 lg:px-24 py-16 md:py-20 max-w-[1400px] mx-auto">
        <div className="bg-white rounded-2xl md:rounded-3xl p-8 md:p-12 lg:p-16 text-center">
          <h2 className="font-bebas text-[36px] md:text-[48px] lg:text-[64px] leading-[0.9] tracking-[-1px] text-black mb-4">
            Let's work together
          </h2>
          <p className="text-[16px] md:text-[18px] lg:text-[20px] text-[#6b6b6b] mb-8 max-w-[600px] mx-auto">
            I help funded startups move fast in the right direction through product design, user research, and strategic thinking.
          </p>
          <a href="#" className="inline-block bg-gradient-to-b from-[#242424] to-[#131313] text-white rounded-xl px-8 py-4 text-[16px] md:text-[18px] hover:from-[#2f2f2f] hover:to-[#1a1a1a] transition-all">
            Get in touch
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}
