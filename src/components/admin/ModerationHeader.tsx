'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { useLogout } from '@/hooks/auth/useLogout'
import type { IGetUserData } from '@/types/auth.types'
import { getInitials } from '@/utils/get-initials'
import { useTranslations } from 'next-intl'
import { LogOut } from 'lucide-react'

export function ModerationHeader({ user }: { user: IGetUserData }) {
	const { logout } = useLogout()
	const t = useTranslations('moderation.header')
	const tCommon = useTranslations('moderation.common')

	return (
		<header
			className='
				sticky top-0 z-40 shrink-0
				h-[60px] md:h-16
				border-b border-border/50
				bg-background/75 backdrop-blur-xl
				shadow-sm shadow-black/5
				flex items-center justify-between px-4 md:px-8
			'
		>
			<div className='flex items-center gap-3 min-w-0'>
				<div className='hidden sm:block h-8 w-px bg-gradient-to-b from-transparent via-primary/50 to-transparent rounded-full' aria-hidden />
				<div className='min-w-0'>
					<h1 className='text-lg md:text-xl font-semibold tracking-tight truncate'>
						{t('title')}
					</h1>
					<p className='text-[10px] md:text-[11px] uppercase tracking-[0.14em] text-muted-foreground font-medium'>
						Loomio
					</p>
				</div>
			</div>

			<div className='flex items-center gap-2 md:gap-3'>
				<Avatar className='size-9 ring-2 ring-border/80 shadow-md'>
					<AvatarImage src={user.avatarUrl || undefined} alt={tCommon('avatarAlt')} />
					<AvatarFallback>{getInitials(user.username)}</AvatarFallback>
				</Avatar>

				<Button
					variant='outline'
					size='sm'
					onClick={() => logout()}
					className='rounded-full border-border/60 gap-2 shadow-sm hover:bg-muted/60'
				>
					<LogOut className='size-4 opacity-80' />
					<span className='hidden sm:inline'>{t('logout')}</span>
				</Button>
			</div>
		</header>
	)
}
