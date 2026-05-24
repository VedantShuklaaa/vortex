
export const EXCHANGES = [
	{
		id: "binance",
		name: "Binance",
		color: "#F3BA2F",
		image: "/binance.png",
		type: "CEX",
		wss: "wss://stream.binance.com:9443/ws",
		docsUrl: "https://binance-docs.github.io/apidocs/spot/en/#websocket-market-streams",
		raw: `{
	"e": "trade",
    "E": 1779632766398,
    "s": "SOLUSDT",
    "t": 1961721572,
    "p": "85.10000000",
    "q": "2.11000000",
    "T": 1779632766397,
    "m": false,
    "M": true
  }`,
		normalised: `{
	exchange: "binance",
    symbol: "SOLUSDT",
    event_type: "trade",
    event_time: "1779632766398",
    trade_id: "1961721572",
    last_price: "85.10000000",
    quantity: "2.1100000",
    is_buyer_maker?: false,
    timestamp: 1779632766397 
  }`,
		notes: [
			'Symbol arrives without separator — BTCUSDT. SDK splits at known quote currencies (USDT, BTC, ETH, BNB).',
			'price and q (quantity) are strings. SDK coerces both to number.',
			'Field E is server event time, T is trade time. SDK uses T as the authoritative timestamp.',
		],
		fields: [
			{ raw: "e", mapped: "Event type", desc: "Event type (always \"trade\")" },
			{ raw: "E", mapped: "Event time", desc: "Event time " },
			{ raw: "s", mapped: "symbol", desc: "Trading pair without separator" },
			{ raw: "t", mapped: "Trade id", desc: "Trade id" },
			{ raw: "p", mapped: "price", desc: "Trade price (string → number)" },
			{ raw: "q", mapped: "volume", desc: "Trade quantity (string → number)" },
			{ raw: "T", mapped: "timestamp", desc: "Trade time in Unix ms" },
			{ raw: "m", mapped: "maker", desc: "is_buyer_maker? (always \"true\ or false)" },
			{ raw: "M", mapped: "—", desc: "" },
		],
	},
	{
		id: "coinbase",
		name: "Coinbase",
		color: "#1652F0",
		image: "/coinbase.png",
		type: "CEX",
		wss: "wss://ws-feed.exchange.coinbase.com",
		docsUrl: "https://docs.cdp.coinbase.com/advanced-trade/docs/ws-overview",
		raw: `{
	"type": "ticker",
    "sequence": 29368170969,
    "product_id": "SOL-USD",
    "price": "85.06",
    "open_24h": "84",
    "volume_24h": "816608.42188814",
    "low_24h": "83.83",
    "high_24h": "87.42",
    "volume_30d": "25130856.66129846",
    "best_bid": "85.050",
    "best_bid_size": "88.38031422",
    "best_ask": "85.070",
    "best_ask_size": "308.56210592",
    "side": "buy",
    "time": "2026-05-24T15:16:59.095168Z",
    "trade_id": 338210917,
    "last_size": "14.69678123"
  }`,
		normalised: `{
	exchange: "coinbase", 
	symbol: "SOL/USD", 
	event_type: "ticker", 
	event_time: "1779635819095168", 
	trade_id: "338210917", 
	last_price: "85.06", 
	quantity: "14.69678123", 
	is_buyer_maker: Some(false), 
	timestamp: 1779635819095168
  }`,
		notes: [
			'product_id uses dash separator (BTC-USD). SDK replaces - with / and normalises USD → USDT.',
			'price and volume_24_h are strings. SDK coerces to number.',
			'time is an ISO 8601 string. SDK converts via new Date(time).getTime().',
		],
		fields: [
			{ raw: "type", mapped: "event_type", desc: "" },
			{ raw: "sequence", mapped: "sequence", desc: "" },
			{ raw: "product_id", mapped: "symbol", desc: "Pair with dash separator" },
			{ raw: "price", mapped: "price", desc: "Last price (string → number)" },
			{ raw: "open_24h", mapped: "open_24h", desc: "" },
			{ raw: "volume_24_h", mapped: "volume", desc: "24 h volume (string → number)" },
			{ raw: "best_bid", mapped: "best_bid", desc: "" },
			{ raw: "best_bid_size", mapped: "best_bid_size", desc: "" },
			{ raw: "best_ask", mapped: "best_ask", desc: "" },
			{ raw: "best_ask_size", mapped: "best_ask_size", desc: "" },
			{ raw: "side", mapped: "side", desc: "" },
			{ raw: "time", mapped: "timestamp", desc: "ISO 8601 → Unix ms" },
			{ raw: "trade_id", mapped: "trade_id", desc: "" },
			{ raw: "last_size", mapped: "quantity", desc: "" },
		],
	},
	{
		id: "okx",
		name: "OKX",
		color: "#00A3FF",
		image: "/okx.png",
		type: "CEX",
		wss: "wss://ws.okx.com:8443/ws/v5/public",
		docsUrl: "https://www.okx.com/docs-v5/en/#order-book-trading-market-data-ws-trades-channel",
		raw: `{
	"arg": {
        "channel": "trades",
        "instId": "SOL-USDT"
    },
    "data": [
        {
            "instId": "SOL-USDT",
            "tradeId": "435811967",
            "px": "85.21",
            "sz": "3.26503",
            "side": "buy",
            "ts": "1779638515381",
            "count": "3",
            "source": "0",
            "seqId": 30263220729
        }
    ]
  }`,
		normalised: `{
	exchange: "okx", 
	symbol: "SOL-USDT", 
	event_type: "trades", 
	event_time: "1779638515381", 
	trade_id: "435811967", 
	last_price: "85.21", 
	quantity: "3.26503", 
	is_buyer_maker: Some(false), 
	timestamp: 1779638515381
  }`,
		notes: [
			'Payload wraps data in a data array. SDK reads data[0].',
			'px = price, sz = size/volume. SDK maps abbreviated field names.',
			'ts arrives as a string in Unix ms. SDK casts to number.',
		],
		fields: [

			{ raw: "data[0].instId", mapped: "symbol", desc: "Instrument id (BTC-USDT → BTC/USDT)" },
			{ raw: "data[0].tradeId", mapped: "trade_id", desc: "" },
			{ raw: "data[0].px", mapped: "price", desc: "Trade price (string → number)" },
			{ raw: "data[0].sz", mapped: "volume", desc: "Trade size (string → number)" },
			{ raw: "data[0].side", mapped: "side", desc: "Trade size (string → number)" },
			{ raw: "data[0].ts", mapped: "timestamp", desc: "Unix ms as string → number" },
			{ raw: "data[0].count", mapped: "count", desc: "" },
			{ raw: "data[0].source", mapped: "source", desc: "" },
			{ raw: "data[0].seqId", mapped: "seq_id", desc: "" },
		],
	},
	{
		id: "bybit",
		name: "Bybit",
		color: "#E84142",
		image: "/bybit.png",
		type: "CEX",
		wss: "wss://stream.bybit.com/v5/public/spot",
		docsUrl: "https://bybit-exchange.github.io/docs/v5/websocket/public/trade",
		raw: `{
	"topic": "publicTrade.BTCUSDT",
    "ts": 1779642513197,
    "type": "snapshot",
    "data": [
        {
            "i": "2290000001141025668",
            "T": 1779642513195,
            "p": "76700.6",
            "v": "0.007454",
            "S": "Buy",
            "seq": 107841394082,
            "s": "BTCUSDT",
            "BT": false,
            "RPI": false
        }
    ]
  }`,
		normalised: `{
	exchange: "bybit", 
	symbol: "BTCUSDT", 
	event_type: "trade", 
	event_time: "1779642513195", 
	trade_id: "2290000001141025668", 
	last_price: "76700.6", 
	quantity: "0.007454", 
	is_buyer_maker: Some(false), 
	timestamp: 1779642513195
  }`,
		notes: [
			'Topic encodes the pair (publicTrade.BTCUSDT). SDK also reads s inside data[0].',
			'Single-letter fields: p = price, v = volume, s = symbol, S = side.',
			'Data is an array — SDK always reads index 0 for the latest trade.',
		],
		fields: [
			{ raw: "data[0].i", mapped: "trade_id", desc: "" },
			{ raw: "data[0].T", mapped: "timestamp", desc: "Trade time in Unix ms" },
			{ raw: "data[0].p", mapped: "price", desc: "Trade price (string)" },
			{ raw: "data[0].v", mapped: "volume", desc: "Trade volume (string)" },
			{ raw: "data[0].S", mapped: "side", desc: "" },
			{ raw: "data[0].v", mapped: "volume", desc: "Trade volume (string)" },
			{ raw: "data[0].s", mapped: "symbol", desc: "Symbol without separator" },
		],
	},
	{
		id: "bitfinex",
		name: "Bitfinex",
		color: "#16B157",
		image: "/bitfinex.png",
		type: "CEX",
		wss: "wss://api-pub.bitfinex.com/ws/2",
		docsUrl: "wss://api-pub.bitfinex.com/ws/2",
		raw: `[
	90298,
    "tu",
    [
        1923565853,
        1779643373655,
        0.00022001,
        76677
    ]
  ]`,
		normalised: `{
	exchange: "bitfinex", 
	symbol: "BTCUSDT", 
	event_type: "trade", 
	event_time: "1779643373655", 
	trade_id: "1923565853", 
	last_price: "76677", 
	quantity: "0.00022001", 
	is_buyer_maker: Some(false), 
	timestamp: 1779643373655
  }`,
		notes: [
			'Entire payload is an array — not an object. Fields are positional with no keys.',
			'Index 0 = channel id, index 1 = event type ("te" = trade executed), index 2 = trade data array.',
			'Trade data: [0] = trade id, [1] = timestamp (s not ms), [2] = amount, [3] = price. SDK multiplies timestamp × 1000.',
		],
		fields: [
			{ raw: "[2][0]", mapped: "timestamp", desc: "Unix seconds × 1000 → ms" },
			{ raw: "[2][1]", mapped: "trade_id", desc: "trade id at index 1 of trade array" },
			{ raw: "[2][2]", mapped: "quantity", desc: "quantity at index 2 of trade array" },
			{ raw: "[2][3]", mapped: "price", desc: "Price at index 3 of trade array" },
		],
	},
	{
		id: "bitget",
		name: "Bitget",
		color: "#00D4FF",
		image: "/bitget.png",
		type: "CEX",
		wss: "wss://ws.bitget.com/v2/ws/public",
		docsUrl: "https://www.bitget.com/api-doc/spot/websocket/public/Trades-Channel",
		raw: `{
	 "action": "update",
    "arg": {
        "instType": "SPOT",
        "channel": "trade",
        "instId": "SOLUSDT"
    },
    "data": [
        {
            "ts": "1779644386206",
            "price": "85.79",
            "size": "0.027",
            "side": "sell",
            "tradeId": "1442498595645046784"
        }
    ],
    "ts": 1779644386207
  }`,
		normalised: `{
	exchange: "bitfget", 
	symbol: "SOLUSDT", 
	event_type: "trade", 
	event_time: "1779644386206", 
	trade_id: "1442498595645046784", 
	last_price: "85.79", 
	quantity: "0.027", 
	is_buyer_maker: Some(false), 
	timestamp: 1779644386206
  }`,
		notes: [
			'data is an array of arrays — each inner array is one trade.',
			'Inner array is positional: [0] = timestamp, [1] = price, [2] = size, [3] = side.',
			'SDK reads data[0] for the latest trade and maps by index.',
		],
		fields: [
			{ raw: "data[0][0]", mapped: "timestamp", desc: "Unix ms string → number" },
			{ raw: "data[0][1]", mapped: "price", desc: "Price string at index 1" },
			{ raw: "data[0][2]", mapped: "size", desc: "Size string at index 2" },
			{ raw: "data[0][3]", mapped: "side", desc: "Side string at index 3" },
			{ raw: "data[0][4]", mapped: "trade_id", desc: "trade_id string at index 4" },
		],
	},
	{
		id: "htx",
		name: "HTX",
		color: "#1DB8C2",
		image: "/htx.png",
		type: "CEX",
		wss: "wss://api.huobi.pro/ws",
		docsUrl: "https://huobiapi.github.io/docs/spot/v1/en/#websocket-market-data",
		raw: `{
	      ÿ«V*ÈÌKW²247·431134100­ }<    //Binary data
  }`,
		normalised: `{
	exchange: "htx", 
	symbol: "SOLUSDT", 
	event_type: "trade", 
	event_time: "1779644649421", 
	trade_id: "157808468", 
	last_price: "85.7338", 
	quantity: "0.231", 
	is_buyer_maker: Some(true), 
	timestamp: 1779644649421
  }`,
		notes: [
			'Data is gzip-compressed over the wire. SDK decompresses using Node zlib before JSON.parse.',
			'Symbol is extracted from ch (channel) field — market.btcusdt.trade.detail → BTCUSDT.',
			'Nested three levels deep: tick → data[0]. SDK unwraps automatically.',
		],
		fields: [
			{ raw: "Binary", mapped: "normalizedResponse", desc: "" },
		],
	},
	{
		id: "bitstamp",
		name: "Bitstamp",
		color: "#00AB5E",
		image: "/bitstamp.png",
		type: "CEX",
		wss: "wss://ws.bitstamp.net",
		docsUrl: "https://www.bitstamp.net/s/webapp/examples/live_trades_v2.html",
		raw: `{
	"data": {
        "id": 579189584,
        "timestamp": "1779646583",
        "amount": 0.00026147,
        "amount_str": "0.00026147",
        "price": 76731.16,
        "price_str": "76731.16",
        "type": 0,
        "microtimestamp": "1779646583154000",
        "buy_order_id": 2010364348403712,
        "sell_order_id": 2010364319694848
    },
    "channel": "live_trades_btcusdt",
    "event": "trade"
	}
  }`,
		normalised: `{
	exchange: "bitstamp", 
	symbol: "BTCUSDT", 
	event_type: "trade", 
	event_time: "1779646583", 
	trade_id: "579189584", 
	last_price: "76731.16", 
	quantity: "0.00026147", 
	is_buyer_maker: Some(true), 
	timestamp: 1779646583
  }`,
		notes: [
			'Symbol is encoded in the channel name: live_trades_btcusd. SDK strips the prefix and maps to BTC/USDT.',
			'microtimestamp is Unix microseconds as a string. SDK divides by 1000 and casts to number to get ms.',
			'Both numeric (price, amount) and string (_str) versions exist. SDK uses the numeric fields.',
		],
		fields: [
			{ raw: "type", mapped: "type", desc: "trade" },
			{ raw: "data.microtimestamp", mapped: "timestamp", desc: "Microseconds string ÷ 1000 → ms" },
			{ raw: "channel", mapped: "symbol", desc: "live_trades_btcusd → BTC/USDT" },
			{ raw: "id", mapped: "id", desc: "trade id" },
			{ raw: "data.price_str", mapped: "price", desc: "Trade price (number)" },
			{ raw: "data.amount", mapped: "quantity", desc: "Trade quantity (number)" },
		],
	},
	{
		id: "cryptocom",
		name: "Crypto.com",
		color: "#103F91",
		image: "/cryptocom.png",
		type: "CEX",
		wss: "wss://stream.crypto.com/exchange/v1/market",
		docsUrl: "https://exchange-docs.crypto.com/exchange/v1/rest-ws/index.html#trade-instrument_name",
		raw: `{
	"id": -1,
    "method": "subscribe",
    "code": 0,
    "result": {
        "instrument_name": "SOL_USDT",
        "subscription": "trade.SOL_USDT",
        "channel": "trade",
        "data": [
            {
                "d": "1779647881637105153",
                "t": 1779647881637,
                "p": "85.45",
                "q": "0.013",
                "s": "BUY",
                "i": "SOL_USDT",
                "m": "4611686018501938488"
            }
        ]
    }
  }`,
		normalised: `{
	exchange: "cryptocom", 
	symbol: "SOLUSDT", 
	event_type: "trade", 
	event_time: "1779647881637", 
	trade_id: "1779647881637105153", 
	last_price: "85.45", 
	quantity: "0.013", 
	is_buyer_maker: Some(true), 
	timestamp: 1779647881637
  }`,
		notes: [
			'instrument_name uses underscore separator (BTC_USDT). SDK replaces _ with /.',
			'Single-letter field names inside data: p = price, q = quantity, t = time, s = side.',
			'Data is an array — SDK reads result.data[0].',
		],
		fields: [
			{ raw: "result.data[0].d", mapped: "trade_id", desc: "trade id → number" },
			{ raw: "result.data[0].i", mapped: "symbol", desc: "Instrument name → BTC/USDT" },
			{ raw: "result.data[0].p", mapped: "price", desc: "Price string → number" },
			{ raw: "result.data[0].q", mapped: "quantity", desc: "Quantity string → number" },
			{ raw: "result.data[0].s", mapped: "side", desc: "" },
			{ raw: "result.data[0].t", mapped: "timestamp", desc: "Unix ms (number)" },
		],
	},
	{
		id: "kraken",
		name: "Kraken",
		color: "#5741D9",
		image: "/kraken.png",
		type: "CEX",
		wss: "wss://ws.kraken.com",
		docsUrl: "https://docs.kraken.com/api/docs/websocket-v2/trade",
		raw: `[
	119930881, 
	[
	    [
	        "76518.20000",
			"0.00002764",
			"1779648761.413683",
			"s",
			"l",
			""
		]
	],
	"trade",
	"XBT/USD"
  ]`,
		normalised: `{
	exchange: "kraken", 
	symbol: "BTCUSDT", 
	event_type: "trade", 
	event_time: "1779648761.413683", 
	trade_id: "", 
	last_price: "76518.20000", 
	quantity: "0.00002764", 
	is_buyer_maker: Some(true), 
	timestamp: 1779648761.413683
  }`,
		notes: [
			'Entire message is an array: [channelId, trades[], type, pair].',
			'Pair (index 3) uses XBT instead of BTC. SDK remaps XBT → BTC globally.',
			'Each trade is a positional array: [0]=price, [1]=volume, [2]=timestamp(s), [3]=side, [4]=type.',
			'Timestamp is Unix seconds with microsecond decimals. SDK multiplies by 1000 and floors.',
		],
		fields: [
			{ raw: "[3]", mapped: "symbol", desc: "Pair string XBT/USDT → BTC/USDT" },
			{ raw: "[1][0][0]", mapped: "price", desc: "Price string → number" },
			{ raw: "[1][0][1]", mapped: "quantity", desc: "Volume string → number" },
			{ raw: "[1][0][2]", mapped: "timestamp", desc: "Unix seconds × 1000 → ms, floor'd" },
		],
	},
] as const;

export type ExchangeId = typeof EXCHANGES[number]["id"];

export const EXCHANGE_MAP = Object.fromEntries(EXCHANGES.map(e => [e.id, e])) as Record<ExchangeId, typeof EXCHANGES[number]>;