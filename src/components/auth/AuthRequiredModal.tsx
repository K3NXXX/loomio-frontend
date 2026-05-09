'use client'

import { Button } from '@/components/ui/button'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import { PAGES } from '@/constants/pages.constants'
import { useAuthPromptStore } from '@/zustand/store/authPromptStore'
import { useTranslations } from 'next-intl'
import Link from 'next/link'

export function AuthRequiredModal() {
	const open = useAuthPromptStore((s) => s.open)
	const closeAuthPrompt = useAuthPromptStore((s) => s.closeAuthPrompt)
	const t = useTranslations()

	return (
		<Dialog
			open={open}
			onOpenChange={(next) => {
				if (!next) closeAuthPrompt()
			}}
		>
			<DialogContent className='border-neutral-700 bg-neutral-900 text-neutral-100 sm:max-w-md'>
				<DialogHeader>
					<DialogTitle>{t('guestAuth.modalTitle')}</DialogTitle>
					<DialogDescription className='text-neutral-400'>
						{t('guestAuth.modalDescription')}
					</DialogDescription>
				</DialogHeader>
				<DialogFooter className='gap-2 sm:justify-end'>
					<Button variant='outline' className='rounded-full' asChild>
						<Link href={PAGES.LOGIN} onClick={closeAuthPrompt}>
							{t('guestAuth.logIn')}
						</Link>
					</Button>
					<Button className='rounded-full' asChild>
						<Link href={PAGES.SIGNUP} onClick={closeAuthPrompt}>
							{t('guestAuth.signUp')}
						</Link>
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
