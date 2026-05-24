"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { ThemeToggleButton } from "../theme-toggle/theme-button";
import { ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Navbar() {
	const router = useRouter();

	const [stars, setStars] = useState<number | null>(null);

	useEffect(() => {
		fetch("https://api.github.com/repos/VedantShuklaaa/vortex-stream")
			.then(res => res.json())
			.then(data => {
				setStars(data.stargazers_count);
			})
			.catch(() => { });
	}, []);

	return (
		<div className="h-20 w-full font-mono bg-white/3 backdrop-blur-md border-white/10">
			<div className="max-w-7xl mx-auto h-full flex items-center px-6">

				{/* Left — logo */}
				<div className="flex-1 flex justify-start">
					<Link href="/" className="text-sm">Vortex-Stream</Link>
				</div>

				{/* Centre — nav links */}
				<div className="flex-1 flex justify-center gap-6">
					<Link className="text-sm hover:text-primary transition-all" href="/#features">Features</Link>
					<Link className="text-sm hover:text-primary transition-all" href="/#faq">FAQ</Link>
					<Link className="text-sm hover:text-primary transition-all" href="/docs">Docs</Link>
				</div>

				{/* Right — actions */}
				<div className="flex-1 flex justify-end items-center gap-2">
					<Link href="https://github.com/VedantShuklaaa/vortex-stream"
						target="_blank"
						rel="noopener noreferrer"
						className="h-8 px-2 text-sm flex items-center cursor-pointer rounded-lg gap-2 hover:bg-background">
						<svg
							width="30"
							height="30"
							viewBox="0 0 24 24"
							fill="currentColor"
							className="text-foreground"
						>
							<path d="M12 .5C5.65.5.5 5.65.5 12a11.5 11.5 0 008 10.93c.58.1.79-.25.79-.56v-2.17c-3.25.7-3.93-1.56-3.93-1.56-.53-1.34-1.3-1.7-1.3-1.7-1.06-.72.08-.7.08-.7 1.17.08 1.79 1.2 1.79 1.2 1.04 1.77 2.72 1.26 3.39.96.1-.75.4-1.26.73-1.55-2.6-.3-5.34-1.3-5.34-5.8 0-1.28.46-2.33 1.2-3.15-.12-.3-.52-1.52.11-3.17 0 0 .98-.31 3.2 1.2a11.1 11.1 0 015.82 0c2.22-1.51 3.2-1.2 3.2-1.2.63 1.65.23 2.87.11 3.17.75.82 1.2 1.87 1.2 3.15 0 4.51-2.74 5.5-5.35 5.79.42.37.8 1.1.8 2.23v3.3c0 .31.21.67.8.56A11.5 11.5 0 0023.5 12C23.5 5.65 18.35.5 12 .5z" />
						</svg>

						<span className="tex-lg text-foreground">
							{stars != null ? `${stars}` : "GitHub"}
						</span>
					</Link>
					<button
						className="h-8 px-4 text-sm flex items-center gap-1 rounded-xl bg-primary text-black hover:bg-primary/90 hover:scale-105 transition-all cursor-pointer"
						onClick={() => { router.push("/trial") }}
					>
						Try It Now
						<ChevronRight height={20} width={20} />
					</button>
					<ThemeToggleButton variant="polygon" blur start="top-left" />
				</div>

			</div>
		</div>
	)
}