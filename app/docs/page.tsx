"use client";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// ─── primitives ───────────────────────────────────────────────────
function InlineCode({ children }: { children: React.ReactNode }) {
	return (
		<code
			className="rounded-md px-1.5 py-0.5 text-[0.8em] bg-muted text-primary border border-border"
			style={{ fontFamily: "var(--font-mono,'IBM Plex Mono',monospace)" }}
		>
			{children}
		</code>
	);
}

function CopyBtn({ text }: { text: string }) {
	const [copied, setCopied] = useState(false);
	return (
		<button
			onClick={() => {
				navigator.clipboard.writeText(text);
				setCopied(true);
				setTimeout(() => setCopied(false), 2000);
			}}
			className="text-xs border border-border rounded-lg px-2.5 py-1 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors font-mono"
		>
			<AnimatePresence mode="wait" initial={false}>
				<motion.span
					key={copied ? "y" : "n"}
					initial={{ opacity: 0, y: 4 }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0, y: -4 }}
					transition={{ duration: 0.12 }}
				>
					{copied ? "✓ copied" : "copy"}
				</motion.span>
			</AnimatePresence>
		</button>
	);
}

function CodeBlock({ code, lang = "bash", title }: { code: string; lang?: string; title?: string }) {
	const highlighted = code
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/("(?:[^"\\]|\\.)*")/g, `<span>$1</span>`)
		.replace(/(\/\/[^\n]*)/g, `<span class="text-muted-foreground italic">$1</span>`)

	return (
		<div className="rounded-xl border border-border overflow-hidden my-5">
			{title && (
				<div className="flex items-center justify-between px-4 py-2 border-b border-border bg-muted/30">
					<span className="text-xs text-muted-foreground font-mono" >
						{title}
					</span>
					<div className="flex items-center gap-2">
						<span className="text-xs rounded-md px-1.5 py-0.5 bg-primary/10 text-primary border border-primary/20 font-mono" >
							{lang}
						</span>
						<CopyBtn text={code} />
					</div>
				</div>
			)}
			<pre className="p-4 text-sm leading-relaxed bg-card overflow-x-auto font-mono" >
				<code className="text-foreground" dangerouslySetInnerHTML={{ __html: highlighted }} />
			</pre>
		</div>
	);
}

function Note({ children, type = "note" }: { children: React.ReactNode; type?: "note" | "tip" }) {
	const s = type === "tip"
		? { border: "border-primary/25", bg: "bg-primary/5", label: "Tip", lc: "text-primary" }
		: { border: "border-border", bg: "bg-muted/30", label: "Note", lc: "text-muted-foreground" };
	return (
		<div className={`flex gap-3 rounded-xl border ${s.border} ${s.bg} px-4 py-3 my-4 text-sm`}>
			<span className={`text-xs font-semibold uppercase tracking-widest shrink-0 mt-0.5 font-mono ${s.lc}`} >
				{s.label}
			</span>
			<p className="text-muted-foreground leading-relaxed">{children}</p>
		</div>
	);
}

// ─── section ──────────────────────────────────────────────────────
function Section({ id, children }: { id: string; children: React.ReactNode }) {
	const ref = useRef<HTMLElement>(null);
	useEffect(() => {
		gsap.registerPlugin(ScrollTrigger);
		const el = ref.current;
		if (!el) return;
		gsap.fromTo(el,
			{ opacity: 0, y: 16 },
			{
				opacity: 1, y: 0, duration: 0.5, ease: "power2.out",
				scrollTrigger: { trigger: el, start: "top 88%", once: true }
			}
		);
	}, []);
	return <section ref={ref} id={id} className="scroll-mt-24 mb-16">{children}</section>;
}

function H2({ children }: { children: React.ReactNode }) {
	return <h2 className="text-2xl font-bold tracking-tight text-foreground mb-3">{children}</h2>;
}
function Para({ children }: { children: React.ReactNode }) {
	return <p className="text-sm text-muted-foreground leading-relaxed mb-4">{children}</p>;
}

// ─── page ─────────────────────────────────────────────────────────
export default function DocsPage() {
	return (
		<motion.div
			initial={{ opacity: 0, y: 12 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.4, ease: "easeOut" }}
			className="max-w-2xl mt-10"
		>
			<Section id="installation">
				<H2>Installation</H2>
				<Para>
					Install from npm. The native Rust addon ships pre-built — no extra
					toolchain required.
				</Para>
				<CodeBlock title="npm" lang="bash" code="npm install vortex-stream-sdk" />
				<CodeBlock title="bun" lang="bash" code="bun add vortex-stream-sdk" />
				<CodeBlock title="pnpm" lang="bash" code="pnpm add vortex-stream-sdk" />
				<Note type="tip">
					Requires <InlineCode>Node.js 18+</InlineCode> or{" "}
					<InlineCode>Bun 1.0+</InlineCode>. Pre-built binaries ship for{" "}
					<InlineCode>linux-x64</InlineCode>,{" "}
					<InlineCode>darwin-arm64</InlineCode>, and{" "}
					<InlineCode>win32-x64</InlineCode>.
				</Note>
			</Section>

			<Section id="quick-start">
				<H2>Quick Start</H2>
				<Para>
					Connect to an exchange and receive live ticks in a few lines.
				</Para>
				<CodeBlock
					title="example.ts"
					lang="ts"
					code={`import { JsVortexStream } from "vortex-stream-sdk";

const stream = new JsVortexStream();

stream.trades(
    "binance", "SOLUSDT", //or ["SOLUSDT", "BTCUSDT"] for multiple tickers
    (trade) => {
	    console.log(trade);
			}
	);
	`}
				/>
				<Note>
					All pairs use the unified <InlineCode>BASE/QUOTE</InlineCode> format
					regardless of exchange. The SDK translates to each exchange's native
					format internally.
				</Note>
			</Section>

			<Section id="tick-schema">
				<H2>Normalised Tick Schema</H2>
				<Para>
					Every exchange sends data in a different shape. The SDK normalises
					all responses to this single <InlineCode>Tick</InlineCode> type
					before delivering to your handler.
				</Para>
				<CodeBlock
					title="types.ts"
					lang="ts"
					code={`interface Tick {
  exchange:         string;   // "binance" | "okx" | ...
  symbol:           string;   // "BTC/USDT"
  event_type:       string;   // trade/orderbook
  event_time:       string;   // "Unix ms"
  trade_id:         string;   // "961677022"
  last_price:       string;   // last traded price
  quantity:         string;   // base asset volume
  is_buyer_maker:   boolean;  // True/False
  timestamp:        number;   // Unix ms
}`}
				/>
				<Para>
					See the{" "}
					<a href="/docs/exchanges" className="text-primary underline underline-offset-2 hover:opacity-80 transition-opacity">
						Exchanges
					</a>{" "}
					section for the exact raw → normalised mapping for each exchange.
				</Para>
			</Section>
		</motion.div>
	);
}