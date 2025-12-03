'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export function RightSidebar({ report }: any) {
	const UserItem = ({ label, user }: any) => (
		<div className='space-y-3 min-h-[82px]'>
			<div className='text-[11px] uppercase tracking-wide text-muted-foreground/70 font-semibold'>
				{label}
			</div>

			{user ? (
				<div className='flex items-center gap-3'>
					<Avatar className='w-10 h-10'>
						<AvatarImage src={user.avatarUrl || ''} />
						<AvatarFallback>{user.username?.[0]?.toUpperCase()}</AvatarFallback>
					</Avatar>
					<div className='text-sm font-medium'>@{user.username}</div>
				</div>
			) : (
				<div className='text-sm text-muted-foreground'>None</div>
			)}

			<div className='h-[1px] bg-border/30 w-full' />
		</div>
	)

	return (
		<div
			className='
				border-l border-border/20 
				bg-muted/15 
				p-8 
				space-y-8 
				overflow-y-auto 
				backdrop-blur-sm
				shadow-inner
			'
		>
			<UserItem label='Assigned To' user={report.assignedTo} />
			<UserItem label='Comment Author' user={report.comment?.user} />
			<UserItem label='Reported By' user={report.author} />

			<div className='space-y-3'>
				<div className='text-[11px] uppercase tracking-wide text-muted-foreground/70 font-semibold'>
					Reported At
				</div>

				<div className='text-sm text-foreground'>
					{new Date(report.createdAt).toLocaleString('en-GB')}
				</div>
			</div>
		</div>
	)
}
