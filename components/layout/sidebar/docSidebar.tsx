"use client";

// components/DocsSidebar.tsx
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ─── Exchange list (same as before) ──────────────────────────────
const EXCHANGES = [
  { id: "binance", name: "Binance", color: "#F3BA2F" },
  { id: "coinbase", name: "Coinbase", color: "#1652F0" },
  { id: "okx", name: "OKX", color: "#00A3FF" },
  { id: "bybit", name: "Bybit", color: "#E84142" },
  { id: "bitfinex", name: "Bitfinex", color: "#16B157" },
  { id: "bitget", name: "Bitget", color: "#00D4FF" },
  { id: "htx", name: "HTX", color: "#1DB8C2" },
  { id: "bitstamp", name: "Bitstamp", color: "#00AB5E" },
  { id: "cryptocom", name: "Crypto.com", color: "#103F91" },
  { id: "kraken", name: "Kraken", color: "#5741D9" },
];

// ─── Frameworks list (add more as you build them) ─────────────────
const FRAMEWORKS = [
  { id: "nextjs", name: "Next.js", icon: "▲", ready: true },
  { id: "vite", name: "Vite", icon: "⚡", ready: false },
  { id: "nuxt", name: "Nuxt", icon: "◆", ready: false },
  { id: "sveltekit", name: "SvelteKit", icon: "⬡", ready: false },
  { id: "remix", name: "Remix", icon: "◉", ready: false },
  { id: "express", name: "Express", icon: "⬢", ready: false },
  { id: "bun", name: "Bun", icon: "●", ready: false },
];

// ─── Primitives ───────────────────────────────────────────────────
function PulseDot() {
  return (
    <span className="relative flex h-1.5 w-1.5 shrink-0">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-60 bg-primary" />
      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary" />
    </span>
  );
}

function Chevron({ open }: { open: boolean }) {
  return (
    <motion.svg
      animate={{ rotate: open ? 90 : 0 }}
      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
      width="10" height="10" viewBox="0 0 10 10" fill="none"
      className="text-muted-foreground shrink-0"
    >
      <path d="M3 2l4 3-4 3" stroke="currentColor" strokeWidth="1.2"
        strokeLinecap="round" strokeLinejoin="round" />
    </motion.svg>
  );
}

function AccordionGroup({
  label,
  defaultOpen = false,
  children,
}: {
  label: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border-t border-border pt-4 mt-2">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between group mb-1"
      >
        <span
          className="text-xs uppercase tracking-widest text-muted-foreground group-hover:text-foreground transition-colors duration-150"
          style={{ fontFamily: "var(--font-mono,'IBM Plex Mono',monospace)" }}
        >
          {label}
        </span>
        <Chevron open={open} />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            style={{ overflow: "hidden" }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Main sidebar ─────────────────────────────────────────────────
export function DocsSidebar() {
  const pathname = usePathname();

  // Auto-open exchanges section on exchange pages
  const isOnExchange = pathname.includes("/exchanges");
  const isOnFramework = pathname.includes("/frameworks");

  const navLink = (href: string, label: string) => {
    const active = pathname === href;
    return (
      <Link
        href={href}
        className={`text-xs py-1.5 block transition-colors duration-150 ${active
            ? "text-primary font-medium"
            : "text-muted-foreground hover:text-foreground"
          }`}
        style={{ fontFamily: "var(--font-mono,'IBM Plex Mono',monospace)" }}
      >
        {label}
      </Link>
    );
  };

  return (
    <aside className="hidden lg:flex flex-col w-52 shrink-0">
      <div className="sticky top-25 flex flex-col max-h-[calc(100vh-5rem)] overflow-y-auto pr-2">

        {/* Brand */}
        <div className="flex items-center gap-2 mb-6">
          <PulseDot />
          <span className="text-xs text-primary font-mono">
            streamex-sdk
          </span>
        </div>

        {/* Top-level nav */}
        <div className="flex flex-col gap-0.5">
          {navLink("/docs", "Installation")}
          {navLink("/docs", "Quick Start")}
          {navLink("/docs/tick-schema", "Tick Schema")}
        </div>

        {/* ── Frameworks ─────────────────────────────────────── */}
        <AccordionGroup label="Frameworks" defaultOpen={isOnFramework}>
          <div className="flex flex-col gap-0.5 pl-0 mt-1">
            {FRAMEWORKS.map(fw => {
              const href = `/docs/frameworks/${fw.id}`;
              const active = pathname === href;

              return (
                <div key={fw.id} className="relative">
                  {fw.ready ? (
                    <Link
                      href={href}
                      className={`flex items-center gap-2 text-xs py-1.5 transition-colors duration-150 ${active
                          ? "text-foreground font-medium"
                          : "text-muted-foreground hover:text-foreground"
                        }`}
                      style={{ fontFamily: "var(--font-mono,'IBM Plex Mono',monospace)" }}
                    >
                      <span className="text-muted-foreground/50 shrink-0 w-3 text-center text-[10px]">
                        {fw.icon}
                      </span>
                      {fw.name}
                    </Link>
                  ) : (
                    <span
                      className="flex items-center gap-2 text-xs py-1.5 text-muted-foreground/40 cursor-not-allowed select-none"
                      style={{ fontFamily: "var(--font-mono,'IBM Plex Mono',monospace)" }}
                    >
                      <span className="shrink-0 w-3 text-center text-[10px]">{fw.icon}</span>
                      {fw.name}
                      <span className="text-[9px] text-muted-foreground/30 ml-auto">soon</span>
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </AccordionGroup>

        {/* ── Exchanges ──────────────────────────────────────── */}
        <AccordionGroup label="Exchanges" defaultOpen={isOnExchange}>
          <div className="flex flex-col gap-0.5 mt-1">
            {/* All exchanges overview */}
            <Link
              href="/docs/exchanges"
              className={`text-xs py-1 block pl-0 mb-0.5 transition-colors duration-150 ${pathname === "/docs/exchanges"
                  ? "text-primary font-medium"
                  : "text-muted-foreground hover:text-foreground"
                }`}
              style={{ fontFamily: "var(--font-mono,'IBM Plex Mono',monospace)" }}
            >
              All exchanges
            </Link>

            {/* Individual exchange links */}
            {EXCHANGES.map(ex => {
              const href = `/docs/exchanges/${ex.id}`;
              const active = pathname === href;
              return (
                <Link
                  key={ex.id}
                  href={href}
                  className={`flex items-center gap-2 text-xs py-1 transition-colors duration-150 ${active
                      ? "text-foreground font-medium"
                      : "text-muted-foreground hover:text-foreground"
                    }`}
                  style={{ fontFamily: "var(--font-mono,'IBM Plex Mono',monospace)" }}
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full shrink-0 transition-colors"
                    style={{ background: active ? ex.color : "var(--muted-foreground)" }}
                  />
                  {ex.name}
                </Link>
              );
            })}
          </div>
        </AccordionGroup>

      </div>
    </aside>
  );
}