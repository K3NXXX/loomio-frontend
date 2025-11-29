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
import {
	editPlaylistSchema,
	type TEditPlaylistSchema,
} from '@/schemas/playlists/edit-playlist.schema'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import loader from '@/assets/animations/loader.json'
import { useEditPlaylist } from '@/hooks/playlists/useEditPlaylist'
import { useEditPlaylistErrors } from '@/hooks/playlists/useEditPlaylistErrors'
import { IEditPlaylistRequest } from '@/types/playlist.types'
import Lottie from 'lottie-react'

interface EditPlaylistModalProps {
	open: boolean
	onOpenChange: (open: boolean) => void
	initialData: {
		id: string
		name: string
		description?: string | null
	}
}

export function EditPlaylistModal({
	open,
	onOpenChange,
	initialData,
}: EditPlaylistModalProps) {
	const {
		register,
		handleSubmit,
		reset,
		formState: { isSubmitting, isValid, errors },
	} = useForm<TEditPlaylistSchema>({
		resolver: zodResolver(editPlaylistSchema),
		reValidateMode: 'onSubmit',
		defaultValues: {
			name: initialData.name || '',
			description: initialData.description || '',
		},
	})

	const { editPlaylist } = useEditPlaylist()

	const onSubmit = (data: IEditPlaylistRequest) => {
		editPlaylist(
			{
				id: initialData.id,
				name: data.name,
				description: data.description,
			},
			{
				onSuccess: () => {
					onOpenChange(false)
					reset()
				},
			},
		)
	}

	useEditPlaylistErrors(errors)

	return (
		<div onClick={(e) => e.stopPropagation()}>
			<Dialog open={open} onOpenChange={onOpenChange}>
				<DialogContent
					onClick={(e) => e.stopPropagation()}
					className='w-full max-w-md rounded-2xl border border-neutral-800 bg-neutral-950/95 text-white shadow-2xl backdrop-blur-xl p-0'
				>
					<DialogHeader className='px-5 pt-5 pb-3 border-b border-neutral-800'>
						<DialogTitle className='text-base font-semibold'>
							Edit Playlist
						</DialogTitle>
					</DialogHeader>

					<form
						onSubmit={handleSubmit(onSubmit)}
						className='p-5 flex flex-col gap-5 max-w-[500px]'
					>
						<div className='space-y-2'>
							<Label
								htmlFor='playlist-name'
								className='text-sm text-neutral-300'
							>
								Name (required)
							</Label>
							<Input
								id='playlist-name'
								placeholder='Enter playlist name'
								className='bg-neutral-900/60 border-neutral-800 focus-visible:ring-primary'
								{...register('name')}
							/>
						</div>

						<div className='space-y-2'>
							<Label
								htmlFor='playlist-description'
								className='text-sm text-neutral-300'
							>
								Description (optional)
							</Label>
							<Textarea
								id='playlist-description'
								placeholder='Add an optional description...'
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
								Cancel
							</Button>

							<Button
								type='submit'
								disabled={!isValid || isSubmitting}
								className='bg-primary text-primary-foreground font-semibold rounded-xl px-6 py-2.5 hover:bg-primary/90 disabled:opacity-50 disabled:pointer-events-none'
							>
								{isSubmitting ? (
									<Lottie animationData={loader} loop className='w-10 h-10' />
								) : (
									'Save changes'
								)}
							</Button>
						</div>
					</form>
				</DialogContent>
			</Dialog>
		</div>
	)
}
