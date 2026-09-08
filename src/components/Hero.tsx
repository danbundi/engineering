
import React, { useRef } from 'react';

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

  useGSAP(
    () => {
      const section = sectionRef.current;

      if (!section) return;

      /*
       * -------------------------------------------------------
       * INITIAL STATE
       * -------------------------------------------------------
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

      /*
       * -------------------------------------------------------
       * SCROLL TIMELINE
       * -------------------------------------------------------
       */

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=450%',
          pin: true,
          scrub: 0.8,
        },
      });

      /*
       * 01
       * WALL ENTERS
       */

      tl.to(wallRef.current, {
        xPercent: -15,
        rotation: -32,
        duration: 1.25,
        ease: 'power2.inOut',
      });

      /*
       * 02
       * WALL DETAILS
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
       * 03
       * SCANNING LINE
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
       * 04
       * APEX
       */

      tl.to(
        apexRef.current,
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          ease: 'power3.out',
        },
        '-=0.45',
      );

      /*
       * 05
       * STRUCTURAL
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
       * 06
       * ACCENT LINE
       */

      tl.to(
        lineRef.current,
        {
          scaleX: 1,
          duration: 0.65,
          ease: 'power2.out',
        },
        '-=0.25',
      );

      /*
       * 07
       * SUBTITLE
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
       * 08
       * CROSSHAIR
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
       * 09
       * TECHNICAL DATA
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
       * 10
       * WALL PASSES THROUGH
       */

      tl.to(wallRef.current, {
        xPercent: 65,
        rotation: -32,
        duration: 1.45,
        ease: 'power2.inOut',
      });

      /*
       * 11
       * STRUCTURAL FRAME
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
       * 12
       * FINAL STATEMENT
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
       * 13
       * EXIT
       */

      tl.to(
        [
          apexRef.current,
          structuralRef.current,
          engineeringRef.current,
          lineRef.current,
          coordinateRef.current,
          bottomTextRef.current,
          frameRef.current,
          crosshairRef.current,
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
   * ---------------------------------------------------------
   * SUBTLE MOUSE PARALLAX
   * ---------------------------------------------------------
   */

  React.useEffect(() => {
    const section = sectionRef.current;
    const wall = wallRef.current;

    if (!section || !wall) return;

    const handleMouseMove = (event: MouseEvent) => {
      const x = (event.clientX / window.innerWidth - 0.5) * 2;
      const y = (event.clientY / window.innerHeight - 0.5) * 2;

      gsap.to(wall, {
        x: `+=${x * 8}`,
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
      className="relative h-screen w-full overflow-hidden bg-[#F5F3EE] text-[#18324A]"
    >

      {/* =====================================================
          ARCHITECTURAL GRID
      ===================================================== */}

      <div className="pointer-events-none absolute inset-0 opacity-40">

        <div className="absolute left-[8%] top-0 h-full w-px bg-[#18324A]/10" />

        <div className="absolute left-[92%] top-0 h-full w-px bg-[#18324A]/10" />

        <div className="absolute left-0 top-[18%] h-px w-full bg-[#18324A]/10" />

        <div className="absolute left-0 top-[82%] h-px w-full bg-[#18324A]/10" />

      </div>

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="absolute left-[8%] top-8 z-40 flex items-center gap-4">

        <span className="font-mono text-[9px] tracking-[0.25em] text-[#D89A24]">
          APEX
        </span>

        <span className="h-px w-8 bg-[#18324A]/20" />

        <span className="text-[9px] tracking-[0.2em] text-[#5F7890]">
          STRUCTURAL
        </span>

      </div>

      <div className="absolute right-[8%] top-8 z-40 font-mono text-[9px] tracking-[0.2em] text-[#5F7890]">
        EST. 2026
      </div>

      {/* =====================================================
          CONCRETE WALL
      ===================================================== */}

      <div
        ref={wallRef}
        className="absolute left-[-25%] top-[-20%] z-10 h-[150%] w-[52%] bg-[#D9D6CE] shadow-[20px_0_60px_rgba(24,50,74,0.08)]"
      >

        <div
          ref={wallInnerRef}
          className="absolute inset-0 opacity-0"
        >

          {/* Vertical construction lines */}

          <div className="absolute left-[15%] top-0 h-full w-px bg-[#18324A]/10" />

          <div className="absolute left-[55%] top-0 h-full w-px bg-[#18324A]/10" />

          <div className="absolute left-[78%] top-0 h-full w-px bg-[#18324A]/10" />

          {/* Horizontal construction lines */}

          <div className="absolute left-0 top-[22%] h-px w-full bg-[#18324A]/10" />

          <div className="absolute left-0 top-[65%] h-px w-full bg-[#18324A]/10" />

          {/* Wall label */}

          <div className="absolute bottom-[12%] left-[15%] font-mono text-[8px] tracking-[0.18em] text-[#5F7890]">
            STRUCTURAL PLANE / 01
          </div>

          {/* Load path indicator */}

          <div className="absolute right-[12%] top-[30%] h-16 w-16 border border-[#18324A]/15" />

          <div className="absolute right-[12%] top-[30%] h-px w-24 bg-[#D89A24]/50" />

          <div className="absolute right-[12%] top-[30%] w-24 translate-y-3 text-right font-mono text-[7px] tracking-[0.15em] text-[#5F7890]">
            LOAD PATH
          </div>

          {/* Measurement ticks */}

          <div className="absolute right-[8%] top-[50%] flex items-center gap-2">
            <div className="h-px w-8 bg-[#18324A]/20" />

            <span className="font-mono text-[7px] text-[#5F7890]">
              2400
            </span>
          </div>

        </div>

        {/* Moving scan line */}

        <div
          ref={scanLineRef}
          className="absolute left-0 top-0 h-px w-full bg-[#D89A24]/60 shadow-[0_0_12px_rgba(216,154,36,0.25)]"
        />

      </div>

      {/* =====================================================
          MAIN TYPOGRAPHY
      ===================================================== */}

      <div className="absolute inset-0 z-20 flex items-center px-[8%]">

        <div className="relative">

          <div className="mb-5 overflow-hidden">

            <span
              ref={apexRef}
              className="block text-[clamp(3.5rem,8vw,7.5rem)] font-medium leading-[0.85] tracking-[-0.055em] text-[#18324A]"
            >
              APEX
            </span>

          </div>

          <div className="overflow-hidden">

            <span
              ref={structuralRef}
              className="block text-[clamp(3.5rem,8vw,7.5rem)] font-medium leading-[0.85] tracking-[-0.055em] text-[#18324A]"
            >
              STRUCTURAL
            </span>

          </div>

          <div
            ref={lineRef}
            className="mt-8 h-px w-[min(420px,45vw)] bg-[#D89A24]"
          />

          <div className="mt-4 overflow-hidden">

            <span
              ref={engineeringRef}
              className="block font-mono text-[9px] tracking-[0.25em] text-[#5F7890]"
            >
              STRUCTURAL ENGINEERING / CONSTRUCTION
            </span>

          </div>

        </div>

      </div>

      {/* =====================================================
          STRUCTURAL FRAME
      ===================================================== */}

      <div
        ref={frameRef}
        className="pointer-events-none absolute right-[13%] top-[27%] z-20 h-[46%] w-[20%] opacity-0"
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
      ===================================================== */}

      <div
        ref={crosshairRef}
        className="pointer-events-none absolute right-[32%] top-[26%] z-30 h-8 w-8"
      >

        <div className="absolute left-1/2 top-0 h-full w-px bg-[#D89A24]/60" />

        <div className="absolute left-0 top-1/2 h-px w-full bg-[#D89A24]/60" />

        <div className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#D89A24]" />

      </div>

      {/* =====================================================
          TECHNICAL DATA
      ===================================================== */}

      <div
        ref={coordinateRef}
        className="absolute bottom-[18%] right-[8%] z-20 hidden md:block"
      >

        <div className="flex items-start gap-5">

          <div className="h-12 w-px bg-[#18324A]/15" />

          <div className="font-mono text-[8px] leading-5 tracking-[0.14em] text-[#5F7890]">

            <div>LAT 01°17′S</div>

            <div>LON 36°49′E</div>

            <div>STRUCT / 001</div>

          </div>

        </div>

      </div>

      {/* =====================================================
          BOTTOM STATEMENT
      ===================================================== */}

      <div
        ref={bottomTextRef}
        className="absolute bottom-8 left-[8%] right-[8%] z-30 flex items-end justify-between"
      >

        <div className="max-w-xs">

          <p className="text-xs leading-5 text-[#5F7890]">
            Engineering spaces that carry weight,
            purpose, and time.
          </p>

        </div>

        <div className="hidden items-center gap-3 md:flex">

          <span className="font-mono text-[8px] tracking-[0.2em] text-[#5F7890]">
            SCROLL TO EXPLORE
          </span>

          <div className="h-px w-10 bg-[#18324A]/25" />

          <div className="h-1.5 w-1.5 rounded-full bg-[#D89A24]" />

        </div>

      </div>

      {/* =====================================================
          CORNER MARK
      ===================================================== */}

      <div className="absolute bottom-8 right-[8%] z-30 hidden md:block">

        <div className="relative h-5 w-5">

          <div className="absolute right-0 top-0 h-px w-5 bg-[#18324A]/30" />

          <div className="absolute right-0 top-0 h-5 w-px bg-[#18324A]/30" />

        </div>

      </div>

    </section>
  );
}

