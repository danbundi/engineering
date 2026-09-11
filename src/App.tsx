import type { ReactElement } from "react";
import { lazy, Suspense } from "react";
import { AnimatePresence } from "framer-motion";

import Hero from "./components/Hero";
import About from "./components/About";

import {
  useConstructionPreloader,
  PreloaderScreen,
} from "./components/Preloader";

import SmoothScrollProvider from "./components/SmoothScrollProvider";

import "lenis/dist/lenis.css";

const Services = lazy(() => import("./components/Services"));

/*
 * Start downloading the Services JavaScript chunk early.
 *
 * React will still render it through <Suspense> normally,
 * but the browser can begin fetching the chunk while
 * the Hero/About experience is loading.
 */
void import("./components/Services");

const CRITICAL_ASSETS = [
  "/house.webp",
  "/Construction-720.mp4",
  "/modern_house.glb",
];

function ServicesLoader() {
  return (
    <section className="flex min-h-screen items-center justify-center bg-[#F5F3EE]">
      <div className="w-[240px]">
        <div className="mb-3 flex items-center justify-between">
          <span className="font-mono text-[9px] tracking-[0.25em] text-[#18324A]">
            APEX STRUCTURAL
          </span>

          <span className="font-mono text-[9px] text-[#D89A24]">
            SYSTEM
          </span>
        </div>

        <div className="h-px w-full bg-[#18324A]/10">
          <div className="h-px w-1/3 bg-[#D89A24]" />
        </div>

        <p className="mt-3 font-mono text-[8px] tracking-[0.2em] text-[#5F7890]">
          INITIALIZING STRUCTURAL MODEL
        </p>
      </div>
    </section>
  );
}

export default function App(): ReactElement {
  const { isLoaded, progress } =
    useConstructionPreloader(CRITICAL_ASSETS);

  return (
    <SmoothScrollProvider>
      <div className="relative w-full bg-[#F5F3EE] font-sans text-slate-100">
        <AnimatePresence mode="wait">
          {!isLoaded && (
            <PreloaderScreen
              key="loader"
              progress={progress}
            />
          )}
        </AnimatePresence>

        <Hero />

        <About />

        <Suspense fallback={<ServicesLoader />}>
          <Services />
        </Suspense>
      </div>
    </SmoothScrollProvider>
  );
}