"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import SiteHeader from "../components/SiteHeader";
import Footer from "../components/Footer";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    message: ""
  });
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("submitting");

    const form = e.currentTarget;
    const formDataObj = new FormData(form);

    try {
      const response = await fetch("https://formspree.io/f/mbdzjorl", {
        method: "POST",
        body: formDataObj,
        headers: {
          Accept: "application/json",
        },
      });

      if (response.ok) {
        setStatus("success");
        setFormData({ name: "", email: "", company: "", message: "" });
      } else {
        setStatus("error");
      }
    } catch (error) {
      setStatus("error");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="max-w-[1920px] mx-auto">
      <SiteHeader showColorBar={true} showBreadcrumb={false} variant="default" />

      {/* Contact Section */}
      <section className="px-4 md:px-12 lg:px-24 py-12 md:py-16 lg:py-24 max-w-[900px] mx-auto">
        <div className="flex flex-col gap-8 md:gap-12">
          {/* Heading */}
          <div className="flex flex-col gap-4">
            <h1 className="font-bebas text-[56px] sm:text-[72px] md:text-[96px] lg:text-[120px] leading-[0.9] tracking-[-2px] md:tracking-[-3px] text-black">
              Let's work together
            </h1>
            <p className="text-[18px] md:text-[22px] lg:text-[24px] leading-[1.5] text-[#6b6b6b] max-w-[700px]">
              Whether you need strategic product thinking, user research infrastructure, or hands-on design — let's talk about how I can help.
            </p>
          </div>

          {/* Success/Error Messages */}
          {status === "success" && (
            <div className="bg-green-50 border-2 border-green-500 rounded-xl p-4 md:p-6">
              <p className="text-[16px] md:text-[18px] text-green-800 font-medium">
                Thanks for reaching out! I'll get back to you soon.
              </p>
            </div>
          )}

          {status === "error" && (
            <div className="bg-red-50 border-2 border-red-500 rounded-xl p-4 md:p-6">
              <p className="text-[16px] md:text-[18px] text-red-800 font-medium">
                Oops! Something went wrong. Please try again or email me directly.
              </p>
            </div>
          )}

          {/* Contact Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {/* Name */}
            <div className="flex flex-col gap-2">
              <label htmlFor="name" className="text-[14px] md:text-[16px] text-[#292929] font-medium">
                Name*
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="bg-[#f1efed] rounded-xl md:rounded-2xl px-4 md:px-6 py-4 md:py-5 text-[14px] md:text-[16px] text-[#292929] border-2 border-transparent focus:border-black focus:outline-none transition-colors"
                placeholder="Your name"
              />
            </div>

            {/* Email */}
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-[14px] md:text-[16px] text-[#292929] font-medium">
                Email*
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="bg-[#f1efed] rounded-xl md:rounded-2xl px-4 md:px-6 py-4 md:py-5 text-[14px] md:text-[16px] text-[#292929] border-2 border-transparent focus:border-black focus:outline-none transition-colors"
                placeholder="your@email.com"
              />
            </div>

            {/* Company */}
            <div className="flex flex-col gap-2">
              <label htmlFor="company" className="text-[14px] md:text-[16px] text-[#292929] font-medium">
                Company
              </label>
              <input
                type="text"
                id="company"
                name="company"
                value={formData.company}
                onChange={handleChange}
                className="bg-[#f1efed] rounded-xl md:rounded-2xl px-4 md:px-6 py-4 md:py-5 text-[14px] md:text-[16px] text-[#292929] border-2 border-transparent focus:border-black focus:outline-none transition-colors"
                placeholder="Your company (optional)"
              />
            </div>

            {/* Message */}
            <div className="flex flex-col gap-2">
              <label htmlFor="message" className="text-[14px] md:text-[16px] text-[#292929] font-medium">
                Message*
              </label>
              <textarea
                id="message"
                name="message"
                required
                value={formData.message}
                onChange={handleChange}
                rows={6}
                className="bg-[#f1efed] rounded-xl md:rounded-2xl px-4 md:px-6 py-4 md:py-5 text-[14px] md:text-[16px] text-[#292929] border-2 border-transparent focus:border-black focus:outline-none transition-colors resize-none"
                placeholder="Tell me about your project..."
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={status === "submitting"}
              className="bg-gradient-to-b from-[#242424] to-[#131313] text-white rounded-xl md:rounded-2xl px-6 py-4 md:py-5 text-[16px] md:text-[18px] hover:from-[#2f2f2f] hover:to-[#1a1a1a] transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status === "submitting" ? "Sending..." : "Send Message"}
            </button>
          </form>

          {/* Alternative Contact */}
          <div className="pt-8 border-t border-gray-200">
            <p className="text-[14px] md:text-[16px] text-[#6b6b6b] mb-4">
              Or reach out directly:
            </p>
            <div className="flex flex-col gap-2">
              <a href="mailto:hello@taylerhughes.co.uk" className="text-[16px] md:text-[18px] text-black hover:opacity-70 transition-opacity">
                hello@taylerhughes.co.uk
              </a>
              <a href="https://linkedin.com/in/taylerhughes" target="_blank" rel="noopener noreferrer" className="text-[16px] md:text-[18px] text-black hover:opacity-70 transition-opacity flex items-center gap-2">
                LinkedIn
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="size-4">
                  <path fillRule="evenodd" d="M4.22 11.78a.75.75 0 0 1 0-1.06L9.44 5.5H5.75a.75.75 0 0 1 0-1.5h5.5a.75.75 0 0 1 .75.75v5.5a.75.75 0 0 1-1.5 0V6.56l-5.22 5.22a.75.75 0 0 1-1.06 0Z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
