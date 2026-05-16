'use client'

import loader from '@/assets/animations/loader.json'
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import {
	uploadVideoSchema,
	type TUploadVideoSchema,
} from '@/schemas/videos/upload-video.schema'

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogDescription,
	AlertDialogFooter,
} from '@/components/ui/alert-dialog'

import { Button } from '@/components/ui/button'
import { useAddVideo } from '@/hooks/videos/useAddVideo'
import type { IAddVideoRequest } from '@/types/video.types'
import { truncateName } from '@/utils/truncateName'
import { getValidationMessage } from '@/utils/validationMessage'
import { useVideoStore } from '@/zustand/store/videoStore'
import { zodResolver } from '@hookform/resolvers/zod'
import Lottie from 'lottie-react'
import { useTranslations } from 'next-intl'
import { useEffect, useRef, useState } from 'react'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { FaUpload } from 'react-icons/fa6'
import { toast } from 'sonner'
import { UploadVideoFile } from './UploadVideoFile'
import { UploadVideoPreview } from './UploadVideoPreview'
import { UploadVideoStepFirst } from './UploadVideoStepFirst'
import { UploadVideoSteps } from './UploadVideoSteps'
import { UploadVideoStepSecond } from './UploadVideoStepSecond'
import { UploadVideoStepThird } from './UploadVideoStepThird'
import { useDeleteVideo } from '@/hooks/videos/useDeleteVideo'
import { useDeleteTempVideo } from '@/hooks/videos/useDeleteTempVideo'
import { useVideoProcessing } from '@/hooks/videos/useVideoProccessing'
import { useUploadVideo } from '@/hooks/videos/useUploadVideo'
import { videoService } from '@/services/video.service'

interface UploadVideoModalProps {
	open: boolean
	onOpenChange: (open: boolean) => void
}

export function UploadVideoModal({
	open,
	onOpenChange,
}: UploadVideoModalProps) {
	const t = useTranslations()
	const {
		register,
		handleSubmit,
		setValue,
		reset,
		trigger,
		watch,
		getFieldState,
		formState: { errors, isDirty },
	} = useForm<TUploadVideoSchema>({
		resolver: zodResolver(uploadVideoSchema),
		reValidateMode: 'onSubmit',
		defaultValues: {
			thumbnail: [],
			audience: 'no',
			visibility: 'public',
			publishType: 'now',
			tags: '',
		},
	})

	const [isConfirmOpen, setIsConfirmOpen] = useState(false)
	const [progress, setProgress] = useState(0)
	const [displayProgress, setDisplayProgress] = useState(0)
	const [pendingOpen, setPendingOpen] = useState<boolean | null>(null)
	const [isLoading, setIsLoading] = useState(false)
	const [fileName, setFileName] = useState<string>('')
	const [previewUrl, setPreviewUrl] = useState<string | null>(null)
	const [steps, setSteps] = useState(1)
	const [videoId, setVideoId] = useState<string | null>(null)

	const [abortController, setAbortController] =
		useState<AbortController | null>(null)

	const [status, setStatus] = useState<
		'idle' | 'uploading' | 'processing' | 'ready'
	>('idle')

	const isUploadFinished = status === 'ready'
	const hasChanges = isDirty || !!fileName

	const { uploadVideo } = useUploadVideo()
	const { addVideo } = useAddVideo()
	const { deleteTempVideo } = useDeleteTempVideo()

	//@ts-ignore
	useVideoProcessing(videoId, setStatus)
	const { setThumbnailFile, setThumbnailPreview, uploadChannelId } =
		useVideoStore()

	const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		if (videoId) {
			try {
				await deleteTempVideo(videoId)
			} catch {}

			setVideoId(null)
			setProgress(0)
		}

		const file = e.target.files?.[0]
		if (!file) return

		const dot = file.name.lastIndexOf('.')
		const cleanName = dot > 0 ? file.name.slice(0, dot) : file.name
		setFileName(cleanName)
		setValue('file', [file])
		setPreviewUrl(URL.createObjectURL(file))

		const controller = new AbortController()
		setAbortController(controller)

		try {
			setStatus('uploading')

			const { uploadURL, videoId: newVideoId } =
				await videoService.getUploadUrl()

			setVideoId(newVideoId)

			const result = await uploadVideo({
				file,
				controller,
				uploadURL,
				onProgress: (p) => {
					setProgress(p)
					setDisplayProgress(p)
				},
			})

			if (!result) return

			setStatus('processing')
		} catch (err: any) {
			if (err.code === 'ERR_CANCELED') return
			console.error(err)
		}
	}

	const handleBack = () => {
		if (steps > 1) {
			setSteps((prev: number) => prev - 1)
		} else {
			setFileName('')
			setPreviewUrl((prev) => {
				if (prev?.startsWith('blob:')) URL.revokeObjectURL(prev)
				return null
			})
			reset()
		}
	}

	const handleOpenChange = (nextOpen: boolean) => {
		if (!nextOpen && hasChanges) {
			setIsConfirmOpen(true)
			setPendingOpen(nextOpen)
			return
		}

		onOpenChange(nextOpen)
	}
	const handleNextStep = async () => {
		if (steps === 1) {
			const isValid = await trigger(['title', 'file', 'tags'])

			if (!isValid) {
				const titleState = getFieldState('title')
				if (titleState.error) {
					toast.error(
						getValidationMessage(titleState.error.message as string, t),
					)
					return
				}

				const fileState = getFieldState('file')
				if (fileState.error) {
					toast.error(
						getValidationMessage(fileState.error.message as string, t),
					)
					return
				}

				const tagsState = getFieldState('tags')
				if (tagsState.error?.message) {
					toast.error(getValidationMessage(tagsState.error.message, t))
					return
				}

				return
			}

			setSteps((prev) => prev + 1)
			return
		}

		if (steps === 2) {
			const isValid = await trigger(['thumbnail', 'visibility', 'audience'])
			if (isValid) {
				setSteps((prev) => prev + 1)
			} else {
				const thumbErr = getFieldState('thumbnail').error?.message
				const visErr = getFieldState('visibility').error?.message
				const audErr = getFieldState('audience').error?.message
				toast.error(getValidationMessage(thumbErr || visErr || audErr, t))
			}
			return
		}

		if (steps === 3) {
			const isValid = await trigger(['publishType', 'publishDate'])
			if (!isValid) {
				const dateErr = getFieldState('publishDate').error?.message
				if (dateErr) toast.error(getValidationMessage(dateErr, t))
				return
			}
			if (!videoId) {
				toast.error(t('uploadVideoModal.toastStillUploading'))
				return
			}
			handleSubmit(onSubmit)()
		}
	}
	const onSubmit: SubmitHandler<TUploadVideoSchema> = (data) => {
		setIsLoading(true)

		if (!uploadChannelId) {
			toast.error(t('uploadVideoModal.toastNoChannel'))
			return
		}
		try {
			const formData = new FormData()

			const payload: IAddVideoRequest = {
				title: data.title,
				description: data.description || '',
				tags: data.tags || '',
				visibility: data.visibility,
				audience: data.audience,
				publishType: data.publishType,
				publishDate:
					data.publishType === 'scheduled' ? data.publishDate : undefined,
				thumbnail: data.thumbnail?.[0],
				channelId: uploadChannelId,
				videoPublicId: videoId!,
			}

			formData.append('title', payload.title)
			formData.append('videoPublicId', videoId!)
			if (payload.description)
				formData.append('description', payload.description)
			if (payload.tags) formData.append('tags', payload.tags)
			formData.append('visibility', payload.visibility)
			formData.append('audience', payload.audience)
			formData.append('publishType', payload.publishType)
			if (payload.channelId) {
				formData.append('channelId', payload.channelId)
			}
			if (payload.publishDate)
				formData.append('publishDate', payload.publishDate)
			if (payload.thumbnail) formData.append('thumbnail', payload.thumbnail)

			addVideo(formData, {
				onSuccess: () => {
					onOpenChange(false)
					reset()
					setFileName('')
					setValue('thumbnail', [], { shouldValidate: true })
					setThumbnailFile(null)
					setThumbnailPreview(null)
					setVideoId(null)
					setProgress(0)
				},
				onSettled: () => {
					setIsLoading(false)
				},
			})
		} catch {
			setIsLoading(false)
		}
	}

	const prevOpenRef = useRef(open)

	useEffect(() => {
		const wasOpen = prevOpenRef.current
		prevOpenRef.current = open

		if (!wasOpen || open) return

		reset()
		setFileName('')
		setPreviewUrl((prev) => {
			if (prev?.startsWith('blob:')) URL.revokeObjectURL(prev)
			return null
		})
		setSteps(1)
		setVideoId(null)
		setProgress(0)
		setDisplayProgress(0)
		setStatus('idle')
		setAbortController(null)
		setIsConfirmOpen(false)
		setPendingOpen(null)
		setThumbnailFile(null)
		setThumbnailPreview(null)
	}, [open, reset, setThumbnailFile, setThumbnailPreview])

	useEffect(() => {
		if (status === 'uploading') {
			const value = Math.min(80, Math.round(progress * 0.8))
			setDisplayProgress(value)
			return
		}

		if (status === 'ready') {
			setDisplayProgress(100)
		}
	}, [progress, status])

	useEffect(() => {
		if (status !== 'processing') return

		const interval = setInterval(() => {
			setDisplayProgress((prev) => {
				if (prev >= 99) return prev

				const speed = prev < 90 ? 0.8 : 0.2
				return Math.min(99, Math.round(prev + speed))
			})
		}, 200)

		return () => clearInterval(interval)
	}, [status])

	return (
		<>
			<Dialog open={open} onOpenChange={handleOpenChange}>
				<DialogContent
					className={`
					fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
					min-w-[960px] min-h-[800px]
					max-h-[90vh] overflow-y-auto
					rounded-2xl
					border border-border bg-card text-card-foreground
					shadow-2xl
					backdrop-blur-xl
					p-0
					[&>button]:hidden
				`}
				>
					<DialogTitle className='flex items-center justify-between gap-4 text-lg font-semibold text-foreground px-10'>
						<div className='flex items-center gap-2'>
							{fileName ? (
								<span className='max-w-[320px] truncate'>
									{truncateName(fileName, 50)}
								</span>
							) : (
								<>
									<FaUpload className='text-primary' />
									{t('uploadVideoModal.title')}
								</>
							)}
						</div>

						{fileName && (
							<div className='flex items-center gap-2 w-[300px]'>
								<span className='text-xs text-muted-foreground whitespace-nowrap'>
									{status === 'uploading' &&
										t('uploadVideoModal.statusUploading')}
									{status === 'processing' &&
										t('uploadVideoModal.statusProcessing')}
									{status === 'ready' && t('uploadVideoModal.statusReady')}
								</span>

								<div className='flex-1 h-[4px] bg-muted rounded-full overflow-hidden'>
									<div
										className='h-full bg-primary transition-all duration-300 ease-out'
										style={{ width: `${displayProgress}%` }}
									/>
								</div>

								<span className='text-xs tabular-nums text-foreground min-w-[40px] text-right'>
									{Math.round(displayProgress)}%
								</span>
							</div>
						)}
					</DialogTitle>

					<form
						onSubmit={handleSubmit(onSubmit)}
						className='flex flex-col gap-5 px-6 py-8'
					>
						{!fileName && (
							<UploadVideoFile
								register={register}
								handleFileChange={handleFileChange}
								errorMessage={getValidationMessage(errors.file?.message, t)}
							/>
						)}

						{fileName && (
							<>
								<UploadVideoSteps currentStep={steps} />
								<div className='grid grid-cols-2 gap-8 px-5'>
									<div className='h-[500px] flex flex-col justify-between'>
										{steps === 1 && (
											<UploadVideoStepFirst
												register={register}
												fileName={fileName}
											/>
										)}
										{steps === 2 && (
											<UploadVideoStepSecond setValue={setValue} />
										)}
										{steps === 3 && (
											<UploadVideoStepThird watch={watch} setValue={setValue} />
										)}
									</div>
									<div className='flex flex-col justify-between'>
										<UploadVideoPreview
											fileName={fileName}
											previewUrl={previewUrl ? previewUrl : ''}
										/>
										<div className='flex pt-2 justify-end gap-5'>
											<Button
												onClick={() => handleBack()}
												type='button'
												disabled={isLoading}
												className='bg-secondary text-secondary-foreground font-semibold py-3 px-8 rounded-xl flex justify-center min-w-[140px]'
											>
												{t('uploadVideoModal.back')}
											</Button>
											<Button
												onClick={handleNextStep}
												type='button'
												disabled={
													isLoading || (steps === 3 && !isUploadFinished)
												}
												className='bg-primary text-primary-foreground font-semibold py-3 px-8 rounded-xl flex justify-center min-w-[140px]'
											>
												{isLoading ? (
													<Lottie
														animationData={loader}
														loop
														className='w-15 h-15'
													/>
												) : steps === 3 ? (
													t('uploadVideoModal.confirm')
												) : (
													t('uploadVideoModal.next')
												)}
											</Button>
										</div>
									</div>
								</div>
							</>
						)}
					</form>
				</DialogContent>
			</Dialog>
			<AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>
							{t('uploadVideoModal.discardTitle')}
						</AlertDialogTitle>
						<AlertDialogDescription>
							{t('uploadVideoModal.discardDescription')}
						</AlertDialogDescription>
					</AlertDialogHeader>

					<AlertDialogFooter>
						<AlertDialogCancel>
							{t('uploadVideoModal.cancel')}
						</AlertDialogCancel>

						<AlertDialogAction
							onClick={async () => {
								setIsConfirmOpen(false)

								if (abortController) {
									abortController.abort()
								}

								if (videoId) {
									await deleteTempVideo(videoId)
									setVideoId(null)
									setProgress(0)
								}

								setValue('thumbnail', [], { shouldValidate: true })
								setThumbnailFile(null)
								setThumbnailPreview(null)

								if (pendingOpen !== null) {
									onOpenChange(pendingOpen)
								}
							}}
						>
							{t('uploadVideoModal.leave')}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	)
}
