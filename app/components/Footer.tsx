"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

const imgLogo = "/assets/logo.svg";

export default function Footer() {
  return (
    <footer className="my-6 md:my-8 mx-2 md:mx-3 relative">
      <div className="bg-white rounded-2xl md:rounded-3xl my-2 md:my-3 mx-2 md:mx-3 flex flex-col items-center px-4 py-8 md:py-12 lg:py-16">
        {/* Newsletter Form */}
        <div className="w-full max-w-[90%] md:max-w-[500px] lg:max-w-[550px] mb-8 md:mb-12">
          <p className="text-[12px] md:text-[14px] tracking-[-0.32px] text-black mb-3 md:mb-4">
            Join the newsletter
          </p>
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
            <input
              type="email"
              placeholder="Email*"
              className="flex-1 bg-[#f1efed] rounded-xl md:rounded-2xl px-4 md:px-6 py-4 md:py-5 text-[13px] md:text-[14px] text-[#707070]"
            />
            <button className="bg-gradient-to-b from-[#242424] to-[#131313] text-white rounded-xl md:rounded-2xl px-4 md:px-6 py-4 md:py-5 text-[13px] md:text-[14px] whitespace-nowrap">
              Subscribe
            </button>
          </div>
        </div>

        {/* Logo */}
        <div className="flex justify-center">
          <Image
            src={imgLogo}
            alt="Tayler Hughes"
            width={120}
            height={40}
            className="object-contain w-[60px] md:w-[70px] lg:w-[80px] h-auto"
          />
        </div>
      </div>

      {/* Footer Links */}
      <div className="flex flex-col md:flex-row gap-4 md:gap-8 justify-between items-center px-4 md:px-8 lg:px-12 py-4">
        <p className="text-[11px] md:text-[12px] tracking-[-0.32px] text-[#6b6b6b] order-2 md:order-1">
          © 2026 Tayler Hughes
        </p>
        <div className="flex flex-wrap gap-4 md:gap-8 text-[11px] md:text-[12px] tracking-[-0.32px] text-[#6b6b6b] order-1 md:order-2 justify-center">
          <a href="#" className="hover:opacity-70 transition-opacity">Privacy Policy</a>
          <a href="#" className="hover:opacity-70 transition-opacity">Careers</a>
          <a href="#" className="hover:opacity-70 transition-opacity">Changelog</a>
          <a href="#" className="hover:opacity-70 transition-opacity">Instructions</a>
        </div>
      </div>
    </footer>
  );
}
