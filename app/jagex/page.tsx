"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import SiteHeader from "../components/SiteHeader";
import Footer from "../components/Footer";

// Asset URLs
const imgJagexLogo = "/assets/jagex-logo.svg";
const imgSlide52 = "/assets/slide 52.png";
const imgSlide53 = "/assets/slide 53.png";

export default function JagexCaseStudy() {
  return (
    <div className="max-w-[1920px] mx-auto">
        <SiteHeader showColorBar={true} showBreadcrumb={false} variant="simple" />

        {/* Hero Section */}
        <section className="px-4 md:px-12 lg:px-24 py-12 md:py-16 lg:py-24 max-w-[1200px] mx-auto">
          <div className="flex flex-col gap-6 md:gap-8">
            {/* Title */}
            <h1 className="font-bebas text-[40px] sm:text-[56px] md:text-[80px] lg:text-[96px] leading-[0.95] md:leading-[0.9] tracking-[-1.5px] md:tracking-[-2px] text-black">
              Designing for a 300 million player legacy
            </h1>

            {/* Metadata */}
            <div className="flex gap-4 items-center">
              <div className="bg-white p-2 rounded-lg w-10 h-10 flex items-center justify-center border border-gray-200">
                <Image src={imgJagexLogo} alt="Jagex" width={24} height={24} />
              </div>
              <p className="font-poppins font-medium text-[21px] tracking-[-0.42px] text-black leading-[1.795] whitespace-nowrap">
                Jagex · RuneScape IP
              </p>
            </div>

            {/* Role Info */}
            <div className="flex flex-wrap gap-4 text-[14px] md:text-[16px] text-[#6b6b6b]">
              <span className="bg-[#f2f2f2] px-3 py-1.5 rounded-lg">Senior UI/UX Designer → Lead Product Designer</span>
              <span className="bg-[#f2f2f2] px-3 py-1.5 rounded-lg">Dec 2019 – Apr 2022</span>
            </div>

            {/* Summary */}
            <p className="text-[18px] leading-[1.7] text-[#292929]">
              Embedded as Lead Product Designer within Jagex's publishing platform team — working across the games launcher and player-facing products for one of the longest-running MMORPGs in history.
            </p>
          </div>
        </section>

        {/* The Context */}
        <section className="px-4 md:px-12 lg:px-24 py-12 md:py-16 max-w-[1200px] mx-auto">
          <div className="prose prose-lg max-w-none">
            <h2 className="font-bebas text-[36px] md:text-[48px] lg:text-[56px] leading-[0.9] tracking-[-1px] md:tracking-[-2px] text-black mb-6">
              The Context
            </h2>

            <h3 className="text-[24px] font-semibold text-black mb-4">
              A 25-year-old IP with 300 million registered players
            </h3>

            <p className="text-[18px] leading-[1.7] text-[#292929] mb-6">
              RuneScape is not a young product. It has been running continuously since 2001, accumulated over 300 million registered accounts, and carries an enormous amount of history, expectation, and community identity. Designing for it isn't just a UX challenge — it's a question of how you introduce change to a player base that has a deep, sometimes fierce attachment to the way things are.
            </p>

            <p className="text-[18px] leading-[1.7] text-[#292929] mb-6">
              My work sat within the publishing platform team, responsible for the infrastructure that connects players to the games: the launcher, authentication, account management, and player-facing utility products. The games themselves were out of scope — but everything around them was ours to improve.
            </p>
          </div>
        </section>

        {/* The Work */}
        <section className="px-4 md:px-12 lg:px-24 py-12 md:py-16 max-w-[1200px] mx-auto">
          <div className="prose prose-lg max-w-none">
            <h2 className="font-bebas text-[36px] md:text-[48px] lg:text-[56px] leading-[0.9] tracking-[-1px] md:tracking-[-2px] text-black mb-6">
              The Work
            </h2>

            <h3 className="text-[24px] font-semibold text-black mb-4">
              The games launcher
            </h3>

            <p className="text-[18px] leading-[1.7] text-[#292929] mb-6">
              The primary focus was redesigning and building out the Jagex games launcher — the product players interact with before they ever enter a game. For many, it's the first thing they open and the last thing they close.
            </p>

            <p className="text-[18px] leading-[1.7] text-[#292929] mb-6">
              The launcher needed to serve two distinct games with different audiences: RuneScape, the continuously updated modern client with a broad international player base, and Old School RuneScape, a deliberately preserved 2007-era version with an intensely passionate and opinionated community. The design had to respect the identity of both without forcing a false unity between them.
            </p>

            {/* Image */}
            <div className="rounded-2xl overflow-hidden my-10 flex justify-center bg-[#f2f2f2] p-8 md:p-12">
              <img
                src={imgSlide53}
                alt="The RuneScape games launcher: dark sidebar with RuneScape and OSRS icons, hero image, Install CTA, news article feed"
                className="max-w-full h-auto"
              />
            </div>

            <p className="text-[18px] leading-[1.7] text-[#292929] mb-4">
              The launcher gave players access to:
            </p>

            <ul className="text-[18px] leading-[1.7] text-[#292929] mb-6 list-disc pl-6">
              <li>Game installation and launching</li>
              <li>News and update feeds per game</li>
              <li>Shop and website quick links</li>
              <li>Account and settings management</li>
            </ul>

            <p className="text-[18px] leading-[1.7] text-[#292929] mb-6">
              Keeping the experience lightweight and out of the way was a deliberate principle. Players aren't there to use the launcher — they're there to get into the game. The design's job was to serve that goal and stay out of the way.
            </p>

            <h3 className="text-[24px] font-semibold text-black mt-12 mb-4">
              Authentication
            </h3>

            <p className="text-[18px] leading-[1.7] text-[#292929] mb-6">
              The login flow was another area of focused work — annotated for precise spacing, accessible across a wide range of screen sizes, and designed to handle the edge cases that come with a legacy account system (players who registered years ago, multiple account types, various authentication states).
            </p>

            {/* Image */}
            <div className="rounded-2xl overflow-hidden my-10 flex justify-center bg-[#f2f2f2] p-8 md:p-12">
              <img
                src={imgSlide52}
                alt="Login screen with spacing annotation overlay (XXXL breakpoint): New here? Create an account, Username, Password, Login, Problems logging in?"
                className="max-w-full h-auto"
              />
            </div>

            <p className="text-[18px] leading-[1.7] text-[#292929] mb-6">
              Getting the fundamentals right mattered here. With hundreds of thousands of daily logins, even minor friction in the authentication flow has measurable impact.
            </p>
          </div>
        </section>

        {/* How I Worked */}
        <section className="px-4 md:px-12 lg:px-24 py-12 md:py-16 max-w-[1200px] mx-auto">
          <div className="prose prose-lg max-w-none">
            <h2 className="font-bebas text-[36px] md:text-[48px] lg:text-[56px] leading-[0.9] tracking-[-1px] md:tracking-[-2px] text-black mb-6">
              How I Worked
            </h2>

            <p className="text-[18px] leading-[1.7] text-[#292929] mb-6">
              Across both my senior and lead designer roles at Jagex, I was embedded directly within cross-functional Agile teams — working closely with engineering and product on shared sprint cycles rather than handing work over a wall.
            </p>

            <p className="text-[18px] leading-[1.7] text-[#292929] mb-6">
              At the lead level, I moved between high-level strategy and hands-on execution: contributing to product roadmaps, shaping design process within the team, and staying actively involved in detailed design decisions. Research and discovery fed into the work throughout — conducting user interviews and product discovery sessions with product owners to define the right direction before committing to solutions.
            </p>
          </div>
        </section>

        <Footer />
      </div>
  );
}
