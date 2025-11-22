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
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export function DangerZone() {
	const { channel } = useChannelStore()
	const requiredPhrase = `delete channel @${channel?.username}`
	const [value, setValue] = useState('')

	const router = useRouter()

	const { deleteChannel, deleteChannelLoading } = useDeleteChannel(() => {
		router.push(PAGES.CHANNELS)
	})

	return (
		<div className='p-10 flex flex-col items-start space-y-10'>
			<div className='sticky top-[73px] z-30 bg-background/80 backdrop-blur border-b border-border/40 w-full py-3'>
				<h1 className='text-[25px] font-bold tracking-tight'>
					Channel danger zone
				</h1>
			</div>

			<div className='w-full border border-destructive/40 bg-destructive/10 rounded-xl p-6 space-y-4'>
				<h2 className='text-lg font-semibold text-destructive'>
					Delete this channel
				</h2>

				<p className='text-sm text-muted-foreground'>
					Deleting your channel is a permanent action and cannot be undone. All
					videos, comments, playlists, followers, statistics, and branding
					associated with this channel will be permanently removed. Make sure
					you have saved any important content before continuing.
				</p>

				<Dialog>
					<DialogTrigger asChild>
						<Button variant='destructive' className='mt-2 rounded-full px-6'>
							Delete channel
						</Button>
					</DialogTrigger>

					<DialogContent className='max-w-[420px] p-6'>
						<DialogHeader className='space-y-1.5'>
							<DialogTitle className='text-xl font-semibold'>
								Delete channel?
							</DialogTitle>

							<DialogDescription className='text-sm leading-relaxed text-muted-foreground'>
								This action is permanent and cannot be undone. All content
								associated with this channel will be removed.
							</DialogDescription>
						</DialogHeader>

						<div className='flex items-center gap-2 text-sm font-medium mt-4'>
							<span className='text-foreground'>
								Type the confirmation phrase:
							</span>

							<span className='text-destructive'>{requiredPhrase}</span>
						</div>

						<Input
							value={value}
							placeholder='Enter the phrase above'
							onChange={(e) => setValue(e.target.value)}
						/>

						<DialogFooter className='flex justify-end gap-3 pt-4'>
							<DialogClose asChild>
								<Button variant='outline' className='rounded-full px-5'>
									Cancel
								</Button>
							</DialogClose>

							<Button
								disabled={value !== requiredPhrase}
								variant='destructive'
								className='rounded-full px-6 relative w-[142px]'
								onClick={() => deleteChannel(channel.id)}
							>
								{deleteChannelLoading ? (
									<Lottie
										animationData={loader}
										loop={true}
										className='absolute w-15 h-15'
									/>
								) : (
									'	Delete channel'
								)}
							</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>
			</div>
		</div>
	)
}
