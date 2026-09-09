
import type { ReactElement } from 'react';
import Hero from './components/Hero';
import About from './components/About';
import Services from './components/Services';
import ModelInspector from './components/ModelInspector';

export default function App(): ReactElement {
  return (
    <div className="relative w-full bg-hud-dark text-slate-100 font-sans">
      <Hero />
      <About />
      <Services/>
    </div>

    // <ModelInspector />
  );
}