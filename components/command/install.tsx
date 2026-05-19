'use client';
import { useState } from 'react';
import { Check, Copy } from 'lucide-react';

export function InstallSnippet() {
	const [manager, setManager] = useState<'npm' | 'bun'>('npm');
	const [copied, setCopied] = useState(false);

	const commands = {
		npm: 'npm install vortex-stream@beta',
		bun: 'bun add vortex-stream@beta',
	};

	const currentCommand = commands[manager];

	const copyToClipboard = async () => {
		await navigator.clipboard.writeText(currentCommand);

		setCopied(true);

		setTimeout(() => {
			setCopied(false);
		}, 2000);
	};

	return (
		<div className="w-full max-w-2xl rounded-2xl border border-border bg-card shadow-2xl overflow-hidden">
			{/* Header */}
			<div className="flex items-center justify-between border-b border-border px-4 py-2">
				{/* Terminal dots */}
				<div className="flex items-center gap-2">
					<div className="h-3 w-3 rounded-full bg-red-500" />
					<div className="h-3 w-3 rounded-full bg-yellow-500" />
					<div className="h-3 w-3 rounded-full bg-green-500" />
				</div>

				{/* Package Manager Toggle */}
				<div className="flex items-center rounded-lg bg-card p-1">
					<button
						onClick={() => setManager('npm')}
						className={`px-3 py-1 text-sm rounded-md cursor-pointer transition-all ${manager === 'npm'
							? 'bg-card-foreground text-white dark:text-black'
							: 'text-black/60 dark:text-white/60 hover:text-white'
							}`}
					>
						npm
					</button>
					<button
						onClick={() => setManager('bun')}
						className={`px-3 py-1 text-sm rounded-md cursor-pointer transition-all ${manager === 'bun'
							? 'bg-card-foreground text-white dark:text-black'
							: 'text-black/60 dark:text-white/60 hover:text-white'
							}`}
					>
						bun
					</button>
				</div>
			</div>

			{/* Code */}
			<div className="flex items-center justify-between px-5 py-2 font-mono text-sm">
				<div className="flex items-center gap-3 overflow-hidden">
					<span className="text-green-400">$</span>

					<code className="whitespace-nowrap overflow-x-auto">
						{currentCommand}
					</code>
				</div>

				{/* Copy Button */}
				<button
					onClick={copyToClipboard}
					className="ml-4 flex h-9 w-9 items-center justify-center cursor-pointer rounded-lg border border-border bg-muted text-card-foreground transition-all hover:bg-white/10 "
				>
					{copied ? (
						<Check size={16} />
					) : (
						<Copy size={16} />
					)}
				</button>
			</div>
		</div>
	);
}