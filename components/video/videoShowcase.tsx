"use client";
import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";

// ─── Pulse dot (matches site config) ─────────────────────────────
function PulseDot() {
	return (
		<span className="relative flex h-1.5 w-1.5 shrink-0">
			<span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-60 bg-primary" />
			<span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary" />
		</span>
	);
}

// ─── Step pills shown below the video ────────────────────────────
const STEPS = [
	{ label: "Install", desc: "npm install vortex-stream@beta" },
	{ label: "Connect", desc: "vortex.connect({ exchange })" },
	{ label: "Subscribe", desc: "stream.subscribe(callback)" },
];

// ─── Main export ──────────────────────────────────────────────────
export default function DemoSection() {
	const headerRef = useRef<HTMLDivElement>(null);
	const videoRef = useRef<HTMLVideoElement>(null);
	const wrapRef = useRef<HTMLDivElement>(null);
	const [playing, setPlaying] = useState(false);
	const [hovered, setHovered] = useState(false);
	const [activeStep, setActiveStep] = useState(0);

	// ── GSAP header stagger ────────────────────────────────────────
	useEffect(() => {
		gsap.registerPlugin(ScrollTrigger);
		const el = headerRef.current;
		if (!el) return;
		gsap.fromTo(
			el.querySelectorAll(".gsap-reveal"),
			{ opacity: 0, y: 24 },
			{
				opacity: 1, y: 0,
				duration: 0.65,
				stagger: 0.1,
				ease: "power3.out",
				scrollTrigger: { trigger: el, start: "top 82%" },
			}
		);
	}, []);

	// ── GSAP video card parallax depth on scroll ───────────────────
	useEffect(() => {
		const wrap = wrapRef.current;
		if (!wrap) return;
		gsap.fromTo(
			wrap,
			{ opacity: 0, y: 48, scale: 0.97 },
			{
				opacity: 1, y: 0, scale: 1,
				duration: 0.8,
				ease: "power3.out",
				scrollTrigger: { trigger: wrap, start: "top 78%" },
			}
		);
	}, []);

	// ── Auto-cycle step pills ──────────────────────────────────────
	useEffect(() => {
		const id = setInterval(() => setActiveStep(s => (s + 1) % STEPS.length), 3500);
		return () => clearInterval(id);
	}, []);


	return (
		<section
			className="h-screen relative z-10 w-full py-24 px-4 md:px-8"
		>
			<BackgroundBeamsWithCollision >
				<div className="max-w-7xl mx-auto flex flex-col items-center gap-12">

					{/* ── Video card ──────────────────────────────────────── */}
					<div ref={wrapRef} className="w-full" style={{ opacity: 0 }}>
						<motion.div
							className="relative w-full rounded-2xl overflow-hidden bg-card border border-border rounded-[1.2rem] shadow-[0_0_0_1px_rgba(81,240,168,0.06),0_32px_64px_rgba(0,0,0,0.6)]"
							onMouseEnter={() => setHovered(true)}
							onMouseLeave={() => setHovered(false)}
						>
							{/* Browser-style top bar */}
							<div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-background" >
								<div className="flex gap-1.5">
									<div className="w-2.5 h-2.5 rounded-full" style={{ background: "rgb(255,95,86)" }} />
									<div className="w-2.5 h-2.5 rounded-full" style={{ background: "rgb(255,189,46)" }} />
									<div className="w-2.5 h-2.5 rounded-full" style={{ background: "rgb(39,201,63)" }} />
								</div>

								{/* Fake address bar */}
								<div className="flex-1 flex items-center gap-2 rounded-md px-3 py-1 bg-background border border-border" >
									<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="rgb(82,82,82)" strokeWidth="2" strokeLinecap="round">
										<circle cx="12" cy="12" r="10" /><path d="M12 8v4l3 3" />
									</svg>
									<span className="text-xs font-mono text-muted-foreground" >
										vortex-stream — demo.ts
									</span>
								</div>

								{/* Live badge */}
								<div
									className="flex items-center gap-1.5 rounded-full px-2.5 py-0.5"
									style={{ background: "rgba(81,240,168,0.08)", border: "1px solid rgba(81,240,168,0.15)" }}
								>
									<PulseDot />
									<span
										className="text-xs text-primary"
										style={{ fontFamily: "var(--font-mono,'IBM Plex Mono',monospace)" }}
									>
										LIVE
									</span>
								</div>
							</div>

							{/* Video / placeholder */}
							<div className="relative aspect-video w-full" style={{ background: "rgb(7,7,7)" }}>
								<video
									ref={videoRef}
									className="w-full h-full object-cover"
									src="/demo.mov"        // ← replace with your video
									loop
									playsInline
									preload="metadata"
									autoPlay
									muted
								/>

								{/* Placeholder grid (shown while video hasn't loaded / no src) */}
								<div
									className="absolute inset-0 pointer-events-none"
									style={{
										backgroundImage: "radial-gradient(rgb(25,25,26) 1px, transparent 1px)",
										backgroundSize: "24px 24px",
										opacity: 0.6,
									}}
								/>

								{/* Emerald glow at center */}
								<div
									className="absolute inset-0 pointer-events-none"
									style={{
										background: "radial-gradient(ellipse at 50% 60%, rgba(81,240,168,0.07) 0%, transparent 65%)",
									}}
								/>
							</div>

							{/* Step description strip */}
							<div className="flex items-center justify-between px-5 py-3 border-t border-border" >
								<AnimatePresence mode="wait">
									<motion.span
										key={activeStep}
										initial={{ opacity: 0, y: 6 }}
										animate={{ opacity: 1, y: 0 }}
										exit={{ opacity: 0, y: -6 }}
										transition={{ duration: 0.2 }}
										className="text-xs text-primary font-mono"
									>
										$ {STEPS[activeStep].desc}
									</motion.span>
								</AnimatePresence>

								<div className="flex items-center gap-1.5">
									{STEPS.map((_, i) => (
										<button
											key={i}
											onClick={() => setActiveStep(i)}
											className="rounded-full transition-all duration-300"
											style={{
												width: activeStep === i ? 16 : 6,
												height: 6,
												background: activeStep === i ? "rgb(81,240,168)" : "rgb(25,25,26)",
												border: "none",
												cursor: "pointer",
											}}
										/>
									))}
								</div>
							</div>
						</motion.div>
					</div>

					{/* ── Step pills ──────────────────────────────────────── */}
					<div className="gsap-reveal flex items-center gap-3 flex-wrap justify-center">
						{STEPS.map((step, i) => (
							<React.Fragment key={step.label}>
								<motion.button
									onClick={() => setActiveStep(i)}
									className={`flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium transition-colors duration-200 border font-mono cursor-pointer ${activeStep === i ? "bg-primary/10 border-primary/30 text-primary" : "bg-transparent border-border text-muted-foreground"}`}
									whileTap={{ scale: 0.96 }}
								>
									<span className={`w-4 h-4 rounded-full flex items-center justify-center text-xs shrink-0 text-[9px] ${activeStep === i ? "bg-primary/20 text-primary" : "bg-card text-muted-foreground"}`} >
										{i + 1}
									</span>
									{step.label}
								</motion.button>

								{/* arrow between steps */}
								{i < STEPS.length - 1 && (
									<svg width="12" height="12" viewBox="0 0 12 12" fill="none">
										<path d="M2 6h8M7 3l3 3-3 3" stroke="rgb(25,25,26)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
									</svg>
								)}
							</React.Fragment>
						))}
					</div>
				</div>
			</ BackgroundBeamsWithCollision>
		</section>
	);
}