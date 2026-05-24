"use client";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { EXCHANGES, EXCHANGE_MAP } from "../../../../lib/exchanges";
import Image from "next/image";
// ─── copy button ──────────────────────────────────────────────────
function CopyBtn({ text }: { text: string }) {
	const [copied, setCopied] = useState(false);
	return (
		<button
			onClick={() => {
				navigator.clipboard.writeText(text);
				setCopied(true);
				setTimeout(() => setCopied(false), 2000);
			}}
			className="text-xs border border-border rounded-lg px-2.5 py-1 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors font-mono cursor-pointer"
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

// ─── code panel ───────────────────────────────────────────────────
function CodePanel({
	title,
	code,
	accentColor,
}: {
	title: string;
	code: string;
	accentColor?: string;
}) {
	return (
		<div
			className="rounded-xl border overflow-hidden"
			style={{ borderColor: accentColor ? accentColor + "33" : undefined }}
		>
			<div
				className="flex items-center justify-between px-4 py-2.5 border-b border-border"
				style={{ background: accentColor ? accentColor + "0a" : "var(--muted)" }}
			>
				<span
					className="text-xs text-muted-foreground"
					style={{ fontFamily: "var(--font-mono,'IBM Plex Mono',monospace)" }}
				>
					{title}
				</span>
				<CopyBtn text={code} />
			</div>
			<pre
				className="p-4 text-xs leading-relaxed overflow-x-auto bg-card"
				style={{
					fontFamily: "var(--font-mono,'IBM Plex Mono',monospace)",
					color: accentColor ? "var(--foreground)" : "var(--muted-foreground)",
				}}
			>
				{code}
			</pre>
		</div>
	);
}

// ─── field mapping table ──────────────────────────────────────────
function FieldTable({ fields }: { fields: ReadonlyArray<{ raw: string; mapped: string; desc: string }> }) {
	return (
		<div className="rounded-xl border border-border overflow-hidden">
			<div className="grid grid-cols-3 gap-0 px-4 py-2 border-b border-border bg-muted/30">
				{["Raw field", "Maps to", "Description"].map(h => (
					<span key={h} className="text-xs text-muted-foreground font-mono">
						{h}
					</span>
				))}
			</div>
			{fields.map((f, idx) => (
				<div key={`${f.raw}-${idx}`} className="grid grid-cols-3 gap-0 px-4 py-3 border-b border-border last:border-0 text-xs items-start">
					<code className="text-primary font-mono">
						{f.raw}
					</code>
					<code className="text-chart-4 font-mono">
						{f.mapped}
					</code>
					<span className="text-muted-foreground leading-relaxed">
						{f.desc}
					</span>
				</div>
			))}
		</div>
	);
}

// ─── prev / next nav ──────────────────────────────────────────────
function ExchangeNav({ currentId }: { currentId: string }) {
	const idx = EXCHANGES.findIndex(e => e.id === currentId);
	const prev = EXCHANGES[idx - 1];
	const next = EXCHANGES[idx + 1];

	return (
		<div className="flex justify-between mt-14 pt-6 border-t border-border">
			{prev ? (
				<Link
					href={`/docs/exchanges/${prev.id}`}
					className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors font-mono"
				>
					<svg width="14" height="14" viewBox="0 0 14 14" fill="none">
						<path d="M11 7H3M6 10L3 7l3-3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
					</svg>
					{prev.name}
				</Link>
			) : <div />}

			{next ? (
				<Link
					href={`/docs/exchanges/${next.id}`}
					className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
					style={{ fontFamily: "var(--font-mono,'IBM Plex Mono',monospace)" }}
				>
					{next.name}
					<svg width="14" height="14" viewBox="0 0 14 14" fill="none">
						<path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
					</svg>
				</Link>
			) : <div />}
		</div>
	);
}

// ─── page ─────────────────────────────────────────────────────────
export default function ExchangeDetailPage() {
	const { exchange: exchangeId } = useParams<{ exchange: string }>();
	const ex = EXCHANGE_MAP[exchangeId as keyof typeof EXCHANGE_MAP];

	// 404-like fallback
	if (!ex) {
		return (
			<div className="flex flex-col gap-3 py-20 items-center text-center">
				<p className="text-muted-foreground text-sm">Exchange not found.</p>
				<Link
					href="/docs/exchanges"
					className="text-xs text-primary underline underline-offset-2"
				>
					← Back to exchanges
				</Link>
			</div>
		);
	}

	return (
		<motion.div
			key={ex.id}
			initial={{ opacity: 0, y: 14 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
			className="max-w-2xl mt-12"
		>
			{/* Breadcrumb */}
			<div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-8"
				style={{ fontFamily: "var(--font-mono,'IBM Plex Mono',monospace)" }}>
				<Link href="/docs/exchanges" className="hover:text-foreground transition-colors">
					exchanges
				</Link>
				<span>/</span>
				<span className="text-foreground">{ex.id}</span>
			</div>

			{/* Exchange header */}
			<div className="flex items-center gap-4 mb-8">
				<div
					className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold shrink-0"
					style={{ background: ex.color + "22", color: ex.color }}
				>
					<Image
						src={ex.image}
						height={50}
						width={50}
						alt={ex.name[0]}
					/>
				</div>
				<div>
					<h1 className="text-2xl font-bold tracking-tight text-foreground">{ex.name}</h1>
					<div className="flex items-center gap-3 mt-1">
						<span
							className="text-xs rounded-full px-2 py-0.5 border font-mono"
							style={{
								background: ex.color + "11",
								borderColor: ex.color + "33",
								color: ex.color,
							}}
						>
							{ex.type}
						</span>
						<a
							href={ex.docsUrl}
							target="_blank"
							rel="noreferrer"
							className="text-xs text-muted-foreground hover:text-primary transition-colors font-mono"
						>
							Official docs ↗
						</a>
					</div>
				</div>
			</div>

			{/* WSS URL */}
			<div className="mb-8">
				<p className="text-xs text-muted-foreground uppercase tracking-widest mb-2 font-mono">
					WebSocket Endpoint
				</p>
				<div className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3">
					<span className="text-xs text-primary flex-1 break-all font-mono" >
						{ex.wss}
					</span>
					<CopyBtn text={ex.wss} />
				</div>
			</div>

			{/* Raw payload */}
			<div className="mb-6">
				<p
					className="text-xs text-muted-foreground uppercase tracking-widest mb-2"
					style={{ fontFamily: "var(--font-mono,'IBM Plex Mono',monospace)" }}
				>
					Raw exchange payload
				</p>
				<CodePanel title={`${ex.id} → raw`} code={ex.raw} />
			</div>

			{/* Normalised output */}
			<div className="mb-8">
				<p
					className="text-xs text-muted-foreground uppercase tracking-widest mb-2"
					style={{ fontFamily: "var(--font-mono,'IBM Plex Mono',monospace)" }}
				>
					SDK normalised output
				</p>
				<CodePanel
					title="Tick"
					code={ex.normalised}
					accentColor={ex.color}
				/>
			</div>

			{/* Field mapping */}
			<div className="mb-8">
				<p className="text-xs text-muted-foreground uppercase tracking-widest mb-3 font-mono" >
					Field mapping
				</p>
				<FieldTable fields={ex.fields} />
			</div>

			{/* SDK notes */}
			<div className="flex flex-col gap-2">
				<p className="text-xs text-muted-foreground uppercase tracking-widest mb-1 font-mono">
					SDK notes
				</p>
				{ex.notes.map((note, i) => (
					<motion.div
						key={i}
						initial={{ opacity: 0, x: -8 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.35, delay: 0.1 + i * 0.06 }}
						className="flex gap-2.5 rounded-xl border border-border bg-muted/20 px-4 py-3"
					>
						<span
							className="text-primary shrink-0 mt-px font-mono"
							style={{ fontSize: 11 }}
						>
							→
						</span>
						<p className="text-xs text-muted-foreground leading-relaxed font-mono">
							{note}
						</p>
					</motion.div>
				))}
			</div>

			{/* Prev / Next */}
			<ExchangeNav currentId={ex.id} />
		</motion.div>
	);
}