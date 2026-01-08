"use client";

import React from "react";
import GridPattern from "./GridPattern";

const imgGeminiGeneratedImageGtr7Digtr7Digtr71 = "/assets/character-card.png";
const imgJagex1 = "/assets/jagex-logo.svg";
const imgArrowLeft2 = "/assets/arrow-left.svg";

export default function Jagex() {
  return (
    <div className="w-full flex flex-col items-center lg:items-end px-4 md:px-8 lg:px-[132px] pr-4 lg:pr-32">
      {/* Card Component */}
      <div className="relative bg-[#f2f2f2] w-full max-w-[646px] h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden rounded-tr-[24px] shadow-2xl z-20">
        <div className="absolute inset-0 w-full h-full bg-black">
          <img
            alt=""
            className="absolute inset-0 w-full h-full object-cover opacity-80"
            src={imgGeminiGeneratedImageGtr7Digtr7Digtr71}
          />
        </div>

        {/* Grid Pattern Inside Card */}
        <div className="absolute bottom-0 left-0 w-[300px] md:w-[602px] h-[300px] md:h-[565px] opacity-100 z-10 pointer-events-none">
          <GridPattern className="w-full h-full mt-24" opacity={1} alignX="left" alignY="bottom" />
        </div>

        {/* Card Header */}
        <div className="absolute left-6 top-6 md:left-[32px] md:top-[24px] right-6 flex items-center justify-between z-20">
          <div className="flex gap-4 items-center">
            <div className="bg-white p-2 rounded-[8px]">
              <div className="relative size-[24px]">
                <img alt="" className="block w-full h-full" src={imgJagex1} />
              </div>
            </div>
            <p className="font-poppins font-medium text-[21px] text-white tracking-[-0.42px]">
              Jagex
            </p>
          </div>

          <div className="flex gap-3">
            <button className="bg-[rgba(241,241,241,0.15)] p-2 rounded-full hover:bg-white/30 transition-colors">
              <img alt="" className="w-6 h-6 rotate-90" src={imgArrowLeft2} />
            </button>
            <button className="bg-[rgba(241,241,241,0.15)] p-2 rounded-full hover:bg-white/30 transition-colors">
              <img alt="" className="w-6 h-6 -rotate-90" src={imgArrowLeft2} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
