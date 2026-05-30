"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

// ─────────────────────────────────────────────────────────────────
// PRIMITIVES
// ─────────────────────────────────────────────────────────────────

function InlineCode({ children }: { children: React.ReactNode }) {
	return (
		<code
			className="rounded-md px-1.5 py-0.5 text-[0.82em] bg-muted text-primary border border-border"
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
			className="text-xs border border-border rounded-lg px-2.5 py-1 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
			style={{ fontFamily: "var(--font-mono,'IBM Plex Mono',monospace)" }}
		>
			<AnimatePresence mode="wait" initial={false}>
				<motion.span
					key={copied ? "y" : "n"}
					initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
					transition={{ duration: 0.12 }}
				>
					{copied ? "✓ copied" : "copy"}
				</motion.span>
			</AnimatePresence>
		</button>
	);
}

function CodeBlock({ code, lang = "ts", title, highlight }: {
	code: string; lang?: string; title?: string; highlight?: string[];
}) {
	const lines = code.split("\n");
	return (
		<div className="rounded-xl border border-border overflow-hidden my-5">
			{title && (
				<div className="flex items-center justify-between px-4 py-2 border-b border-border bg-muted/30">
					<span className="text-xs text-muted-foreground"
						style={{ fontFamily: "var(--font-mono,'IBM Plex Mono',monospace)" }}>
						{title}
					</span>
					<div className="flex items-center gap-2">
						<span className="text-xs rounded-md px-1.5 py-0.5 bg-primary/10 text-primary border border-primary/20"
							style={{ fontFamily: "var(--font-mono,'IBM Plex Mono',monospace)" }}>
							{lang}
						</span>
						<CopyBtn text={code} />
					</div>
				</div>
			)}
			<pre className="p-4 text-sm leading-relaxed bg-card overflow-x-auto"
				style={{ fontFamily: "var(--font-mono,'IBM Plex Mono',monospace)" }}>
				{lines.map((line, i) => {
					const isHighlighted = highlight?.some(h => line.includes(h));
					return (
						<div
							key={i}
							className={isHighlighted ? "rounded px-1 -mx-1" : ""}
							style={isHighlighted ? { background: "rgba(81,240,168,0.08)", borderLeft: "2px solid rgb(81,240,168)", paddingLeft: "6px" } : {}}
						>
							<code
								className="text-foreground"
								dangerouslySetInnerHTML={{
									__html: line
										.replace(/&/g, "&amp;")
										.replace(/</g, "&lt;")
										.replace(/>/g, "&gt;")

										// strings first
										.replace(
											/("(?:[^"\\]|\\.)*")/g,
											`<span style="color:rgb(81,240,168,0.85)">$1</span>`
										)
										.replace(
											/('(?:[^'\\]|\\.)*')/g,
											`<span style="color:rgb(81,240,168,0.85)">$1</span>`
										)

										// keywords
										.replace(
											/\b(import|from|const|let|export|default|async|await|return|new|true|false|type|interface)\b/g,
											`<span style="color:rgb(95,208,255)">$1</span>`
										)

										// sdk funcs
										.replace(
											/\b(streamex|stream|connect|subscribe|disconnect|streamexStream)\b/g,
											`<span style="color:rgb(81,240,168)">$1</span>`
										)

										// comments LAST
										.replace(
											/(\/\/[^\n]*)/g,
											`<span style="color:var(--muted-foreground);font-style:italic">$1</span>`
										)
										.replace(
											/(#[^\n]*)/g,
											`<span style="color:var(--muted-foreground);font-style:italic">$1</span>`
										)
								}}
							/>
						</div>
					);
				})}
			</pre>
		</div>
	);
}

function Callout({ type = "note", children }: {
	type?: "note" | "warning" | "tip" | "important"; children: React.ReactNode;
}) {
	const styles = {
		note: { border: "border-border", bg: "bg-muted/20", label: "Note", lc: "text-muted-foreground", icon: "ℹ" },
		warning: { border: "border-chart-5/30", bg: "bg-chart-5/5", label: "Warning", lc: "text-chart-5", icon: "⚠" },
		tip: { border: "border-primary/25", bg: "bg-primary/5", label: "Tip", lc: "text-primary", icon: "✦" },
		important: { border: "border-destructive/30", bg: "bg-destructive/5", label: "Important", lc: "text-destructive", icon: "!" },
	}[type];

	return (
		<div className={`flex gap-3 rounded-xl border ${styles.border} ${styles.bg} px-4 py-3 my-4`}>
			<span className={`text-xs font-bold shrink-0 mt-0.5 ${styles.lc}`}
				style={{ fontFamily: "var(--font-mono,'IBM Plex Mono',monospace)" }}>
				{styles.icon} {styles.label}
			</span>
			<div className="text-sm text-muted-foreground leading-relaxed">{children}</div>
		</div>
	);
}

function StepBadge({ n }: { n: number }) {
	return (
		<span
			className="inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold shrink-0 bg-primary/10 text-primary border border-primary/20"
			style={{ fontFamily: "var(--font-mono,'IBM Plex Mono',monospace)" }}
		>
			{n}
		</span>
	);
}

// ─── Section wrapper ──────────────────────────────────────────────
function Section({ id, children }: { id: string; children: React.ReactNode }) {
	const ref = useRef<HTMLElement>(null);
	useEffect(() => {
		gsap.registerPlugin(ScrollTrigger);
		const el = ref.current;
		if (!el) return;
		gsap.fromTo(el,
			{ opacity: 0, y: 14 },
			{
				opacity: 1, y: 0, duration: 0.5, ease: "power2.out",
				scrollTrigger: { trigger: el, start: "top 88%", once: true }
			}
		);
	}, []);
	return <section ref={ref} id={id} className="scroll-mt-24 mb-16">{children}</section>;
}

function H2({ children }: { children: React.ReactNode }) {
	return (
		<h2 className="text-xl font-bold tracking-tight text-foreground mb-1 mt-2">{children}</h2>
	);
}
function H3({ children }: { children: React.ReactNode }) {
	return (
		<h3 className="text-sm font-semibold text-foreground mt-6 mb-2">{children}</h3>
	);
}
function Para({ children }: { children: React.ReactNode }) {
	return <p className="text-sm text-muted-foreground leading-relaxed mb-3">{children}</p>;
}

// ─────────────────────────────────────────────────────────────────
// ON-PAGE TOC
// ─────────────────────────────────────────────────────────────────
const TOC = [
	{ id: "overview", label: "Overview" },
	{ id: "install", label: "Installation" },
	{ id: "config", label: "next.config" },
	{ id: "turbopack", label: "Turbopack" },
	{ id: "route-handler", label: "Route Handler" },
	{ id: "sse", label: "Streaming via SSE" },
	{ id: "runtime", label: "Runtime Boundary" },
	{ id: "ssr", label: "SSR Compatibility" },
	{ id: "deployment", label: "Deployment" },
	{ id: "troubleshoot", label: "Troubleshooting" },
];

function OnPageToc({ active }: { active: string }) {
	const scrollTo = (id: string) =>
		document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });

	return (
		<div className="hidden xl:flex flex-col w-44 shrink-0">
			<div className="sticky top-25">
				<p className="text-xs uppercase tracking-widest text-muted-foreground mb-3 font-mono">
					On this page
				</p>
				<div className="flex flex-col gap-0.5 border-l border-border pl-3">
					{TOC.map(item => (
						<button
							key={item.id}
							onClick={() => scrollTo(item.id)}
							className={`text-left text-xs py-1 transition-colors duration-150 cursor-pointer font-mono ${active === item.id ? "text-primary font-medium" : "text-muted-foreground hover:text-foreground"
								}`}
						>
							{item.label}
						</button>
					))}
				</div>
			</div>
		</div>
	);
}

// ─────────────────────────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────────────────────────
export default function NextJsGuidePage() {
	const [activeSection, setActiveSection] = useState("overview");

	useEffect(() => {
		gsap.registerPlugin(ScrollTrigger);
		const observers: IntersectionObserver[] = [];
		TOC.forEach(({ id }) => {
			const el = document.getElementById(id);
			if (!el) return;
			const obs = new IntersectionObserver(
				([e]) => { if (e.isIntersecting) setActiveSection(id); },
				{ rootMargin: "-20% 0px -70% 0px" }
			);
			obs.observe(el);
			observers.push(obs);
		});
		return () => observers.forEach(o => o.disconnect());
	}, []);

	return (
		<motion.div
			initial={{ opacity: 0, y: 12 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.4, ease: "easeOut" }}
			className="flex gap-10 w-4xl"
		>
			{/* Main content */}
			<div className="flex-1 min-w-0 max-w-none mt-12">

				{/* Breadcrumb */}
				<div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-8 font-mono">
					<a href="/docs" className="hover:text-foreground transition-colors">docs</a>
					<span>/</span>
					<a href="/docs/frameworks" className="hover:text-foreground transition-colors">frameworks</a>
					<span>/</span>
					<span className="text-foreground">next.js</span>
				</div>

				{/* Hero */}
				<div className="mb-10">
					<div className="flex items-center gap-3 mb-4">
						{/* Next.js logo */}
						<div className="w-9 h-9 rounded-xl bg-foreground flex items-center justify-center shrink-0">
							<Image
								src="/next.png"
								height={40}
								width={40}
								alt="Na"
							/>
						</div>
						<div>
							<h1 className="text-2xl font-bold tracking-tight text-foreground">Next.js</h1>
							<p className="text-xs text-muted-foreground mt-0.5"
								style={{ fontFamily: "var(--font-mono,'IBM Plex Mono',monospace)" }}>
								App Router · Pages Router · Route Handlers · SSE
							</p>
						</div>
					</div>

					<Para>
						<InlineCode>streamex-sdk</InlineCode> uses native Rust bindings compiled
						via <InlineCode>napi-rs</InlineCode>. This means it must run inside a real
						Node.js runtime — not the Edge runtime, and not bundled by Webpack or
						Turbopack. This guide covers every configuration step needed to use the SDK
						inside a Next.js application correctly.
					</Para>

					{/* Compat matrix */}
					<div className="rounded-xl border border-border overflow-hidden my-5">
						<div className="grid grid-cols-3 gap-0 px-4 py-2 border-b border-border bg-muted/30 text-xs text-muted-foreground"
							style={{ fontFamily: "var(--font-mono,'IBM Plex Mono',monospace)" }}>
							<span>Feature</span><span>Supported</span><span>Notes</span>
						</div>
						{[
							["App Router", "✓", "Route Handlers only — not React Server Components"],
							["Pages Router", "✓", "API routes with runtime = 'nodejs'"],
							["Edge Runtime", "✗", "Native .node addons cannot run in V8 isolates"],
							["Turbopack", "⚠", "Requires NEXT_DISABLE_TURBOPACK=1 for builds"],
							["Webpack bundling", "✗", "Must be in serverExternalPackages"],
							["Server Components", "✗", "No Node.js process access in RSCs"],
							["Client Components", "✗", "Runs in browser — no native addons"],
							["Vercel", "✓", "With runtime = 'nodejs' on route"],
							["Railway / Render", "✓", "Standard Node.js deployment"],
						].map(([f, s, n]) => (
							<div key={f} className="grid grid-cols-3 gap-0 px-4 py-2.5 border-b border-border last:border-0 text-xs">
								<span className="text-foreground font-medium"
									style={{ fontFamily: "var(--font-mono,'IBM Plex Mono',monospace)" }}>{f}</span>
								<span className={s === "✓" ? "text-primary" : s === "✗" ? "text-destructive" : "text-chart-5"}
									style={{ fontFamily: "var(--font-mono,'IBM Plex Mono',monospace)" }}>{s}</span>
								<span className="text-muted-foreground">{n}</span>
							</div>
						))}
					</div>
				</div>

				{/* ── 1. Overview ─────────────────────────────────────── */}
				<Section id="overview">
					<H2>Why native addons need special treatment</H2>
					<Para>
						The SDK ships a precompiled <InlineCode>.node</InlineCode> binary for each
						platform (linux-x64, darwin-arm64, win32-x64). Next.js, by default, bundles
						everything it can find into a single JS output. A{" "}
						<InlineCode>.node</InlineCode> binary cannot be bundled — it must be loaded
						by Node.js at runtime via <InlineCode>require()</InlineCode> from the
						filesystem.
					</Para>
					<Para>
						If you skip any of the configuration steps below, you will hit one of these
						errors:
					</Para>
					<div className="flex flex-col gap-2 my-4">
						{[
							"Error: Cannot find module './streamex_stream_sdk.node'",
							"TypeError: streamex.connect is not a function",
							"Error: Dynamic require of 'streamex-sdk' is not supported",
							"Error: Module not found in Edge runtime",
						].map(e => (
							<div key={e}
								className="flex items-start gap-2 rounded-lg border border-destructive/20 bg-destructive/5 px-3 py-2 text-xs text-destructive"
								style={{ fontFamily: "var(--font-mono,'IBM Plex Mono',monospace)" }}>
								<span className="shrink-0 mt-px">✕</span>{e}
							</div>
						))}
					</div>
					<Para>The next sections fix each of these one by one.</Para>
				</Section>

				{/* ── 2. Install ──────────────────────────────────────── */}
				<Section id="install">
					<H2>Installation</H2>
					<CodeBlock title="terminal" lang="bash" code="npm install streamex-sdk" />
					<CodeBlock title="bun" lang="bash" code="bun add streamex-sdk" />
					<Para>
						No build tools required. Pre-built binaries for all major platforms
						are bundled with the package.
					</Para>
				</Section>

				{/* ── 3. next.config ──────────────────────────────────── */}
				<Section id="config">
					<H2>next.config setup</H2>
					<Para>
						This is the most important step. Add{" "}
						<InlineCode>streamex-sdk</InlineCode> to{" "}
						<InlineCode>serverExternalPackages</InlineCode>. This tells Next.js to
						skip bundling it and instead <InlineCode>require()</InlineCode> it
						directly from <InlineCode>node_modules</InlineCode> at runtime.
					</Para>
					<CodeBlock
						title="next.config.ts"
						lang="ts"
						highlight={["serverExternalPackages"]}
						code={`import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.externals.push({
      'streamex-sdk': 'commonjs streamex-sdk',
    })

    config.module.rules.push({
      test: /\.node$/,
      use: 'node-loader',
    })

    return config
  },
};

export default nextConfig;`}
					/>
					<Callout type="important">
						If your project uses <InlineCode>next.config.js</InlineCode> instead
						of <InlineCode>next.config.ts</InlineCode>, the same key applies:{" "}
						<InlineCode>serverExternalPackages: ["streamex-sdk"]</InlineCode>.
					</Callout>

					<H3>Pages Router — webpack config</H3>
					<Para>
						If you are on the Pages Router and need to customise Webpack,
						also add the package to <InlineCode>externals</InlineCode>:
					</Para>
					<CodeBlock
						title="next.config.js (Pages Router)"
						lang="js"
						highlight={["externals"]}
						code={`
@type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.externals.push({
      'streamex-sdk': 'commonjs streamex-sdk',
    })

    config.module.rules.push({
      test: /\.node$/,
      use: 'node-loader',
    })

    return config
  },
}

module.exports = nextConfig
  },
};`}
					/>
				</Section>

				{/* ── 4. Turbopack ────────────────────────────────────── */}
				<Section id="turbopack">
					<H2>Turbopack</H2>
					<Para>
						Turbopack (enabled by default in <InlineCode>next dev --turbo</InlineCode>
						and upcoming in production builds) does not yet fully support native
						Node.js addons. You must opt out for both dev and build.
					</Para>

					<H3>Development</H3>
					<CodeBlock
						title="package.json"
						lang="json"
						highlight={["next dev --no-turbo"]}
						code={`{
  "scripts": {
    "dev":   "next dev --webpack",
    "build": "NEXT_DISABLE_TURBOPACK=1 next build",
    "start": "next start"
  }
}`}
					/>

					<H3>Build</H3>
					<CodeBlock
						title="terminal"
						lang="bash"
						code={`NEXT_DISABLE_TURBOPACK=1 next build`}
					/>

					<Callout type="warning">
						Using <InlineCode>next dev</InlineCode> without{" "}
						<InlineCode>--no-turbo</InlineCode> will cause the{" "}
						<InlineCode>.node</InlineCode> binary to fail to load with a
						module-resolution error. This is a Turbopack limitation, not an SDK
						bug.
					</Callout>
				</Section>

</div>
			{/* On-page TOC */}
			<OnPageToc active={activeSection} />

		</motion.div>
	);
}