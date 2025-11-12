'use client'

import loader from '@/assets/animations/loader.json'
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import { MdEdit } from 'react-icons/md'

import { Button } from '@/components/ui/button'
import { useEditVideo } from '@/hooks/videos/useEditVideo'
import {
	editVideoSchema,
	type TEditVideoSchema,
} from '@/schemas/videos/edit-video.schema'
import type { IAddVideoRequest, IEditVideoRequest } from '@/types/video.types'
import { useVideoStore } from '@/zustand/store/videoStore'
import { zodResolver } from '@hookform/resolvers/zod'
import Lottie from 'lottie-react'
import { useEffect, useState } from 'react'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { toast } from 'sonner'
import { EditVideoPreview } from './EditVideoPreview'
import { EditVideoStepFirst } from './EditVideoStepFirst'
import { EditVideoSteps } from './EditVideoSteps'
import { EditVideoStepSecond } from './EditVideoStepSecond'
import { EditVideoStepThird } from './EditVideoStepThird'

interface IEditVideoModalProps {
	open: boolean
	onOpenChange: (open: boolean) => void
}

export function EditVideoModal({ open, onOpenChange }: IEditVideoModalProps) {
	const {
		register,
		handleSubmit,
		setValue,
		reset,
		trigger,
		getFieldState,
		watch,
	} = useForm<TEditVideoSchema>({
		resolver: zodResolver(editVideoSchema),
		reValidateMode: 'onSubmit',
	})

	const [isLoading, setIsLoading] = useState(false)
	const [fileName, setFileName] = useState<string>('')
	const [previewUrl, setPreviewUrl] = useState<string | null>(null)
	const [steps, setSteps] = useState(1)
	const { editVideo } = useEditVideo()

	const {
		setThumbnailFile,
		setThumbnailPreview,
		uploadChannelId,
		editingVideo,
	} = useVideoStore()

	const handleBack = () => {
		if (steps > 1) {
			setSteps((prev: number) => prev - 1)
		} else {
			setFileName('')
			setPreviewUrl(null)
			reset()
		}
	}

	const handleNextStep = async (e?: React.MouseEvent<HTMLButtonElement>) => {
		e?.preventDefault()

		if (steps === 1) {
			const isValid = await trigger(['title', 'tags'])
			if (!isValid) {
				const titleState = getFieldState('title')
				if (titleState.error) toast.error(titleState.error.message)
				const tagsState = getFieldState('tags')
				if (tagsState.error?.message) toast.error(tagsState.error.message)
				return
			}
			setSteps(2)
			return
		}

		if (steps === 2) {
			const isValid = await trigger(['thumbnail', 'visibility', 'audience'])
			if (!isValid) {
				const thumbErr = getFieldState('thumbnail').error?.message
				const visErr = getFieldState('visibility').error?.message
				const audErr = getFieldState('audience').error?.message
				toast.error(thumbErr || visErr || audErr)
				return
			}

			if (editingVideo?.publishType === 'scheduled') {
				setSteps(3)
				return
			}
		}
	}

	const onSubmit: SubmitHandler<TEditVideoSchema> = (data) => {
		setIsLoading(true)

		if (!editingVideo) {
			toast.error('No video selected for editing')
			setIsLoading(false)
			return
		}

		try {
			const formData = new FormData()

			const payload: IEditVideoRequest = {
				title: data.title,
				description: data.description || '',
				tags: data.tags || '',
				visibility: data.visibility,
				audience: data.audience,
				thumbnail: data.thumbnail?.[0],
				channelId: uploadChannelId,
				publishType: data.publishType ?? editingVideo.publishType,
				publishDate: data.publishDate ?? editingVideo.publishDate,
			}

			formData.append('title', payload.title)
			if (payload.description)
				formData.append('description', payload.description)
			if (payload.tags) formData.append('tags', payload.tags)
			formData.append('visibility', payload.visibility)
			formData.append('audience', payload.audience)
			formData.append('publishType', payload.publishType)
			if (payload.publishDate)
				formData.append('publishDate', payload.publishDate.toString())

			if (payload.thumbnail) formData.append('thumbnail', payload.thumbnail)

			editVideo(
				{
					videoId: editingVideo.id,
					data: formData,
				},
				{
					onSuccess: () => {
						onOpenChange(false)
						reset()
						setFileName('')
						setValue('thumbnail', [], { shouldValidate: true })
						setThumbnailFile(null)
						setThumbnailPreview(null)
					},
					onSettled: () => setIsLoading(false),
				},
			)
		} catch {
			setIsLoading(false)
		}
	}

	useEffect(() => {
		if (!open) {
			reset()
			setFileName('')
		}
	}, [open, reset])

	if (!editingVideo) {
		return 'Loading...'
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent
				onInteractOutside={(e) => e.preventDefault()}
				className={`
					fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
					min-w-[960px] min-h-[800px]
					max-h-[90vh] overflow-y-auto
					rounded-2xl
					border border-neutral-800
					bg-gradient-to-br from-neutral-900 via-neutral-950 to-black
					text-white
					shadow-2xl
					backdrop-blur-xl
					p-0
				`}
			>
				<DialogHeader className='px-6 pt-6 pb-4 border-b border-neutral-800'>
					<DialogTitle className='flex items-center gap-2 text-lg font-semibold'>
						<>
							<MdEdit className='text-primary' size={20} />
							Edit Video
						</>
					</DialogTitle>
				</DialogHeader>

				<form
					onSubmit={handleSubmit(onSubmit)}
					className='flex flex-col gap-5 px-6 py-8'
				>
					<>
						<EditVideoSteps
							publishType={editingVideo.publishType}
							currentStep={steps}
						/>
						<div className='grid grid-cols-2 gap-8 px-5'>
							<div className='h-[500px] flex flex-col justify-between'>
								{steps === 1 && (
									<EditVideoStepFirst
										register={register}
										fileName={fileName}
										video={editingVideo}
									/>
								)}
								{steps === 2 && (
									<EditVideoStepSecond
										setValue={setValue}
										video={editingVideo}
										register={register}
									/>
								)}
								{steps === 3 && (
									<EditVideoStepThird
										setValue={setValue}
										video={editingVideo}
										watch={watch}
									/>
								)}
							</div>
							<div className='flex flex-col justify-between'>
								<EditVideoPreview
									fileName={fileName}
									previewUrl={previewUrl ? previewUrl : ''}
									video={editingVideo}
								/>
								<div className='flex pt-2 justify-end gap-5'>
									<Button
										onClick={() => handleBack()}
										type='button'
										disabled={isLoading}
										className='bg-secondary text-primary-foreground font-semibold py-3 px-8 rounded-xl flex justify-center min-w-[140px]'
									>
										Back
									</Button>
									<Button
										onClick={(e) => {
											if (
												steps ===
												(editingVideo.publishType === 'scheduled' ? 3 : 2)
											)
												return
											handleNextStep(e)
										}}
										type={
											steps ===
											(editingVideo.publishType === 'scheduled' ? 3 : 2)
												? 'submit'
												: 'button'
										}
										disabled={isLoading}
										className='bg-primary text-primary-foreground font-semibold py-3 px-8 rounded-xl flex justify-center min-w-[140px]'
									>
										{isLoading ? (
											<Lottie
												animationData={loader}
												loop
												className='w-15 h-15'
											/>
										) : steps ===
										  (editingVideo.publishType === 'scheduled' ? 3 : 2) ? (
											'Confirm'
										) : (
											'Next'
										)}
									</Button>
								</div>
							</div>
						</div>
					</>
				</form>
			</DialogContent>
		</Dialog>
	)
}
