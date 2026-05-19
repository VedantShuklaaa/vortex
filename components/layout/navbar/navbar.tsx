import Link from "next/link";
import { ThemeToggleButton } from "../theme-toggle/theme-button";
import { ChevronRight } from "lucide-react";

export default function Navbar() {
	return (
		<div className="h-20 w-full font-mono bg-white/3 backdrop-blur-md border-white/10">
			<div className="max-w-7xl mx-auto h-full flex items-center px-6">

				{/* Left — logo */}
				<div className="flex-1 flex justify-start">
					<span className="text-sm">Vortex-Stream</span>
				</div>

				{/* Centre — nav links */}
				<div className="flex-1 flex justify-center gap-6">
					<Link className="text-sm hover:text-primary transition-all" href="#features">Features</Link>
					<Link className="text-sm hover:text-primary transition-all" href="#faq">FAQ</Link>
					<Link className="text-sm hover:text-primary transition-all" href="/docs">Docs</Link>
				</div>

				{/* Right — actions */}
				<div className="flex-1 flex justify-end items-center gap-2">
					<span className="h-8 px-4 text-sm flex items-center cursor-pointer">Github</span>
					<button className="h-8 px-4 text-sm flex items-center gap-1 rounded-xl bg-primary text-black hover:bg-primary/90 hover:scale-105 transition-all cursor-pointer">
						Try It Now
						<ChevronRight height={20} width={20} />
					</button>
					<ThemeToggleButton variant="polygon" blur start="top-left" />
				</div>

			</div>
		</div>
	)
}