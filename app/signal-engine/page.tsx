"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import SiteHeader from "../components/SiteHeader";
import Footer from "../components/Footer";

const imgActivityIcon = "/assets/activity-icon.svg";

export default function SignalEngine() {
  return (
    <div className="max-w-[1920px] mx-auto">
      <SiteHeader showColorBar={true} showBreadcrumb={false} variant="default" />

      {/* Coming Soon Section */}
      <section className="min-h-[70vh] flex flex-col items-center justify-center px-4 md:px-12 lg:px-24 py-16 md:py-24">
        <div className="flex flex-col items-center gap-8 md:gap-12 max-w-[800px] text-center">
          {/* Icon */}
          <div className="bg-white rounded-2xl p-6 md:p-8">
            <Image src={imgActivityIcon} alt="Signal Engine" width={64} height={64} className="w-12 h-12 md:w-16 md:h-16" />
          </div>

          {/* Heading */}
          <h1 className="font-bebas text-[56px] sm:text-[72px] md:text-[96px] lg:text-[120px] leading-[0.9] tracking-[-2px] md:tracking-[-3px] text-black">
            Signal Engine™
          </h1>

          {/* Subheading */}
          <p className="text-[20px] md:text-[28px] lg:text-[32px] leading-[1.5] text-[#292929] max-w-[90%] md:max-w-[700px]">
            Coming soon. A systematic approach to installing certainty into product decisions.
          </p>

          {/* Description */}
          <p className="text-[16px] md:text-[18px] leading-[1.7] text-[#6b6b6b] max-w-[90%] md:max-w-[600px]">
            The Signal Engine™ is our proprietary framework for turning user research into confident product decisions — without slowing teams down.
          </p>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <Link
              href="/"
              className="bg-gradient-to-b from-[#242424] to-[#131313] text-white rounded-xl px-6 py-3 hover:from-[#2f2f2f] hover:to-[#1a1a1a] transition-all text-[16px] md:text-[18px]"
            >
              Back to Home
            </Link>
            <a
              href="mailto:hello@willard.co.uk"
              className="bg-white border-2 border-black text-black rounded-xl px-6 py-3 hover:bg-black hover:text-white transition-all text-[16px] md:text-[18px]"
            >
              Get Notified
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
