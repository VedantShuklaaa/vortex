import { cn } from "@/lib/utils";

export function GridBackgroundDemo() {
	return (
		<div className="relative flex h-screen w-full items-center justify-center bg-white dark:bg-black">

			{/* Grid */}
			<div
				className={cn(
					"absolute inset-0",
					"[background-size:40px_40px]",
					"[background-image:linear-gradient(to_right,#e4e4e7_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e7_1px,transparent_1px)]",
					"dark:[background-image:linear-gradient(to_right,#262626_1px,transparent_1px),linear-gradient(to_bottom,#262626_1px,transparent_1px)]",
				)}
			/>

			{/* Radial vignette */}
			<div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_1%,black)] dark:bg-black" />

			{/* Edge fades — all z-10 so they sit above the grid */}
			<div className="absolute top-0    z-10 w-full h-44  bg-gradient-to-b from-background to-transparent" />
			<div className="absolute bottom-0 z-10 w-full h-44  bg-gradient-to-t from-background to-transparent" />
			<div className="absolute left-0   z-10 h-full w-52  bg-gradient-to-r from-background to-transparent" />
			<div className="absolute right-0  z-10 h-full w-52  bg-gradient-to-l from-background to-transparent" />

		</div>
	);
}