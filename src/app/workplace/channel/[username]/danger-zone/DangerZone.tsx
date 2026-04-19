'use client'

import loader from '@/assets/animations/loader.json'
import { Button } from '@/components/ui/button'
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { PAGES } from '@/constants/pages.constants'
import { useDeleteChannel } from '@/hooks/channel/useDeleteChannel'
import { useChannelStore } from '@/zustand/store/channelStore'
import Lottie from 'lottie-react'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export function DangerZone() {
	const { channel } = useChannelStore()
	const t = useTranslations('workplaceDangerZone')
	const username = channel?.username ?? ''
	const requiredPhrase = t('confirmPhrase', { username })
	const [value, setValue] = useState('')

	const router = useRouter()

	const { deleteChannel, deleteChannelLoading } = useDeleteChannel(() => {
		router.replace(PAGES.CHANNELS)
	})

	return (
		<div className='p-4 min-[500px]:p-6 min-[980px]:p-10 flex flex-col items-start space-y-6 min-[980px]:space-y-10'>
			<div className='sticky top-[73px] z-30 bg-background/80 backdrop-blur border-b border-border/40 w-full py-3'>
				<h1 className='text-lg min-[400px]:text-xl min-[980px]:text-[25px] font-bold tracking-tight'>
					{t('pageTitle')}
				</h1>
			</div>

			<div className='w-full border border-destructive/40 bg-destructive/10 rounded-xl p-4 min-[500px]:p-6 space-y-3 min-[500px]:space-y-4'>
				<h2 className='text-base min-[500px]:text-lg font-semibold text-destructive'>
					{t('deleteSectionTitle')}
				</h2>

				<p className='text-xs min-[500px]:text-sm text-muted-foreground'>
					{t('deleteWarning')}
				</p>

				<Dialog>
					<DialogTrigger asChild>
						<Button
							variant='destructive'
							className='mt-2 rounded-full px-4 min-[500px]:px-6 text-xs min-[500px]:text-sm'
						>
							{t('openDialogButton')}
						</Button>
					</DialogTrigger>

					<DialogContent className='w-[calc(100%-1rem)] max-w-[420px] p-4 min-[500px]:p-6'>
						<DialogHeader className='space-y-1.5'>
							<DialogTitle className='text-base min-[500px]:text-xl font-semibold'>
								{t('dialogTitle')}
							</DialogTitle>

							<DialogDescription className='text-xs min-[500px]:text-sm leading-relaxed text-muted-foreground'>
								{t('dialogDescription')}
							</DialogDescription>
						</DialogHeader>

						<div className='flex flex-wrap items-center gap-x-2 gap-y-1 text-xs min-[500px]:text-sm font-medium mt-3 min-[500px]:mt-4'>
							<span className='text-foreground'>{t('confirmPhraseLabel')}</span>
							<span className='text-destructive break-all'>
								{requiredPhrase}
							</span>
						</div>

						<Input
							value={value}
							placeholder={t('phrasePlaceholder')}
							onChange={(e) => setValue(e.target.value)}
							className='text-xs min-[500px]:text-sm'
						/>

						<DialogFooter className='flex justify-end gap-2 min-[500px]:gap-3 pt-3 min-[500px]:pt-4'>
							<DialogClose asChild>
								<Button
									variant='outline'
									className='rounded-full px-3 min-[500px]:px-5 text-xs min-[500px]:text-sm h-8 min-[500px]:h-10'
								>
									{t('cancel')}
								</Button>
							</DialogClose>

							<Button
								disabled={value !== requiredPhrase || channel?.id == null}
								variant='destructive'
								className='rounded-full px-4 min-[500px]:px-6 relative w-[120px] min-[500px]:w-[142px] text-xs min-[500px]:text-sm h-8 min-[500px]:h-10'
								onClick={() => {
									if (channel?.id != null) deleteChannel(channel.id)
								}}
							>
								{deleteChannelLoading ? (
									<Lottie
										animationData={loader}
										loop={true}
										className='absolute w-12 h-12 min-[500px]:w-15 min-[500px]:h-15'
									/>
								) : (
									t('confirmDeleteButton')
								)}
							</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>
			</div>
		</div>
	)
}
