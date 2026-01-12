"use client";

import React from "react";

export default function Introduction() {
  return (
    <div className="w-full flex items-center justify-center px-4 md:px-16 lg:px-32">
      <div className="max-w-[1200px] text-white space-y-8">
        <p className="font-figtree font-semibold text-[24px] md:text-[34px] leading-[1.4] md:leading-[1.591]">
          Consider Willard the design department you didn’t think you could afford. We provide end-to-end product design and strategy for software teams that value precision and craftsmanship.
        </p>
        <p className="font-figtree font-normal text-[20px] md:text-[28px] leading-[1.4] md:leading-[1.5]">
          We don’t work for you; we work with you, embedding ourselves into your workflow to solve your most difficult interface challenges and streamline your developer handoff.
        </p>
      </div>
    </div>
  );
}
