"use client";
import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { GridBackgroundDemo } from "@/components/layout/background/background";
import { InstallSnippet } from "@/components/command/install";
import DemoSection from "@/components/video/videoShowcase";
import { FeatureCard, FEATURES, SectionHeader } from "@/components/features/features";
import { FAQItem, FAQS, PulseDot } from "@/components/faq/faqSection";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const heroRef = useRef<HTMLDivElement>(null);
  const faqHeaderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".gsap-reveal", {
        opacity: 0,
        y: 24,
      }, {
        opacity: 1,
        y: 0,
        duration: 0.7,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: {
          trigger: faqHeaderRef.current,
          start: "top 80%",
        },
      });

      /**
       * Hero parallax
       */
      gsap.to(".hero-parallax", {
        yPercent: 18,
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    });

    return () => ctx.revert();
  }, []);

  const toggleFAQ = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <main className="relative min-h-screen overflow-x-hidden font-mono">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <GridBackgroundDemo />
      </div>

      {/* HERO */}
      <section
        ref={heroRef}
        className="relative flex min-h-screen items-center justify-center"
      >
        <div className="hero-parallax flex h-[70vh] w-full max-w-7xl flex-col items-center justify-center px-4 gap-30">
          <div className="flex flex-col items-center gap-3 text-center">
            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55 }}
              className="max-w-6xl bg-gradient-to-br from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-5xl font-bold tracking-tight text-transparent sm:text-6xl md:text-7xl"
            >
              Build Realtime{" "}
              <span className="font-serif font-light italic text-foreground">
                Multi-Exchange
              </span>{" "}
              <span className="relative inline-block">
                <span className="absolute -inset-1 rounded-lg bg-primary/10 blur-xl opacity-50" />

                <span className="relative inline-flex items-center gap-2 text-primary">
                  Crypto Infrastructure
                </span>
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.1 }}
              className="mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground"
            >
              Unified realtime crypto streams for JavaScript applications.
              <br />
              Powered by Rust.
            </motion.p>
          </div>

          <InstallSnippet />
        </div>
      </section>

      {/* DEMO */}
      <DemoSection />

      {/* FEATURES */}
      <section
        id="features"
        className="w-full bg-background px-4 py-24 md:px-8"
      >
        <div className="mx-auto max-w-7xl">
          <SectionHeader />

          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12 lg:col-span-7">
              <FeatureCard feature={FEATURES[0]} index={0} />
            </div>

            <div className="col-span-12 lg:col-span-5">
              <FeatureCard feature={FEATURES[1]} index={1} />
            </div>

            <div className="col-span-12 lg:col-span-5">
              <FeatureCard feature={FEATURES[2]} index={2} />
            </div>

            <div className="col-span-12 lg:col-span-7">
              <FeatureCard feature={FEATURES[3]} index={3} />
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section
        id="faq"
        className="w-full bg-background px-4 py-24 md:px-8"
      >
        <div className="mx-auto max-w-3xl">
          {/* Header */}
          <div
            ref={faqHeaderRef}
            className="mb-12 flex flex-col items-center gap-4 text-center"
          >
            <div className="gsap-reveal flex items-center gap-2 rounded-full border border-primary/15 bg-primary/6 px-4 py-1.5">
              <PulseDot />

              <span className="font-mono text-xs font-medium uppercase tracking-widest text-primary">
                FAQ
              </span>
            </div>

            <h2 className="gsap-reveal text-3xl font-bold leading-tight tracking-tight text-foreground md:text-4xl">
              Common questions
            </h2>

            <p className="gsap-reveal max-w-md text-sm leading-relaxed text-muted-foreground">
              Everything you need to know about Vortex-Stream.
              Can't find the answer?{" "}
              <a
                href="#"
                className="underline-offset-2 transition-opacity hover:opacity-80 hover:underline text-primary"
              >
                Open an issue.
              </a>
            </p>
          </div>

          {/* Accordion */}
          <div className="flex flex-col gap-2">
            {FAQS.map((faq, index) => (
              <FAQItem
                key={index}
                faq={faq}
                index={index}
                isOpen={openIndex === index}
                onToggle={() => toggleFAQ(index)}
              />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}