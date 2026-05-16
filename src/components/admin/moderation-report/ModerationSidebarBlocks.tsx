'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export function ModerationSidebarUserBlock({
	label,
	user,
	noneText,
}: {
	label: string
	user:
		| { username?: string; avatarUrl?: string | null }
		| null
		| undefined
	noneText: string
}) {
	return (
		<div className='rounded-xl border border-border/45 bg-card/55 p-4 shadow-sm ring-1 ring-border/40'>
			<div className='text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-3'>
				{label}
			</div>
			{user ? (
				<div className='flex items-center gap-3'>
					<Avatar className='h-10 w-10 ring-2 ring-background shadow-sm'>
						<AvatarImage src={user.avatarUrl ?? undefined} />
						<AvatarFallback className='text-xs font-medium'>
							{user.username?.[0]?.toUpperCase()}
						</AvatarFallback>
					</Avatar>
					<div className='text-sm font-medium truncate'>
						@{user.username}
					</div>
				</div>
			) : (
				<div className='text-sm text-muted-foreground'>{noneText}</div>
			)}
		</div>
	)
}

export function ModerationSidebarMetaBlock({
	label,
	value,
}: {
	label: string
	value: string
}) {
	return (
		<div className='rounded-xl border border-border/45 bg-card/55 p-4 shadow-sm ring-1 ring-border/40'>
			<div className='text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-2'>
				{label}
			</div>
			<div className='text-sm font-medium text-foreground tabular-nums leading-snug'>
				{value}
			</div>
		</div>
	)
}
