import { NextRequest } from "next/server"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function GET(req: NextRequest) {
	const { searchParams } = new URL(req.url)
	const exchange = (searchParams.get("exchange") ?? "binance").toLowerCase()
	const pair = (searchParams.get("pair") ?? "BTCUSDT").replace("/", "")

	let sdk: any = null

	const stream = new ReadableStream({
		async start(controller) {
			const encoder = new TextEncoder()
			let closed = false

			const send = (data: unknown) => {
				if (closed) return
				try {
					controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`))
				} catch {
					closed = true
				}
			}

			try {
				const { JsStreamex } = await import("streamex-sdk")
				sdk = new JsStreamex()

				send({ type: "connected", exchange, pair })

				sdk.trades(exchange, pair, (raw: string) => {
					if (closed) return
					try {
						send({ type: "tick", ...JSON.parse(raw) })
					} catch (err) {
						console.error("parse error:", err)
					}
				})

				while (!closed) {
					await new Promise((r) => setTimeout(r, 1000))
				}
			} catch (err: any) {
				console.error("[stream route]", err)
				send({ type: "error", message: err?.message ?? "stream failed" })
				controller.close()
			}
		},

		cancel() {
			sdk?.disconnect(exchange)
			sdk = null
		}
	})

	return new Response(stream, {
		headers: {
			"Content-Type": "text/event-stream",
			"Cache-Control": "no-cache, no-transform",
			"Connection": "keep-alive",
			"X-Accel-Buffering": "no",
		},
	})
}