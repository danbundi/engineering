import React, { useRef, useState } from 'react';
import type { ReactElement } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Activity, HardHat, ArrowUpRight, Layers3, ShieldCheck } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function About(): ReactElement {
  const curtainRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoPinRef = useRef<HTMLDivElement>(null);

  const aboutSectionRef = useRef<HTMLElement>(null);
  const aboutLabelRef = useRef<HTMLDivElement>(null);
  const aboutNumberRef = useRef<HTMLSpanElement>(null);
  const aboutLineRef = useRef<HTMLSpanElement>(null);
  const aboutLabelTextRef = useRef<HTMLSpanElement>(null);

  const aboutHeadingRef = useRef<HTMLHeadingElement>(null);
  const headingLine1Ref = useRef<HTMLSpanElement>(null);
  const headingLine2Ref = useRef<HTMLSpanElement>(null);
  const headingAccentRef = useRef<HTMLSpanElement>(null);

  const aboutDescriptionRef = useRef<HTMLParagraphElement>(null);

  const approachRef = useRef<HTMLDivElement>(null);
  const approachLineRef = useRef<HTMLDivElement>(null);
  const approachLabelRef = useRef<HTMLParagraphElement>(null);
  const approachTextRef = useRef<HTMLParagraphElement>(null);

  const statsRef = useRef<HTMLDivElement>(null);
  const statOneRef = useRef<HTMLDivElement>(null);
  const statTwoRef = useRef<HTMLDivElement>(null);
  const statOneNumberRef = useRef<HTMLParagraphElement>(null);
  const statTwoNumberRef = useRef<HTMLParagraphElement>(null);

  const bottomStatementRef = useRef<HTMLDivElement>(null);
  const bottomBorderRef = useRef<HTMLDivElement>(null);
  const bottomLeftRef = useRef<HTMLSpanElement>(null);
  const bottomRightRef = useRef<HTMLSpanElement>(null);

  const [scrollProgress, setScrollProgress] = useState<number>(0);

  useGSAP(() => {
    if (!videoRef.current || !videoPinRef.current) return;

    ScrollTrigger.create({
      trigger: videoPinRef.current,
      start: 'top top',
      end: '+=300%',
      pin: true,
      scrub: 0.1,
      onUpdate: (self: ScrollTrigger) => {
        setScrollProgress(self.progress);

        if (videoRef.current && videoRef.current.duration) {
          videoRef.current.currentTime = videoRef.current.duration * self.progress;
        }
      },
    });
  }, { scope: curtainRef });

  /*
  ============================================================
  ABOUT SECTION ANIMATION
  ============================================================
  */

  useGSAP(() => {
    if (!aboutSectionRef.current) return;

    const section = aboutSectionRef.current;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top 72%',
          end: 'top 15%',
          scrub: 0.8,
        },
      });

      /*
      ----------------------------------------------------------
      INITIAL STATES
      ----------------------------------------------------------
      */

      gsap.set(aboutNumberRef.current, {
        y: 20,
        opacity: 0,
      });

      gsap.set(aboutLineRef.current, {
        scaleX: 0,
        transformOrigin: 'left center',
      });

      gsap.set(aboutLabelTextRef.current, {
        y: 12,
        opacity: 0,
      });

      gsap.set(headingLine1Ref.current, {
        yPercent: 110,
        opacity: 0,
      });

      gsap.set(headingLine2Ref.current, {
        yPercent: 110,
        opacity: 0,
      });

      gsap.set(headingAccentRef.current, {
        opacity: 0,
        x: -20,
      });

      gsap.set(aboutDescriptionRef.current, {
        y: 30,
        opacity: 0,
      });

      gsap.set(approachLineRef.current, {
        scaleY: 0,
        transformOrigin: 'top center',
      });

      gsap.set(approachLabelRef.current, {
        y: 15,
        opacity: 0,
      });

      gsap.set(approachTextRef.current, {
        y: 25,
        opacity: 0,
      });

      gsap.set(statOneRef.current, {
        y: 30,
        opacity: 0,
      });

      gsap.set(statTwoRef.current, {
        y: 30,
        opacity: 0,
      });

      gsap.set(statOneNumberRef.current, {
        yPercent: 100,
      });

      gsap.set(statTwoNumberRef.current, {
        yPercent: 100,
      });

      gsap.set(bottomBorderRef.current, {
        scaleX: 0,
        transformOrigin: 'left center',
      });

      gsap.set(bottomLeftRef.current, {
        x: -30,
        opacity: 0,
      });

      gsap.set(bottomRightRef.current, {
        x: 30,
        opacity: 0,
      });

      /*
      ----------------------------------------------------------
      01 — SECTION LABEL
      ----------------------------------------------------------
      */

      tl.to(aboutNumberRef.current, {
        y: 0,
        opacity: 1,
        duration: 0.35,
        ease: 'power3.out',
      });

      tl.to(
        aboutLineRef.current,
        {
          scaleX: 1,
          duration: 0.45,
          ease: 'power3.out',
        },
        '-=0.15'
      );

      tl.to(
        aboutLabelTextRef.current,
        {
          y: 0,
          opacity: 1,
          duration: 0.4,
          ease: 'power3.out',
        },
        '-=0.25'
      );

      /*
      ----------------------------------------------------------
      02 — MAIN HEADING
      ----------------------------------------------------------
      */

      tl.to(
        headingLine1Ref.current,
        {
          yPercent: 0,
          opacity: 1,
          duration: 0.65,
          ease: 'power4.out',
        },
        '+=0.1'
      );

      tl.to(
        headingLine2Ref.current,
        {
          yPercent: 0,
          opacity: 1,
          duration: 0.65,
          ease: 'power4.out',
        },
        '-=0.42'
      );

      tl.to(
        headingAccentRef.current,
        {
          opacity: 1,
          x: 0,
          duration: 0.45,
          ease: 'power3.out',
        },
        '-=0.35'
      );

      /*
      ----------------------------------------------------------
      03 — DESCRIPTION
      ----------------------------------------------------------
      */

      tl.to(
        aboutDescriptionRef.current,
        {
          y: 0,
          opacity: 1,
          duration: 0.55,
          ease: 'power3.out',
        },
        '+=0.05'
      );

      /*
      ----------------------------------------------------------
      04 — APPROACH BLOCK
      ----------------------------------------------------------
      */

      tl.to(
        approachLineRef.current,
        {
          scaleY: 1,
          duration: 0.55,
          ease: 'power3.out',
        },
        '+=0.05'
      );

      tl.to(
        approachLabelRef.current,
        {
          y: 0,
          opacity: 1,
          duration: 0.4,
          ease: 'power3.out',
        },
        '-=0.35'
      );

      tl.to(
        approachTextRef.current,
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          ease: 'power3.out',
        },
        '-=0.3'
      );

      /*
      ----------------------------------------------------------
      05 — STATS
      ----------------------------------------------------------
      */

      tl.to(
        statOneRef.current,
        {
          y: 0,
          opacity: 1,
          duration: 0.45,
          ease: 'power3.out',
        },
        '+=0.05'
      );

      tl.to(
        statTwoRef.current,
        {
          y: 0,
          opacity: 1,
          duration: 0.45,
          ease: 'power3.out',
        },
        '-=0.28'
      );

      tl.to(
        statOneNumberRef.current,
        {
          yPercent: 0,
          duration: 0.5,
          ease: 'power4.out',
        },
        '-=0.3'
      );

      tl.to(
        statTwoNumberRef.current,
        {
          yPercent: 0,
          duration: 0.5,
          ease: 'power4.out',
        },
        '-=0.38'
      );

      /*
      ----------------------------------------------------------
      06 — BOTTOM STATEMENT
      ----------------------------------------------------------
      */

      tl.to(
        bottomBorderRef.current,
        {
          scaleX: 1,
          duration: 0.55,
          ease: 'power3.out',
        },
        '+=0.05'
      );

      tl.to(
        bottomLeftRef.current,
        {
          x: 0,
          opacity: 1,
          duration: 0.45,
          ease: 'power3.out',
        },
        '-=0.25'
      );

      tl.to(
        bottomRightRef.current,
        {
          x: 0,
          opacity: 1,
          duration: 0.45,
          ease: 'power3.out',
        },
        '-=0.32'
      );
    }, section);

    return () => ctx.revert();
  }, { scope: aboutSectionRef });

  // Original phase mapping
  const showPhase1 = scrollProgress >= 0.12 && scrollProgress < 0.40;
  const showPhase2 = scrollProgress >= 0.42 && scrollProgress < 0.70;
  const showPhase3 = scrollProgress >= 0.72 && scrollProgress <= 0.98;

  const currentPhase =
    scrollProgress < 0.35
      ? 'FOUNDATION'
      : scrollProgress < 0.70
      ? 'SUPERSTRUCTURE'
      : 'ENCLOSURE';

  const progress = Math.round(scrollProgress * 100);

  return (
    <main ref={curtainRef} className="relative z-20 overflow-hidden bg-[#F5F3EE] text-[#18324A] border-t border-[#18324A]/10">

      {/* =========================================================
          VIDEO / SCRUB SECTION
      ========================================================== */}

      <div ref={videoPinRef} className="relative h-screen w-full overflow-hidden bg-[#D9D6CE]">

        <video
          ref={videoRef}
          src="/Construction.mp4"
          muted
          playsInline
          preload="auto"
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-[#18324A]/25 via-transparent to-[#18324A]/35" />
        <div className="absolute inset-x-0 bottom-0 h-40 pointer-events-none bg-gradient-to-t from-[#18324A]/45 to-transparent" />
        <div className="absolute inset-0 pointer-events-none bg-[#F5F3EE]/[0.04] mix-blend-soft-light" />

        <div className="absolute inset-0 pointer-events-none">
          <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
            <line x1="5" y1="0" x2="5" y2="100" stroke="#18324A" strokeOpacity="0.16" strokeWidth="0.08" />
            <line x1="95" y1="0" x2="95" y2="100" stroke="#18324A" strokeOpacity="0.16" strokeWidth="0.08" />
            <line x1="0" y1="84" x2="100" y2="84" stroke="#18324A" strokeOpacity="0.14" strokeWidth="0.08" />
            <line x1="50" y1="0" x2="50" y2="100" stroke="#18324A" strokeOpacity="0.06" strokeWidth="0.06" strokeDasharray="0.7 1.4" />
          </svg>
        </div>

        <div className="absolute left-6 top-6 md:left-10 md:top-8 z-30 pointer-events-none">
          <div className="flex items-start gap-3">
            <div className="mt-1.5 h-2 w-2 rounded-full bg-[#D89A24]" />

            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-white drop-shadow-sm">
                About the build
              </p>

              <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.18em] text-white/70">
                Structural process / 2026
              </p>
            </div>
          </div>
        </div>

        <div className="absolute right-6 top-6 md:right-10 md:top-8 z-30 pointer-events-none text-right">
          <div className="flex items-center justify-end gap-2">
            <Activity className="h-3.5 w-3.5 text-[#D89A24]" />

            <span className="font-mono text-[9px] font-semibold uppercase tracking-[0.2em] text-white">
              Construction sequence
            </span>
          </div>

          <div className="mt-1 flex items-center justify-end gap-2">
            <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-white/60">
              {currentPhase}
            </span>

            <span className="font-mono text-xs font-bold text-white">
              {String(progress).padStart(2, '0')}%
            </span>
          </div>
        </div>

        <div className="absolute left-6 bottom-7 md:left-10 md:bottom-9 z-30 pointer-events-none">
          <div className="flex items-center gap-3">
            <span className="font-mono text-[9px] font-bold tracking-[0.15em] text-white">
              01
            </span>

            <div className="h-px w-16 md:w-24 bg-white/50 overflow-hidden">
              <div className="h-full bg-[#D89A24] transition-[width] duration-100" style={{ width: `${progress}%` }} />
            </div>

            <span className="font-mono text-[9px] tracking-[0.15em] text-white/70">
              03
            </span>
          </div>

          <p className="mt-2 text-[9px] uppercase tracking-[0.2em] text-white/60">
            Scroll to explore
          </p>
        </div>

        {/* =====================================================
            PHASE 01
        ====================================================== */}

        <AnimatePresence>
          {showPhase1 && (
            <>
              <div className="absolute top-[35%] left-[32%] z-30 pointer-events-none">
                <span className="absolute -inset-3 rounded-full border border-[#D89A24]/60 animate-ping" />
                <span className="absolute -inset-2 rounded-full border border-white/50" />

                <span className="relative flex h-8 w-8 items-center justify-center rounded-full bg-[#D89A24] text-[#18324A] font-mono text-xs font-bold shadow-[0_4px_18px_rgba(24,50,74,0.25)]">
                  1
                </span>
              </div>

              <motion.div
                initial={{ opacity: 0, x: -25, y: 8 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                exit={{ opacity: 0, x: -15 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                className="absolute top-[20%] left-[5%] md:left-[8%] z-40 w-[calc(100%-2rem)] max-w-xs md:max-w-sm overflow-hidden rounded-sm border border-[#18324A]/15 border-l-4 border-l-[#D89A24] bg-[#F5F3EE]/50 p-6 shadow-[0_20px_60px_rgba(24,50,74,0.16)] backdrop-blur-xl"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-sm bg-[#18324A] text-[#D89A24]">
                      <HardHat className="h-3.5 w-3.5" />
                    </div>

                    <span className="font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-[#18324A]/60">
                      01 / Foundation
                    </span>
                  </div>

                  <span className="font-mono text-[9px] text-[#18324A]/40">
                    001
                  </span>
                </div>

                <div className="mt-5">
                  <h3 className="font-sans text-lg font-semibold tracking-tight text-[#18324A]">
                    Hydraulic Crane Rigging
                  </h3>

                  <p className="mt-2 text-xs leading-6 text-[#5F7890]">
                    Precision off-site precast panel positioning using controlled heavy-lift systems and coordinated site operations.
                  </p>
                </div>

                <div className="mt-5 flex items-center justify-between border-t border-[#18324A]/10 pt-3">
                  <span className="font-mono text-[8px] uppercase tracking-[0.18em] text-[#18324A]/45">
                    Structural system
                  </span>

                  <ArrowUpRight className="h-3.5 w-3.5 text-[#D89A24]" />
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* =====================================================
            PHASE 02
        ====================================================== */}

        <AnimatePresence>
          {showPhase2 && (
            <>
              <div className="absolute top-[48%] left-[55%] z-30 pointer-events-none">
                <span className="absolute -inset-3 rounded-full border border-[#D89A24]/60 animate-ping" />
                <span className="absolute -inset-2 rounded-full border border-white/50" />

                <span className="relative flex h-8 w-8 items-center justify-center rounded-full bg-[#D89A24] text-[#18324A] font-mono text-xs font-bold shadow-[0_4px_18px_rgba(24,50,74,0.25)]">
                  2
                </span>
              </div>

              <motion.div
                initial={{ opacity: 0, x: 25, y: 8 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                exit={{ opacity: 0, x: 15 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                className="absolute top-[38%] right-[5%] md:right-[8%] z-40 w-[calc(100%-2rem)] max-w-xs md:max-w-sm overflow-hidden rounded-sm border border-[#18324A]/15 border-r-4 border-r-[#D89A24] bg-[#F5F3EE]/50 p-6 shadow-[0_20px_60px_rgba(24,50,74,0.16)] backdrop-blur-xl"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-sm bg-[#18324A] text-[#D89A24]">
                      <Layers3 className="h-3.5 w-3.5" />
                    </div>

                    <span className="font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-[#18324A]/60">
                      02 / Structure
                    </span>
                  </div>

                  <span className="font-mono text-[9px] text-[#18324A]/40">
                    002
                  </span>
                </div>

                <div className="mt-5">
                  <h3 className="font-sans text-lg font-semibold tracking-tight text-[#18324A]">
                    Precast Concrete Envelope
                  </h3>

                  <p className="mt-2 text-xs leading-6 text-[#5F7890]">
                    Load-bearing insulated sandwich wall panels engineered for thermal performance, structural stability and long-term durability.
                  </p>
                </div>

                <div className="mt-5 flex items-center justify-between border-t border-[#18324A]/10 pt-3">
                  <span className="font-mono text-[8px] uppercase tracking-[0.18em] text-[#18324A]/45">
                    Envelope assembly
                  </span>

                  <ArrowUpRight className="h-3.5 w-3.5 text-[#D89A24]" />
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* =====================================================
            PHASE 03
        ====================================================== */}

        <AnimatePresence>
          {showPhase3 && (
            <>
              <div className="absolute top-[28%] left-[52%] z-30 pointer-events-none">
                <span className="absolute -inset-3 rounded-full border border-[#D89A24]/60 animate-ping" />
                <span className="absolute -inset-2 rounded-full border border-white/50" />

                <span className="relative flex h-8 w-8 items-center justify-center rounded-full bg-[#D89A24] text-[#18324A] font-mono text-xs font-bold shadow-[0_4px_18px_rgba(24,50,74,0.25)]">
                  3
                </span>
              </div>

              <motion.div
                initial={{ opacity: 0, y: -25 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                className="absolute top-[15%] right-[5%] md:right-[12%] z-40 w-[calc(100%-2rem)] max-w-xs md:max-w-sm overflow-hidden rounded-sm border border-[#18324A]/15 border-t-4 border-t-[#D89A24] bg-[#F5F3EE]/50 p-6 shadow-[0_20px_60px_rgba(24,50,74,0.16)] backdrop-blur-xl"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-sm bg-[#18324A] text-[#D89A24]">
                      <ShieldCheck className="h-3.5 w-3.5" />
                    </div>

                    <span className="font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-[#18324A]/60">
                      03 / Enclosure
                    </span>
                  </div>

                  <span className="font-mono text-[9px] text-[#18324A]/40">
                    003
                  </span>
                </div>

                <div className="mt-5">
                  <h3 className="font-sans text-lg font-semibold tracking-tight text-[#18324A]">
                    Engineered Roof Trusses
                  </h3>

                  <p className="mt-2 text-xs leading-6 text-[#5F7890]">
                    Lightweight steel roof systems engineered for structural efficiency, environmental loads and precise final assembly.
                  </p>
                </div>

                <div className="mt-5 flex items-center justify-between border-t border-[#18324A]/10 pt-3">
                  <span className="font-mono text-[8px] uppercase tracking-[0.18em] text-[#18324A]/45">
                    Structural closure
                  </span>

                  <ArrowUpRight className="h-3.5 w-3.5 text-[#D89A24]" />
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>

      {/* =========================================================
          ABOUT DESCRIPTION — ANIMATED
      ========================================================== */}

      <section ref={aboutSectionRef} className="relative min-h-screen overflow-hidden bg-[#F5F3EE] px-6 py-24 md:px-16 md:py-32 lg:px-24">

        {/* Architectural detail */}
        <div className="absolute right-0 top-0 h-full w-px bg-[#18324A]/10" />
        <div className="absolute left-[8%] top-0 h-full w-px bg-[#18324A]/5" />

        {/* Very subtle horizontal datum */}
        <div className="absolute left-0 top-[42%] h-px w-full bg-[#18324A]/[0.035]" />
        <div className="absolute left-0 bottom-[17%] h-px w-full bg-[#18324A]/[0.035]" />

        <div className="relative mx-auto max-w-6xl">

          {/* =====================================================
              SECTION LABEL
          ====================================================== */}

          <div ref={aboutLabelRef} className="flex items-center gap-4 border-b border-[#18324A]/10 pb-5 overflow-hidden">

            <span ref={aboutNumberRef} className="font-mono text-[10px] font-bold tracking-[0.2em] text-[#D89A24]">
              01
            </span>

            <span ref={aboutLineRef} className="h-px w-10 bg-[#D89A24]" />

            <span ref={aboutLabelTextRef} className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#18324A]/50">
              About the company
            </span>

          </div>

          {/* =====================================================
              MAIN CONTENT
          ====================================================== */}

          <div className="mt-16 grid gap-12 lg:grid-cols-[1.3fr_0.7fr] lg:gap-24">

            {/* LEFT */}
            <div>

              <h2 ref={aboutHeadingRef} className="max-w-4xl text-4xl font-semibold leading-[1.05] tracking-[-0.04em] text-[#18324A] md:text-6xl lg:text-7xl">

                <span className="block overflow-hidden">
                  <span ref={headingLine1Ref} className="inline-block">
                    Building with
                  </span>
                </span>

                <span className="block overflow-hidden">
                  <span ref={headingLine2Ref} className="inline-block">
                    <span ref={headingAccentRef} className="text-[#D89A24]">
                      precision.
                    </span>
                  </span>
                </span>

                <span className="block overflow-hidden">
                  <span className="inline-block">
                    Designed to last.
                  </span>
                </span>

              </h2>

              <p ref={aboutDescriptionRef} className="mt-8 max-w-2xl text-base leading-7 text-[#5F7890] md:text-lg md:leading-8">
                Our approach combines engineered systems, controlled fabrication and precise site execution to create structures that are efficient, resilient and built for the long term.
              </p>

            </div>

            {/* RIGHT */}
            <div ref={approachRef} className="lg:pt-3">

              <div className="relative pl-6">

                <div
                  ref={approachLineRef}
                  className="absolute left-0 top-0 h-full w-px bg-[#D89A24]"
                />

                <p ref={approachLabelRef} className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#18324A]/45">
                  Our approach
                </p>

                <p ref={approachTextRef} className="mt-4 text-sm leading-7 text-[#18324A]">
                  From foundation to final enclosure, every stage is treated as part of one coordinated structural system.
                </p>

              </div>

              {/* =================================================
                  STATS
              ================================================== */}

              <div ref={statsRef} className="mt-12 grid grid-cols-2 border-t border-[#18324A]/10">

                <div ref={statOneRef} className="overflow-hidden border-r border-[#18324A]/10 py-5 pr-5">

                  <div className="overflow-hidden">
                    <p ref={statOneNumberRef} className="font-mono text-2xl font-semibold text-[#18324A]">
                      01
                    </p>
                  </div>

                  <p className="mt-2 text-[9px] uppercase tracking-[0.15em] text-[#18324A]/45">
                    Integrated process
                  </p>

                </div>

                <div ref={statTwoRef} className="overflow-hidden py-5 pl-5">

                  <div className="overflow-hidden">
                    <p ref={statTwoNumberRef} className="font-mono text-2xl font-semibold text-[#18324A]">
                      03
                    </p>
                  </div>

                  <p className="mt-2 text-[9px] uppercase tracking-[0.15em] text-[#18324A]/45">
                    Construction phases
                  </p>

                </div>

              </div>

            </div>

          </div>

          {/* =====================================================
              BOTTOM STATEMENT
          ====================================================== */}

          <div ref={bottomStatementRef} className="relative mt-24 flex flex-col justify-between gap-6 pt-6 md:flex-row md:items-center overflow-hidden">

            <div
              ref={bottomBorderRef}
              className="absolute left-0 top-0 h-px w-full bg-[#18324A]/10"
            />

            <span ref={bottomLeftRef} className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#18324A]/40">
              STRUCTURAL ENGINEERING / PREFABRICATION / CONSTRUCTION
            </span>

            <span ref={bottomRightRef} className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#D89A24]">
              Built with intention
            </span>

          </div>

        </div>

      </section>

    </main>
  );
}