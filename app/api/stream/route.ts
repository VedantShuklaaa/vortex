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

function normalizeSymbol(symbol: string) {
	return symbol
		.replace("-", "")
		.replace("/", "")
		.toUpperCase();
}

export async function GET(req: NextRequest) {
	const { searchParams } = new URL(req.url);

	const exchange =
		(searchParams.get("exchange") ?? "binance").toLowerCase();

	const pair =
		(searchParams.get("pair") ?? "BTCUSDT").toUpperCase();

	const normalizedPair = normalizeSymbol(pair);

	const stream = new ReadableStream({
		async start(controller) {
			const encoder = new TextEncoder();

			let closed = false;
			let sdkStream: any = null;

			const send = (payload: unknown) => {
				if (closed) return;

				try {
					controller.enqueue(
						encoder.encode(
							`data: ${JSON.stringify(payload)}\n\n`
						)
					);
				} catch (err) {
					console.error("SSE send error:", err);
				}
			};

			const cleanup = () => {
				if (closed) return;

				closed = true;

				clearInterval(heartbeat);

				try {
					if (sdkStream) {
						sdkStream.disconnect();
					}
				} catch (err) {
					console.error("disconnect error:", err);
				}

				try {
					controller.close();
				} catch { }
			};

			send({
				type: "connected",
				exchange,
				pair: normalizedPair,
			});

			const heartbeat = setInterval(() => {
				send({ type: "ping" });
			}, 15000);

			req.signal.addEventListener(
				"abort",
				cleanup,
				{ once: true }
			);

			try {
				const { JsVortexStream } =
					await import("vortex-stream-sdk");

				sdkStream = new JsVortexStream();

				sdkStream.trades(
					exchange,
					normalizedPair,
					(rawTrade: unknown) => {
						if (closed) return;

						try {
							const trade: Tick =
								typeof rawTrade === "string"
									? JSON.parse(rawTrade)
									: (rawTrade as Tick);

							// Prevent cross-exchange leaks
							if (
								trade.exchange.toLowerCase() !== exchange
							) {
								return;
							}

							// Prevent symbol mismatches
							if (
								normalizeSymbol(trade.symbol) !==
								normalizedPair
							) {
								return;
							}

							send({
								type: "tick",
								...trade,
							});
						} catch (err) {
							console.error(
								"trade parse error:",
								err
							);
						}
					}
				);

				// Keep route alive until disconnect
				await new Promise<void>((resolve) => {
					req.signal.addEventListener(
						"abort",
						() => resolve(),
						{ once: true }
					);
				});
			} catch (err: any) {
				console.warn(
					"[stream] SDK unavailable, using mock data:",
					err?.message
				);

				const MOCK_PRICES: Record<string, number> = {
					BTCUSDT: 97432.1,
					ETHUSDT: 3241.8,
					SOLUSDT: 182.45,
					BNBUSDT: 641.2,
					AVAXUSDT: 38.74,
					ARBUSDT: 1.14,
					DOGEUSDT: 0.182,
				};

				let price =
					MOCK_PRICES[normalizedPair] ?? 100;

				let tradeId = 1_000_000;

				const interval = setInterval(() => {
					if (closed) {
						clearInterval(interval);
						return;
					}

					price *=
						1 + (Math.random() - 0.5) * 0.001;

					const tick: Tick = {
						exchange,
						symbol: normalizedPair,
						event_type: "trade",
						event_time: Date.now().toString(),
						trade_id: String(tradeId++),
						last_price: price.toFixed(
							normalizedPair.includes("DOGE")
								? 4
								: 2
						),
						quantity: (
							Math.random() * 0.05 +
							0.001
						).toFixed(5),
						is_buyer_maker:
							Math.random() > 0.5,
						timestamp: Date.now(),
					};

					send({
						type: "tick",
						...tick,
					});
				}, 800);

				await new Promise<void>((resolve) => {
					req.signal.addEventListener(
						"abort",
						() => {
							clearInterval(interval);
							resolve();
						},
						{ once: true }
					);
				});
			} finally {
				cleanup();
			}
		},
	});

	return new Response(stream, {
		headers: {
			"Content-Type": "text/event-stream",
			"Cache-Control":
				"no-cache, no-transform",
			Connection: "keep-alive",
			"X-Accel-Buffering": "no",
		},
	});
}