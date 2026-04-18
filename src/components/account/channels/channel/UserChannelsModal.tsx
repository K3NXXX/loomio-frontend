'use client'

import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import UserChannelsList from '../UserChannelsList'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { X } from 'lucide-react'
import CreateChannelModal from '@/components/account/channels/CreateChannelModal'

interface Props {
	open: boolean
	onOpenChange: (v: boolean) => void
}

export function UserChannelsModal({ open, onOpenChange }: Props) {
	const t = useTranslations()
	const [search, setSearch] = useState('')
	const [isCreateOpen, setIsCreateOpen] = useState(false)

	return (
		<>
			<Dialog open={open} onOpenChange={onOpenChange}>
				<DialogContent className='w-[calc(100%-1rem)]'>
					<DialogHeader className='space-y-2'>
						<DialogTitle>{t('accountPage.channelsModal.title')}</DialogTitle>
						<p className='text-sm text-muted-foreground'>
							{t('accountPage.channelsModal.descriptionPrefix')}{' '}
							<button
								onClick={() => setIsCreateOpen(true)}
								className='text-primary hover:underline cursor-pointer font-bold'
							>
								{t('accountPage.channelsModal.createNewInline')}
							</button>
						</p>
					</DialogHeader>

					<div className='mt-4 relative'>
						<Input
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							placeholder={t('accountPage.channelsModal.searchPlaceholder')}
							className='h-9 pr-10 text-sm'
						/>

						{search && (
							<button
								onClick={() => setSearch('')}
								className='absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-md hover:bg-muted'
							>
								<X size={16} />
							</button>
						)}
					</div>

					<div className='mt-4 min-h-[150px]'>
						<UserChannelsList search={search} />
					</div>
				</DialogContent>
			</Dialog>

			<CreateChannelModal open={isCreateOpen} onOpenChange={setIsCreateOpen} />
		</>
	)
}
