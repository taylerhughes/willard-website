"use client";

import { InlineWidget } from "react-calendly";
import { useState, useEffect } from "react";

export default function BookTayler() {
  // Image assets from Figma
  const imgGeminiGeneratedImage = "https://www.figma.com/api/mcp/asset/0c14bd41-caac-44f6-986f-4330fae5a591";
  const imgEllipse7 = "https://www.figma.com/api/mcp/asset/96d5db98-e3c3-4a0b-8e1b-afa784b0ed2f";
  const imgFrame674 = "https://www.figma.com/api/mcp/asset/489cd514-ebd7-476d-bb8f-99c89f90e4dd";
  const imgArrowLeft2 = "https://www.figma.com/api/mcp/asset/e318257b-50ca-49a0-8ae5-712a857e2244";
  const imgTimeCircle = "https://www.figma.com/api/mcp/asset/5db4caf2-809c-4e5b-a1fd-b4a9d407c7c2";
  const imgVideo = "https://www.figma.com/api/mcp/asset/2ac248fe-a867-4c23-83e9-3a70051be4c9";
  const imgVector = "https://www.figma.com/api/mcp/asset/b8984aa2-c20c-408d-9fe3-a3068cf4ca25";

  // Additional background images - you can replace these URLs with different images
  const imgBackground2 = "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1920&h=1080&fit=crop";
  const imgBackground3 = "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1920&h=1080&fit=crop";

  // Testimonials data
  const testimonials = [
    {
      quote: "Aside from being a talented designer, Tayler is responsive, honest in his hours and fair in his pricing.",
      subtext: "Everything we could ever ask for in a contract designer. Highly recommend!",
      author: "Tayler Hughes",
      role: "Owner & Founder",
      image: imgGeminiGeneratedImage,
    },
    {
      quote: "Working with Tayler transformed our entire design process. His attention to detail is unmatched.",
      subtext: "The best investment we've made in our product development journey.",
      author: "Sarah Chen",
      role: "Product Manager",
      image: imgBackground2,
    },
    {
      quote: "Tayler's expertise in user research helped us identify critical pain points we had missed.",
      subtext: "Our user engagement increased by 40% after implementing his recommendations.",
      author: "Marcus Johnson",
      role: "CEO",
      image: imgBackground3,
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Auto-rotate every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      handleNext();
    }, 5000);

    return () => clearInterval(interval);
  }, [currentSlide]);

  const handleNext = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev + 1) % testimonials.length);
    setTimeout(() => setIsTransitioning(false), 500);
  };

  const handlePrev = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    setTimeout(() => setIsTransitioning(false), 500);
  };

  const currentTestimonial = testimonials[currentSlide];

  return (
    <div className="bg-white relative min-h-screen w-full overflow-x-hidden">
      {/* Mobile & Tablet: Stack vertically */}
      <div className="flex flex-col lg:flex-row lg:h-screen">

        {/* Left Panel - Booking Section */}
        <div className="relative w-full lg:w-[calc(100%-741px)] min-h-screen lg:h-screen p-6 md:p-12 lg:p-0 flex flex-col lg:flex-row">
          {/* Left Side - Content */}
          <div className="flex-1 lg:flex-none lg:w-auto flex flex-col">
            {/* Logo */}
            <div className="w-[49px] h-[49px] mb-8 lg:absolute lg:left-[79px] lg:top-[79px] lg:mb-0">
              <img alt="Willard Logo" className="block max-w-none size-full" src={imgVector} />
            </div>

            {/* Content Container */}
            <div className="flex-1 flex flex-col lg:absolute lg:left-[79px] lg:top-[177px] lg:w-auto lg:max-w-[500px]">
              {/* Heading Section */}
              <div className="flex flex-col gap-4 mb-6 lg:mb-0">
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <p className="font-bebas leading-[0.85] text-[48px] md:text-[68px] text-black tracking-[-0.68px]">
                    Book a call with
                  </p>
                  {/* Name Badge - Mobile/Tablet inline */}
                  <div className="bg-[#f7f7f7] flex gap-[8px] items-center p-[12px] md:p-[16px] rounded-[8px] w-fit">
                    <div className="relative size-[36px] md:size-[48px]">
                      <img alt="Tayler avatar" className="block max-w-none size-full" src={imgEllipse7} />
                    </div>
                    <p className="font-bebas leading-[0.85] text-[48px] md:text-[68px] text-black tracking-[-0.68px]">
                      Tayler
                    </p>
                  </div>
                </div>

                <p className="font-figtree font-normal leading-[1.8] text-[16px] md:text-[18px] text-black max-w-[600px]">
                  We led user research for Jagex that uncovered fundamental player confusion across their product.
                </p>

                {/* Time & Platform Badges */}
                <div className="flex gap-[16px] items-start flex-wrap">
                  <div className="bg-[#f7f7f7] flex gap-[8px] items-center pl-[8px] pr-[16px] py-[8px] rounded-[8px]">
                    <div className="overflow-clip relative size-[24px]">
                      <img alt="Time" className="block max-w-none size-full" src={imgTimeCircle} />
                    </div>
                    <p className="font-figtree font-bold leading-[0.85] text-[13px] text-black tracking-[-0.13px] uppercase">
                      30 mins
                    </p>
                  </div>
                  <div className="bg-[#f7f7f7] flex gap-[8px] items-center pl-[8px] pr-[16px] py-[8px] rounded-[8px]">
                    <div className="overflow-clip relative size-[24px]">
                      <img alt="Video" className="block max-w-none size-full" src={imgVideo} />
                    </div>
                    <p className="font-figtree font-bold leading-[0.85] text-[13px] text-black tracking-[-0.13px] uppercase">
                      Zoom
                    </p>
                  </div>
                </div>
              </div>

              {/* Calendly Widget - Mobile/Tablet */}
              <div className="mt-8 lg:hidden w-full max-w-[500px] h-[500px] overflow-hidden">
                <InlineWidget
                  url="https://calendly.com/tayler-willard/willard-free-plan-intro-call"
                  styles={{
                    height: "700px",
                    width: "100%",
                  }}
                  pageSettings={{
                    hideEventTypeDetails: true,
                    hideLandingPageDetails: true,
                    hideGdprBanner: true,
                  }}
                />
              </div>
            </div>

            {/* Footer - Desktop Only */}
            <div className="hidden lg:flex absolute gap-[112px] items-center leading-[1.091] left-[79px] bottom-[20px]">
              <p className="font-figtree font-medium text-[16px] text-black text-right">
                Prepared by Tayler Hughes January 1st, 2026
              </p>
              <p className="font-bebas text-[#404040] text-[28px] text-center uppercase">
                Willard
              </p>
            </div>
          </div>

          {/* Right Side - Calendly Widget (Desktop Only) */}
          <div className="hidden lg:block lg:absolute lg:right-0 lg:top-0 lg:bottom-0 lg:w-[450px] overflow-hidden">
            <InlineWidget
              url="https://calendly.com/tayler-willard/willard-free-plan-intro-call"
              styles={{
                height: "100%",
                width: "100%",
              }}
              pageSettings={{
                hideEventTypeDetails: true,
                hideLandingPageDetails: true,
                hideGdprBanner: true,
              }}
            />
          </div>
        </div>

        {/* Right Panel - Testimonial Section */}
        <div className="relative w-full lg:w-[741px] min-h-[600px] lg:h-screen bg-[#f2f2f2] overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0 w-full h-full">
            <img
              alt=""
              className={`absolute inset-0 w-full h-full object-cover pointer-events-none transition-opacity duration-500 ${
                isTransitioning ? "opacity-70" : "opacity-100"
              }`}
              src={currentTestimonial.image}
            />
          </div>

          {/* Gradient Overlay */}
          <div className="absolute bg-gradient-to-b bottom-0 from-[rgba(0,0,0,0)] via-[rgba(0,0,0,0.5)] h-full lg:h-[664px] inset-x-0 to-black" />

          {/* Testimonial Content */}
          <div className="absolute bottom-8 left-6 right-6 md:left-[47px] md:right-[47px] md:bottom-12 lg:bottom-[80px] flex flex-col gap-[24px] md:gap-[40px]">
            {/* Quote */}
            <div
              className={`flex flex-col gap-[16px] transition-all duration-500 ${
                isTransitioning ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"
              }`}
            >
              <p className="font-figtree font-normal leading-[1.291] text-[24px] md:text-[32px] lg:text-[38px] text-white">
                {currentTestimonial.quote}
              </p>
              <p className="font-figtree font-normal leading-[1.491] text-[#9f9f9f] text-[18px] md:text-[20px] lg:text-[22px]">
                {currentTestimonial.subtext}
              </p>
              <div className="h-[14.974px] w-[110.19px]">
                <img alt="5 stars" className="block max-w-none size-full" src={imgFrame674} />
              </div>
            </div>

            {/* Author Info & Navigation */}
            <div className="flex flex-col md:flex-row gap-[24px] md:gap-[60px] lg:gap-[100px] items-start md:items-center">
              <div
                className={`flex flex-1 gap-[12px] md:gap-[16px] items-center transition-all duration-500 ${
                  isTransitioning ? "opacity-0 translate-x-4" : "opacity-100 translate-x-0"
                }`}
              >
                <div className="bg-white rounded-[99px] shrink-0 size-[32px] md:size-[40px]" />
                <div className="flex flex-col md:flex-row md:gap-2 md:items-center flex-1">
                  <p className="font-figtree font-medium leading-[1.795] text-[18px] md:text-[21px] text-white tracking-[-0.42px]">
                    {currentTestimonial.author}
                  </p>
                  <p className="font-figtree font-medium leading-[1.795] text-[#606060] text-[16px] md:text-[21px] tracking-[-0.42px]">
                    {currentTestimonial.role}
                  </p>
                </div>
              </div>

              {/* Navigation Arrows */}
              <div className="flex gap-[12px] items-center">
                <button
                  onClick={handlePrev}
                  className="bg-[rgba(241,241,241,0.15)] hover:bg-[rgba(241,241,241,0.25)] transition-colors flex items-center p-[8px] rounded-[99px]"
                  aria-label="Previous testimonial"
                >
                  <div className="overflow-clip relative size-[24px]">
                    <svg id="Chevron Left" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M15 19L8 12L15 5" stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
</svg>
                  </div>
                </button>
                <button
                  onClick={handleNext}
                  className="bg-[rgba(241,241,241,0.15)] hover:bg-[rgba(241,241,241,0.25)] transition-colors flex items-center p-[8px] rounded-[99px]"
                  aria-label="Next testimonial"
                >
                  <div className="overflow-clip relative size-[24px]">
<svg id="Chevron Right" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M9 5L16 12L9 19" stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
</svg>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Footer */}
      <div className="lg:hidden flex flex-col md:flex-row gap-4 md:gap-[112px] items-center justify-center p-6 bg-white">
        <p className="font-figtree font-medium text-[14px] md:text-[16px] text-black text-center">
          Prepared by Tayler Hughes January 1st, 2026
        </p>
        <p className="font-bebas text-[#404040] text-[24px] md:text-[28px] text-center uppercase">
          Willard
        </p>
      </div>

      {/* Color Bar at Bottom - Desktop Only */}
      {/* Left Panel Color Bar */}
      <div className="hidden lg:block absolute h-[8px] left-0 bottom-0 w-[calc(100%-741px)]">
        <div className="absolute bg-[#06144b] h-[8px] left-0 top-0 w-[39px]" />
        <div className="absolute bg-[#011f90] h-[8px] left-[39px] top-0 w-[40px]" />
        <div className="absolute bg-[#0028b7] h-[8px] left-[79px] top-0 right-[237px]" />
        <div className="absolute bg-[#0133eb] h-[8px] right-[198px] top-0 w-[39px]" />
        <div className="absolute bg-[#006cfd] h-[8px] right-[158px] top-0 w-[40px]" />
        <div className="absolute bg-[#6cabff] h-[8px] right-[119px] top-0 w-[39px]" />
        <div className="absolute bg-[#c3e0fd] h-[8px] right-[80px] top-0 w-[39px]" />
        <div className="absolute bg-[#ff4e31] h-[8px] right-[40px] top-0 w-[40px]" />
        <div className="absolute bg-[#ff7353] h-[8px] right-[1px] top-0 w-[39px]" />
        <div className="absolute bg-[#ffa075] h-[8px] right-0 top-0 w-[1px]" />
      </div>

      {/* Right Panel Color Bar */}
      <div className="hidden lg:block absolute h-[8px] right-0 bottom-0 w-[741px]">
        <div className="absolute bg-black h-[8px] left-0 top-0 w-[583px]" />
        <div className="absolute bg-[#2a292e] h-[8px] left-[583px] top-0 w-[40px]" />
        <div className="absolute bg-[#959499] h-[8px] left-[623px] top-0 w-[39px]" />
        <div className="absolute bg-[#c1c1c3] h-[8px] left-[662px] top-0 w-[40px]" />
        <div className="absolute bg-[#e2e2e2] h-[8px] left-[702px] top-0 w-[39px]" />
      </div>
    </div>
  );
}
