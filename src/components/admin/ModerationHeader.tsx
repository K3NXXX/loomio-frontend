'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { useLogout } from '@/hooks/auth/useLogout'
import type { IGetUserData } from '@/types/auth.types'
import { getInitials } from '@/utils/get-initials'
import { useTranslations } from 'next-intl'

export function ModerationHeader({ user }: { user: IGetUserData }) {
	const { logout } = useLogout()
	const t = useTranslations('moderation.header')

	return (
		<header
			className='
			sticky top-0 z-50
			h-16 border-b border-neutral-800
			bg-background/70 backdrop-blur-xl
			flex items-center justify-between px-6
		'
		>
			<h1 className='text-xl font-semibold'>{t('title')}</h1>

			<div className='flex items-center gap-3'>
				<Avatar className='size-9 ring-1 ring-border'>
					<AvatarImage src={user.avatarUrl || ''} />
					<AvatarFallback>{getInitials(user.username)}</AvatarFallback>
				</Avatar>

				<Button variant='outline' onClick={() => logout()}>
					{t('logout')}
				</Button>
			</div>
		</header>
	)
}
