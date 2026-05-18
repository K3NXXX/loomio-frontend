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
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { useDeleteTempVideo } from '@/hooks/videos/useDeleteTempVideo'
import { useVideoProcessing } from '@/hooks/videos/useVideoProccessing'
import { useUploadVideo } from '@/hooks/videos/useUploadVideo'
import { useRequestReview } from '@/hooks/report/useRequestReview'
import { useQueryClient } from '@tanstack/react-query'
import { videoService } from '@/services/video.service'
import { TRestrictVideoSchema } from '@/schemas/videos/restrict-video.schema'
import { truncateName } from '@/utils/truncateName'
import { getValidationMessage } from '@/utils/validationMessage'
import { useVideoStore } from '@/zustand/store/videoStore'
import Lottie from 'lottie-react'
import { useTranslations } from 'next-intl'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { FaUpload } from 'react-icons/fa6'
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

type UploadFlowStatus = 'idle' | 'uploading' | 'processing' | 'ready'

export function RestrictVideoModal({
	open,
	onOpenChange,
}: IEditVideoModalProps) {
	const t = useTranslations('editVideo.modal')
	const tRoot = useTranslations()
	const tUpload = useTranslations('uploadVideoModal')
	const {
		register,
		handleSubmit,
		setValue,
		reset,
		trigger,
		getFieldState,
		watch,
	} = useForm<TRestrictVideoSchema>({
		reValidateMode: 'onSubmit',
	})

	const [reviewSentDialogOpen, setReviewSentDialogOpen] = useState(false)
	const [isLoading, setIsLoading] = useState(false)

	const queryClient = useQueryClient()
	const [fileName, setFileName] = useState<string>('')
	const [previewUrl, setPreviewUrl] = useState<string | null>(null)
	const [steps, setSteps] = useState(1)
	const [progress, setProgress] = useState(0)
	const [displayProgress, setDisplayProgress] = useState(0)
	const [abortController, setAbortController] =
		useState<AbortController | null>(null)
	const [status, setStatus] = useState<UploadFlowStatus>('idle')
	const [reviewTempVideoId, setReviewTempVideoId] = useState<string | null>(
		null,
	)
	const reviewTempVideoIdRef = useRef<string | null>(null)

	const syncTempVideoId = useCallback((id: string | null) => {
		reviewTempVideoIdRef.current = id
		setReviewTempVideoId(id)
	}, [])

	const { requestReview } = useRequestReview()
	const { uploadVideo } = useUploadVideo()
	const { deleteTempVideo } = useDeleteTempVideo()

	const {
		setThumbnailFile,
		setThumbnailPreview,
		uploadChannelId,
		editingVideo,
		setVideoFile,
		setEditingVideo,
	} = useVideoStore()

	useEffect(() => {
		if (open) setReviewSentDialogOpen(false)
	}, [open])

	useVideoProcessing(reviewTempVideoId, (s) => setStatus(s as UploadFlowStatus))

	const isUploadFinished = status === 'ready'

	const handleVideoFileSelected = async (file: File) => {
		if (reviewTempVideoIdRef.current) {
			try {
				await deleteTempVideo(reviewTempVideoIdRef.current)
			} catch {
				/* ignore */
			}
			syncTempVideoId(null)
			setProgress(0)
			setDisplayProgress(0)
		}

		setAbortController((prev) => {
			prev?.abort()
			return null
		})

		const cleanName = file.name.split('.').slice(0, -1).join('.')
		setFileName(cleanName)
		setPreviewUrl((prev) => {
			if (prev?.startsWith('blob:')) URL.revokeObjectURL(prev)
			return URL.createObjectURL(file)
		})

		const controller = new AbortController()
		setAbortController(controller)

		try {
			setStatus('uploading')

			const { uploadURL, videoId: newVideoId } =
				await videoService.getUploadUrl()

			syncTempVideoId(newVideoId)

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
		} catch (err: unknown) {
			const code =
				err && typeof err === 'object' && 'code' in err
					? (err as { code?: string }).code
					: undefined
			if (code === 'ERR_CANCELED') return
			console.error(err)
			toast.error(tUpload('toastUploadFailed'))
			setStatus('idle')
			syncTempVideoId(null)
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
			if (!fileName) {
				toast.error(t('toastPickNewVideoFirst'))
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
				toast.error(getValidationMessage(thumbErr || audErr, tRoot))
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
			toast.error(t('toastNoVideoSelected'))
			setIsLoading(false)
			return
		}

		if (!reviewTempVideoId || status !== 'ready') {
			toast.error(tUpload('toastStillUploading'))
			setIsLoading(false)
			return
		}

		if (!uploadChannelId) {
			toast.error(tUpload('toastNoChannel'))
			setIsLoading(false)
			return
		}

		try {
			const formData = new FormData()

			formData.append('title', data.title)
			if (data.description) formData.append('description', data.description)
			if (data.tags) formData.append('tags', data.tags)
			formData.append('audience', data.audience)
			formData.append('videoPublicId', reviewTempVideoId)
			formData.append('channelId', uploadChannelId)
			if (data.thumbnail?.[0]) formData.append('thumbnail', data.thumbnail[0])

			requestReview(
				{
					videoId: editingVideo.id,
					data: formData,
				},
				{
					onSuccess: () => {
						queryClient.invalidateQueries({
							queryKey: ['channelStudioVideos'],
						})
						onOpenChange(false)
						reset()
						setFileName('')
						setPreviewUrl((prev) => {
							if (prev?.startsWith('blob:')) URL.revokeObjectURL(prev)
							return null
						})
						setValue('thumbnail', [], { shouldValidate: true })
						setThumbnailFile(null)
						setThumbnailPreview(null)
						setVideoFile(null)
						syncTempVideoId(null)
						setStatus('idle')
						setProgress(0)
						setDisplayProgress(0)
						setSteps(1)
						setEditingVideo(null)
						setReviewSentDialogOpen(true)
					},
					onSettled: () => setIsLoading(false),
				},
			)
		} catch {
			setIsLoading(false)
		}
	}

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

	useEffect(() => {
		if (open) return

		setAbortController((ac) => {
			ac?.abort()
			return null
		})

		const id = reviewTempVideoIdRef.current
		if (id) void deleteTempVideo(id).catch(() => {})

		syncTempVideoId(null)
		setStatus('idle')
		setProgress(0)
		setDisplayProgress(0)
		reset()
		setFileName('')
		setSteps(1)
		setPreviewUrl((prev) => {
			if (prev?.startsWith('blob:')) URL.revokeObjectURL(prev)
			return null
		})
		setThumbnailFile(null)
		setThumbnailPreview(null)
		setVideoFile(null)
	}, [
		open,
		reset,
		deleteTempVideo,
		syncTempVideoId,
		setThumbnailFile,
		setThumbnailPreview,
		setVideoFile,
	])

	const finalStep = editingVideo?.publishType === 'scheduled' ? 3 : 2
	const isFinalStep = Boolean(editingVideo) && steps === finalStep

	return (
		<>
			<Dialog open={open} onOpenChange={onOpenChange}>
				{open && editingVideo ? (
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
						<DialogHeader className='px-6 pt-6 pb-4 border-b border-border'>
							<DialogTitle className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between text-lg font-semibold text-foreground'>
								<div className='flex items-center gap-2 min-w-0'>
									{fileName ? (
										<>
											<FaUpload className='text-primary shrink-0' />
											<span className='truncate'>
												{truncateName(fileName, 50)}
											</span>
										</>
									) : (
										<>
											<MdEdit className='text-primary shrink-0' size={20} />
											<span className='truncate'>{t('title')}</span>
										</>
									)}
								</div>

								{fileName ? (
									<div className='flex items-center gap-2 w-full sm:w-[300px] shrink-0'>
										<span className='text-xs text-muted-foreground whitespace-nowrap'>
											{status === 'uploading' && tUpload('statusUploading')}
											{status === 'processing' && tUpload('statusProcessing')}
											{status === 'ready' && tUpload('statusReady')}
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
								) : null}
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
												//@ts-expect-error shared shape with restrict schema
												register={register}
												fileName={fileName}
												video={editingVideo}
											/>
										)}
										{steps === 2 && (
											<EditVideoStepSecond
												//@ts-expect-error shared shape with restrict schema
												setValue={setValue}
												video={editingVideo}
												restrictReviewFlow
												//@ts-expect-error shared shape with restrict schema
												register={register}
											/>
										)}
										{steps === 3 && (
											<EditVideoStepThird
												//@ts-expect-error shared shape with restrict schema
												setValue={setValue}
												video={editingVideo}
												//@ts-expect-error shared shape with restrict schema
												watch={watch}
											/>
										)}
									</div>
									<div className='flex flex-col justify-between'>
										<RestrictVideoPreview
											fileName={fileName}
											previewUrl={previewUrl ? previewUrl : ''}
											video={editingVideo}
											onVideoFileSelected={handleVideoFileSelected}
										/>
										<div className='flex pt-2 justify-end gap-5'>
											<Button
												onClick={() => handleBack()}
												type='button'
												variant='secondary'
												disabled={isLoading}
												className='font-semibold py-3 px-8 rounded-xl flex justify-center min-w-[140px]'
											>
												{t('back')}
											</Button>
											<Button
												onClick={(e) => {
													if (!isFinalStep) handleNextStep(e)
												}}
												type={isFinalStep ? 'submit' : 'button'}
												disabled={
													isLoading || (isFinalStep && !isUploadFinished)
												}
												className='font-semibold py-3 px-8 rounded-xl flex justify-center min-w-[140px]'
											>
												{isLoading ? (
													<Lottie
														animationData={loader}
														loop
														className='w-15 h-15'
													/>
												) : isFinalStep ? (
													t('submitForReview')
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
				) : open ? (
					<DialogContent className='border-border bg-card text-card-foreground'>
						<div className='flex items-center justify-center p-8 text-sm text-muted-foreground'>
							{t('loading')}
						</div>
					</DialogContent>
				) : null}
			</Dialog>

			<AlertDialog
				open={reviewSentDialogOpen}
				onOpenChange={setReviewSentDialogOpen}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>{t('reviewSubmittedTitle')}</AlertDialogTitle>
						<AlertDialogDescription className='text-left whitespace-pre-line'>
							{t('reviewSubmittedDescription')}
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogAction>{t('reviewSubmittedClose')}</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	)
}
