"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import SiteHeader from "./components/SiteHeader";
import Footer from "./components/Footer";

// Asset URLs from Figma
const imgProfileRobert = "/assets/profile-robert.png";
const imgJagexCaseStudy = "/assets/jagex-case-study.png";
const imgStudyStreamMockup = "/assets/studystream-mockup.png";
const imgGeminiBackground = "/assets/gemini-background.png";
const imgJagexBackgroundBlur = "/assets/jagex-background-blur.png";
const imgJagexBackgroundDark = "/assets/jagex-background-dark.png";
const imgYCLogo = "/assets/yc-logo-proper.png";
const imgStudyStreamLogo = "/assets/studystream-logo.svg";
const imgActivityIcon = "/assets/activity-icon.svg";
const imgJagexLogo = "/assets/jagex-logo.svg";
const imgArrowNav = "/assets/arrow-nav.svg";
const imgLogo = "/assets/logo.svg";
const imgStudyStreamLogoGrayscale = "/assets/studystream-logo-grayscale.svg";
const imgNSPCCLogo = "/assets/nspcc-logo.svg";
const imgJagexLogoLandscape = "/assets/jagex-logo-landscape.svg";
const imgYCLogoSquare = "/assets/yc-logo-square.svg";

export default function Home() {
  return (
    <div className="max-w-[1920px] mx-auto">
        <SiteHeader showColorBar={true} showBreadcrumb={true} variant="default" />

        {/* Hero Section */}
        <section className="px-4 md:px-8 lg:px-12 py-12 md:py-16 lg:py-40 flex flex-col items-center gap-6 md:gap-8 lg:gap-10 max-w-[1799px] mx-auto">
          <h2 className="font-bebas text-[48px] sm:text-[72px] md:text-[96px] lg:text-[128.8px] leading-[0.9] md:leading-[0.85] tracking-[-2px] md:tracking-[-3px] lg:tracking-[-5.184px] text-black text-center max-w-full px-4">
            14 years. 300 million users. A few YC companies along the way.
          </h2>
          <p className="font-300 text-[18px] md:text-[24px] lg:text-[28px] text-[#202020] text-center leading-[1.5] md:leading-[1.591] max-w-[90%] md:max-w-[80%]">
            I'm Tayler Hughes — a product design consultant who helps startups shape ideas into products people actually want to use.
          </p>

          {/* Service Categories */}
          <div className="flex gap-4 md:gap-6 lg:gap-8 items-center flex-wrap justify-center">
            <div className="flex gap-3 md:gap-4 items-center">
              <Image src={imgActivityIcon} alt="" width={20} height={20} className="md:w-[24px] md:h-[24px]" />
              <p className="font-medium text-[14px] md:text-[16px] lg:text-[18px] text-[#202020]">Product Management</p>
            </div>
            <div className="flex gap-3 md:gap-4 items-center">
              <svg id="user" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M8.43255 3H16.8673C19.8154 3 21.6504 5.08119 21.6504 8.02638V15.9736C21.6504 18.9188 19.8154 21 16.8663 21H8.43255C5.48444 21 3.65039 18.9188 3.65039 15.9736V8.02638C3.65039 5.08119 5.4932 3 8.43255 3Z" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
<path opacity="0.4" d="M7.48926 20.9202V20.0153C7.48926 18.3321 8.82223 16.2305 12.646 16.2305C16.4795 16.2305 17.8125 18.3126 17.8125 19.9959V20.9202" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
<path opacity="0.4" fill-rule="evenodd" clip-rule="evenodd" d="M15.9454 10.5259C15.9454 12.3464 14.4704 13.8214 12.6499 13.8214C10.8295 13.8214 9.35352 12.3464 9.35352 10.5259C9.35352 8.7055 10.8295 7.23047 12.6499 7.23047C14.4704 7.23047 15.9454 8.7055 15.9454 10.5259Z" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
</svg>
              <p className="font-medium text-[14px] md:text-[16px] lg:text-[18px] text-[#202020]">User Experience</p>
            </div>
            <div className="flex gap-3 md:gap-4 items-center">
<svg id="Target" width="24" height="25" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path opacity="0.4" d="M20.989 9.98114C21.19 10.7221 21.296 11.5011 21.296 12.3091C21.296 17.2251 17.314 21.2072 12.399 21.2072C7.48299 21.2072 3.5 17.2251 3.5 12.3091C3.5 7.40314 7.48299 3.41016 12.399 3.41016C13.139 3.41016 13.86 3.50714 14.553 3.67114" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
<path d="M12.4081 7.5H12.3991C9.73311 7.5 7.57812 9.65502 7.57812 12.309C7.57812 14.974 9.73311 17.128 12.3991 17.128C14.9671 17.128 17.0831 15.108 17.1981 12.559" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
<path d="M21.5003 5.58136H19.2793V3.35938" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
<path d="M13.709 11.1541L19.281 5.58203" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
</svg>
              <p className="font-medium text-[14px] md:text-[16px] lg:text-[18px] text-[#202020]">Product Strategy</p>
            </div>
            <div className="flex gap-3 md:gap-4 items-center">
<svg id="UI" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M8.03857 8.40002C8.45264 8.40002 8.78857 8.73602 8.78857 9.15002V12.7C8.78857 13.528 9.46045 14.2 10.2886 14.2C11.1167 14.2 11.7886 13.528 11.7886 12.7V9.15002C11.7886 8.73602 12.1245 8.40002 12.5386 8.40002C12.9526 8.40002 13.2886 8.73602 13.2886 9.15002V12.7C13.2886 14.357 11.9458 15.7 10.2886 15.7C8.63135 15.7 7.28857 14.357 7.28857 12.7V9.15002C7.28857 8.73602 7.62451 8.40002 8.03857 8.40002Z" fill="#000000"></path>
<path d="M16.0386 8.40002C16.4526 8.40002 16.7886 8.73602 16.7886 9.15002V14.75C16.7886 15.164 16.4526 15.5 16.0386 15.5C15.6245 15.5 15.2886 15.164 15.2886 14.75V9.15002C15.2886 8.73602 15.6245 8.40002 16.0386 8.40002Z" fill="#000000"></path>
<path fill-rule="evenodd" clip-rule="evenodd" d="M3.77881 3.64697C4.76367 2.59094 6.16553 2 7.8208 2H16.2554C17.9146 2 19.3174 2.591 20.3018 3.64801C21.2798 4.698 21.7886 6.14899 21.7886 7.776V15.724C21.7886 17.351 21.2798 18.802 20.3018 19.852C19.3174 20.909 17.9146 21.5 16.2544 21.5H7.8208C6.16064 21.5 4.75879 20.909 3.77441 19.852C2.79639 18.801 2.28857 17.351 2.28857 15.724V7.776C2.28857 6.14801 2.7998 4.698 3.77881 3.64697ZM4.87549 4.66998C4.19873 5.39697 3.78857 6.46002 3.78857 7.776V15.724C3.78857 17.042 4.19678 18.104 4.87256 18.83C5.54248 19.55 6.53174 20 7.8208 20H16.2544C17.5435 20 18.5327 19.55 19.2036 18.83C19.8794 18.104 20.2886 17.041 20.2886 15.724V7.776C20.2886 6.45898 19.8794 5.396 19.2036 4.66998C18.5337 3.95001 17.5444 3.5 16.2554 3.5H7.8208C6.53662 3.5 5.54736 3.94897 4.87549 4.66998Z" fill="#000000"></path>
</svg>

              <p className="font-medium text-[14px] md:text-[16px] lg:text-[18px] text-[#202020]">Visual Design</p>
            </div>
          </div>
        </section>

        {/* Willard Installs Certainty Section */}
        <section className="px-4 md:px-8 lg:px-12 py-8 md:py-12 lg:py-14 flex flex-col items-center gap-8 md:gap-12 lg:gap-14 max-w-[1811px] mx-auto">
          <p className="font-bebas text-[32px] md:text-[48px] lg:text-[60px] leading-[0.9] md:leading-[0.85] tracking-[-0.4px] md:tracking-[-0.6px] text-[#292929] text-center max-w-full md:max-w-[700px] lg:max-w-[793px] px-4">
            Willard installs certainty into funded startups using our signal engine™
          </p>

          {/* Company Logos */}
          <div className="hidden md:flex gap-[60px] lg:gap-[92px] items-center justify-center opacity-30 flex-wrap">
            <Image
              src={imgStudyStreamLogoGrayscale}
              alt="StudyStream"
              width={184}
              height={40}
              className="object-contain h-[32px] lg:h-[40px] w-auto"
            />
            <Image
              src={imgNSPCCLogo}
              alt="NSPCC"
              width={167}
              height={40}
              className="object-contain h-[32px] lg:h-[40px] w-auto"
            />
            <Image
              src={imgJagexLogoLandscape}
              alt="Jagex"
              width={137}
              height={40}
              className="object-contain h-[32px] lg:h-[40px] w-auto"
            />
            <Image
              src={imgYCLogoSquare}
              alt="YCombinator"
              width={48}
              height={48}
              className="object-contain h-[38px] lg:h-[48px] w-auto"
            />
          </div>

          {/* Areas of Work Image */}
          <div className="w-full rounded-2xl md:rounded-3xl overflow-hidden">
            <Image
              src="/assets/AreasOfWork.jpg"
              alt="Areas of Work"
              width={1811}
              height={636}
              className="w-full h-auto object-cover"
            />
          </div>
        </section>

        {/* Testimonial Section */}
        <section className="bg-white rounded-2xl md:rounded-3xl p-6 md:p-12 lg:p-32 my-6 md:my-8 mx-4 md:mx-6 flex flex-col items-center gap-6 md:gap-8 max-w-[1811px]">
          <p className="text-[18px] md:text-[28px] lg:text-[36px] leading-[1.5] md:leading-[1.49] tracking-[-0.24px] md:tracking-[-0.36px] text-[#292929] text-center max-w-[95%] md:max-w-[90%] lg:max-w-[1409px]">
            "Willard quickly demonstrated strong product design knowledge and a genuine commitment to understanding our users and problem space. Even in a short engagement, they integrated seamlessly into our team and contributed thoughtful, high-quality design work. They approached the work with care, curiosity, and professionalism."
          </p>
          <div className="flex flex-col items-center gap-3 md:gap-3.5">
            <div className="relative w-[80px] h-[80px] md:w-[100px] md:h-[100px] rounded-full overflow-hidden">
              <Image
                src={imgProfileRobert}
                alt="Robert Ross"
                fill
                sizes="(min-width: 768px) 100px, 80px"
                className="object-cover"
              />
            </div>
            <div className="text-center">
              <p className="font-semibold text-[16px] md:text-[18px] text-[#202020]">Robert Ross</p>
              <p className="font-medium text-[16px] md:text-[18px] text-[#8e8e8e]">Angel & LP Investor</p>
            </div>
          </div>
        </section>

        {/* Jagex Case Study */}
        <Link href="/jagex" className="block my-6 md:my-8 mx-4 md:mx-6 max-w-[1759px]">
        <section className="bg-[#f2f2f2] rounded-2xl md:rounded-3xl overflow-hidden min-h-[400px] md:min-h-[600px] lg:h-[1047px] relative cursor-pointer hover:opacity-90 transition-opacity">
          {/* Dark Background Layer */}
          <div className="absolute -translate-x-1/2 bottom-[-290px] left-1/2 top-0 aspect-[2752/1536]">
            <div className="absolute inset-0 pointer-events-none">
              <Image
                src={imgJagexBackgroundDark}
                alt=""
                fill
                className="object-cover"
              />
              <div className="absolute bg-[#03060f] inset-0" />
            </div>
          </div>

          {/* Blurred Background */}
          <div className="absolute blur-[74px] h-[1080px] left-0 top-[-16.82px] w-full">
            <Image
              src={imgJagexBackgroundBlur}
              alt=""
              fill
              className="object-cover pointer-events-none"
            />
          </div>

          {/* Header */}
          <div className="relative z-10 flex items-center justify-between p-6 md:p-8 lg:px-8 lg:pt-6">
            <div className="flex gap-3 md:gap-4 items-center">
              <div className="bg-white p-2 rounded-lg w-10 h-10 flex items-center justify-center">
                <Image src={imgJagexLogo} alt="Jagex" width={24} height={24} />
              </div>
              <p className="font-poppins font-medium text-[18px] md:text-[21px] tracking-[-0.42px] text-white leading-[1.795] whitespace-nowrap">
                Jagex (RuneScape IP)
              </p>
            </div>
            <div className="flex gap-3 items-center">
                <button className="bg-white/[0.03] p-2 rounded-[99px] w-10 h-10 flex items-center justify-center">
                  <div className="w-6 h-6 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="white" className="size-5">
  <path fillRule="evenodd" d="M11.78 5.22a.75.75 0 0 1 0 1.06L8.06 10l3.72 3.72a.75.75 0 1 1-1.06 1.06l-4.25-4.25a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0Z" clipRule="evenodd" />
</svg>

                  </div>
                </button>
                <button className="bg-white/[0.03] p-2 rounded-[99px] w-10 h-10 flex items-center justify-center">
                  <div className="w-6 h-6 flex items-center justify-center ">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="white" className="size-5">
  <path fillRule="evenodd" d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
</svg>

                  </div>
                </button>
            </div>
          </div>

          {/* Case Study Image */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] md:w-[85%] lg:w-[1339px] h-[60%] md:h-[70%] lg:h-[754px] rounded-2xl md:rounded-3xl overflow-hidden">
            <Image
              src={imgJagexCaseStudy}
              alt="Jagex Case Study"
              fill
              className="object-cover"
            />
          </div>
        </section>
        </Link>

        {/* StudyStream Case Study */}
        <Link href="/studystream" className="block my-6 md:my-8 mx-4 md:mx-6 max-w-[1759px]">
          <section className="bg-[#f2f2f2] rounded-2xl md:rounded-3xl overflow-hidden relative cursor-pointer hover:bg-[#ebebeb] transition-colors flex flex-col gap-8">
            {/* Header */}
            <div className="relative z-10 flex items-center justify-between p-8">
              <div className="flex gap-4 items-center">
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
              <div className="flex gap-3 items-center">
                <button className="bg-black/[0.03] p-2 rounded-[99px] w-10 h-10 flex items-center justify-center">
                  <div className="w-6 h-6 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5">
  <path fillRule="evenodd" d="M11.78 5.22a.75.75 0 0 1 0 1.06L8.06 10l3.72 3.72a.75.75 0 1 1-1.06 1.06l-4.25-4.25a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0Z" clipRule="evenodd" />
</svg>

                  </div>
                </button>
                <button className="bg-black/[0.03] p-2 rounded-[99px] w-10 h-10 flex items-center justify-center">
                  <div className="w-6 h-6 flex items-center justify-center ">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5">
  <path fillRule="evenodd" d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
</svg>

                  </div>
                </button>
              </div>
            </div>

            {/* StudyStream Mockup */}
            <div className="w-[80%] md:w-[75%] lg:w-[80%] h-auto mx-auto">
              <Image
                src={imgStudyStreamMockup}
                alt="StudyStream Case Study"
                width={1280}
                height={800}
                className="object-contain mx-auto"
              />
            </div>
          </section>
        </Link>

        <Footer />
      </div>
  );
}
