
import { useRef, useState, useEffect } from 'react';
import type { ReactElement } from 'react';

import { motion, AnimatePresence } from 'framer-motion';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

import {
  Activity,
  HardHat,
  ArrowUpRight,
  Layers3,
  ShieldCheck,
} from 'lucide-react';

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

  const videoSeekRef = useRef<number | null>(null);
  const targetTimeRef = useRef(0);
  const lastVideoTimeRef = useRef(0);

  const [scrollProgress, setScrollProgress] = useState<number>(0);

  useEffect(() => {
  const video = videoRef.current;
  const section = videoPinRef.current;

  if (!video || !section) return;

  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        video.preload = "auto";
        video.load();

        observer.disconnect();
      }
    },
    {
      rootMargin: "1200px",
    }
  );

  observer.observe(section);

  return () => observer.disconnect();
}, []);

  /*
  ============================================================
  VIDEO / IMAGE SCROLL SCRUB
  ============================================================
  */

  useGSAP(
    () => {
      if (!videoRef.current || !videoPinRef.current) return;

      ScrollTrigger.create({
        trigger: videoPinRef.current,
        start: 'top top',
        end: '+=300%',
        pin: true,
        scrub: 0.1,

        onUpdate: (self: ScrollTrigger) => {
  setScrollProgress(self.progress);

  if (
    window.innerWidth < 768 ||
    !videoRef.current ||
    !videoRef.current.duration
  ) {
    return;
  }

  const targetTime =
    videoRef.current.duration * self.progress;

  targetTimeRef.current = targetTime;

  if (
    Math.abs(targetTime - lastVideoTimeRef.current) < 0.04
  ) {
    return;
  }

  if (videoSeekRef.current !== null) {
    return;
  }

  videoSeekRef.current = requestAnimationFrame(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = targetTimeRef.current;
      lastVideoTimeRef.current = targetTimeRef.current;
    }

    videoSeekRef.current = null;
  });
},
      });
    },
    { scope: curtainRef },
  );

  /*
  ============================================================
  ABOUT DESCRIPTION ANIMATION
  ============================================================
  */

  useGSAP(
    () => {
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
        --------------------------------------------------------
        INITIAL STATES
        --------------------------------------------------------
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
        --------------------------------------------------------
        01 — SECTION LABEL
        --------------------------------------------------------
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
          '-=0.15',
        );

        tl.to(
          aboutLabelTextRef.current,
          {
            y: 0,
            opacity: 1,
            duration: 0.4,
            ease: 'power3.out',
          },
          '-=0.25',
        );

        /*
        --------------------------------------------------------
        02 — MAIN HEADING
        --------------------------------------------------------
        */

        tl.to(
          headingLine1Ref.current,
          {
            yPercent: 0,
            opacity: 1,
            duration: 0.65,
            ease: 'power4.out',
          },
          '+=0.1',
        );

        tl.to(
          headingLine2Ref.current,
          {
            yPercent: 0,
            opacity: 1,
            duration: 0.65,
            ease: 'power4.out',
          },
          '-=0.42',
        );

        tl.to(
          headingAccentRef.current,
          {
            opacity: 1,
            x: 0,
            duration: 0.45,
            ease: 'power3.out',
          },
          '-=0.35',
        );

        /*
        --------------------------------------------------------
        03 — DESCRIPTION
        --------------------------------------------------------
        */

        tl.to(
          aboutDescriptionRef.current,
          {
            y: 0,
            opacity: 1,
            duration: 0.55,
            ease: 'power3.out',
          },
          '+=0.05',
        );

        /*
        --------------------------------------------------------
        04 — APPROACH
        --------------------------------------------------------
        */

        tl.to(
          approachLineRef.current,
          {
            scaleY: 1,
            duration: 0.55,
            ease: 'power3.out',
          },
          '+=0.05',
        );

        tl.to(
          approachLabelRef.current,
          {
            y: 0,
            opacity: 1,
            duration: 0.4,
            ease: 'power3.out',
          },
          '-=0.35',
        );

        tl.to(
          approachTextRef.current,
          {
            y: 0,
            opacity: 1,
            duration: 0.5,
            ease: 'power3.out',
          },
          '-=0.3',
        );

        /*
        --------------------------------------------------------
        05 — STATS
        --------------------------------------------------------
        */

        tl.to(
          statOneRef.current,
          {
            y: 0,
            opacity: 1,
            duration: 0.45,
            ease: 'power3.out',
          },
          '+=0.05',
        );

        tl.to(
          statTwoRef.current,
          {
            y: 0,
            opacity: 1,
            duration: 0.45,
            ease: 'power3.out',
          },
          '-=0.28',
        );

        tl.to(
          statOneNumberRef.current,
          {
            yPercent: 0,
            duration: 0.5,
            ease: 'power4.out',
          },
          '-=0.3',
        );

        tl.to(
          statTwoNumberRef.current,
          {
            yPercent: 0,
            duration: 0.5,
            ease: 'power4.out',
          },
          '-=0.38',
        );

        /*
        --------------------------------------------------------
        06 — BOTTOM STATEMENT
        --------------------------------------------------------
        */

        tl.to(
          bottomBorderRef.current,
          {
            scaleX: 1,
            duration: 0.55,
            ease: 'power3.out',
          },
          '+=0.05',
        );

        tl.to(
          bottomLeftRef.current,
          {
            x: 0,
            opacity: 1,
            duration: 0.45,
            ease: 'power3.out',
          },
          '-=0.25',
        );

        tl.to(
          bottomRightRef.current,
          {
            x: 0,
            opacity: 1,
            duration: 0.45,
            ease: 'power3.out',
          },
          '-=0.32',
        );
      }, section);

      return () => ctx.revert();
    },
    { scope: aboutSectionRef },
  );

  /*
  ============================================================
  PHASE MAPPING
  ============================================================
  */

  const showPhase1 =
    scrollProgress >= 0.12 && scrollProgress < 0.40;

  const showPhase2 =
    scrollProgress >= 0.42 && scrollProgress < 0.70;

  const showPhase3 =
    scrollProgress >= 0.72 && scrollProgress <= 0.98;

  const currentPhase =
    scrollProgress < 0.35
      ? 'FOUNDATION'
      : scrollProgress < 0.70
        ? 'SUPERSTRUCTURE'
        : 'ENCLOSURE';

  const progress = Math.round(scrollProgress * 100);

  return (
    <main
      ref={curtainRef}
      className="relative z-20 overflow-hidden border-t border-[#18324A]/10 bg-[#F5F3EE] text-[#18324A]"
    >
      {/* =====================================================
          VIDEO / IMAGE SECTION
      ====================================================== */}

      <div
        ref={videoPinRef}
        className="relative h-screen min-h-[600px] w-full overflow-hidden bg-[#D9D6CE] md:min-h-[680px]"
      >
        {/* MOBILE PORTRAIT IMAGE */}

        <img
          src="/house.jpg"
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-center md:hidden"
        />

        {/* DESKTOP LANDSCAPE VIDEO */}

        <video
          ref={videoRef}
          src="/Construction.mp4"
          muted
          playsInline
          preload="metadata"
          className="absolute inset-0 hidden h-full w-full object-cover md:block"
        />

        {/* IMAGE / VIDEO OVERLAY */}

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#18324A]/30 via-transparent to-[#18324A]/45" />

        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#18324A]/50 to-transparent md:h-48" />

        <div className="pointer-events-none absolute inset-0 bg-[#F5F3EE]/[0.035] mix-blend-soft-light" />

        {/* ARCHITECTURAL GRID */}

        <div className="pointer-events-none absolute inset-0">
          <svg
            className="h-full w-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <line
              x1="5"
              y1="0"
              x2="5"
              y2="100"
              stroke="#18324A"
              strokeOpacity="0.16"
              strokeWidth="0.08"
            />

            <line
              x1="95"
              y1="0"
              x2="95"
              y2="100"
              stroke="#18324A"
              strokeOpacity="0.16"
              strokeWidth="0.08"
            />

            <line
              x1="0"
              y1="84"
              x2="100"
              y2="84"
              stroke="#18324A"
              strokeOpacity="0.14"
              strokeWidth="0.08"
            />

            <line
              x1="50"
              y1="0"
              x2="50"
              y2="100"
              stroke="#18324A"
              strokeOpacity="0.06"
              strokeWidth="0.06"
              strokeDasharray="0.7 1.4"
            />
          </svg>
        </div>

        {/* =================================================
            TOP LEFT LABEL
        ================================================== */}

        <div className="pointer-events-none absolute left-5 top-5 z-30 sm:left-7 sm:top-7 md:left-10 md:top-8">
          <div className="flex items-start gap-2.5 sm:gap-3">
            <div className="mt-1 h-1.5 w-1.5 rounded-full bg-[#D89A24] sm:mt-1.5 sm:h-2 sm:w-2" />

            <div>
              <p className="text-[8px] font-semibold uppercase tracking-[0.22em] text-white drop-shadow-sm sm:text-[9px] md:text-[10px] md:tracking-[0.28em]">
                About the build
              </p>

              <p className="mt-1 font-mono text-[7px] uppercase tracking-[0.13em] text-white/70 sm:text-[8px] md:text-[9px] md:tracking-[0.18em]">
                Structural process / 2026
              </p>
            </div>
          </div>
        </div>

        {/* =================================================
            TOP RIGHT STATUS
        ================================================== */}

        <div className="pointer-events-none absolute right-5 top-5 z-30 text-right sm:right-7 sm:top-7 md:right-10 md:top-8">
          <div className="flex items-center justify-end gap-1.5 sm:gap-2">
            <Activity className="h-3 w-3 text-[#D89A24] sm:h-3.5 sm:w-3.5" />

            <span className="font-mono text-[7px] font-semibold uppercase tracking-[0.14em] text-white sm:text-[8px] md:text-[9px] md:tracking-[0.2em]">
              Construction sequence
            </span>
          </div>

          <div className="mt-1 flex items-center justify-end gap-2">
            <span className="font-mono text-[7px] uppercase tracking-[0.1em] text-white/60 sm:text-[8px] md:text-[9px] md:tracking-[0.12em]">
              {currentPhase}
            </span>

            <span className="font-mono text-[10px] font-bold text-white sm:text-xs">
              {String(progress).padStart(2, '0')}%
            </span>
          </div>
        </div>

        {/* =================================================
            BOTTOM PROGRESS
        ================================================== */}

        <div className="pointer-events-none absolute bottom-6 left-5 z-30 sm:bottom-7 sm:left-7 md:bottom-9 md:left-10">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <span className="font-mono text-[8px] font-bold tracking-[0.12em] text-white sm:text-[9px] sm:tracking-[0.15em]">
              01
            </span>

            <div className="h-px w-12 overflow-hidden bg-white/50 sm:w-16 md:w-24">
              <div
                className="h-full bg-[#D89A24] transition-[width] duration-100"
                style={{ width: `${progress}%` }}
              />
            </div>

            <span className="font-mono text-[8px] tracking-[0.12em] text-white/70 sm:text-[9px] sm:tracking-[0.15em]">
              03
            </span>
          </div>

          <p className="mt-1.5 text-[7px] uppercase tracking-[0.15em] text-white/60 sm:mt-2 sm:text-[8px] md:text-[9px] md:tracking-[0.2em]">
            Scroll to explore
          </p>
        </div>

        {/* =================================================
            PHASE 01
        ================================================== */}

        <AnimatePresence>
          {showPhase1 && (
            <>
              {/* MARKER — POSITION PRESERVED */}

              <div className="pointer-events-none absolute left-[32%] top-[35%] z-30">
                <span className="absolute -inset-2.5 animate-ping rounded-full border border-[#D89A24]/60 sm:-inset-3" />

                <span className="absolute -inset-1.5 rounded-full border border-white/50 sm:-inset-2" />

                <span className="relative flex h-7 w-7 items-center justify-center rounded-full bg-[#D89A24] font-mono text-[10px] font-bold text-[#18324A] shadow-[0_4px_18px_rgba(24,50,74,0.25)] sm:h-8 sm:w-8 sm:text-xs">
                  1
                </span>
              </div>

              <motion.div
                initial={{ opacity: 0, x: -25, y: 8 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                exit={{ opacity: 0, x: -15 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                className="absolute left-4 top-[18%] z-40 w-[calc(100%-2rem)] max-w-[320px] overflow-hidden rounded-sm border border-[#18324A]/15 border-l-4 border-l-[#D89A24] bg-[#F5F3EE]/65 p-4 shadow-[0_20px_60px_rgba(24,50,74,0.16)] backdrop-blur-xl sm:left-[6%] sm:top-[20%] sm:max-w-xs sm:p-5 md:left-[8%] md:max-w-sm md:p-6"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex h-6 w-6 items-center justify-center rounded-sm bg-[#18324A] text-[#D89A24] sm:h-7 sm:w-7">
                      <HardHat className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                    </div>

                    <span className="font-mono text-[7px] font-bold uppercase tracking-[0.15em] text-[#18324A]/60 sm:text-[8px] md:text-[9px] md:tracking-[0.2em]">
                      01 / Foundation
                    </span>
                  </div>

                  <span className="font-mono text-[7px] text-[#18324A]/40 sm:text-[8px] md:text-[9px]">
                    001
                  </span>
                </div>

                <div className="mt-4 sm:mt-5">
                  <h3 className="font-sans text-base font-semibold tracking-tight text-[#18324A] sm:text-lg">
                    Hydraulic Crane Rigging
                  </h3>

                  <p className="mt-2 text-[11px] leading-5 text-[#5F7890] sm:text-xs sm:leading-6">
                    Precision off-site precast panel positioning using
                    controlled heavy-lift systems and coordinated site
                    operations.
                  </p>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-[#18324A]/10 pt-3 sm:mt-5">
                  <span className="font-mono text-[7px] uppercase tracking-[0.14em] text-[#18324A]/45 sm:text-[8px] sm:tracking-[0.18em]">
                    Structural system
                  </span>

                  <ArrowUpRight className="h-3 w-3 text-[#D89A24] sm:h-3.5 sm:w-3.5" />
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* =================================================
            PHASE 02
        ================================================== */}

        <AnimatePresence>
          {showPhase2 && (
            <>
              {/* MARKER — POSITION PRESERVED */}

              <div className="pointer-events-none absolute left-[55%] top-[48%] z-30">
                <span className="absolute -inset-2.5 animate-ping rounded-full border border-[#D89A24]/60 sm:-inset-3" />

                <span className="absolute -inset-1.5 rounded-full border border-white/50 sm:-inset-2" />

                <span className="relative flex h-7 w-7 items-center justify-center rounded-full bg-[#D89A24] font-mono text-[10px] font-bold text-[#18324A] shadow-[0_4px_18px_rgba(24,50,74,0.25)] sm:h-8 sm:w-8 sm:text-xs">
                  2
                </span>
              </div>

              <motion.div
                initial={{ opacity: 0, x: 25, y: 8 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                exit={{ opacity: 0, x: 15 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                className="absolute right-4 top-[35%] z-40 w-[calc(100%-2rem)] max-w-[320px] overflow-hidden rounded-sm border border-[#18324A]/15 border-r-4 border-r-[#D89A24] bg-[#F5F3EE]/65 p-4 shadow-[0_20px_60px_rgba(24,50,74,0.16)] backdrop-blur-xl sm:right-[6%] sm:top-[38%] sm:max-w-xs sm:p-5 md:right-[8%] md:max-w-sm md:p-6"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex h-6 w-6 items-center justify-center rounded-sm bg-[#18324A] text-[#D89A24] sm:h-7 sm:w-7">
                      <Layers3 className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                    </div>

                    <span className="font-mono text-[7px] font-bold uppercase tracking-[0.15em] text-[#18324A]/60 sm:text-[8px] md:text-[9px] md:tracking-[0.2em]">
                      02 / Structure
                    </span>
                  </div>

                  <span className="font-mono text-[7px] text-[#18324A]/40 sm:text-[8px] md:text-[9px]">
                    002
                  </span>
                </div>

                <div className="mt-4 sm:mt-5">
                  <h3 className="font-sans text-base font-semibold tracking-tight text-[#18324A] sm:text-lg">
                    Precast Concrete Envelope
                  </h3>

                  <p className="mt-2 text-[11px] leading-5 text-[#5F7890] sm:text-xs sm:leading-6">
                    Load-bearing insulated sandwich wall panels engineered
                    for thermal performance, structural stability and
                    long-term durability.
                  </p>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-[#18324A]/10 pt-3 sm:mt-5">
                  <span className="font-mono text-[7px] uppercase tracking-[0.14em] text-[#18324A]/45 sm:text-[8px] sm:tracking-[0.18em]">
                    Envelope assembly
                  </span>

                  <ArrowUpRight className="h-3 w-3 text-[#D89A24] sm:h-3.5 sm:w-3.5" />
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* =================================================
            PHASE 03
        ================================================== */}

        <AnimatePresence>
          {showPhase3 && (
            <>
              {/* MARKER — POSITION PRESERVED */}

              <div className="pointer-events-none absolute left-[52%] top-[28%] z-30">
                <span className="absolute -inset-2.5 animate-ping rounded-full border border-[#D89A24]/60 sm:-inset-3" />

                <span className="absolute -inset-1.5 rounded-full border border-white/50 sm:-inset-2" />

                <span className="relative flex h-7 w-7 items-center justify-center rounded-full bg-[#D89A24] font-mono text-[10px] font-bold text-[#18324A] shadow-[0_4px_18px_rgba(24,50,74,0.25)] sm:h-8 sm:w-8 sm:text-xs">
                  3
                </span>
              </div>

              <motion.div
                initial={{ opacity: 0, y: -25 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                className="absolute right-4 top-[13%] z-40 w-[calc(100%-2rem)] max-w-[320px] overflow-hidden rounded-sm border border-[#18324A]/15 border-t-4 border-t-[#D89A24] bg-[#F5F3EE]/65 p-4 shadow-[0_20px_60px_rgba(24,50,74,0.16)] backdrop-blur-xl sm:right-[6%] sm:top-[15%] sm:max-w-xs sm:p-5 md:right-[12%] md:max-w-sm md:p-6"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex h-6 w-6 items-center justify-center rounded-sm bg-[#18324A] text-[#D89A24] sm:h-7 sm:w-7">
                      <ShieldCheck className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                    </div>

                    <span className="font-mono text-[7px] font-bold uppercase tracking-[0.15em] text-[#18324A]/60 sm:text-[8px] md:text-[9px] md:tracking-[0.2em]">
                      03 / Enclosure
                    </span>
                  </div>

                  <span className="font-mono text-[7px] text-[#18324A]/40 sm:text-[8px] md:text-[9px]">
                    003
                  </span>
                </div>

                <div className="mt-4 sm:mt-5">
                  <h3 className="font-sans text-base font-semibold tracking-tight text-[#18324A] sm:text-lg">
                    Engineered Roof Trusses
                  </h3>

                  <p className="mt-2 text-[11px] leading-5 text-[#5F7890] sm:text-xs sm:leading-6">
                    Lightweight steel roof systems engineered for structural
                    efficiency, environmental loads and precise final
                    assembly.
                  </p>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-[#18324A]/10 pt-3 sm:mt-5">
                  <span className="font-mono text-[7px] uppercase tracking-[0.14em] text-[#18324A]/45 sm:text-[8px] sm:tracking-[0.18em]">
                    Structural closure
                  </span>

                  <ArrowUpRight className="h-3 w-3 text-[#D89A24] sm:h-3.5 sm:w-3.5" />
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>

      {/* =========================================================
          ABOUT DESCRIPTION
      ========================================================== */}

      <section
        ref={aboutSectionRef}
        className="relative min-h-screen overflow-hidden bg-[#F5F3EE] px-5 py-20 sm:px-8 sm:py-24 md:px-16 md:py-28 lg:px-24 lg:py-32"
      >
        {/* ARCHITECTURAL DETAIL */}

        <div className="absolute right-0 top-0 h-full w-px bg-[#18324A]/10" />

        <div className="absolute left-[8%] top-0 hidden h-full w-px bg-[#18324A]/5 sm:block" />

        <div className="absolute left-0 top-[42%] h-px w-full bg-[#18324A]/[0.035]" />

        <div className="absolute bottom-[17%] left-0 h-px w-full bg-[#18324A]/[0.035]" />

        <div className="relative mx-auto max-w-6xl">
          {/* =================================================
              SECTION LABEL
          ================================================== */}

          <div
            ref={aboutLabelRef}
            className="flex items-center gap-3 overflow-hidden border-b border-[#18324A]/10 pb-4 sm:gap-4 sm:pb-5"
          >
            <span
              ref={aboutNumberRef}
              className="font-mono text-[9px] font-bold tracking-[0.18em] text-[#D89A24] sm:text-[10px] sm:tracking-[0.2em]"
            >
              01
            </span>

            <span
              ref={aboutLineRef}
              className="h-px w-7 bg-[#D89A24] sm:w-10"
            />

            <span
              ref={aboutLabelTextRef}
              className="text-[8px] font-semibold uppercase tracking-[0.18em] text-[#18324A]/50 sm:text-[9px] sm:tracking-[0.25em] md:text-[10px]"
            >
              About the company
            </span>
          </div>

          {/* =================================================
              MAIN CONTENT
          ================================================== */}

          <div className="mt-12 grid gap-12 sm:mt-14 md:mt-16 md:gap-16 lg:grid-cols-[1.3fr_0.7fr] lg:gap-24">
            {/* LEFT */}

            <div>
              <h2
                ref={aboutHeadingRef}
                className="max-w-4xl text-[clamp(2.35rem,8vw,5rem)] font-semibold leading-[0.98] tracking-[-0.045em] text-[#18324A]"
              >
                <span className="block overflow-hidden">
                  <span ref={headingLine1Ref} className="inline-block">
                    Building with
                  </span>
                </span>

                <span className="block overflow-hidden">
                  <span ref={headingLine2Ref} className="inline-block">
                    <span
                      ref={headingAccentRef}
                      className="text-[#D89A24]"
                    >
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

              <p
                ref={aboutDescriptionRef}
                className="mt-7 max-w-2xl text-sm leading-6 text-[#5F7890] sm:mt-8 sm:text-base sm:leading-7 md:text-lg md:leading-8"
              >
                Our approach combines engineered systems, controlled
                fabrication and precise site execution to create structures
                that are efficient, resilient and built for the long term.
              </p>
            </div>

            {/* RIGHT */}

            <div
              ref={approachRef}
              className="lg:pt-3"
            >
              <div className="relative pl-5 sm:pl-6">
                <div
                  ref={approachLineRef}
                  className="absolute left-0 top-0 h-full w-px bg-[#D89A24]"
                />

                <p
                  ref={approachLabelRef}
                  className="font-mono text-[8px] uppercase tracking-[0.17em] text-[#18324A]/45 sm:text-[9px] sm:tracking-[0.2em]"
                >
                  Our approach
                </p>

                <p
                  ref={approachTextRef}
                  className="mt-3 text-[13px] leading-6 text-[#18324A] sm:mt-4 sm:text-sm sm:leading-7"
                >
                  From foundation to final enclosure, every stage is treated
                  as part of one coordinated structural system.
                </p>
              </div>

              {/* =================================================
                  STATS
              ================================================== */}

              <div
                ref={statsRef}
                className="mt-10 grid grid-cols-2 border-t border-[#18324A]/10 sm:mt-12"
              >
                <div
                  ref={statOneRef}
                  className="overflow-hidden border-r border-[#18324A]/10 py-4 pr-4 sm:py-5 sm:pr-5"
                >
                  <div className="overflow-hidden">
                    <p
                      ref={statOneNumberRef}
                      className="font-mono text-xl font-semibold text-[#18324A] sm:text-2xl"
                    >
                      01
                    </p>
                  </div>

                  <p className="mt-1.5 text-[8px] uppercase tracking-[0.12em] text-[#18324A]/45 sm:mt-2 sm:text-[9px] sm:tracking-[0.15em]">
                    Integrated process
                  </p>
                </div>

                <div
                  ref={statTwoRef}
                  className="overflow-hidden py-4 pl-4 sm:py-5 sm:pl-5"
                >
                  <div className="overflow-hidden">
                    <p
                      ref={statTwoNumberRef}
                      className="font-mono text-xl font-semibold text-[#18324A] sm:text-2xl"
                    >
                      03
                    </p>
                  </div>

                  <p className="mt-1.5 text-[8px] uppercase tracking-[0.12em] text-[#18324A]/45 sm:mt-2 sm:text-[9px] sm:tracking-[0.15em]">
                    Construction phases
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* =================================================
              BOTTOM STATEMENT
          ================================================== */}

          <div
            ref={bottomStatementRef}
            className="relative mt-16 flex flex-col gap-5 overflow-hidden pt-5 sm:mt-20 sm:gap-6 sm:pt-6 md:mt-24 md:flex-row md:items-center md:justify-between"
          >
            <div
              ref={bottomBorderRef}
              className="absolute left-0 top-0 h-px w-full bg-[#18324A]/10"
            />

            <span
              ref={bottomLeftRef}
              className="max-w-md font-mono text-[7px] uppercase tracking-[0.15em] text-[#18324A]/40 sm:text-[8px] sm:tracking-[0.2em] md:text-[9px]"
            >
              Structural engineering / Prefabrication / Construction
            </span>

            <span
              ref={bottomRightRef}
              className="font-mono text-[8px] uppercase tracking-[0.16em] text-[#D89A24] sm:text-[9px] sm:tracking-[0.2em]"
            >
              Built with intention
            </span>
          </div>
        </div>
      </section>
    </main>
  );
}

