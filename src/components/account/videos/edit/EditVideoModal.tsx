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
import type { IEditVideoRequest, IVideo } from '@/types/video.types'
import { getValidationMessage } from '@/utils/validationMessage'
import { useVideoStore } from '@/zustand/store/videoStore'
import { zodResolver } from '@hookform/resolvers/zod'
import Lottie from 'lottie-react'
import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { toast } from 'sonner'
import { EditVideoPreview } from './EditVideoPreview'
import { EditVideoStepFirst } from './EditVideoStepFirst'
import { EditVideoSteps } from './EditVideoSteps'
import { EditVideoStepSecond } from './EditVideoStepSecond'
import { EditVideoStepThird } from './EditVideoStepThird'
import { EditVideoStepFourth } from './EditVideoStepFourth'

interface IEditVideoModalProps {
	open: boolean
	onOpenChange: (open: boolean) => void
}

function chaptersFromVideo(video: IVideo): { title: string; timecode: string }[] {
	const raw = video.chapters
	if (!Array.isArray(raw)) return []
	return raw.map((c) => ({
		title: c?.title != null ? String(c.title) : '',
		timecode: c?.timecode != null ? String(c.timecode) : '',
	}))
}

export function EditVideoModal({ open, onOpenChange }: IEditVideoModalProps) {
	const t = useTranslations('editVideo.modal')
	const tRoot = useTranslations()
	const {
		register,
		handleSubmit,
		setValue,
		reset,
		trigger,
		getFieldState,
		watch,
		control,
	} = useForm<TEditVideoSchema>({
		resolver: zodResolver(editVideoSchema),
		reValidateMode: 'onSubmit',
		defaultValues: {
			chapters: [],
			thumbnail: [],
			audience: 'no',
			visibility: 'public',
			publishType: 'now',
			tags: '',
		},
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

	const isScheduled = editingVideo?.publishType === 'scheduled'
	const submitStep = isScheduled ? 4 : 3

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
				if (titleState.error)
					toast.error(getValidationMessage(titleState.error.message, tRoot))
				const tagsState = getFieldState('tags')
				if (tagsState.error?.message)
					toast.error(getValidationMessage(tagsState.error.message, tRoot))
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
				toast.error(getValidationMessage(thumbErr || visErr || audErr, tRoot))
				return
			}
			setSteps(3)
			return
		}

		if (steps === 3 && isScheduled) {
			const isValid = await trigger(['publishType', 'publishDate'])
			if (!isValid) {
				const dateErr = getFieldState('publishDate').error?.message
				if (dateErr) toast.error(getValidationMessage(dateErr, tRoot))
				return
			}
			setSteps(4)
			return
		}

		if (steps === 3 && !isScheduled) {
			const isValid = await trigger(['chapters'])
			if (!isValid) {
				toast.error(tRoot('uploadVideoModal.stepFourth.validationToast'))
				return
			}
			handleSubmit(onSubmit)()
			return
		}

		if (steps === 4) {
			const isValid = await trigger(['chapters'])
			if (!isValid) {
				toast.error(tRoot('uploadVideoModal.stepFourth.validationToast'))
				return
			}
			handleSubmit(onSubmit)()
		}
	}

	const onSubmit: SubmitHandler<TEditVideoSchema> = (data) => {
		setIsLoading(true)

		if (!editingVideo) {
			toast.error(t('toastNoVideoSelected'))
			setIsLoading(false)
			return
		}

		try {
			const formData = new FormData()

			const chaptersPayload = (data.chapters ?? [])
				.map((c) => ({
					title: c.title.trim(),
					timecode: c.timecode.trim(),
				}))
				.filter((c) => c.title.length > 0 && c.timecode.length > 0)

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

			formData.append('chapters', JSON.stringify(chaptersPayload))

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
						setSteps(1)
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
			setSteps(1)
		}
	}, [open, reset])

	useEffect(() => {
		if (!open || !editingVideo) return

		reset({
			title: editingVideo.title,
			description: editingVideo.description ?? '',
			tags: editingVideo.tags ?? '',
			visibility: editingVideo.visibility === 'private' ? 'private' : 'public',
			audience: editingVideo.audience === 'yes' ? 'yes' : 'no',
			publishType:
				editingVideo.publishType === 'scheduled' ? 'scheduled' : 'now',
			publishDate: editingVideo.publishDate
				? new Date(editingVideo.publishDate).toISOString()
				: undefined,
			thumbnail: [],
			chapters: chaptersFromVideo(editingVideo),
		})
		setSteps(1)
	}, [open, editingVideo?.id, reset, editingVideo])

	if (!editingVideo) {
		return (
			<div className='flex items-center justify-center p-8 text-sm text-muted-foreground'>
				{t('loading')}
			</div>
		)
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
					border border-border
					bg-card text-card-foreground
					shadow-2xl
					backdrop-blur-xl
					p-0
				`}
			>
				<DialogHeader className='border-b border-border px-6 pb-4 pt-6'>
					<DialogTitle className='flex items-center gap-2 text-lg font-semibold text-foreground'>
						<>
							<MdEdit className='text-primary' size={20} />
							{t('title')}
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
							<div className='flex h-[500px] flex-col justify-between'>
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
								{steps === 3 && isScheduled && (
									<EditVideoStepThird
										setValue={setValue}
										video={editingVideo}
										watch={watch}
									/>
								)}
								{steps === 3 && !isScheduled && (
									<EditVideoStepFourth control={control} register={register} />
								)}
								{steps === 4 && (
									<EditVideoStepFourth control={control} register={register} />
								)}
							</div>
							<div className='flex flex-col justify-between'>
								<EditVideoPreview
									fileName={fileName}
									previewUrl={previewUrl ? previewUrl : ''}
									video={editingVideo}
								/>
								<div className='flex justify-end gap-5 pt-2'>
									<Button
										onClick={() => handleBack()}
										type='button'
										variant='secondary'
										disabled={isLoading}
										className='flex min-w-[140px] justify-center rounded-xl px-8 py-3 font-semibold'
									>
										{t('back')}
									</Button>
									<Button
										onClick={(e) => {
											if (steps === submitStep) return
											handleNextStep(e)
										}}
										type={steps === submitStep ? 'submit' : 'button'}
										disabled={isLoading}
										className='flex min-w-[140px] justify-center rounded-xl px-8 py-3 font-semibold'
									>
										{isLoading ? (
											<Lottie
												animationData={loader}
												loop
												className='h-15 w-15'
											/>
										) : steps === submitStep ? (
											t('confirm')
										) : (
											t('next')
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
