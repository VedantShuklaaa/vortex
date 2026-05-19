"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";

// ─── Exchange data ────────────────────────────────────────────────
const EXCHANGES = [
	{
		name: "Binance",
		color: "#F3BA2F",
		icon: (
			<svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
				<path d="M12 1.5L7.5 6l1.5 1.5L12 4.5l3 3L16.5 6 12 1.5zM6 7.5L4.5 9 6 10.5 7.5 9 6 7.5zM18 7.5l-1.5 1.5 1.5 1.5 1.5-1.5L18 7.5zM12 7.5L7.5 12l1.5 1.5L12 10.5l3 3 1.5-1.5L12 7.5zm0 7.5l-3-3-1.5 1.5L12 18l4.5-4.5L15 12l-3 3zM6 13.5L4.5 15 6 16.5l1.5-1.5L6 13.5zm12 0l-1.5 1.5 1.5 1.5 1.5-1.5-1.5-1.5zM12 19.5l-1.5 1.5 1.5 1.5 1.5-1.5-1.5-1.5z" />
			</svg>
		),
	},
	{
		name: "Coinbase",
		color: "#1652F0",
		icon: (
			<svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
				<path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 4a6 6 0 110 12A6 6 0 0112 6zm0 2a4 4 0 100 8 4 4 0 000-8z" />
			</svg>
		),
	},
	{
		name: "OKX",
		color: "#00A3FF",
		icon: (
			<svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
				<rect x="2" y="9" width="6" height="6" rx="1" />
				<rect x="9" y="2" width="6" height="6" rx="1" />
				<rect x="9" y="16" width="6" height="6" rx="1" />
				<rect x="16" y="9" width="6" height="6" rx="1" />
			</svg>
		),
	},
	{
		name: "Bybit",
		color: "#E84142",
		icon: (
			<svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
				<path d="M3 5h7v4H3zm0 5h7v4H3zm0 5h7v4H3zm8-10h10v4H11zm0 10h10v4H11z" />
			</svg>
		),
	},
	{
		name: "Bitfinex",
		color: "#16B157",
		icon: (
			<svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
				<path d="M12 2L4 7v10l8 5 8-5V7L12 2zm0 2.3l6 3.7v7.4l-6 3.7-6-3.7V8L12 4.3z" />
			</svg>
		),
	},
	{
		name: "Bitget",
		color: "#00F0FF",
		icon: (
			<svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
				<path d="M12 2a10 10 0 100 20A10 10 0 0012 2zm-1 5h2v6h-2zm0 8h2v2h-2z" />
			</svg>
		),
	},
	{
		name: "HTX",
		color: "#1DB8C2",
		icon: (
			<svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
				<path d="M4 4h6v6H4zm10 0h6v6h-6zM4 14h6v6H4zm10 3l3-3 3 3-3 3-3-3z" />
			</svg>
		),
	},
	{
		name: "Bitstamp",
		color: "#00AB5E",
		icon: (
			<svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
				<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
			</svg>
		),
	},
	{
		name: "Crypto.com",
		color: "#002D74",
		icon: (
			<svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
				<path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
			</svg>
		),
	},
	{
		name: "Kraken",
		color: "#5741D9",
		icon: (
			<svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
				<path d="M12 2a10 10 0 100 20A10 10 0 0012 2zm0 3l7 4v6l-7 4-7-4V9l7-4z" />
			</svg>
		),
	},
];

// ─── Single exchange chip ─────────────────────────────────────────
function ExchangeChip({ exchange }: { exchange: typeof EXCHANGES[0] }) {
	return (
		<div
			className="flex items-center gap-2.5 rounded-xl px-4 py-2.5 border border-border bg-card shrink-0 select-none"
			style={{ minWidth: 140 }}
		>
			<span style={{ color: exchange.color }}>{exchange.icon}</span>
			<span className="text-sm font-medium text-foreground font-mono" >
				{exchange.name}
			</span>
			{/* live dot */}
			<span className="relative flex h-1.5 w-1.5 ml-auto shrink-0">
				<span
					className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-50"
					style={{ backgroundColor: exchange.color }}
				/>
				<span
					className="relative inline-flex rounded-full h-1.5 w-1.5"
					style={{ backgroundColor: exchange.color }}
				/>
			</span>
		</div>
	);
}

// ─── One marquee row ──────────────────────────────────────────────
function MarqueeRow({
	direction,
	speed,
}: {
	direction: "left" | "right";
	speed: number;
}) {
	const trackRef = useRef<HTMLDivElement>(null);
	const tweenRef = useRef<gsap.core.Tween | null>(null);
	// triple the list so we always have content filling the viewport
	const items = [...EXCHANGES, ...EXCHANGES, ...EXCHANGES];

	useEffect(() => {
		const track = trackRef.current;
		if (!track) return;

		const totalW = track.scrollWidth / 3; // one full copy width
		const fromX = direction === "left" ? 0 : -totalW;
		const toX = direction === "left" ? -totalW : 0;

		gsap.set(track, { x: fromX });

		tweenRef.current = gsap.to(track, {
			x: toX,
			duration: speed,
			ease: "none",
			repeat: -1,
			modifiers: {
				x: (v: string) => {
					const mod = parseFloat(v) % totalW;
					const value = direction === "left" ? mod <= 0 ? mod : mod - totalW : mod >= 0 ? mod : mod + totalW;

					return `${value}px`;
				},
			},
		});

		return () => { tweenRef.current?.kill(); };
	}, [direction, speed]);

	const pause = () => tweenRef.current?.pause();
	const resume = () => tweenRef.current?.resume();

	return (
		<div
			className="overflow-hidden w-full"
			onMouseEnter={pause}
			onMouseLeave={resume}
		>
			<div ref={trackRef} className="flex gap-3 w-max">
				{items.map((ex, i) => (
					<ExchangeChip key={`${ex.name}-${i}`} exchange={ex} />
				))}
			</div>
		</div>
	);
}

// ─── Main export ──────────────────────────────────────────────────
export function ExchangeMarquee() {
	return (
		<div className="w-full flex flex-col gap-3 py-4 overflow-hidden">
			{/* Row 1 — left */}
			<MarqueeRow direction="left" speed={28} />
			{/* Row 2 — right */}
			<MarqueeRow direction="right" speed={28} />
		</div>
	);
}