"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import SiteHeader from "../components/SiteHeader";
import Footer from "../components/Footer";

// Asset URLs
const imgYCLogo = "/assets/yc-logo.png";
const imgStudyStreamLogo = "/assets/studystream-logo.svg";
const imgSlide4 = "/assets/slide 4.png";
const imgSlide6 = "/assets/slide 6.png";
const imgSlide9 = "/assets/slide 9.png";
const imgSlide10 = "/assets/slide 10.png";
const imgSlide11 = "/assets/slide 11.jpg";
const imgSlide15 = "/assets/slide 15.png";
const imgSlide18 = "/assets/slide 18.png";
const imgSlide22 = "/assets/slide 22.png";
const imgSlide24 = "/assets/slide 24.png";
const imgSlide25 = "/assets/slide 25.png";
const imgSlide29 = "/assets/slide 29.png";
const imgSlide31 = "/assets/slide 31.png";
const imgSlide32_1 = "/assets/slide 32:1.png";
const imgSlide32_2 = "/assets/slide 32:2.png";
const imgSlide32_3 = "/assets/slide 32:3.png";
const imgSlide33 = "/assets/slide 33.png";
const imgSlide34 = "/assets/slide 34.png";
const imgSlide37 = "/assets/slide 37.png";
const imgSlide42 = "/assets/slide 42.png";
const imgSlide43 = "/assets/slide 43.png";
const imgSlide47 = "/assets/slide 47.png";
const imgSlide48 = "/assets/slide 48.png";
const imgSlide49 = "/assets/slide 49.png";

export default function StudyStreamCaseStudy() {
  return (
    <div className="max-w-[1920px] mx-auto">
        <SiteHeader showColorBar={true} showBreadcrumb={false} variant="simple" />

        {/* Hero Section */}
        <section className="px-4 md:px-12 lg:px-24 py-12 md:py-16 lg:py-24 max-w-[1200px] mx-auto">
          <div className="flex flex-col gap-6 md:gap-8">
            {/* Title */}
            <h1 className="font-bebas text-[40px] sm:text-[56px] md:text-[80px] lg:text-[96px] leading-[0.95] md:leading-[0.9] tracking-[-1.5px] md:tracking-[-2px] text-black">
              From a Zoom call to 3 million students
            </h1>

            {/* Metadata */}
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

            {/* Subtitle */}
            <p className="text-[18px] md:text-[22px] lg:text-[28px] leading-[1.5] text-[#292929] max-w-full lg:max-w-[900px]">
              Leading product design for a YC-backed startup from its earliest concept — shaping vision, building the research infrastructure, and iterating a platform to product-market fit at global scale.
            </p>

            {/* Role Details */}
            <div className="flex flex-wrap gap-4 md:gap-6 lg:gap-8 text-[14px] md:text-[16px] text-[#6b6b6b] pt-2 md:pt-4">
              <div>
                <span className="font-semibold text-black">Role:</span> Lead Product Designer
              </div>
              <div>
                <span className="font-semibold text-black">Company:</span> StudyStream (YC W22)
              </div>
              <div>
                <span className="font-semibold text-black">Duration:</span> 2.5 years
              </div>
              <div>
                <span className="font-semibold text-black">Outcome:</span> 0 → 3M+ students worldwide
              </div>
            </div>
          </div>
        </section>

        {/* Divider */}
        <div className="h-px bg-gray-200 max-w-[1200px] mx-auto px-4 md:px-12" />

        {/* Impact Section */}
        <section className="px-4 md:px-12 lg:px-24 py-12 md:py-16 max-w-[1200px] mx-auto">
          <h2 className="font-bebas text-[36px] md:text-[42px] lg:text-[48px] leading-[0.9] tracking-[-0.8px] md:tracking-[-1px] text-black mb-8 md:mb-12">
            Impact
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 lg:gap-8">
            <div className="bg-white p-6 md:p-8 rounded-xl md:rounded-2xl">
              <p className="font-bebas text-[48px] md:text-[56px] lg:text-[64px] leading-none text-black mb-2">3M+</p>
              <p className="text-[16px] md:text-[18px] text-[#6b6b6b]">students on the platform</p>
            </div>
            <div className="bg-white p-6 md:p-8 rounded-xl md:rounded-2xl">
              <p className="font-bebas text-[48px] md:text-[56px] lg:text-[64px] leading-none text-black mb-2">86%</p>
              <p className="text-[16px] md:text-[18px] text-[#6b6b6b]">of users joined to study with others</p>
            </div>
            <div className="bg-white p-6 md:p-8 rounded-xl md:rounded-2xl">
              <p className="font-bebas text-[48px] md:text-[56px] lg:text-[64px] leading-none text-black mb-2">30+</p>
              <p className="text-[16px] md:text-[18px] text-[#6b6b6b]">user interviews in the Top 50 project</p>
            </div>
            <div className="bg-white p-6 md:p-8 rounded-xl md:rounded-2xl">
              <p className="font-bebas text-[48px] md:text-[56px] lg:text-[64px] leading-none text-black mb-2">0 → 1</p>
              <p className="text-[16px] md:text-[18px] text-[#6b6b6b]">from a Zoom link to a global platform</p>
            </div>
          </div>
        </section>

        {/* Where It Started */}
        <section className="px-4 md:px-12 lg:px-24 py-12 md:py-16 max-w-[1200px] mx-auto">
          <h2 className="font-bebas text-[36px] md:text-[42px] lg:text-[48px] leading-[0.9] tracking-[-0.8px] md:tracking-[-1px] text-black mb-4 md:mb-6">
            Where It Started
          </h2>

          <h3 className="text-[24px] md:text-[28px] lg:text-[32px] font-medium leading-[1.3] text-[#292929] mb-6 md:mb-8">
            A Zoom room full of strangers doing their homework
          </h3>

          <div className="prose prose-lg max-w-none">
            <p className="text-[18px] leading-[1.7] text-[#292929] mb-6">
              StudyStream began with an observation: students were voluntarily joining Zoom rooms not to talk, but to study alongside strangers. No agenda. No structure. Just the quiet presence of other people doing the same hard thing. Something real was happening in those rooms, and the founders wanted to understand it — and build something worthy of it.
            </p>

            {/* Image */}
            <div className="rounded-2xl overflow-hidden my-10 flex justify-center bg-[#f2f2f2] p-8 md:p-12">
              <img
                src={imgSlide6}
                alt="The original Zoom room grid of students"
                className="max-w-full h-auto"
              />
            </div>

            <p className="text-[18px] leading-[1.7] text-[#292929] mb-6">
              That's where I came in. Before any product existed, I worked with the co-founders on the fundamentals: mission, vision, and values. What was StudyStream actually for? Who was it for? What did it believe about how people learn? Getting that foundation right wasn't a formality — it was the lens every product decision would be made through. From conversations with early Zoom users, Discord community members, and people showing up every day to study with strangers, we built a picture of what was really driving the behaviour.
            </p>

            {/* Core Insight Quote */}
            <div className="bg-[#f9f9f9] border-l-4 border-black p-8 my-10 rounded-r-lg">
              <p className="text-[24px] font-medium leading-[1.5] text-[#292929] italic">
                "People want to get things done in the presence of others."
              </p>
              <p className="text-[16px] text-[#6b6b6b] mt-3">Core Insight</p>
            </div>

            <p className="text-[18px] leading-[1.7] text-[#292929] mb-6">
              Two forces were at work. Users wanted accountability and focus — a place to simply get things done. And they were motivated by seeing others studying. Not competition. Not chat. Just the quiet signal that someone else was in it too. The platform's job was to hold both of those things without pulling them apart.
            </p>

            <div className="rounded-2xl overflow-hidden my-10 flex justify-center bg-[#f2f2f2] p-8 md:p-12">
              <img
                src={imgSlide4}
                alt="Get things done in the presence of others annotated diagram"
                className="max-w-full h-auto"
              />
            </div>
          </div>
        </section>

        {/* Building the MVP */}
        <section className="px-4 md:px-12 lg:px-24 py-12 md:py-16 max-w-[1200px] mx-auto">
          <h2 className="font-bebas text-[36px] md:text-[42px] lg:text-[48px] leading-[0.9] tracking-[-0.8px] md:tracking-[-1px] text-black mb-4 md:mb-6">
            Building the MVP
          </h2>

          <h3 className="text-[24px] md:text-[28px] lg:text-[32px] font-medium leading-[1.3] text-[#292929] mb-6 md:mb-8">
            Turning what we knew into something people could use
          </h3>

          <div className="prose prose-lg max-w-none">
            <p className="text-[18px] leading-[1.7] text-[#292929] mb-6">
              With that grounding in place, I moved into design. Early whiteboard sessions mapped the two core modes the product needed: a focused study environment at its heart, and a social layer that would let community form naturally around it. The question wasn't whether to have both — the research made that clear. The question was how to sequence them so neither undermined the other.
            </p>

            {/* Image */}
            <div className="rounded-2xl overflow-hidden my-10 flex justify-center bg-[#f2f2f2] p-8 md:p-12">
              <img
                src={imgSlide11}
                alt="Focused / Social whiteboard with study room wireframes and feature list"
                className="max-w-full h-auto"
              />
            </div>

            <p className="text-[18px] leading-[1.7] text-[#292929] mb-6">
              Survey data from the growing Zoom and Discord community shaped the architecture further. Of over 330 respondents, 86.4% came primarily to study with others — but 50% also cited making friends, and nearly 49% mentioned improving motivation. The product had to serve all three without becoming unfocused itself.
            </p>

            {/* Images */}
            <div className="rounded-2xl overflow-hidden my-10 flex justify-center bg-[#f2f2f2] p-8 md:p-12">
              <img
                src={imgSlide9}
                alt="Why are you interested in joining StudyStream? bar chart"
                className="max-w-full h-auto"
              />
            </div>

            <div className="rounded-2xl overflow-hidden my-10 flex justify-center bg-[#f2f2f2] p-8 md:p-12">
              <img
                src={imgSlide10}
                alt="Age distribution chart"
                className="max-w-full h-auto"
              />
            </div>

            <p className="text-[18px] leading-[1.7] text-[#292929] mb-6">
              I built the design system from scratch alongside the product — establishing the visual language, component library, colour system, and typography that would need to carry the product from early prototype through to a platform serving millions.
            </p>

            {/* Images */}
            <div className="rounded-2xl overflow-hidden my-10 flex justify-center bg-[#f2f2f2] p-8 md:p-12">
              <img
                src={imgSlide15}
                alt="Colour palette: Primary Purple, Primary Blue, gradients, dark scale"
                className="max-w-full h-auto"
              />
            </div>

            <div className="bg-[#f2f2f2] rounded-2xl p-16 my-10 flex items-center justify-center">
              <p className="text-[16px] text-[#6b6b6b] text-center">
                [Image: Slide 16 — the launched MVP with study rooms, event spotlight, social feed - Image not available]
              </p>
            </div>
          </div>
        </section>

        {/* The Aha Moment */}
        <section className="px-4 md:px-12 lg:px-24 py-12 md:py-16 max-w-[1200px] mx-auto">
          <h2 className="font-bebas text-[36px] md:text-[42px] lg:text-[48px] leading-[0.9] tracking-[-0.8px] md:tracking-[-1px] text-black mb-4 md:mb-6">
            The Aha Moment
          </h2>

          <h3 className="text-[24px] md:text-[28px] lg:text-[32px] font-medium leading-[1.3] text-[#292929] mb-6 md:mb-8">
            We saw it on her face before we could explain it
          </h3>

          <div className="prose prose-lg max-w-none">
            <p className="text-[18px] leading-[1.7] text-[#292929] mb-6">
              During user testing of an early version of the MVP, something happened that changed the direction of the product. A user navigated into the focus room for the first time — and her reaction was immediate. You could see it on her face. You could hear it in her voice. The room, the people, the quiet shared focus — it landed in a way that none of us had fully anticipated. That was the magic. Not explained, not prompted. Just felt.
            </p>

            <p className="text-[18px] leading-[1.7] text-[#292929] mb-6">
              That moment sharpened everything. If the focus room was where the product came alive, then the entire MVP needed to be in service of getting users there as fast as possible. We restructured the experience around that — reducing friction, shortening the path, making the focus room the first thing people encountered rather than something they had to find.
            </p>

            <p className="text-[18px] leading-[1.7] text-[#292929] mb-6">
              We launched. And users started coming off Zoom.
            </p>

            {/* Image */}
            <div className="rounded-2xl overflow-hidden my-10 flex justify-center bg-[#f2f2f2] p-8 md:p-12">
              <img
                src={imgSlide18}
                alt="Line chart showing Zoom DAU flat/declining vs. WebApp DAU growing from June–October 2022"
                className="max-w-full h-auto"
              />
            </div>

            <p className="text-[18px] leading-[1.7] text-[#292929] mb-6">
              The crossover wasn't gradual. Once users experienced the product, the Zoom sessions declined and the web app climbed. The community was moving — and they were telling each other to move too.
            </p>

            {/* User Quotes */}
            <div className="bg-[#f9f9f9] border-l-4 border-[#6cabff] p-8 my-8 rounded-r-lg">
              <p className="text-[20px] leading-[1.6] text-[#292929] italic mb-3">
                "I think it's the best study site I've ever found. It makes studying more motivating and makes me want to go here every day to get things done."
              </p>
              <p className="text-[16px] text-[#6b6b6b]">— Community user, Discord</p>
            </div>

            <div className="bg-[#f9f9f9] border-l-4 border-[#6cabff] p-8 my-8 rounded-r-lg">
              <p className="text-[20px] leading-[1.6] text-[#292929] italic mb-3">
                "i'm so thankful for this server ❤️"
              </p>
              <p className="text-[16px] text-[#6b6b6b]">— Community user, Discord</p>
            </div>
          </div>
        </section>

        {/* Building the Research Infrastructure */}
        <section className="px-4 md:px-12 lg:px-24 py-12 md:py-16 max-w-[1200px] mx-auto">
          <h2 className="font-bebas text-[36px] md:text-[42px] lg:text-[48px] leading-[0.9] tracking-[-0.8px] md:tracking-[-1px] text-black mb-4 md:mb-6">
            Building the Research Infrastructure
          </h2>

          <h3 className="text-[24px] md:text-[28px] lg:text-[32px] font-medium leading-[1.3] text-[#292929] mb-6 md:mb-8">
            Turning scattered signals into something we could act on
          </h3>

          <div className="prose prose-lg max-w-none">
            <p className="text-[18px] leading-[1.7] text-[#292929] mb-6">
              With users on the platform and feedback arriving from every direction — Discord messages, in-app reports, user interviews, Hotjar recordings, analytics, in-app surveys — the challenge became structure. How do you make sure nothing important gets lost? How do you spot patterns across hundreds of individual signals?
            </p>

            <p className="text-[18px] leading-[1.7] text-[#292929] mb-6">
              I built StudyStream's research repository from scratch, starting in Jira. I created a custom schema with UX labels, experience vectors, emotion tags, event frequency markers, and user name fields — so every piece of feedback, regardless of where it came from, could be tagged, queried, and compared. A Discord message sat alongside an interview transcript alongside an in-app report, all coded consistently.
            </p>

            {/* Images */}
            <div className="rounded-2xl overflow-hidden my-10 flex justify-center bg-[#f2f2f2] p-8 md:p-12">
              <img
                src={imgSlide22}
                alt="UXRR Jira ticket view with custom fields"
                className="max-w-full h-auto"
              />
            </div>

            <div className="rounded-2xl overflow-hidden my-10 flex justify-center bg-[#f2f2f2] p-8 md:p-12">
              <img
                src={imgSlide24}
                alt="UXRR Kanban board with workflow stages"
                className="max-w-full h-auto"
              />
            </div>

            <p className="text-[18px] leading-[1.7] text-[#292929] mb-6">
              The system tracked insights through confidence levels — from things we'd heard once and weren't sure about, through to things we knew with enough certainty to act on. It also included a "Triple Fire Alarm" filter: any signal that was both negative and high-frequency surfaced automatically, so nothing critical could be buried under volume.
            </p>

            {/* Image */}
            <div className="rounded-2xl overflow-hidden my-10 flex justify-center bg-[#f2f2f2] p-8 md:p-12">
              <img
                src={imgSlide25}
                alt="Pie chart of keywords in user requests"
                className="max-w-full h-auto"
              />
            </div>

            <p className="text-[18px] leading-[1.7] text-[#292929]">
              As the team and the data grew, the repo moved to Dovetail. The tooling changed; the taxonomy and the discipline stayed the same.
            </p>
          </div>
        </section>

        {/* Top 50 */}
        <section className="px-4 md:px-12 lg:px-24 py-12 md:py-16 max-w-[1200px] mx-auto">
          <h2 className="font-bebas text-[36px] md:text-[42px] lg:text-[48px] leading-[0.9] tracking-[-0.8px] md:tracking-[-1px] text-black mb-4 md:mb-6">
            Top 50
          </h2>

          <h3 className="text-[24px] md:text-[28px] lg:text-[32px] font-medium leading-[1.3] text-[#292929] mb-6 md:mb-8">
            Going deeper with the people who mattered most
          </h3>

          <div className="prose prose-lg max-w-none">
            <p className="text-[18px] leading-[1.7] text-[#292929] mb-6">
              With a solid foundation of ongoing research in place, we identified an opportunity to go much deeper. We ran a focused project — the Top 50 — selecting StudyStream's fifty most engaged, highest-value users and conducting in-depth interviews with over thirty of them. I ran many of these sessions myself, alongside other members of the team.
            </p>

            {/* Image */}
            <div className="rounded-2xl overflow-hidden my-10 flex justify-center bg-[#f2f2f2] p-8 md:p-12">
              <img
                src={imgSlide29}
                alt="Zoom interview screenshot"
                className="max-w-full h-auto"
              />
            </div>

            <p className="text-[18px] leading-[1.7] text-[#292929] mb-6">
              These weren't quick pulse checks. They were long, open conversations — about how people studied, what their days looked like, what brought them to StudyStream and what kept them coming back. Every session was transcribed, tagged, and entered into Dovetail. Then we ran affinity mapping across the full body of interviews, grouping observations until the patterns became impossible to ignore.
            </p>

            {/* Images */}
            <div className="rounded-2xl overflow-hidden my-10 flex justify-center bg-[#f2f2f2] p-8 md:p-12">
              <img
                src={imgSlide31}
                alt="Bird's eye view of all 20+ FigJam affinity mapping boards"
                className="max-w-full h-auto"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-10">
              <div className="rounded-2xl overflow-hidden flex justify-center bg-[#f2f2f2] p-8 md:p-12">
                <img
                  src={imgSlide32_1}
                  alt="Seeing others studying affinity board"
                  className="max-w-full h-auto"
                />
              </div>
              <div className="rounded-2xl overflow-hidden flex justify-center bg-[#f2f2f2] p-8 md:p-12">
                <img
                  src={imgSlide32_2}
                  alt="Shared struggle affinity board"
                  className="max-w-full h-auto"
                />
              </div>
              <div className="rounded-2xl overflow-hidden flex justify-center bg-[#f2f2f2] p-8 md:p-12">
                <img
                  src={imgSlide32_3}
                  alt="Affinity board with sticky notes and user quotes"
                  className="max-w-full h-auto"
                />
              </div>
            </div>

            <p className="text-[18px] leading-[1.7] text-[#292929] mb-6">
              The most important thing the Top 50 revealed wasn't a feature request. It was an emotional truth: for these users, StudyStream wasn't just a productivity tool. It was a place where they felt less alone. Studying is a solitary, often demoralising experience. The platform gave them company in that — and for the most engaged users, connection wasn't a nice-to-have. It was the whole point.
            </p>

            {/* User Quote */}
            <div className="bg-[#f9f9f9] border-l-4 border-[#6cabff] p-8 my-8 rounded-r-lg">
              <p className="text-[20px] leading-[1.6] text-[#292929] italic mb-3">
                "Like, what is this? People are studying, they are just looking at people who are studying, but then later on I realized that we all are going through the same shit and that we do this together."
              </p>
              <p className="text-[16px] text-[#6b6b6b]">— Assim & Ti, Top 50 interview</p>
            </div>

            <p className="text-[18px] leading-[1.7] text-[#292929] mb-6">
              That finding reoriented how we thought about the product and drove a significant wave of iterations focused on deepening connection — not just enabling focus. The social graph, the encouragement system, the pin mechanic, the move toward smaller rooms and one-to-one study sessions — all of it was shaped by what we heard in the Top 50.
            </p>

            {/* Image */}
            <div className="rounded-2xl overflow-hidden my-10 flex justify-center bg-[#f2f2f2] p-8 md:p-12">
              <img
                src={imgSlide33}
                alt="Process diagram: sticky notes to Problems to Solutions to Design/Dev/Product meeting to Backlog"
                className="max-w-full h-auto"
              />
            </div>
          </div>
        </section>

        {/* Iterating in Production */}
        <section className="px-4 md:px-12 lg:px-24 py-12 md:py-16 max-w-[1200px] mx-auto">
          <h2 className="font-bebas text-[36px] md:text-[42px] lg:text-[48px] leading-[0.9] tracking-[-0.8px] md:tracking-[-1px] text-black mb-4 md:mb-6">
            Iterating in Production
          </h2>

          <h3 className="text-[24px] md:text-[28px] lg:text-[32px] font-medium leading-[1.3] text-[#292929] mb-6 md:mb-8">
            Ideas that were built, tested, and earned their place
          </h3>

          <div className="prose prose-lg max-w-none">
            <p className="text-[18px] leading-[1.7] text-[#292929] mb-6">
              With the Top 50 insights driving the backlog, the team moved fast. Solutions were designed, shipped, and measured against a clear definition of success. Things that worked stayed. Things that didn't were killed. Below is a selection of what we iterated on.
            </p>

            <h4 className="text-[24px] font-semibold text-black mt-12 mb-4">
              Social presence: encouragement and connection
            </h4>

            <p className="text-[18px] leading-[1.7] text-[#292929] mb-6">
              We built and iterated on an encouragement system — letting users send recognition to others in the room — and a pin mechanic that let users save people they wanted to study with again. Both features were direct responses to what the Top 50 told us: that being seen mattered, and that familiarity made the experience significantly more valuable.
            </p>

            {/* Images */}
            <div className="rounded-2xl overflow-hidden my-10 flex justify-center bg-[#f2f2f2] p-8 md:p-12">
              <img
                src={imgSlide37}
                alt="Encouragement notification toasts"
                className="max-w-full h-auto"
              />
            </div>

            <div className="rounded-2xl overflow-hidden my-10 flex justify-center bg-[#f2f2f2] p-8 md:p-12">
              <img
                src={imgSlide43}
                alt="Statistics with pins and encouragements"
                className="max-w-full h-auto"
              />
            </div>

            <h4 className="text-[24px] font-semibold text-black mt-12 mb-4">
              The video tile
            </h4>

            <p className="text-[18px] leading-[1.7] text-[#292929] mb-6">
              The video tile was the face of every person in every room — carrying their name, subject, pin count, status, and social signals. It was one of the most iterated components in the product. We explored multiple directions for information density, hover states, and hierarchy, trying to find the balance between personality and the focused atmosphere the rooms needed to maintain.
            </p>

            {/* Image */}
            <div className="rounded-2xl overflow-hidden my-10 flex justify-center bg-[#f2f2f2] p-8 md:p-12">
              <img
                src={imgSlide42}
                alt="Multiple video tile variants with different status indicators and hover states"
                className="max-w-full h-auto"
              />
            </div>

            <h4 className="text-[24px] font-semibold text-black mt-12 mb-4">
              Streaks, levels, and visible progress
            </h4>

            <p className="text-[18px] leading-[1.7] text-[#292929] mb-6">
              StudyStream's users were students who already tracked grades and built habits. Streak tracking, daily study counters, and a levelling badge system gave users external signals of their own consistency — making dedication feel recognised without turning the product into something competitive or distracting.
            </p>

            {/* Images */}
            <div className="rounded-2xl overflow-hidden my-10 flex justify-center bg-[#f2f2f2] p-8 md:p-12">
              <img
                src={imgSlide47}
                alt="Level badges - Level 1, Level 3, Level 100"
                className="max-w-full h-auto"
              />
            </div>

            <div className="rounded-2xl overflow-hidden my-10 flex justify-center bg-[#f2f2f2] p-8 md:p-12">
              <img
                src={imgSlide48}
                alt="Achieved 50 day streak notification"
                className="max-w-full h-auto"
              />
            </div>

            <h4 className="text-[24px] font-semibold text-black mt-12 mb-4">
              The social web framework
            </h4>

            <p className="text-[18px] leading-[1.7] text-[#292929] mb-6">
              To help the team think clearly about where features sat in the user journey, I developed the social web framework — mapping the progression from a user's first moment (awareness, seeing others study, turning camera on) through foundation mechanics (group chat, finding a study buddy, smaller rooms) and out toward deep, lasting relationships. It gave everyone a shared language for talking about connection and where the product needed to invest next.
            </p>

            {/* Image */}
            <div className="rounded-2xl overflow-hidden my-10 flex justify-center bg-[#f2f2f2] p-8 md:p-12">
              <img
                src={imgSlide34}
                alt="Core / Foundation / Social Web diamond diagram with labelled journey nodes"
                className="max-w-full h-auto"
              />
            </div>

            <h4 className="text-[24px] font-semibold text-black mt-12 mb-4">
              Going mobile
            </h4>

            <p className="text-[18px] leading-[1.7] text-[#292929] mb-6">
              As the product matured, mobile became essential. The mobile app brought the core study room experience to iOS alongside background customisation, a pomodoro focus mode, and social nudges — built for the environments where students actually studied.
            </p>

            {/* Image */}
            <div className="rounded-2xl overflow-hidden my-10 flex justify-center bg-[#f2f2f2] p-8 md:p-12">
              <img
                src={imgSlide49}
                alt="Five iPhone screens showing Pomodoro timer, background gallery, and social notifications"
                className="max-w-full h-auto"
              />
            </div>
          </div>
        </section>

        {/* Reflection */}
        <section className="px-4 md:px-12 lg:px-24 py-12 md:py-16 max-w-[1200px] mx-auto">
          <h2 className="font-bebas text-[36px] md:text-[42px] lg:text-[48px] leading-[0.9] tracking-[-0.8px] md:tracking-[-1px] text-black mb-4 md:mb-6">
            Reflection
          </h2>

          <h3 className="text-[24px] md:text-[28px] lg:text-[32px] font-medium leading-[1.3] text-[#292929] mb-6 md:mb-8">
            What this taught me about design at pace
          </h3>

          <div className="prose prose-lg max-w-none">
            <p className="text-[18px] leading-[1.7] text-[#292929] mb-6">
              StudyStream was one of the most formative engagements of my career — not because of the scale, but because of the speed and the stakes. When you're building for a community that's actively cheering you on, the feedback loop is short and the work feels real. Users told you what they loved and what hurt them. The job was to keep listening.
            </p>

            <p className="text-[18px] leading-[1.7] text-[#292929]">
              The things I'm proudest of aren't the individual screens. They're the infrastructure: a research system that scaled with the company, a process that turned scattered signals into prioritised decisions, and a team culture where design and data were genuinely trusted together. Those things outlasted any single feature.
            </p>
          </div>
        </section>

        {/* Footer CTA */}
        <section className="px-4 md:px-12 lg:px-24 py-16 md:py-20 max-w-[1200px] mx-auto border-t border-gray-200">
          <div className="text-center">
            <p className="text-[18px] text-[#6b6b6b] mb-4">
              Tayler Hughes · <a href="mailto:hello@taylerhughes.co.uk" className="hover:text-black transition-colors">hello@taylerhughes.co.uk</a> · <a href="https://www.linkedin.com/in/taylerhughes" target="_blank" rel="noopener noreferrer" className="hover:text-black transition-colors">LinkedIn</a>
            </p>
          </div>
        </section>

        <Footer />
      </div>
  );
}
