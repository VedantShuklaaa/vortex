"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import Image from "next/image";

// ─────────────────────────────────────────────────────────────────────
// CONFIG
// ─────────────────────────────────────────────────────────────────────

const EXCHANGES = [
	{
		id: "binance",
		label: "Binance",
		color: "#F3BA2F",
		image: "/binance.png",
	},
	{
		id: "coinbase",
		label: "Coinbase",
		color: "#1652F0",
		image: "/coinbase.png",
	},
	{
		id: "kraken",
		label: "Kraken",
		color: "#5741D9",
		image: "/kraken.png",
	},
	{
		id: "bybit",
		label: "Bybit",
		color: "#E84142",
		image: "/bybit.png",
	},
	{
		id: "bitfinex",
		label: "Bitfinex",
		color: "#E84142",
		image: "/bitfinex.png",
	},
	{
		id: "htx",
		label: "Htx",
		color: "#E84142",
		image: "/htx.png",
	},
	{
		id: "crypto_com",
		label: "Crypto.com",
		color: "#E84142",
		image: "/cryptocom.png",
	},
	{
		id: "okx",
		label: "Okx",
		color: "#E84142",
		image: "/okx.png",
	},
	{
		id: "bitstamp",
		label: "Bitstamp",
		color: "#E84142",
		image: "/bitstamp.png",
	},
	{
		id: "bitget",
		label: "Bitget",
		color: "#E84142",
		image: "/bitget.png",
	},
];

const PAIRS = [
	"BTC/USDT",
	"ETH/USDT",
	"SOL/USDT",
	"AVAX/USDT",
	"DOGE/USDT",
];

// ─────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────

interface Tick {
	exchange: string;
	symbol: string;
	tradeId: string;
	last_price: string;
	quantity: string;
	timestamp: number;
	side?: string;
}

type Status =
	| "idle"
	| "connecting"
	| "live"
	| "error"
	| "disconnected";

// ─────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────

function PulseDot({
	color = "rgb(81,240,168)",
}: {
	color?: string;
}) {
	return (
		<span className="relative flex h-2 w-2 shrink-0">
			<span
				className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-70"
				style={{ background: color }}
			/>

			<span
				className="relative inline-flex rounded-full h-2 w-2"
				style={{ background: color }}
			/>
		</span>
	);
}

// ─────────────────────────────────────────────────────────────────────
// CUSTOM SELECT
// ─────────────────────────────────────────────────────────────────────

function Select<T extends string>({
	value,
	onChange,
	options,
	placeholder,
	disabled,
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

	const selected = options.find((o) => o.value === value);

	useEffect(() => {
		const handler = (e: MouseEvent) => {
			if (
				ref.current &&
				!ref.current.contains(e.target as Node)
			) {
				setOpen(false);
			}
		};

		document.addEventListener("mousedown", handler);

		return () =>
			document.removeEventListener(
				"mousedown",
				handler
			);
	}, []);

	return (
		<div ref={ref} className="relative">
			<button
				type="button"
				disabled={disabled}
				onClick={() => !disabled && setOpen((o) => !o)}
				className="w-full flex items-center justify-between gap-3 rounded-2xl border border-border bg-card px-4 py-3 text-sm transition-colors hover:border-primary/30"
			>
				<div className="flex items-center gap-2">
					{selected?.image && (
						<Image
							src={selected.image}
							width={18}
							height={18}
							alt={selected.label}
							className="rounded-sm object-contain"
						/>
					)}

					<span
						className={
							selected
								? "text-foreground"
								: "text-muted-foreground"
						}
						style={{
							fontFamily:
								"var(--font-mono,'IBM Plex Mono',monospace)",
						}}
					>
						{selected?.label ??
							placeholder ??
							"Select"}
					</span>
				</div>

				<motion.svg
					animate={{ rotate: open ? 180 : 0 }}
					transition={{ duration: 0.2 }}
					width="12"
					height="12"
					viewBox="0 0 12 12"
					fill="none"
					className="text-muted-foreground"
				>
					<path
						d="M2 4l4 4 4-4"
						stroke="currentColor"
						strokeWidth="1.3"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
				</motion.svg>
			</button>

			<AnimatePresence>
				{open && (
					<motion.div
						initial={{
							opacity: 0,
							y: -6,
							scale: 0.98,
						}}
						animate={{
							opacity: 1,
							y: 0,
							scale: 1,
						}}
						exit={{
							opacity: 0,
							y: -6,
							scale: 0.98,
						}}
						transition={{ duration: 0.15 }}
						className="absolute z-50 top-full left-0 right-0 mt-2 rounded-2xl border border-border bg-card overflow-hidden shadow-xl"
					>
						{options.map((opt) => (
							<button
								key={opt.value}
								type="button"
								onClick={() => {
									onChange(opt.value);
									setOpen(false);
								}}
								className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors
                ${value === opt.value
										? "bg-primary/10 text-primary"
										: "hover:bg-muted text-foreground"
									}`}
							>
								{opt.image && (
									<Image
										src={opt.image}
										width={18}
										height={18}
										alt={opt.label}
										className="rounded-sm object-contain"
									/>
								)}

								<span
									style={{
										fontFamily:
											"var(--font-mono,'IBM Plex Mono',monospace)",
									}}
								>
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

// ─────────────────────────────────────────────────────────────────────
// TICK ROW
// ─────────────────────────────────────────────────────────────────────

function TickRow({
	label,
	value,
}: {
	label: string;
	value: string;
}) {
	return (
		<div className="flex items-center justify-between py-3 border-b border-border last:border-0">
			<span
				className="text-xs text-muted-foreground"
				style={{
					fontFamily:
						"var(--font-mono,'IBM Plex Mono',monospace)",
				}}
			>
				{label}
			</span>

			<span
				className="text-xs text-foreground"
				style={{
					fontFamily:
						"var(--font-mono,'IBM Plex Mono',monospace)",
				}}
			>
				{value}
			</span>
		</div>
	);
}

// ─────────────────────────────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────────────────────────────

export default function TryPage() {
	const [exchange, setExchange] =
		useState("binance");

	const [pair, setPair] =
		useState("BTC/USDT");

	const [status, setStatus] =
		useState<Status>("idle");

	const [tick, setTick] =
		useState<Tick | null>(null);

	const [tickCount, setTickCount] =
		useState(0);

	const [error, setError] =
		useState<string | null>(null);

	const eventSourceRef =
		useRef<EventSource | null>(null);

	const cardRef =
		useRef<HTMLDivElement>(null);

	// ─────────────────────────────────────────────────────────────────

	const connect = useCallback(() => {
		if (!exchange || !pair) return;

		eventSourceRef.current?.close();

		setStatus("connecting");
		setError(null);
		setTick(null);
		setTickCount(0);

		const url =
			`/api/stream?exchange=${exchange}&pair=${encodeURIComponent(
				pair
			)}`;

		const es = new EventSource(url);

		eventSourceRef.current = es;

		es.onmessage = (event) => {
			try {
				const data = JSON.parse(event.data);

				// Connected
				if (data.type === "connected") {
					setStatus("live");
					return;
				}

				// Heartbeat
				if (data.type === "ping") {
					return;
				}

				// Backend error
				if (data.type === "error") {
					setStatus("error");

					setError(data.message);

					es.close();

					return;
				}

				// Live tick
				if (data.type === "tick") {
					const parsed: Tick = {
						exchange: data.exchange,
						symbol: data.symbol,
						tradeId: data.trade_id,
						last_price: data.last_price,
						quantity: data.quantity,
						timestamp: data.timestamp,
						side: data.is_buyer_maker
							? "SELL"
							: "BUY",
					};

					setTick(parsed);

					setTickCount((c) => c + 1);

					if (status !== "live") {
						setStatus("live");
					}
				}
			} catch (err) {
				console.error(
					"SSE parse error:",
					err
				);
			}
		};

		es.onerror = () => {
			setStatus("error");

			setError(
				"Stream connection failed"
			);

			es.close();
		};
	}, [exchange, pair, status]);

	// ─────────────────────────────────────────────────────────────────

	const disconnect = useCallback(() => {
		eventSourceRef.current?.close();
		eventSourceRef.current = null;
		setStatus("disconnected");
	}, []);

	// ─────────────────────────────────────────────────────────────────

	useEffect(() => {
		return () =>
			eventSourceRef.current?.close();
	}, []);

	// ─────────────────────────────────────────────────────────────────

	useEffect(() => {
		if (!tick || !cardRef.current) return;

		gsap.fromTo(
			cardRef.current,
			{
				boxShadow:
					"0 0 0 1px rgb(81,240,168)",
			},
			{
				boxShadow:
					"0 0 0 0px rgb(81,240,168)",
				duration: 0.6,
			}
		);
	}, [tick]);

	// ─────────────────────────────────────────────────────────────────

	const isLive = status === "live";

	const exchObj = EXCHANGES.find(
		(e) => e.id === exchange
	);

	// ─────────────────────────────────────────────────────────────────

	return (
		<div className="min-h-screen bg-background text-foreground">
			{/* HEADER */}

			<header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
				<div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
					<div />

					<div className="flex items-center gap-3">
						{isLive && (
							<div className="flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1">
								<PulseDot />

								<span
									className="text-xs text-primary"
									style={{
										fontFamily:
											"var(--font-mono,'IBM Plex Mono',monospace)",
									}}
								>
									LIVE · {tickCount} ticks
								</span>
							</div>
						)}
					</div>
				</div>
			</header>

			{/* BODY */}

			<div className="max-w-7xl mx-auto px-6 py-16">
				<motion.div
					initial={{ opacity: 0, y: 12 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.35 }}
				>
					{/* HERO */}

					<div className="mb-12">
						<h1 className="text-5xl font-bold tracking-tight mb-4">
							Real-time crypto ticks
						</h1>

						<p className="text-muted-foreground max-w-2xl leading-relaxed">
							Real-time streaming powered by the
							Vortex Stream SDK through a backend
							SSE gateway.
						</p>
					</div>

					{/* GRID */}

					<div className="grid grid-cols-1 xl:grid-cols-[420px_1fr] gap-8">
						{/* LEFT */}

						<div className="flex flex-col gap-5">
							{/* EXCHANGE */}

							<div className="flex flex-col gap-2">
								<label
									className="text-xs uppercase tracking-widest text-muted-foreground"
									style={{
										fontFamily:
											"var(--font-mono,'IBM Plex Mono',monospace)",
									}}
								>
									Exchange
								</label>

								<Select
									value={exchange}
									onChange={setExchange}
									options={EXCHANGES.map((e) => ({
										value: e.id,
										label: e.label,
										image: e.image,
									}))}
								/>
							</div>

							{/* PAIR */}

							<div className="flex flex-col gap-2">
								<label
									className="text-xs uppercase tracking-widest text-muted-foreground"
									style={{
										fontFamily:
											"var(--font-mono,'IBM Plex Mono',monospace)",
									}}
								>
									Pair
								</label>

								<Select
									value={pair}
									onChange={setPair}
									options={PAIRS.map((p) => ({
										value: p,
										label: p,
									}))}
								/>
							</div>

							{/* BUTTONS */}

							<div className="flex gap-3">
								{!isLive ? (
									<button
										onClick={connect}
										className="flex-1 rounded-2xl py-3 text-sm font-semibold cursor-pointer"
										style={{
											background:
												"rgb(81,240,168)",
											color: "black",
										}}
									>
										Connect
									</button>
								) : (
									<button
										onClick={disconnect}
										className="flex-1 rounded-2xl border border-border py-3 text-sm hover:bg-muted transition-colors"
									>
										Disconnect
									</button>
								)}
							</div>

							{/* ERROR */}

							{error && (
								<div
									className="rounded-2xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-xs text-destructive"
									style={{
										fontFamily:
											"var(--font-mono,'IBM Plex Mono',monospace)",
									}}
								>
									{error}
								</div>
							)}
						</div>

						{/* RIGHT */}

						<div>
							{!tick ? (
								<div className="rounded-3xl border border-border bg-card p-12 flex items-center justify-center min-h-[500px]">
									<div className="text-center">
										<p
											className="text-sm text-muted-foreground"
											style={{
												fontFamily:
													"var(--font-mono,'IBM Plex Mono',monospace)",
											}}
										>
											connect to stream live ticks
										</p>
									</div>
								</div>
							) : (
								<motion.div
									initial={{
										opacity: 0,
										y: 12,
									}}
									animate={{
										opacity: 1,
										y: 0,
									}}
									className="space-y-4"
								>
									{/* PRICE HERO */}

									<div
										ref={cardRef}
										className="rounded-3xl border border-border bg-card p-8"
									>
										<div className="flex items-start justify-between mb-8">
											<div>
												<div className="flex items-center gap-2 mb-2">
													<PulseDot />

													<span
														className="text-xs text-primary"
														style={{
															fontFamily:
																"var(--font-mono,'IBM Plex Mono',monospace)",
														}}
													>
														LIVE
													</span>
												</div>

												<p
													className="text-xs text-muted-foreground"
													style={{
														fontFamily:
															"var(--font-mono,'IBM Plex Mono',monospace)",
													}}
												>
													{tick.exchange} ·{" "}
													{tick.symbol}
												</p>
											</div>

											<span
												className="rounded-full px-3 py-1 text-xs"
												style={{
													background:
														exchObj?.color +
														"20",
													color:
														exchObj?.color,
													border: `1px solid ${exchObj?.color}40`,
													fontFamily:
														"var(--font-mono,'IBM Plex Mono',monospace)",
												}}
											>
												{tick.side}
											</span>
										</div>

										{/* BIG PRICE */}

										<motion.h2
											key={tick.last_price}
											initial={{
												opacity: 0.6,
												scale: 0.985,
											}}
											animate={{
												opacity: 1,
												scale: 1,
											}}
											transition={{
												duration: 0.15,
											}}
											className="text-6xl font-bold tracking-tight mb-3"
											style={{
												fontFamily:
													"var(--font-mono,'IBM Plex Mono',monospace)",
											}}
										>
											$
											{parseFloat(
												tick.last_price
											).toLocaleString(
												undefined,
												{
													minimumFractionDigits: 2,
													maximumFractionDigits: 4,
												}
											)}
										</motion.h2>

										<p
											className="text-xs text-muted-foreground"
											style={{
												fontFamily:
													"var(--font-mono,'IBM Plex Mono',monospace)",
											}}
										>
											qty: {tick.quantity}
										</p>
									</div>

									{/* DETAILS */}

									<div className="rounded-3xl border border-border bg-card px-6 py-2">
										<TickRow
											label="exchange"
											value={tick.exchange}
										/>

										<TickRow
											label="symbol"
											value={tick.symbol}
										/>

										<TickRow
											label="tradeId"
											value={tick.tradeId}
										/>

										<TickRow
											label="last_price"
											value={tick.last_price}
										/>

										<TickRow
											label="quantity"
											value={tick.quantity}
										/>

										<TickRow
											label="timestamp"
											value={String(
												tick.timestamp
											)}
										/>
									</div>
								</motion.div>
							)}
						</div>
					</div>
				</motion.div>
			</div>
		</div>
	);
}