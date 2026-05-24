// app/docs/layout.tsx
import { DocsSidebar } from "@/components/layout/sidebar/docSidebar";

export default function DocsLayout({ children }: { children: React.ReactNode }) {
	return (
		<div className="min-h-screen bg-background text-foreground">
			<div className="max-w-5xl mx-auto px-6 py-12 flex gap-16">
				<DocsSidebar />
				<main className="flex-1 min-w-0">{children}</main>
			</div>

		</div>
	);
}