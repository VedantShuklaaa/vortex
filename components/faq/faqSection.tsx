"use client";
import { motion, AnimatePresence } from "framer-motion";

// ─── Data ─────────────────────────────────────────────────────────
export const FAQS = [
	{
		q: "What exchanges does Vortex-Stream support?",
		a: "Currently 10 exchanges are supported: Binance, Coinbase, OKX, Bybit, Kraken, Huobi, KuCoin, MEXC, Bitget, and Gate.io. CEX and DEX support is on the roadmap for v1.0.",
	},
	{
		q: "Why is the core written in Rust?",
		a: "Rust gives us zero-cost abstractions, fearless concurrency, and no garbage collector pauses. This means your WebSocket stream is never stalled by a GC cycle mid-tick — critical for sub-millisecond data pipelines.",
	},
	{
		q: "How do I use this in a Node.js project?",
		a: "Install the package with npm install vortex-stream@beta or bun add vortex-stream@beta. The Rust core is pre-compiled to a native Node addon (.node) and shipped with the package — no build tools required.",
	},
	{
		q: "Does it handle reconnections automatically?",
		a: "Yes. Vortex-Stream has built-in exponential backoff reconnection and exchange heartbeat monitoring. If the connection drops, the stream resumes automatically without any code on your end.",
	},
	{
		q: "Is the data schema normalised across exchanges?",
		a: "All tick, orderbook, trade, and funding rate messages are normalised to a consistent schema regardless of which exchange they come from. You write your handler once and it works across all 10 sources.",
	},
	{
		q: "What Node.js versions are supported?",
		a: "Node.js 18 and above. The native addon is pre-built for Node 18, 20, and 22 on Linux x64, macOS arm64, and Windows x64. Bun 1.0+ is also fully supported.",
	},
];

// ─── Pulse dot (matches FeaturesSection) ──────────────────────────
export function PulseDot() {
	return (
		<span className="relative flex h-1.5 w-1.5 shrink-0">
			<span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-60 bg-primary" />
			<span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary" />
		</span>
	);
}

// ─── Single FAQ item ──────────────────────────────────────────────
export function FAQItem({ faq, index, isOpen, onToggle }: {
	faq: { q: string; a: string };
	index: number;
	isOpen: boolean;
	onToggle: () => void;
}) {
	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true, margin: "-40px" }}
			transition={{ duration: 0.5, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
			className={`border border-border rounded-2xl overflow-hidden transition-colors duration-200 ${isOpen ? "bg-background" : "bg-transparent"}`}
		>
			<button
				onClick={onToggle}
				className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left cursor-pointer group"
			>
				{/* Question */}
				<div className="flex items-center gap-3">
					<span
						className="text-xs shrink-0 tabular-nums font-mono text-primary"
						style={{
							opacity: 0.5,
						}}
					>
						{String(index + 1).padStart(2, "0")}
					</span>
					<span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors duration-150">
						{faq.q}
					</span>
				</div>

				{/* Chevron */}
				<motion.span
					animate={{ rotate: isOpen ? 45 : 0 }}
					transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
					className={`shrink-0 w-5 h-5 rounded-full flex items-center justify-center border border-border text-muted-foreground ${isOpen ? "bg-primary/10 border-secondary" : "bg-transparent"}`}
				>
					<svg width="10" height="10" viewBox="0 0 10 10" fill="none">
						<path d="M5 1v8M1 5h8" stroke={isOpen ? "rgb(81,240,168)" : "currentColor"} strokeWidth="1.5" strokeLinecap="round" />
					</svg>
				</motion.span>
			</button>

			{/* Answer */}
			<AnimatePresence initial={false}>
				{isOpen && (
					<motion.div
						key="answer"
						initial={{ height: 0, opacity: 0 }}
						animate={{ height: "auto", opacity: 1 }}
						exit={{ height: 0, opacity: 0 }}
						transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
						style={{ overflow: "hidden" }}
					>
						<p
							className="text-sm leading-relaxed text-muted-foreground px-5 pb-5"
							style={{ paddingLeft: "calc(1.25rem + 1.5rem + 0.75rem)" }}
						>
							{faq.a}
						</p>
					</motion.div>
				)}
			</AnimatePresence>
		</motion.div>
	);
}
