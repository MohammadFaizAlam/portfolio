import ScrollProgress from "@/components/layout/scroll-progress";
import ManifestoFlow from "@/components/effects/manifesto-flow";
import { UnifiedFluidShader } from "@/components/effects/fluid-shader-bg";
import Hero from "@/components/sections/hero";
import About from "@/components/sections/about";
import Projects from "@/components/sections/projects";
import Pillars from "@/components/sections/pillars";
import Stack from "@/components/sections/stack";
import Roadmap from "@/components/sections/roadmap";
import Contact from "@/components/sections/contact";

export default function Home() {
  return (
    <>
      <ScrollProgress />

      {/* Single consolidated WebGL liquid-silk canvas smoothly morphing across all sections */}
      <UnifiedFluidShader />

      <main className="relative z-10 bg-transparent">
        <div data-shader-section="hero">
          <Hero />
        </div>

        <div className="relative z-10">
          <section id="about" data-shader-section="about" className="border-t border-border/40">
            <About />
          </section>

          <ManifestoFlow />

          <section id="projects" data-shader-section="projects">
            <Projects />
          </section>

          <ManifestoFlow reverse />

          <section id="pillars" data-shader-section="pillars">
            <Pillars />
          </section>

          <section id="stack" data-shader-section="stack" className="border-t border-border/40">
            <Stack />
          </section>

          <section id="roadmap" data-shader-section="roadmap" className="border-t border-border/40">
            <Roadmap />
          </section>

          <section id="contact" data-shader-section="contact" className="border-t border-border/40">
            <Contact />
          </section>
        </div>
      </main>
    </>
  );
}
