import type { ReactElement } from "react";
import { lazy, Suspense } from "react";
import Hero from "./components/Hero";
import About from "./components/About";
// import Services from "./components/Services"

const Services = lazy(() => import("./components/Services"));

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
  return (
    <div className="relative w-full bg-[#F5F3EE] text-slate-100 font-sans">
      <Hero />
      <About />

      <Suspense fallback={<ServicesLoader />}>
        <Services />
      </Suspense>
      
    </div>
  );
}