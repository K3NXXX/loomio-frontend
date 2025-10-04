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
import { useVideoStore } from '@/zustand/store/videoStore'
import { zodResolver } from '@hookform/resolvers/zod'
import Lottie from 'lottie-react'
import { useEffect, useState } from 'react'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { FaUpload } from 'react-icons/fa6'
import { toast } from 'sonner'
import { UploadVideoFile } from './UploadVideoFile'
import { UploadVideoPreview } from './UploadVideoPreview'
import { UploadVideoStepThird } from './UploadVideoStedThird'
import { UploadVideoStepFirst } from './UploadVideoStepFirst'
import { UploadVideoSteps } from './UploadVideoSteps'
import { UploadVideoStepSecond } from './UploadVideoStepSecond'

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

	const { setThumbnailFile, setThumbnailPreview } = useVideoStore()

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
	const onSubmit: SubmitHandler<TUploadVideoSchema> = async (data) => {
		setIsLoading(true)
		try {
			const formData = new FormData()

			formData.append('file', data.file[0])
			formData.append('title', data.title)
			formData.append('description', data.description || '')
			formData.append('tags', data.tags || '')
			formData.append('visibility', data.visibility)
			formData.append('audience', data.audience)
			formData.append('publishType', data.publishType)
			if (data.publishType === 'scheduled' && data.publishDate) {
				formData.append('publishDate', data.publishDate)
			}
			if (data.thumbnail && data.thumbnail.length > 0) {
				formData.append('thumbnail', data.thumbnail[0])
			}

			await new Promise((res) => setTimeout(res, 1500))

			onOpenChange(false)
			reset()
			setFileName('')
			setValue('thumbnail', [], { shouldValidate: true })
			setThumbnailFile(null)
			setThumbnailPreview(null)
		} finally {
			setIsLoading(false)
		}
	}

	useEffect(() => {
		if (!open) {
			reset()
			setFileName('')
		}
	}, [open])

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
													className='w-8 h-8'
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
