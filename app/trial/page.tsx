"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import Image from "next/image";

// ─────────────────────────────────────────────────────────────────
// CONFIG
// ─────────────────────────────────────────────────────────────────
const EXCHANGES = [
	{ id: "binance", label: "Binance", color: "#F3BA2F", image: "/binance.png" },
	{ id: "coinbase", label: "Coinbase", color: "#1652F0", image: "/coinbase.png" },
	{ id: "okx", label: "OKX", color: "#00A3FF", image: "/okx.png" },
	{ id: "bybit", label: "Bybit", color: "#E84142", image: "/bybit.png" },
	{ id: "bitfinex", label: "Bitfinex", color: "#16B157", image: "/bitfinex.png" },
	{ id: "bitget", label: "Bitget", color: "#00D4FF", image: "/bitget.png" },
	{ id: "htx", label: "HTX", color: "#1DB8C2", image: "/htx.png" },
	{ id: "bitstamp", label: "Bitstamp", color: "#00AB5E", image: "/bitstamp.png" },
	{ id: "cryptocom", label: "Crypto.com", color: "#103F91", image: "/cryptocom.png" },
	{ id: "kraken", label: "Kraken", color: "#5741D9", image: "/kraken.png" },
];

const PAIRS = [
	"BTCUSDT", "ETHUSDT", "SOLUSDT",
	"BNBUSDT", "AVAXUSDT", "ARBUSDT", "DOGEUSDT",
];

// ─────────────────────────────────────────────────────────────────
// TICK TYPE  (matches Rust struct)
// ─────────────────────────────────────────────────────────────────
interface Tick {
	exchange: string;
	symbol: string;
	event_type: string;
	event_time: string;
	trade_id: string;
	last_price: string;
	quantity: string;
	is_buyer_maker: boolean | null;
	timestamp: number;
}

type Status = "idle" | "connecting" | "live" | "error" | "disconnected";

// ─────────────────────────────────────────────────────────────────
// PRIMITIVES
// ─────────────────────────────────────────────────────────────────
function PulseDot({ color = "rgb(81,240,168)" }: { color?: string }) {
	return (
		<span className="relative flex h-1.5 w-1.5 shrink-0">
			<span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-60"
				style={{ background: color }} />
			<span className="relative inline-flex rounded-full h-1.5 w-1.5"
				style={{ background: color }} />
		</span>
	);
}

// ─── Custom select ────────────────────────────────────────────────
function Select<T extends string>({
	value, onChange, options, placeholder, disabled,
}: {
	value: T;
	onChange: (v: T) => void;
	options: {
		value: T;
		label: string;
		color?: string;
		image?: string;
	}[];
	placeholder?: string;
	disabled?: boolean;
}) {
	const [open, setOpen] = useState(false);
	const ref = useRef<HTMLDivElement>(null);
	const selected = options.find(o => o.value === value);

	// close on outside click
	useEffect(() => {
		const handler = (e: MouseEvent) => {
			if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
		};
		document.addEventListener("mousedown", handler);
		return () => document.removeEventListener("mousedown", handler);
	}, []);

	return (
		<div ref={ref} className="relative">
			<button
				type="button"
				disabled={disabled}
				onClick={() => !disabled && setOpen(o => !o)}
				className="w-full flex items-center justify-between gap-3 rounded-xl border border-border bg-card px-4 py-3 text-sm text-left transition-colors duration-150 disabled:opacity-40 disabled:cursor-not-allowed hover:border-primary/30"
			>
				<div className="flex items-center gap-2">
					{selected?.image ? (
						<img
							src={selected.image}
							alt={selected.label}
							className="w-4 h-4 rounded-sm object-contain shrink-0"
						/>
					) : selected?.color ? (
						<span
							className="w-2 h-2 rounded-full shrink-0"
							style={{ background: selected.color }}
						/>
					) : null}
					<span className={selected ? "text-foreground" : "text-muted-foreground"}
						style={{ fontFamily: "var(--font-mono,'IBM Plex Mono',monospace)", fontSize: 13 }}>
						{selected?.label ?? placeholder ?? "Select…"}
					</span>
				</div>
				<motion.svg
					animate={{ rotate: open ? 180 : 0 }}
					transition={{ duration: 0.2 }}
					width="12" height="12" viewBox="0 0 12 12" fill="none"
					className="text-muted-foreground shrink-0"
				>
					<path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.3"
						strokeLinecap="round" strokeLinejoin="round" />
				</motion.svg>
			</button>

			<AnimatePresence>
				{open && (
					<motion.div
						initial={{ opacity: 0, y: -6, scale: 0.97 }}
						animate={{ opacity: 1, y: 0, scale: 1 }}
						exit={{ opacity: 0, y: -6, scale: 0.97 }}
						transition={{ duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
						className="absolute z-50 top-full left-0 right-0 mt-1.5 rounded-xl border border-border bg-popover shadow-md overflow-hidden"
					>
						{options.map(opt => (
							<button
								key={opt.value}
								type="button"
								onClick={() => { onChange(opt.value); setOpen(false); }}
								className={`w-full flex items-center gap-2 px-4 py-2.5 text-left text-sm transition-colors duration-100
                  ${opt.value === value ? "bg-primary/10 text-primary" : "hover:bg-muted text-foreground"}`}
							>
								{opt.image ? (
									<Image
										src={opt.image}
										height={25}
										width={25}
										alt={opt.label}
										className="rounded-sm object-contain shrink-0"
									/>
								) : opt.color ? (
									<span
										className="w-2 h-2 rounded-full shrink-0"
										style={{ background: opt.color }}
									/>
								) : null}
								<span style={{ fontFamily: "var(--font-mono,'IBM Plex Mono',monospace)", fontSize: 12 }}>
									{opt.label}
								</span>
							</button>
						))}
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}

// ─── Tick field row ───────────────────────────────────────────────
function TickRow({
	label, value, color, mono = true,
}: {
	label: string;
	value: string;
	color?: string;
	mono?: boolean;
}) {
	const valRef = useRef<HTMLSpanElement>(null);

	// flash animation when value changes
	useEffect(() => {
		const el = valRef.current;
		if (!el) return;
		gsap.fromTo(el,
			{ color: color ?? "var(--color-primary, rgb(81,240,168))" },
			{ color: "inherit", duration: 0.6, ease: "power2.out" }
		);
	}, [value, color]);

	return (
		<div className="flex items-center justify-between py-2.5 border-b border-border last:border-0 font-mono">
			<span className="text-xs text-muted-foreground">
				{label}
			</span>
			<span
				ref={valRef}
				className="text-xs font-medium text-foreground"
				style={{ fontFamily: mono ? "var(--font-mono,'IBM Plex Mono',monospace)" : undefined }}
			>
				{value}
			</span>
		</div>
	);
}

// ─────────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────────
export default function TryPage() {
	const [exchange, setExchange] = useState<string>("");
	const [pair, setPair] = useState<string>("");
	const [status, setStatus] = useState<Status>("idle");
	const [tick, setTick] = useState<Tick | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [tickCount, setTickCount] = useState(0);

	const esRef = useRef<EventSource | null>(null);
	const cardRef = useRef<HTMLDivElement>(null);

	// flash the card border on each new tick
	useEffect(() => {
		if (!tick || !cardRef.current) return;
		gsap.fromTo(cardRef.current,
			{ boxShadow: "0 0 0 1px rgb(81,240,168)" },
			{ boxShadow: "0 0 0 0px rgb(81,240,168)", duration: 0.5, ease: "power2.out" }
		);
	}, [tickCount]);

	const connect = useCallback(() => {
		if (!exchange || !pair) return;

		// clean up previous
		esRef.current?.close();
		setTick(null);
		setError(null);
		setTickCount(0);
		setStatus("connecting");

		const url = `/api/stream?exchange=${encodeURIComponent(exchange)}&pair=${encodeURIComponent(pair)}`;
		const es = new EventSource(url);
		esRef.current = es;

		es.onmessage = (e) => {
			try {
				const data = JSON.parse(e.data);
				if (data.type === "connected") {
					setStatus("live");
				} else if (data.type === "tick") {
					setTick(data as Tick);
					setTickCount(c => c + 1);
				} else if (data.type === "error") {
					setError(data.message);
					setStatus("error");
				}
			} catch { }
		};

		es.onerror = () => {
			setStatus("error");
			setError("Connection lost. Try reconnecting.");
			es.close();
		};
	}, [exchange, pair]);

	const disconnect = useCallback(() => {
		esRef.current?.close();
		esRef.current = null;
		setStatus("disconnected");
	}, []);

	// cleanup on unmount
	useEffect(() => () => { esRef.current?.close(); }, []);

	const exchObj = EXCHANGES.find(e => e.id === exchange);
	const canConnect = !!exchange && !!pair;
	const isLive = status === "live";

	// ── render ────────────────────────────────────────────────────
	return (
		<div className="min-h-screen bg-background text-foreground flex flex-col">

			{/* Header */}
			<header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
				<div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
					<div/>
					<div className="flex items-center gap-3 mt-50">
						<AnimatePresence mode="wait">
							{isLive && (
								<motion.div
									key="live"
									initial={{ opacity: 0, x: 8 }}
									animate={{ opacity: 1, x: 0 }}
									exit={{ opacity: 0, x: 8 }}
									className="flex items-center gap-2 rounded-full px-3 py-1 border bg-primary/5 border-primary/20"
								>
									<PulseDot />
									<span className="text-xs text-primary font-medium"
										style={{ fontFamily: "var(--font-mono,'IBM Plex Mono',monospace)" }}>
										LIVE · {tickCount} ticks
									</span>
								</motion.div>
							)}
						</AnimatePresence>
						<a href="/docs"
							className="text-xs text-muted-foreground hover:text-foreground transition-colors"
							style={{ fontFamily: "var(--font-mono,'IBM Plex Mono',monospace)" }}>
							Docs →
						</a>
					</div>
				</div>
			</header>

			{/* Body */}
			<div className="flex-1 max-w-5xl w-full mx-auto px-6 py-14">
				<motion.div
					initial={{ opacity: 0, y: 16 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.45, ease: "easeOut" }}
				>
					{/* Page title */}
					<div className="mb-10">
						<h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">
							Try it live
						</h1>
						<p className="text-sm text-muted-foreground leading-relaxed">
							Select an exchange and pair, then connect to receive real-time
							trade ticks powered by{" "}
							<code className="text-primary text-xs"
								style={{ fontFamily: "var(--font-mono,'IBM Plex Mono',monospace)" }}>
								vortex-stream-sdk
							</code>.
						</p>
					</div>

					<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

						{/* ── Left: controls ─────────────────────────────── */}
						<div className="flex flex-col gap-5">

							{/* Exchange select */}
							<div className="flex flex-col gap-2">
								<label className="text-xs text-muted-foreground uppercase tracking-widest"
									style={{ fontFamily: "var(--font-mono,'IBM Plex Mono',monospace)" }}>
									Exchange
								</label>
								<Select
									value={exchange}
									onChange={setExchange}
									disabled={isLive}
									placeholder="Select exchange"
									options={EXCHANGES.map(e => ({ value: e.id, label: e.label, color: e.color, image: e.image }))}
								/>
							</div>

							{/* Pair select */}
							<div className="flex flex-col gap-2">
								<label className="text-xs text-muted-foreground uppercase tracking-widest"
									style={{ fontFamily: "var(--font-mono,'IBM Plex Mono',monospace)" }}>
									Coin pair
								</label>
								<Select
									value={pair}
									onChange={setPair}
									disabled={isLive}
									placeholder="Select pair"
									options={PAIRS.map(p => ({ value: p, label: p }))}
								/>
							</div>

							{/* Connect / Disconnect */}
							<div className="flex gap-3">
								{!isLive ? (
									<motion.button
										type="button"
										onClick={connect}
										disabled={!canConnect || status === "connecting"}
										className="flex-1 flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
										style={{
											background: "rgb(81,240,168)",
											color: "black",
										}}
										whileHover={canConnect ? { scale: 1.01 } : {}}
										whileTap={canConnect ? { scale: 0.98 } : {}}
									>
										{status === "connecting" ? (
											<>
												<svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none">
													<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
													<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
												</svg>
												Connecting…
											</>
										) : "Connect"}
									</motion.button>
								) : (
									<motion.button
										type="button"
										onClick={disconnect}
										className="flex-1 rounded-xl py-3 text-sm font-semibold border border-border hover:bg-muted transition-colors"
										whileTap={{ scale: 0.98 }}
										style={{ fontFamily: "var(--font-sans)", color: "var(--foreground)" }}
									>
										Disconnect
									</motion.button>
								)}
							</div>

							{/* Error state */}
							<AnimatePresence>
								{error && (
									<motion.div
										initial={{ opacity: 0, y: -8 }}
										animate={{ opacity: 1, y: 0 }}
										exit={{ opacity: 0 }}
										className="flex gap-2 rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-xs text-destructive"
										style={{ fontFamily: "var(--font-mono,'IBM Plex Mono',monospace)" }}
									>
										<span className="shrink-0">✕</span>
										{error}
									</motion.div>
								)}
							</AnimatePresence>

							{/* Connection info */}
							{isLive && exchObj && (
								<motion.div
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									className="rounded-xl border border-border bg-card px-4 py-3 flex flex-col gap-1"
								>
									<p className="text-xs text-muted-foreground uppercase tracking-widest mb-1"
										style={{ fontFamily: "var(--font-mono,'IBM Plex Mono',monospace)" }}>
										Connection
									</p>
									<div className="flex items-center gap-2">
										<span className="w-2 h-2 rounded-full" style={{ background: exchObj.color }} />
										<span className="text-xs text-foreground"
											style={{ fontFamily: "var(--font-mono,'IBM Plex Mono',monospace)" }}>
											{exchObj.label} · {pair}
										</span>
									</div>
									<p className="text-xs text-muted-foreground mt-0.5"
										style={{ fontFamily: "var(--font-mono,'IBM Plex Mono',monospace)" }}>
										{tickCount} updates received
									</p>
								</motion.div>
							)}
						</div>

						{/* ── Right: tick output ─────────────────────────── */}
						<div>
							<AnimatePresence mode="wait">
								{/* Idle / no data yet */}
								{!tick && status !== "connecting" && (
									<motion.div
										key="empty"
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										exit={{ opacity: 0 }}
										className="rounded-2xl border border-border bg-card flex flex-col items-center justify-center py-20 gap-3"
									>
										<div className="w-10 h-10 rounded-full border border-border flex items-center justify-center">
											<svg width="18" height="18" viewBox="0 0 24 24" fill="none"
												stroke="var(--muted-foreground)" strokeWidth="1.5" strokeLinecap="round">
												<path d="M22 12h-4l-3 9L9 3l-3 9H2" />
											</svg>
										</div>
										<p className="text-xs text-muted-foreground text-center max-w-xs leading-relaxed"
											style={{ fontFamily: "var(--font-mono,'IBM Plex Mono',monospace)" }}>
											Select an exchange and pair,<br />then click Connect.
										</p>
									</motion.div>
								)}

								{/* Connecting spinner */}
								{!tick && status === "connecting" && (
									<motion.div
										key="connecting"
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										exit={{ opacity: 0 }}
										className="rounded-2xl border border-border bg-card flex flex-col items-center justify-center py-20 gap-3"
									>
										<svg className="animate-spin text-primary" width="22" height="22" viewBox="0 0 24 24" fill="none">
											<circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
											<path className="opacity-80" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
										</svg>
										<p className="text-xs text-muted-foreground"
											style={{ fontFamily: "var(--font-mono,'IBM Plex Mono',monospace)" }}>
											Connecting to {exchange}…
										</p>
									</motion.div>
								)}

								{/* Live tick display */}
								{tick && (
									<motion.div
										key="tick"
										initial={{ opacity: 0, y: 10 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{ duration: 0.3 }}
									>
										{/* Price hero */}
										<div
											ref={cardRef}
											className="rounded-2xl border border-border bg-card px-6 py-5 mb-3 transition-shadow"
										>
											<div className="flex items-start justify-between mb-4">
												<div>
													<div className="flex items-center gap-2 mb-1">
														<PulseDot />
														<span className="text-xs text-primary font-medium"
															style={{ fontFamily: "var(--font-mono,'IBM Plex Mono',monospace)" }}>
															LIVE
														</span>
													</div>
													<p className="text-xs text-muted-foreground"
														style={{ fontFamily: "var(--font-mono,'IBM Plex Mono',monospace)" }}>
														{tick.exchange} · {tick.symbol}
													</p>
												</div>
												<span
													className="text-xs rounded-full px-2.5 py-0.5 border"
													style={{
														fontFamily: "var(--font-mono,'IBM Plex Mono',monospace)",
														background: exchObj ? exchObj.color + "18" : undefined,
														borderColor: exchObj ? exchObj.color + "40" : undefined,
														color: exchObj?.color,
													}}
												>
													{tick.event_type}
												</span>
											</div>

											{/* Big price */}
											<motion.p
												key={tick.last_price}
												initial={{ opacity: 0.4, scale: 0.98 }}
												animate={{ opacity: 1, scale: 1 }}
												transition={{ duration: 0.2 }}
												className="text-4xl font-bold tracking-tight text-foreground font-mono mb-1"
												style={{ fontFamily: "var(--font-mono,'IBM Plex Mono',monospace)" }}
											>
												${parseFloat(tick.last_price).toLocaleString(undefined, {
													minimumFractionDigits: 2,
													maximumFractionDigits: 4,
												})}
											</motion.p>

											<p className="text-xs text-muted-foreground"
												style={{ fontFamily: "var(--font-mono,'IBM Plex Mono',monospace)" }}>
												qty: {tick.quantity} ·{" "}
												{tick.is_buyer_maker != null
													? (tick.is_buyer_maker ? "maker buy" : "taker buy")
													: "—"}
											</p>
										</div>

										{/* All fields */}
										<div className="rounded-2xl border border-border bg-card px-5 py-1">
											<TickRow label="exchange" value={tick.exchange} />
											<TickRow label="symbol" value={tick.symbol} />
											<TickRow label="event_type" value={tick.event_type} />
											<TickRow label="event_time" value={tick.event_time} />
											<TickRow label="trade_id" value={tick.trade_id} />
											<TickRow label="last_price" value={tick.last_price} color="rgb(81,240,168)" />
											<TickRow label="quantity" value={tick.quantity} />
											<TickRow label="is_buyer_maker" value={tick.is_buyer_maker != null ? String(tick.is_buyer_maker) : "null"} />
											<TickRow label="timestamp" value={String(tick.timestamp)} />
										</div>
									</motion.div>
								)}
							</AnimatePresence>
						</div>
					</div>
				</motion.div>
			</div>
		</div>
	);
}