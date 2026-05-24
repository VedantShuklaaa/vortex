"use client";
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import Link from "next/link";

// ─── Data ─────────────────────────────────────────────────────────
const LINKS = [
	{
		heading: "Product",
		items: [
			{ label: "Features", href: "#features" },
		],
	},
	{
		heading: "Developers",
		items: [
			{ label: "Docs", href: "#" },
			{ label: "API Reference", href: "#" },
			{ label: "GitHub", href: "https://github.com/VedantShuklaaa/Vortex-Stream" },
		],
	},
	{
		heading: "Company",
		items: [
			{ label: "About", href: "#" },
			{ label: "Twitter / X", href: "https://x.com/SegFault_Dev" },
		],
	},
];

const BADGES = ["Rust", "Node.js", "WebSocket", "10 Exchanges", "MIT License"];

// ─── Pulse dot ────────────────────────────────────────────────────
function PulseDot() {
	return (
		<span className="relative flex h-1.5 w-1.5 shrink-0">
			<span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-60 bg-primary" />
			<span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary" />
		</span>
	);
}

// ─── Main export ──────────────────────────────────────────────────
export default function Footer() {
	const lineRef = useRef<HTMLDivElement>(null);
	const footerRef = useRef<HTMLElement>(null);

	useEffect(() => {
		const line = lineRef.current;
		if (!line) return;
		gsap.fromTo(
			line,
			{ scaleX: 0, transformOrigin: "left center" },
			{
				scaleX: 1,
				duration: 1.1,
				ease: "power3.out",
				scrollTrigger: { trigger: footerRef.current, start: "top 90%" },
			}
		);
	}, []);

	return (
		<footer
			ref={footerRef}
			className="w-full border-t border-border bg-background"
		>
			{/* Animated divider line */}
			<div
				ref={lineRef}
				className="h-px w-full bg-[linear-gradient(90deg,transparent,rgb(81,240,168),transparent)]"
			/>

			<div className="max-w-6xl mx-auto px-4 md:px-8 pt-14 pb-10">
				<div className="grid grid-cols-2 md:grid-cols-5 gap-10 md:gap-8">
					<div className="col-span-2 flex flex-col gap-5">
						<div className="flex items-center gap-2.5">
							<div className="w-7 h-7 rounded-lg flex items-center justify-center bg-primary" >
								<svg width="14" height="14" viewBox="0 0 24 24" fill="none">
									<path
										d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"
										fill="black"
									/>
								</svg>
							</div>
							<span className="text-sm font-semibold tracking-wide text-foreground font-mono" >
								Vortex-Stream
							</span>
						</div>

						<p className="text-sm leading-relaxed text-muted-foreground max-w-xs">
							Native Rust WebSocket streams for Node.js. Live market data from 10 exchanges — one import.
						</p>

						<div className="flex items-center gap-2 rounded-xl px-3 py-2 self-start bg-card border border-border" >
							<PulseDot />
							<span className="text-xs text-primary font-mono" >
								npm i vortex-stream-sdk
							</span>
						</div>

						{/* Tech badges */}
						<div className="flex flex-wrap gap-2">
							{BADGES.map((b) => (
								<span
									key={b}
									className="text-xs rounded-lg px-2.5 py-1 border border-border text-muted-foreground font-mono bg-card"
								>
									{b}
								</span>
							))}
						</div>
					</div>

					{/* Link columns */}
					{LINKS.map((col, ci) => (
						<motion.div
							key={col.heading}
							className="flex flex-col gap-4"
							initial={{ opacity: 0, y: 16 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true, margin: "-40px" }}
							transition={{ duration: 0.5, delay: ci * 0.08, ease: [0.22, 1, 0.36, 1] }}
						>
							<span className="text-xs tracking-widest uppercase text-primary font-medium font-mono">
								{col.heading}
							</span>
							<ul className="flex flex-col gap-2.5">
								{col.items.map((item) => (
									<li key={item.label}>
										<Link
											href={item.href}
											className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-150"
										>
											{item.label}
										</Link>
									</li>
								))}
							</ul>
						</motion.div>
					))}
				</div>

				{/* Bottom row */}
				<div
					className="mt-12 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3"
				>t
					<p className="text-xs text-muted-foreground font-mono" >
						© {new Date().getFullYear()} Vortex-Stream. MIT License.
					</p>
					<p className="text-xs text-muted-foreground font-mono">
						Built with{" "}
						<span className="text-primary">Rust</span>
					</p>
				</div>
			</div>
		</footer>
	);
}