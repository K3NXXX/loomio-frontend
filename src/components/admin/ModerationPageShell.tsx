'use client'

import type { ReactNode } from 'react'

interface ModerationPageShellProps {
	title: string
	subtitle?: string
	children: ReactNode
}

export function ModerationPageShell({
	title,
	subtitle,
	children,
}: ModerationPageShellProps) {
	return (
		<div className='mx-auto max-w-[1600px] w-full space-y-6 pb-16'>
			<header className='relative rounded-2xl border border-border/45 bg-gradient-to-br from-card/95 via-card/55 to-card/25 px-6 py-7 md:px-10 md:py-8 shadow-lg ring-1 ring-border/50'>
				<div
					className='pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/45 to-transparent'
					aria-hidden
				/>
				<div className='absolute left-6 top-0 h-1 w-14 rounded-b-full bg-primary md:left-10 shadow-[0_4px_24px_-2px_var(--primary)] opacity-90' />
				<h1 className='text-2xl md:text-[26px] font-bold tracking-tight text-foreground'>
					{title}
				</h1>
				{subtitle ? (
					<p className='mt-2.5 text-sm text-muted-foreground max-w-2xl leading-relaxed'>
						{subtitle}
					</p>
				) : null}
			</header>
			{children}
		</div>
	)
}
