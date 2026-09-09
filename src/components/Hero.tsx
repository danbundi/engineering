
import { useEffect, useRef } from 'react';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);

  const wallRef = useRef<HTMLDivElement>(null);
  const wallInnerRef = useRef<HTMLDivElement>(null);
  const scanLineRef = useRef<HTMLDivElement>(null);

  const apexRef = useRef<HTMLSpanElement>(null);
  const structuralRef = useRef<HTMLSpanElement>(null);
  const engineeringRef = useRef<HTMLSpanElement>(null);

  const lineRef = useRef<HTMLDivElement>(null);
  const coordinateRef = useRef<HTMLDivElement>(null);
  const bottomTextRef = useRef<HTMLDivElement>(null);

  const frameRef = useRef<HTMLDivElement>(null);
  const crosshairRef = useRef<HTMLDivElement>(null);

  const headerLeftRef = useRef<HTMLDivElement>(null);
  const headerRightRef = useRef<HTMLDivElement>(null);
  const loadIndicatorRef = useRef<HTMLDivElement>(null);

  const systemLabelRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const measurementRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;

      if (!section) return;

      /*
      ============================================================
      INITIAL STATES
      ============================================================
      */

      gsap.set(wallRef.current, {
        xPercent: -125,
        rotation: -32,
        transformOrigin: 'center center',
      });

      gsap.set(wallInnerRef.current, {
        opacity: 0,
      });

      gsap.set(scanLineRef.current, {
        yPercent: -120,
        opacity: 0,
      });

      /*
      APEX starts hidden for the load animation.
      It is NOT faded out by the scroll timeline anymore.
      */

      gsap.set(apexRef.current, {
        y: 45,
        opacity: 0,
      });

      gsap.set(structuralRef.current, {
        y: 45,
        opacity: 0,
      });

      gsap.set(engineeringRef.current, {
        y: 15,
        opacity: 0,
      });

      gsap.set(lineRef.current, {
        scaleX: 0,
        transformOrigin: 'left center',
      });

      gsap.set(coordinateRef.current, {
        opacity: 0,
        y: 10,
      });

      gsap.set(bottomTextRef.current, {
        opacity: 0,
        y: 15,
      });

      gsap.set(frameRef.current, {
        opacity: 0,
        scale: 0.85,
      });

      gsap.set(crosshairRef.current, {
        opacity: 0,
        scale: 0.5,
      });

      gsap.set(headerLeftRef.current, {
        opacity: 0,
        y: -10,
      });

      gsap.set(headerRightRef.current, {
        opacity: 0,
        y: -10,
      });

      gsap.set(loadIndicatorRef.current, {
        opacity: 0,
        y: 10,
      });

      gsap.set(systemLabelRef.current, {
        opacity: 0,
        y: 8,
      });

      gsap.set(progressRef.current, {
        opacity: 0,
      });

      gsap.set(measurementRef.current, {
        scaleX: 0,
        transformOrigin: 'left center',
      });

      /*
      ============================================================
      PAGE LOAD INTRO
      ============================================================
      */

      const intro = gsap.timeline({
        defaults: {
          ease: 'power3.out',
        },
      });

      intro.to(headerLeftRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.6,
      });

      intro.to(
        headerRightRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
        },
        '-=0.45',
      );

      /*
      MAIN BRAND

      This is deliberately independent from ScrollTrigger.
      Once APEX appears, it remains the visual anchor.
      */

      intro.to(
        apexRef.current,
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: 'power4.out',
        },
        '-=0.25',
      );

      intro.to(
        lineRef.current,
        {
          scaleX: 1,
          duration: 0.7,
          ease: 'power3.out',
        },
        '-=0.5',
      );

      intro.to(
        systemLabelRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.45,
        },
        '-=0.3',
      );

      intro.to(
        loadIndicatorRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
        },
        '-=0.2',
      );

      intro.to(
        progressRef.current,
        {
          opacity: 1,
          duration: 0.4,
        },
        '-=0.25',
      );

      /*
      ============================================================
      SCROLL TIMELINE
      ============================================================
      */

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=450%',
          pin: true,
          scrub: 0.8,
          invalidateOnRefresh: true,
        },
      });

      /*
      ------------------------------------------------------------
      WALL ENTERS
      ------------------------------------------------------------
      */

      tl.to(wallRef.current, {
        xPercent: -15,
        rotation: -32,
        duration: 1.25,
        ease: 'power2.inOut',
      });

      /*
      ------------------------------------------------------------
      WALL DETAILS
      ------------------------------------------------------------
      */

      tl.to(
        wallInnerRef.current,
        {
          opacity: 1,
          duration: 0.45,
        },
        '-=0.65',
      );

      /*
      ------------------------------------------------------------
      SCAN LINE
      ------------------------------------------------------------
      */

      tl.to(
        scanLineRef.current,
        {
          yPercent: 120,
          opacity: 1,
          duration: 0.9,
          ease: 'none',
        },
        '-=0.25',
      );

      /*
      ------------------------------------------------------------
      STRUCTURAL
      ------------------------------------------------------------

      APEX is already visible.
      STRUCTURAL now joins it.
      */

      tl.to(
        structuralRef.current,
        {
          y: 0,
          opacity: 1,
          duration: 0.55,
          ease: 'power3.out',
        },
        '-=0.35',
      );

      /*
      ------------------------------------------------------------
      ENGINEERING LABEL
      ------------------------------------------------------------
      */

      tl.to(
        engineeringRef.current,
        {
          y: 0,
          opacity: 1,
          duration: 0.4,
        },
        '-=0.3',
      );

      /*
      ------------------------------------------------------------
      CROSSHAIR
      ------------------------------------------------------------
      */

      tl.to(
        crosshairRef.current,
        {
          opacity: 1,
          scale: 1,
          duration: 0.4,
          ease: 'back.out(1.5)',
        },
        '-=0.15',
      );

      /*
      ------------------------------------------------------------
      TECHNICAL DATA
      ------------------------------------------------------------
      */

      tl.to(
        coordinateRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.35,
        },
        '-=0.15',
      );

      /*
      ------------------------------------------------------------
      MEASUREMENT
      ------------------------------------------------------------
      */

      tl.to(
        measurementRef.current,
        {
          scaleX: 1,
          duration: 0.65,
          ease: 'power2.out',
        },
        '-=0.2',
      );

      /*
      ------------------------------------------------------------
      WALL PASSES THROUGH
      ------------------------------------------------------------
      */

      tl.to(wallRef.current, {
        xPercent: 65,
        rotation: -32,
        duration: 1.45,
        ease: 'power2.inOut',
      });

      /*
      ------------------------------------------------------------
      STRUCTURAL FRAME
      ------------------------------------------------------------
      */

      tl.to(
        frameRef.current,
        {
          opacity: 1,
          scale: 1,
          duration: 0.65,
          ease: 'power3.out',
        },
        '-=0.65',
      );

      /*
      ------------------------------------------------------------
      FINAL STATEMENT
      ------------------------------------------------------------
      */

      tl.to(
        bottomTextRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
        },
        '-=0.3',
      );

      /*
      IMPORTANT:

      We intentionally DO NOT fade APEX out here.

      That was the main reason the brand could disappear
      and become unreliable when scrolling back upward.

      APEX stays present as the identity anchor.
      */

      tl.to(
        [
          structuralRef.current,
          engineeringRef.current,
          lineRef.current,
          coordinateRef.current,
          bottomTextRef.current,
          frameRef.current,
          crosshairRef.current,
          systemLabelRef.current,
          loadIndicatorRef.current,
          progressRef.current,
        ],
        {
          opacity: 0,
          duration: 0.5,
        },
        '+=0.45',
      );
    },
    { scope: sectionRef },
  );

  /*
  ================================================================
  MOUSE PARALLAX
  Desktop only
  ================================================================
  */

  useEffect(() => {
    const section = sectionRef.current;
    const wall = wallRef.current;

    if (!section || !wall) return;

    const mediaQuery = window.matchMedia(
      '(hover: hover) and (pointer: fine)',
    );

    if (!mediaQuery.matches) return;

    const handleMouseMove = (event: MouseEvent) => {
      const x = (event.clientX / window.innerWidth - 0.5) * 2;
      const y = (event.clientY / window.innerHeight - 0.5) * 2;

      gsap.to(wall, {
        x: x * 8,
        y: y * 4,
        duration: 1.2,
        ease: 'power3.out',
        overwrite: 'auto',
      });
    };

    section.addEventListener('mousemove', handleMouseMove);

    return () => {
      section.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative h-screen min-h-[620px] w-full overflow-hidden bg-[#F5F3EE] text-[#18324A]"
    >
      {/* =====================================================
          ARCHITECTURAL GRID
      ====================================================== */}

      <div className="pointer-events-none absolute inset-0 opacity-30 md:opacity-40">
        <div className="absolute left-[6%] top-0 h-full w-px bg-[#18324A]/10 md:left-[8%]" />
        <div className="absolute left-[94%] top-0 h-full w-px bg-[#18324A]/10 md:left-[92%]" />
        <div className="absolute left-0 top-[20%] h-px w-full bg-[#18324A]/10 md:top-[18%]" />
        <div className="absolute left-0 top-[80%] h-px w-full bg-[#18324A]/10 md:top-[82%]" />
      </div>

      {/* =====================================================
          HEADER
      ====================================================== */}

      <div
        ref={headerLeftRef}
        className="absolute left-[6%] top-6 z-40 flex items-center gap-3 md:left-[8%] md:top-8 md:gap-4"
      >
        <span className="font-mono text-[8px] tracking-[0.22em] text-[#D89A24] md:text-[9px] md:tracking-[0.25em]">
          APEX
        </span>

        <span className="h-px w-5 bg-[#18324A]/20 md:w-8" />

        <span className="text-[8px] tracking-[0.16em] text-[#5F7890] md:text-[9px] md:tracking-[0.2em]">
          STRUCTURAL
        </span>
      </div>

      <div
        ref={headerRightRef}
        className="absolute right-[6%] top-6 z-40 font-mono text-[8px] tracking-[0.18em] text-[#5F7890] md:right-[8%] md:top-8 md:text-[9px] md:tracking-[0.2em]"
      >
        EST. 2026
      </div>

      {/* =====================================================
          SMALL SYSTEM LABEL
      ====================================================== */}

      <div
        ref={systemLabelRef}
        className="absolute left-[6%] top-[28%] z-30 sm:left-[8%] sm:top-[30%]"
      >
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-[#D89A24]" />

          <span className="font-mono text-[6px] tracking-[0.2em] text-[#5F7890] sm:text-[7px]">
            STRUCTURAL SYSTEM / 01
          </span>
        </div>
      </div>

      {/* =====================================================
          CONCRETE WALL
      ====================================================== */}

      <div
        ref={wallRef}
        className="absolute left-[-45%] top-[-15%] z-10 h-[135%] w-[78%] bg-[#D9D6CE] shadow-[15px_0_45px_rgba(24,50,74,0.07)] sm:left-[-35%] sm:top-[-18%] sm:h-[140%] sm:w-[65%] md:left-[-25%] md:top-[-20%] md:h-[150%] md:w-[52%] md:shadow-[20px_0_60px_rgba(24,50,74,0.08)]"
      >
        <div
          ref={wallInnerRef}
          className="absolute inset-0 opacity-0"
        >
          <div className="absolute left-[15%] top-0 h-full w-px bg-[#18324A]/10" />
          <div className="absolute left-[55%] top-0 h-full w-px bg-[#18324A]/10" />
          <div className="absolute left-[78%] top-0 h-full w-px bg-[#18324A]/10" />

          <div className="absolute left-0 top-[22%] h-px w-full bg-[#18324A]/10" />
          <div className="absolute left-0 top-[65%] h-px w-full bg-[#18324A]/10" />

          <div className="absolute bottom-[12%] left-[15%] whitespace-nowrap font-mono text-[7px] tracking-[0.14em] text-[#5F7890] md:text-[8px] md:tracking-[0.18em]">
            STRUCTURAL PLANE / 01
          </div>

          <div className="absolute right-[10%] top-[30%] h-11 w-11 border border-[#18324A]/15 md:right-[12%] md:h-16 md:w-16" />

          <div className="absolute right-[10%] top-[30%] h-px w-16 bg-[#D89A24]/50 md:right-[12%] md:w-24" />

          <div className="absolute right-[10%] top-[30%] w-16 translate-y-2 text-right font-mono text-[6px] tracking-[0.12em] text-[#5F7890] md:right-[12%] md:w-24 md:translate-y-3 md:text-[7px] md:tracking-[0.15em]">
            LOAD PATH
          </div>

          <div className="absolute right-[7%] top-[50%] flex items-center gap-1.5 md:right-[8%] md:gap-2">
            <div className="h-px w-5 bg-[#18324A]/20 md:w-8" />

            <span className="font-mono text-[6px] text-[#5F7890] md:text-[7px]">
              2400
            </span>
          </div>
        </div>

        <div
          ref={scanLineRef}
          className="absolute left-0 top-0 h-px w-full bg-[#D89A24]/60 shadow-[0_0_10px_rgba(216,154,36,0.22)]"
        />
      </div>

      {/* =====================================================
          MAIN TYPOGRAPHY
      ====================================================== */}

      <div className="absolute inset-0 z-20 flex items-center px-[6%] sm:px-[8%]">
        <div className="relative w-full max-w-5xl">

          <div className="mb-3 overflow-hidden sm:mb-4 md:mb-5">
            <span
              ref={apexRef}
              className="block text-[clamp(3.2rem,13vw,7.5rem)] font-medium leading-[0.86] tracking-[-0.06em] text-[#18324A] sm:text-[clamp(3.8rem,11vw,7.5rem)] md:text-[clamp(3.5rem,8vw,7.5rem)]"
            >
              APEX
            </span>
          </div>

          <div className="overflow-hidden">
            <span
              ref={structuralRef}
              className="block text-[clamp(2.9rem,11.5vw,7.5rem)] font-medium leading-[0.86] tracking-[-0.06em] text-[#18324A] sm:text-[clamp(3.5rem,10vw,7.5rem)] md:text-[clamp(3.5rem,8vw,7.5rem)]"
            >
              STRUCTURAL
            </span>
          </div>

          <div
            ref={lineRef}
            className="mt-6 h-px w-[min(260px,55vw)] bg-[#D89A24] sm:mt-7 sm:w-[min(340px,50vw)] md:mt-8 md:w-[min(420px,45vw)]"
          />

          <div className="mt-3 overflow-hidden sm:mt-4">
            <span
              ref={engineeringRef}
              className="block max-w-[280px] font-mono text-[7px] leading-4 tracking-[0.18em] text-[#5F7890] sm:max-w-none sm:text-[8px] md:text-[9px] md:tracking-[0.25em]"
            >
              STRUCTURAL ENGINEERING / CONSTRUCTION
            </span>
          </div>
        </div>
      </div>

      {/* =====================================================
          MEASUREMENT DETAIL
      ====================================================== */}

      <div className="absolute right-[7%] top-[18%] z-30 hidden items-center gap-2 sm:flex md:right-[10%]">
        <span className="font-mono text-[6px] tracking-[0.16em] text-[#5F7890] md:text-[7px]">
          2400 MM
        </span>

        <div
          ref={measurementRef}
          className="h-px w-10 bg-[#18324A]/30 md:w-16"
        />

        <span className="font-mono text-[6px] text-[#5F7890] md:text-[7px]">
          ┤
        </span>
      </div>

      {/* =====================================================
          STRUCTURAL FRAME
      ====================================================== */}

      <div
        ref={frameRef}
        className="pointer-events-none absolute right-[7%] top-[28%] z-20 h-[32%] w-[25%] opacity-0 sm:right-[10%] sm:top-[27%] sm:h-[38%] sm:w-[22%] md:right-[13%] md:top-[27%] md:h-[46%] md:w-[20%]"
      >
        <div className="absolute left-0 top-0 h-px w-full bg-[#18324A]/20" />
        <div className="absolute bottom-0 left-0 h-px w-full bg-[#18324A]/20" />
        <div className="absolute left-0 top-0 h-full w-px bg-[#18324A]/20" />
        <div className="absolute right-0 top-0 h-full w-px bg-[#18324A]/20" />
        <div className="absolute left-[50%] top-0 h-full w-px bg-[#D89A24]/30" />
        <div className="absolute left-0 top-[50%] h-px w-full bg-[#D89A24]/30" />
      </div>

      {/* =====================================================
          CROSSHAIR
      ====================================================== */}

      <div
        ref={crosshairRef}
        className="pointer-events-none absolute right-[24%] top-[23%] z-30 h-6 w-6 sm:right-[27%] sm:top-[24%] sm:h-7 sm:w-7 md:right-[32%] md:top-[26%] md:h-8 md:w-8"
      >
        <div className="absolute left-1/2 top-0 h-full w-px bg-[#D89A24]/60" />
        <div className="absolute left-0 top-1/2 h-px w-full bg-[#D89A24]/60" />
        <div className="absolute left-1/2 top-1/2 h-1 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#D89A24] md:h-1.5 md:w-1.5" />
      </div>

      {/* =====================================================
          TECHNICAL DATA
      ====================================================== */}

      <div
        ref={coordinateRef}
        className="absolute bottom-[19%] right-[6%] z-20 sm:right-[8%] md:bottom-[18%]"
      >
        <div className="flex items-start gap-3 sm:gap-4 md:gap-5">
          <div className="h-9 w-px bg-[#18324A]/15 sm:h-10 md:h-12" />

          <div className="font-mono text-[6px] leading-4 tracking-[0.1em] text-[#5F7890] sm:text-[7px] sm:leading-5 md:text-[8px] md:tracking-[0.14em]">
            <div>LAT 01°17′S</div>
            <div>LON 36°49′E</div>
            <div>STRUCT / 001</div>
          </div>
        </div>
      </div>

      {/* =====================================================
          BOTTOM STATEMENT
      ====================================================== */}

      <div
        ref={bottomTextRef}
        className="absolute bottom-6 left-[6%] right-[6%] z-30 flex flex-col gap-5 sm:bottom-7 sm:left-[8%] sm:right-[8%] sm:flex-row sm:items-end sm:justify-between md:bottom-8"
      >
        <div className="max-w-[210px] sm:max-w-xs">
          <p className="text-[10px] leading-4 text-[#5F7890] sm:text-xs sm:leading-5">
            Engineering spaces that carry weight,
            purpose, and time.
          </p>
        </div>

        <div className="flex items-center gap-2.5 sm:gap-3">
          <span className="font-mono text-[6px] tracking-[0.16em] text-[#5F7890] sm:text-[7px] sm:tracking-[0.2em] md:text-[8px]">
            SCROLL TO EXPLORE
          </span>

          <div className="h-px w-6 bg-[#18324A]/25 sm:w-8 md:w-10" />

          <div className="h-1.5 w-1.5 rounded-full bg-[#D89A24]" />
        </div>
      </div>

      {/* =====================================================
          LOAD INDICATOR
      ====================================================== */}

      <div
        ref={loadIndicatorRef}
        className="absolute bottom-[13%] left-[6%] z-30 flex items-center gap-3 sm:bottom-[14%] sm:left-[8%]"
      >
        <div className="relative h-5 w-px overflow-hidden bg-[#18324A]/15">
          <div className="absolute bottom-0 left-0 h-1/2 w-full bg-[#D89A24]" />
        </div>

        <span className="font-mono text-[6px] uppercase tracking-[0.18em] text-[#5F7890] sm:text-[7px] sm:tracking-[0.2em]">
          Scroll to unfold
        </span>
      </div>

      {/* =====================================================
          PROGRESS DETAIL
      ====================================================== */}

      <div
        ref={progressRef}
        className="absolute bottom-6 right-[18%] z-30 hidden items-center gap-2 sm:flex md:right-[16%]"
      >
        <span className="font-mono text-[6px] tracking-[0.15em] text-[#18324A]/40">
          01
        </span>

        <div className="h-px w-8 bg-[#18324A]/15 md:w-12" />

        <span className="font-mono text-[6px] tracking-[0.15em] text-[#18324A]/40">
          04
        </span>
      </div>

      {/* =====================================================
          CORNER MARK
      ====================================================== */}

      <div className="absolute bottom-6 right-[6%] z-30 sm:bottom-7 sm:right-[8%] md:bottom-8">
        <div className="relative h-4 w-4 sm:h-5 sm:w-5">
          <div className="absolute right-0 top-0 h-px w-4 bg-[#18324A]/30 sm:w-5" />
          <div className="absolute right-0 top-0 h-4 w-px bg-[#18324A]/30 sm:h-5" />
        </div>
      </div>
    </section>
  );
}

