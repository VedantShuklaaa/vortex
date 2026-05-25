import { NextRequest } from "next/server";

export interface Tick {
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

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
	const { searchParams } = new URL(req.url);
	const exchange = searchParams.get("exchange") ?? "binance";
	const pair = searchParams.get("pair") ?? "BTC/USDT";

	const stream = new ReadableStream({
		async start(controller) {
			const enc = new TextEncoder();

			const send = (data: string) => {
				try {
					controller.enqueue(enc.encode(`data: ${data}\n\n`));
				} catch {

				}
			};

			send(JSON.stringify({ type: "connected", exchange, pair }));

			let sdkStream: any = null;

			try {
				const { JsVortexStream } = await import("vortex-stream-sdk");

				sdkStream = new JsVortexStream();

				sdkStream.trades(
					exchange,
					pair.replace("/", ""),
					(trade: Tick) => {
						send(JSON.stringify({
							type: "tick",
							...trade,
						}));
					}
				);

				await new Promise<void>((resolve) => {
					req.signal.addEventListener(
						"abort",
						() => resolve(),
						{ once: true }
					);
				});

			} catch (err: any) {
				console.warn("[stream] SDK unavailable, falling back to mock data:", err.message);

				// ── MOCK fallback (remove in production) ──────────────────
				const MOCK_PRICES: Record<string, number> = {
					"BTC/USDT": 97432.10,
					"ETH/USDT": 3241.80,
					"SOL/USDT": 182.45,
					"BNB/USDT": 641.20,
					"AVAX/USDT": 38.74,
					"ARB/USDT": 1.14,
					"DOGE/USDT": 0.182,
				};

				let price = MOCK_PRICES[pair] ?? 100;
				let tradeId = 1_000_000;

				const interval = setInterval(() => {
					price *= 1 + (Math.random() - 0.499) * 0.001;
					const tick: Tick = {
						exchange,
						symbol: pair,
						event_type: "trade",
						event_time: new Date().toISOString(),
						trade_id: String(tradeId++),
						last_price: price.toFixed(pair.includes("DOGE") ? 4 : 2),
						quantity: (Math.random() * 0.05 + 0.001).toFixed(5),
						is_buyer_maker: Math.random() > 0.5,
						timestamp: Date.now(),
					};
					send(JSON.stringify({ type: "tick", ...tick }));
				}, 800);

				await new Promise<void>((resolve) => {
					req.signal.addEventListener("abort", () => {
						clearInterval(interval);
						resolve();
					}, { once: true });
				});

			} finally {
				try { sdkStream?.disconnect(); } catch { }
				controller.close();
			}
		},
	});

	return new Response(stream, {
		headers: {
			"Content-Type": "text/event-stream",
			"Cache-Control": "no-cache",
			"Connection": "keep-alive",
			"X-Accel-Buffering": "no", 
		},
	});
}