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

import { Button } from '@/components/ui/button'
import { useAddVideo } from '@/hooks/videos/useAddVideo'
import type { IAddVideoRequest } from '@/types/video.types'
import { useVideoStore } from '@/zustand/store/videoStore'
import { zodResolver } from '@hookform/resolvers/zod'
import Lottie from 'lottie-react'
import { useEffect, useState } from 'react'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { FaUpload } from 'react-icons/fa6'
import { toast } from 'sonner'
import { UploadVideoFile } from './UploadVideoFile'
import { UploadVideoPreview } from './UploadVideoPreview'
import { UploadVideoStepFirst } from './UploadVideoStepFirst'
import { UploadVideoSteps } from './UploadVideoSteps'
import { UploadVideoStepSecond } from './UploadVideoStepSecond'
import { UploadVideoStepThird } from './UploadVideoStepThird'

interface UploadVideoModalProps {
	open: boolean
	onOpenChange: (open: boolean) => void
}

export function UploadVideoModal({
	open,
	onOpenChange,
}: UploadVideoModalProps) {
	const {
		register,
		handleSubmit,
		setValue,
		reset,
		trigger,
		watch,
		getFieldState,
		formState: { errors },
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

	const [isLoading, setIsLoading] = useState(false)
	const [fileName, setFileName] = useState<string>('')
	const [previewUrl, setPreviewUrl] = useState<string | null>(null)
	const [steps, setSteps] = useState(1)
	const { addVideo } = useAddVideo()

	const { setThumbnailFile, setThumbnailPreview, uploadChannelId } =
		useVideoStore()

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]
		if (file) {
			const cleanName = file.name.split('.').slice(0, -1).join('.')
			setFileName(cleanName)
			setValue('file', [file])
			setPreviewUrl(URL.createObjectURL(file))
		} else {
			setFileName('')
			setValue('file', [] as any)
			setPreviewUrl(null)
		}
	}

	const handleBack = () => {
		if (steps > 1) {
			setSteps((prev: number) => prev - 1)
		} else {
			setFileName('')
			setPreviewUrl(null)
			reset()
		}
	}

	const handleNextStep = async () => {
		if (steps === 1) {
			const isValid = await trigger(['title', 'file', 'tags'])

			if (!isValid) {
				const titleState = getFieldState('title')
				if (titleState.error) {
					toast.error(titleState.error.message as string)
					return
				}

				const fileState = getFieldState('file')
				if (fileState.error) {
					toast.error(fileState.error.message as string)
					return
				}

				const tagsState = getFieldState('tags')
				if (tagsState.error?.message) {
					toast.error(tagsState.error.message)
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
				toast.error(thumbErr || visErr || audErr)
			}
			return
		}

		if (steps === 3) {
			const isValid = await trigger(['publishType', 'publishDate'])
			if (!isValid) {
				const dateErr = getFieldState('publishDate').error?.message
				if (dateErr) toast.error(dateErr)
				return
			}
			handleSubmit(onSubmit)()
		}
	}
	const onSubmit: SubmitHandler<TUploadVideoSchema> = (data) => {
		setIsLoading(true)
		console.log('hello')

		if (!uploadChannelId) {
			toast.error('Channel is not selected')
			return
		}
		try {
			const formData = new FormData()

			const payload: IAddVideoRequest = {
				file: data.file[0],
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
			}

			formData.append('file', payload.file)
			formData.append('title', payload.title)
			if (payload.description)
				formData.append('description', payload.description)
			if (payload.tags) formData.append('tags', payload.tags)
			formData.append('visibility', payload.visibility)
			formData.append('audience', payload.audience)
			formData.append('publishType', payload.publishType)
			formData.append('channelId', payload.channelId)
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
				},
				onSettled: () => {
					setIsLoading(false)
				},
			})
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
						{fileName ? (
							fileName
						) : (
							<>
								<FaUpload className='text-primary' />
								Upload Video
							</>
						)}
					</DialogTitle>
				</DialogHeader>

				<form
					onSubmit={handleSubmit(onSubmit)}
					className='flex flex-col gap-5 px-6 py-8'
				>
					{!fileName && (
						<UploadVideoFile
							register={register}
							handleFileChange={handleFileChange}
							errorMessage={errors.file?.message}
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
									{steps === 2 && <UploadVideoStepSecond setValue={setValue} />}
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
											className='bg-secondary text-primary-foreground font-semibold py-3 px-8 rounded-xl flex justify-center min-w-[140px]'
										>
											Back
										</Button>
										<Button
											onClick={handleNextStep}
											type='button'
											disabled={isLoading}
											className='bg-primary text-primary-foreground font-semibold py-3 px-8 rounded-xl flex justify-center min-w-[140px]'
										>
											{isLoading ? (
												<Lottie
													animationData={loader}
													loop
													className='w-15 h-15'
												/>
											) : steps === 3 ? (
												'Confirm'
											) : (
												'Next'
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
	)
}
