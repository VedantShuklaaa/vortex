"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { EXCHANGES } from "@/lib/exchanges";

function PulseDot() {
  return (
    <span className="relative flex h-1.5 w-1.5 shrink-0">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-60 bg-primary" />
      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary" />
    </span>
  );
}

export function DocsSidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(pathname.includes("/exchanges"));

  const navLink = (href: string, label: string) => {
    const active = pathname === href;
    return (
      <Link
        href={href}
        className={`text-xs py-1.5 block transition-colors duration-150 font-mono ${active
          ? "text-primary font-medium"
          : "text-muted-foreground hover:text-foreground"
          }`}
      >
        {label}
      </Link>
    );
  };

  return (
    <aside className="hidden lg:flex flex-col w-52 shrink-0">
      <div className="sticky top-25 flex flex-col">

        {/* Brand */}
        <div className="flex items-center gap-2 mb-6">
          <PulseDot />
          <span className="text-xs text-primary font-mono">
            vortex-stream-sdk
          </span>
        </div>

        {/* Top nav */}
        <div className="flex flex-col gap-0.5 mb-4">
          {navLink("/docs#installation", "Installation")}
          {navLink("/docs#quick-start", "Quick Start")}
        </div>

        <div className="border-t border-border pt-4">
          {/* Exchanges toggle */}
          <button
            onClick={() => setOpen(o => !o)}
            className="w-full flex items-center justify-between group mb-1"
          >
            <span
              className={`text-xs py-1.5 transition-colors duration-150 ${pathname.includes("/exchanges")
                ? "text-primary font-medium"
                : "text-muted-foreground group-hover:text-foreground"
                }`}
              style={{ fontFamily: "var(--font-mono,'IBM Plex Mono',monospace)" }}
            >
              Exchanges
            </span>
            <motion.svg
              animate={{ rotate: open ? 90 : 0 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              width="10" height="10" viewBox="0 0 10 10" fill="none"
              className="text-muted-foreground shrink-0"
            >
              <path d="M3 2l4 3-4 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </motion.svg>
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
                {/* All exchanges overview link */}
                <Link
                  href="/docs/exchanges"
                  className={`text-xs py-1 block pl-3 mb-1 transition-colors duration-150 font-mono ${pathname === "/docs/exchanges"
                    ? "text-primary font-medium"
                    : "text-muted-foreground hover:text-foreground"
                    }`}
                >
                  All exchanges ↗
                </Link>

                {/* Individual exchange links */}
                <div className="flex flex-col gap-0.5 pl-3">
                  {EXCHANGES.map(ex => {
                    const active = pathname === `/docs/exchanges/${ex.id}`;
                    return (
                      <Link
                        key={ex.id}
                        href={`/docs/exchanges/${ex.id}`}
                        className={`flex items-center gap-2 text-xs py-1 transition-colors duration-150 ${active
                          ? "text-foreground font-medium"
                          : "text-muted-foreground hover:text-foreground"
                          }`}
                        style={{ fontFamily: "var(--font-mono,'IBM Plex Mono',monospace)" }}
                      >
                        <span
                          className="w-1.5 h-1.5 rounded-full shrink-0"
                          style={{ background: active ? ex.color : undefined }}
                        />
                        {ex.name}
                      </Link>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </aside>
  );
}