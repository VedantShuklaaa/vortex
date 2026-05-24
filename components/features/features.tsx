"use client";
import React, { useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// ─── Types ────────────────────────────────────────────────────────
interface Feature {
	id: number;
	icon: React.ReactNode;
	tag: string;
	title: string;
	description: string;
	highlight: string;
	size: "large" | "medium" | "small";
	code?: string;
	stat?: { value: string; label: string };
}

// ─── Shared animation variants ───────────────────────────────────
export const fadeUp = {
	hidden: { opacity: 0, y: 28 },
	visible: (i: number) => ({
		opacity: 1,
		y: 0,
		transition: { duration: 0.55, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] as const },
	}),
};

// ─── Live pulse dot ───────────────────────────────────────────────
export function PulseDot({ color = "rgb(81, 240, 168)" }: { color?: string }) {
	return (
		<span className="relative flex h-2 w-2">
			<span
				className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-60"
				style={{ backgroundColor: color }}
			/>
			<span
				className="relative inline-flex rounded-full h-2 w-2"
				style={{ backgroundColor: color }}
			/>
		</span>
	);
}

// ─── Animated ticker strip ────────────────────────────────────────
const TICKERS = [
	"BTC/USDT  97,432.10",
	"ETH/USDT  3,241.80",
	"SOL/USDT  182.45",
	"BNB/USDT  641.20",
	"AVAX/USDT  38.74",
	"ARB/USDT  1.142",
	"OP/USDT  2.883",
];

export function TickerStrip() {
	const doubled = [...TICKERS, ...TICKERS];
	return (
		<div className="overflow-hidden w-full py-1 mt-3 rounded-lg border border-border">
			<div
				className="flex gap-6 whitespace-nowrap"
				style={{
					animation: "marquee 14s linear infinite",
					width: "max-content",
				}}
			>
				{doubled.map((t, i) => (
					<span
						key={i}
						className="text-xs font-mono text-primary "
						style={{
							opacity: 0.7,
						}}
					>
						{t}
					</span>
				))}
			</div>
			<style>{`
        @keyframes marquee { from { transform: translateX(0) } to { transform: translateX(-50%) } }
      `}</style>
		</div>
	);
}

// ─── Mini code block ──────────────────────────────────────────────
export function CodeSnip({ code }: { code: string }) {
	return (
		<pre className="text-xs rounded-xl p-3 mt-3 overflow-x-auto leading-relaxed bg-background border border-border text-muted-foreground font-mono" >
			<code
				dangerouslySetInnerHTML={{
					__html: code
						.replace(/(".*?")/g, '<span style="color:rgb(81,240,168)">$1</span>')
						.replace(/(\/\/.*)/g, '<span style="color:rgb(82,82,82)">$1</span>')
						.replace(/(\.subscribe|\.connect|\.stream|vortex|VortexStream)/g, '<span style="color:rgb(126,254,143)">$1</span>'),
				}}
			/>
		</pre>
	);
}

// ─── Animated latency bars ────────────────────────────────────────
const LATENCIES = [
	{ label: "Binance", ms: 1.2, color: "rgb(81,240,168)" },
	{ label: "Coinbase", ms: 2.8, color: "rgb(81,240,168)" },
	{ label: "OKX", ms: 1.8, color: "rgb(81,240,168)" },
	{ label: "Bybit", ms: 3.1, color: "rgb(126,254,143)" },
	{ label: "Kraken", ms: 4.2, color: "rgb(150,150,150)" },
];

export function LatencyBars() {
	const ref = useRef<HTMLDivElement>(null);
	const inView = useInView(ref, { once: true });

	return (
		<div ref={ref} className="flex flex-col gap-2 mt-3">
			{LATENCIES.map((ex, i) => (
				<div key={ex.label} className="flex items-center gap-3">
					<span className="text-xs w-16 shrink-0 font-mono"
						style={{ color: "rgb(150,150,150)" }}
					>
						{ex.label}
					</span>
					<div className="flex-1 h-1.5 rounded-full overflow-hidden bg-background">
						<motion.div
							className="h-full rounded-full"
							style={{ background: ex.color }}
							initial={{ width: 0 }}
							animate={inView ? { width: `${(ex.ms / 5) * 100}%` } : { width: 0 }}
							transition={{ duration: 0.8, delay: 0.2 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
						/>
					</div>
					<span
						className="text-xs w-10 text-right shrink-0 font-mono"
						style={{ color: ex.color }}
					>
						{ex.ms}ms
					</span>
				</div>
			))}
		</div>
	);
}

// ─── Exchange logo grid ───────────────────────────────────────────
const EXCHANGES = ["Binance", "Coinbase", "OKX", "Bybit", "Kraken", "Huobi", "Kucoin", "MEXC", "Bitget", "Gate.io"];
const DOT_COLORS = [
	"rgb(247,169,57)", "rgb(0,82,255)", "rgb(0,163,255)",
	"rgb(232,65,66)", "rgb(87,65,217)", "rgb(5,205,153)",
	"rgb(0,161,183)", "rgb(6,163,225)", "rgb(22,114,255)", "rgb(255,40,40)",
];

// ─── Stat counter ─────────────────────────────────────────────────
export function StatCounter({ value, label }: { value: string; label: string }) {
	const ref = useRef<HTMLSpanElement>(null);
	const inView = useInView(ref, { once: true });

	useEffect(() => {
		if (!inView || !ref.current) return;
		const numeric = parseFloat(value.replace(/[^0-9.]/g, ""));
		const suffix = value.replace(/[0-9.]/g, "");
		if (isNaN(numeric)) return;
		const obj = { val: 0 };
		gsap.to(obj, {
			val: numeric,
			duration: 1.4,
			ease: "power2.out",
			onUpdate() {
				if (ref.current) ref.current.textContent = obj.val.toFixed(numeric % 1 !== 0 ? 1 : 0) + suffix;
			},
		});
	}, [inView, value]);

	return (
		<div className="flex flex-col gap-0.5">
			<span
				ref={ref}
				className="text-4xl font-bold font-mono text-primary">
				0
			</span>
			<span className="text-xs text-muted-foreground" >{label}</span>
		</div>
	);
}

// ─── Feature card definitions ─────────────────────────────────────
export const FEATURES: Feature[] = [
	{
		id: 0,
		icon: (
			<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgb(81,240,168)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
				<path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
			</svg>
		),
		tag: "Core",
		title: "Native Rust performance",
		description: "Zero-cost abstractions and lock-free concurrency built directly into the Rust core. No GC pauses. No runtime overhead.",
		highlight: "< 1ms latency",
		size: "large",
		code: `// Connect in two lines
import { JsVortexStream } from "vortex-stream-sdk";

const stream = new JsVortexStream();

stream.trades(
    "binance", "SOLUSDT", 
    (trade) => {
	    console.log(trade);
	}
);`,
	},
	{
		id: 1,
		icon: (
			<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgb(81,240,168)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
				<circle cx="12" cy="12" r="10" />
				<path d="M12 8v4l3 3" />
			</svg>
		),
		tag: "Latency",
		title: "Sub-millisecond streams",
		description: "Benchmarked latency across all 10 supported exchanges. Rust's async runtime keeps you first in line.",
		highlight: "10 exchanges",
		size: "medium",
		stat: { value: "1.2ms", label: "avg round-trip" },
	},
	{
		id: 2,
		icon: (
			<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgb(81,240,168)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
				<rect x="2" y="3" width="20" height="14" rx="2" />
				<path d="M8 21h8M12 17v4" />
			</svg>
		),
		tag: "DX",
		title: "Node.js native bindings",
		description: "Drop in as an npm package. The Rust core is compiled to a native Node addon — no spawned processes, no HTTP bridges.",
		highlight: "npm install",
		size: "medium",
		code: `
const stream = new JsVortexStream();

stream.trades(
    "binance", "SOLUSDT",
    (trade) => {
	    console.log(trade);
			}
	);
});`,
	},
	{
		id: 3,
		icon: (
			<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgb(81,240,168)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
				<path d="M22 12h-4l-3 9L9 3l-3 9H2" />
			</svg>
		),
		tag: "Live",
		title: "Real-time market data",
		description: "Ticker, orderbook, trades, and funding rate streams. Normalised schema across all exchanges — one format, ten sources.",
		highlight: "Normalised schema",
		size: "large",
	},
];

// ─── Individual card ──────────────────────────────────────────────
export function FeatureCard({ feature, index }: { feature: Feature; index: number }) {

	const cardRef = useRef<HTMLDivElement>(null);

	const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
		const card = cardRef.current;
		if (!card) return;

		const rect = card.getBoundingClientRect();
		const x = (e.clientX - rect.left) / rect.width - 0.5;
		const y = (e.clientY - rect.top) / rect.height - 0.5;

		const MAX_TILT = 14;

		gsap.to(card, {
			rotateX: -y * MAX_TILT,
			rotateY: x * MAX_TILT,
			transformPerspective: 800,
			duration: 0.35,
			ease: "power2.out",
		});
	};

	const handleMouseLeave = () => {
		gsap.to(cardRef.current, {
			rotateX: 0,
			rotateY: 0,
			duration: 0.55,
			ease: "elastic.out(1, 0.6)",
		});
	};

	return (
		<motion.div
			ref={cardRef}
			onMouseMove={handleMouseMove}
			onMouseLeave={handleMouseLeave}
			variants={fadeUp}
			custom={index}
			initial="hidden"
			whileInView="visible"
			transition={{ duration: 0.2 }}
			className="bg-card border border-border rounded-[1.2rem] p-6 flex flex-col gap-3 relative overflow-hidden h-full hover:border-primary/25 shadow-[0_0_30px_rgba(0,0,0,0.18)] hover:shadow-[0_0_45px_rgba(81,240,168,0.08)] transition-shadow duration-300"
		>

			{/* Tag + icon row */}
			<div className="flex items-center justify-between">
				<div
					className="flex items-center gap-1.5 rounded-full px-2.5 py-0.5 bg-primary/5 border border-border"
				>
					<PulseDot />
					<span
						className="text-xs font-medium text-primary"
						style={{
							fontFamily: "var(--font-mono,'IBM Plex Mono',monospace)",
						}}
					>
						{feature.tag}
					</span>
				</div>
				<div
					className="w-8 h-8 rounded-xl flex items-center justify-center bg-primary/5 border border-border"
				>
					{feature.icon}
				</div>
			</div>

			{/* Title */}
			<h3 className="text-base font-semibold leading-tight text-foreground" >
				{feature.title}
			</h3>

			{/* Description */}
			<p className="text-sm leading-relaxed text-muted-foreground">
				{feature.description}
			</p>

			{/* Highlight pill */}
			<span className="self-start text-xs rounded-lg px-2.5 py-1 font-medium bg-background border border-border text-primary font-mono" >
				{feature.highlight}
			</span>

			{/* Card-specific extras */}
			{feature.id === 0 && feature.code && <CodeSnip code={feature.code} />}
			{feature.id === 1 && <LatencyBars />}
			{feature.id === 2 && feature.code && <CodeSnip code={feature.code} />}
			{feature.id === 3 && <TickerStrip />}
			{feature.stat && (
				<div className="mt-auto pt-3" >
					<StatCounter value={feature.stat.value} label={feature.stat.label} />
				</div>
			)}
		</motion.div>
	);
}

// ─── Section header ───────────────────────────────────────────────
export function SectionHeader() {
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		gsap.registerPlugin(ScrollTrigger);
		const el = ref.current;
		if (!el) return;
		gsap.fromTo(
			el.querySelectorAll(".gsap-reveal"),
			{ opacity: 0, y: 32 },
			{
				opacity: 1, y: 0,
				duration: 0.7,
				stagger: 0.12,
				ease: "power3.out",
				scrollTrigger: { trigger: el, start: "top 80%" },
			}
		);
	}, []);

	return (
		<div ref={ref} className="flex flex-col items-center gap-4 text-center mb-16">
			<div className="gsap-reveal flex items-center gap-2 rounded-full px-4 py-1.5 bg-background border border-border">
				<PulseDot />
				<span
					className="text-xs tracking-widest uppercase font-medium"
					style={{
						fontFamily: "var(--font-mono,'IBM Plex Mono',monospace)",
						color: "rgb(81,240,168)",
					}}
				>
					Built different
				</span>
			</div>

			<h2
				className="gsap-reveal text-4xl md:text-5xl font-bold leading-tight tracking-tight max-w-2xl text-foreground"
			>
				Everything you need for{" "}
				<span
					className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-chart-2 bg-clip-text text-transparent"
				>
					live market data
				</span>
			</h2>

			<p
				className="gsap-reveal text-base max-w-lg leading-relaxed text-muted-foreground"
			>
				Vortex-Stream is a Rust-powered WebSocket library with first-class Node.js bindings.
				Connect to 10 exchanges with a single import.
			</p>
		</div>
	);
}

