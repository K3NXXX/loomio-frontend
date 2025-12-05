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
import { useRequestReview } from '@/hooks/report/useRequestReview'
import { TRestrictVideoSchema } from '@/schemas/videos/restrict-video.schema'
import { useVideoStore } from '@/zustand/store/videoStore'
import Lottie from 'lottie-react'
import { useEffect, useState } from 'react'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { toast } from 'sonner'
import { EditVideoStepFirst } from './EditVideoStepFirst'
import { EditVideoSteps } from './EditVideoSteps'
import { EditVideoStepSecond } from './EditVideoStepSecond'
import { EditVideoStepThird } from './EditVideoStepThird'
import { RestrictVideoPreview } from './RestrictVideoPreview'

interface IEditVideoModalProps {
	open: boolean
	onOpenChange: (open: boolean) => void
}

export function RestrictVideoModal({
	open,
	onOpenChange,
}: IEditVideoModalProps) {
	const {
		register,
		handleSubmit,
		setValue,
		reset,
		trigger,
		getFieldState,
		watch,
	} = useForm<TRestrictVideoSchema>({
		// resolver: zodResolver(restrictVideoSchema),
		reValidateMode: 'onSubmit',
	})

	const [isLoading, setIsLoading] = useState(false)
	const [fileName, setFileName] = useState<string>('')
	const [previewUrl, setPreviewUrl] = useState<string | null>(null)
	const [steps, setSteps] = useState(1)
	const { requestReview } = useRequestReview()

	const {
		setThumbnailFile,
		setThumbnailPreview,
		uploadChannelId,
		editingVideo,
		videoFile,
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
			const isValid = await trigger(['thumbnail', 'audience'])
			if (!isValid) {
				const thumbErr = getFieldState('thumbnail').error?.message

				const audErr = getFieldState('audience').error?.message
				toast.error(thumbErr || audErr)
				return
			}

			if (editingVideo?.publishType === 'scheduled') {
				setSteps(3)
				return
			}
		}
	}

	const onSubmit: SubmitHandler<TRestrictVideoSchema> = (data) => {
		setIsLoading(true)

		if (!editingVideo) {
			toast.error('No video selected for editing')
			setIsLoading(false)
			return
		}

		try {
			const formData = new FormData()

			formData.append('title', data.title)
			if (data.description) formData.append('description', data.description)
			if (data.tags) formData.append('tags', data.tags)
			formData.append('audience', data.audience)

			// ❗ ОБОВ'ЯЗКОВО
			formData.append('channelId', uploadChannelId)

			formData.append('video', videoFile)
			if (data.thumbnail?.[0]) formData.append('thumbnail', data.thumbnail[0])

			requestReview(
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
								<RestrictVideoPreview
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
