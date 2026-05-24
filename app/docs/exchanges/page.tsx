"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { EXCHANGES } from "@/lib/exchanges";
import Image from "next/image";

const fadeUp = {
	hidden: { opacity: 0, y: 16 },
	visible: (i: number) => ({
		opacity: 1, y: 0,
		transition: { duration: 0.45, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] as any },
	}),
};

export default function ExchangesPage() {
	return (
		<motion.div
			initial={{ opacity: 0, y: 12 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.4, ease: "easeOut" }}
			className="max-w-2xl mt-10"
		>
			{/* Header */}
			<div className="mb-10">
				<h1 className="text-2xl font-bold tracking-tight text-foreground mb-3">
					Supported Exchanges
				</h1>
				<p className="text-sm text-muted-foreground leading-relaxed">
					vortex-stream-sdk connects to 10 centralised exchanges. Click any
					exchange to see the raw WebSocket payload and how the SDK normalises
					it to a unified <code className="text-primary text-xs"
						style={{ fontFamily: "var(--font-mono,'IBM Plex Mono',monospace)" }}>
						Tick
					</code>.
				</p>
			</div>

			{/* Exchange list */}
			<div className="flex flex-col gap-2">
				{EXCHANGES.map((ex, i) => (
					<motion.div
						key={ex.id}
						variants={fadeUp}
						custom={i}
						initial="hidden"
						animate="visible"
					>
						<Link
							href={`/docs/exchanges/${ex.id}`}
							className="group flex items-center justify-between rounded-xl border border-border bg-card px-5 py-4 transition-colors duration-150 hover:border-primary/30 hover:bg-muted/20"
						>
							{/* Left */}
							<div className="flex items-center gap-4">
								{/* colour badge */}
								<div
									className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 transition-transform duration-150 group-hover:scale-105"
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
									<p className="text-sm font-medium text-foreground">{ex.name}</p>
									{/* WSS URL */}
									<p className="text-xs text-muted-foreground mt-0.5 truncate max-w-xs font-mono" >
										{ex.wss}
									</p>
								</div>
							</div>

							{/* Right */}
							<div className="flex items-center gap-3 shrink-0">
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
								<svg
									width="14" height="14" viewBox="0 0 14 14" fill="none"
									className="text-muted-foreground transition-transform duration-150 group-hover:translate-x-0.5"
								>
									<path d="M3 7h8M8 4l3 3-3 3"
										stroke="currentColor" strokeWidth="1.3"
										strokeLinecap="round" strokeLinejoin="round" />
								</svg>
							</div>
						</Link>
					</motion.div>
				))}
			</div>

			{/* Info note */}
			<div className="mt-8 flex gap-3 rounded-xl border border-border bg-muted/20 px-4 py-3 text-sm">
				<span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground shrink-0 mt-0.5 font-mono">
					Note
				</span>
				<p className="text-muted-foreground leading-relaxed text-xs">
					All exchanges stream data over WebSocket in real-time. The SDK
					manages connection lifecycle, heartbeats, and reconnection
					automatically. You only interact with normalised{" "}
					<code className="text-primary font-mono">
						Tick
					</code>{" "}
					objects.
				</p>
			</div>
		</motion.div>
	);
}