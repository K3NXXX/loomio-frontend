'use client'

import { Button } from '@/components/ui/button'
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useCreatePlaylist } from '@/hooks/playlists/useCreatePlaylist'
import { useCreatePlaylistErrors } from '@/hooks/playlists/useCreatePlaylistErrors'
import {
	createPlaylistSchema,
	type TCreatePlaylistSchema,
} from '@/schemas/playlists/create-playlist.schema'
import type { ICreatePlaylistRequest } from '@/types/playlist.types'

import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { useForm } from 'react-hook-form'

interface CreatePlaylistModalProps {
	open: boolean
	onOpenChange: (open: boolean) => void
}

export function CreatePlaylistModal({
	open,
	onOpenChange,
}: CreatePlaylistModalProps) {
	const t = useTranslations()
	const {
		register,
		handleSubmit,
		reset,
		formState: { isSubmitting, isValid, errors },
	} = useForm<TCreatePlaylistSchema>({
		resolver: zodResolver(createPlaylistSchema),
		reValidateMode: 'onSubmit',
		defaultValues: { name: '', description: '' },
	})

	const { createPlaylist } = useCreatePlaylist()

	const onSubmit = (data: ICreatePlaylistRequest) => {
		createPlaylist(data, {
			onSuccess: () => {
				onOpenChange(false)
				reset()
			},
		})
	}

	useCreatePlaylistErrors(errors)

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent
				onInteractOutside={(e) => e.preventDefault()}
				className='w-[calc(100%-1rem)] max-w-md rounded-2xl border border-neutral-800 bg-neutral-950/95 text-white shadow-2xl backdrop-blur-xl p-0'
			>
				<DialogHeader className='px-5 pt-5 pb-3 border-b border-neutral-800'>
					<DialogTitle className='text-base font-semibold'>
						{t('playlists.createModalTitle')}
					</DialogTitle>
				</DialogHeader>

				<form
					onSubmit={handleSubmit(onSubmit)}
					className='p-5 flex flex-col gap-5 max-w-[500px]'
				>
					<div className='space-y-2'>
						<Label htmlFor='playlist-name' className='text-sm text-neutral-300'>
							{t('playlists.nameLabel')}
						</Label>
						<Input
							id='playlist-name'
							placeholder={t('playlists.namePlaceholder')}
							className='bg-neutral-900/60 border-neutral-800 focus-visible:ring-primary'
							{...register('name')}
						/>
					</div>

					<div className='space-y-2'>
						<Label
							htmlFor='playlist-description'
							className='text-sm text-neutral-300'
						>
							{t('playlists.descriptionLabel')}
						</Label>
						<Textarea
							id='playlist-description'
							placeholder={t('playlists.descriptionPlaceholder')}
							className='bg-neutral-900/60 border-neutral-800 focus-visible:ring-primary resize-none min-h-[80px]'
							{...register('description')}
						/>
					</div>

					<div className='flex justify-end gap-3 pt-3'>
						<Button
							type='button'
							variant='secondary'
							className='bg-neutral-800/70 text-white hover:bg-neutral-800 rounded-xl px-6 py-2.5'
							onClick={() => {
								onOpenChange(false)
								reset()
							}}
						>
							{t('common.cancel')}
						</Button>

						<Button
							type='submit'
							disabled={!isValid || isSubmitting}
							className='bg-primary text-primary-foreground font-semibold rounded-xl px-6 py-2.5 hover:bg-primary/90 disabled:opacity-50 disabled:pointer-events-none'
						>
							{isSubmitting ? (
								<Lottie animationData={loader} loop className='w-10 h-10' />
							) : (
								t('playlists.createButton')
							)}
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	)
}
