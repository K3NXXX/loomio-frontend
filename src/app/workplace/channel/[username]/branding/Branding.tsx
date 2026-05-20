'use client'

import { Button } from '@/components/ui/button'
import { WorkplaceBrandingAvatar } from '@/components/workplace/branding/WorkplaceBrandingAvatar'
import { WorkplaceBrandingBanner } from '@/components/workplace/branding/WorkplaceBrandingBanner'
import { WorkplaceBrandingFields } from '@/components/workplace/branding/WorkplaceBrandingFields'
import { PAGES } from '@/constants/pages.constants'
import { useGetMe } from '@/hooks/auth/useGetMe'
import { useEditChannel } from '@/hooks/channel/useEditChannel'
import { cn } from '@/lib/utils'
import Lottie from 'lottie-react'
import loader from '@/assets/animations/loader.json'
import {
	editingChannelSchema,
	TEditingChannelSchema,
} from '@/schemas/channel/edit-channel.schema'
import { useChannelStore } from '@/zustand/store/channelStore'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'

export function Branding() {
	const router = useRouter()
	const pathname = usePathname()
	const { channel, setChannel } = useChannelStore()
	const { userData } = useGetMe()
	const isPremium = Boolean(userData?.isPremium)
	const allowAnimatedBanner = isPremium
	const { editChannel, isPending } = useEditChannel()
	const t = useTranslations('workplaceBranding')

	const [avatarTouched, setAvatarTouched] = useState(false)
	const [bannerTouched, setBannerTouched] = useState(false)

	const defaultValues = useMemo<TEditingChannelSchema>(
		() => ({
			name: channel?.name ?? '',
			username: channel?.username ?? '',
			description: channel?.description ?? '',
			avatarFile: undefined,
			bannerFile: undefined,
			removeAvatar: false,
			removeBanner: false,
			avatarFrameColor: channel?.avatarFrameColor ?? '',
			avatarFrameThickness: channel?.avatarFrameThickness ?? '',
			avatarFrameStyle: channel?.avatarFrameStyle ?? '',
		}),
		[channel],
	)

	const {
		register,
		handleSubmit,
		reset,
		watch,
		setValue,
		getValues,
		trigger,
		formState: { errors, isDirty },
	} = useForm<TEditingChannelSchema>({
		// @ts-ignore
		resolver: zodResolver(editingChannelSchema),
		mode: 'onChange',
		defaultValues,
	})

	useEffect(() => {
		register('avatarFile')
		register('bannerFile')
		register('removeAvatar')
		register('removeBanner')
		register('avatarFrameColor')
		register('avatarFrameThickness')
		register('avatarFrameStyle')
	}, [register])

	const watchedUsername = watch('username')

	const onSelectAvatar = async (file: File | null) => {
		setAvatarTouched(true)

		setValue('avatarFile', file ?? undefined, {
			shouldDirty: true,
			shouldValidate: true,
		})
		setValue('removeAvatar', !file, { shouldDirty: true })

		await trigger()
	}

	const onSelectBanner = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const f = e.target.files?.[0]
		setBannerTouched(true)

		if (f) {
			const preview = URL.createObjectURL(f)
			setValue('bannerFile', f, { shouldDirty: true, shouldValidate: true })
			setValue('bannerUrl', preview, { shouldDirty: true })
			setValue('removeBanner', false, { shouldDirty: true })
		} else {
			setValue('bannerFile', undefined, { shouldDirty: true })
			setValue('bannerUrl', undefined, { shouldDirty: true })
			setValue('removeBanner', true, { shouldDirty: true })
		}

		await trigger()
	}

	const onCancel = () => {
		reset(defaultValues, { keepDirty: false })
		setAvatarTouched(false)
		setBannerTouched(false)
	}

	const onSubmit = (data: TEditingChannelSchema) => {
		const fd = new FormData()
		fd.append('name', data.name)
		fd.append('username', data.username.trim().toLowerCase())
		fd.append('description', data.description ?? '')

		if (data.avatarFile) {
			fd.append('avatar', data.avatarFile)
		}

		if (data.bannerFile) {
			fd.append('banner', data.bannerFile)
		}

		fd.append('removeAvatar', String(data.removeAvatar ?? false))
		fd.append('removeBanner', String(data.removeBanner ?? false))
		fd.append('avatarFrameColor', data.avatarFrameColor ?? '')
		fd.append('avatarFrameThickness', data.avatarFrameThickness ?? '')
		fd.append('avatarFrameStyle', data.avatarFrameStyle ?? '')

		if (!channel?.id) {
			return
		}

		const previousUsername = channel.username

		editChannel(
			{ channelId: channel.id, fd },
			{
				onSuccess: (updated) => {
					setChannel(updated)

					if (
						previousUsername &&
						updated.username !== previousUsername &&
						pathname.includes(`/workplace/channel/@${previousUsername}`)
					) {
						router.replace(
							pathname.replace(
								`/workplace/channel/@${previousUsername}`,
								`/workplace/channel/@${updated.username}`,
							),
						)
					}
				},
			},
		)
		setAvatarTouched(false)
		setBannerTouched(false)
	}

	useEffect(() => {
		reset(defaultValues)
		setAvatarTouched(false)
		setBannerTouched(false)
	}, [defaultValues, reset])

	const hasAnyChanges = isDirty || avatarTouched || bannerTouched
	const isPublishDisabled = isPending || !hasAnyChanges

	return (
		<form
			// @ts-ignore
			onSubmit={handleSubmit(onSubmit)}
			className='py-10 px-5 flex flex-col items-start min-h-[calc(100vh-73px)] space-y-10'
		>
			<div className='sticky top-[73px] z-30 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border/40 w-full'>
				<div className='flex flex-col min-[500px]:flex-row min-[500px]:items-center justify-between w-full py-3 gap-2 min-[500px]:gap-3'>
					<h1 className='text-lg min-[400px]:text-xl min-[980px]:text-[25px] font-bold tracking-tight shrink-0'>
						{t('pageTitle')}
					</h1>
					<div className='flex items-center gap-2 flex-wrap'>
						<Button
							type='button'
							variant='secondary'
							className='rounded-full px-3 min-[400px]:px-4 text-xs min-[400px]:text-sm font-medium h-8 min-[400px]:h-9'
							asChild
						>
							<Link href={PAGES.CHANNEL(channel?.username ?? '')}>
								{t('goToChannel')}
							</Link>
						</Button>
						<Button
							type='button'
							variant='outline'
							className='rounded-full px-3 min-[400px]:px-4 text-xs min-[400px]:text-sm font-medium h-8 min-[400px]:h-9'
							onClick={onCancel}
						>
							{t('cancel')}
						</Button>
						<Button
							type='submit'
							disabled={isPublishDisabled}
							aria-busy={isPending}
							className={cn(
								'rounded-full px-3 min-[400px]:px-4 text-xs min-[400px]:text-sm font-medium h-8 min-[400px]:h-9 relative',
								isPending && 'disabled:opacity-100',
							)}
						>
							<span
								className={cn(
									isPending && 'invisible',
									'inline-block min-w-[7.25rem] min-[400px]:min-w-[8.25rem] text-center',
								)}
								aria-hidden={isPending}
							>
								{t('publish')}
							</span>
							{isPending && (
								<span
									className='absolute inset-0 flex items-center justify-center pointer-events-none'
									aria-hidden
								>
									<Lottie
										animationData={loader}
										loop
										className='size-7 min-[400px]:size-8'
									/>
								</span>
							)}
						</Button>
					</div>
				</div>
			</div>

			<WorkplaceBrandingBanner
				onSelectBanner={onSelectBanner}
				watch={watch}
				setValue={setValue}
				channel={channel}
				allowAnimatedBanner={allowAnimatedBanner}
			/>

			<WorkplaceBrandingAvatar
				onSelectAvatar={onSelectAvatar}
				watch={watch}
				setValue={setValue}
				channel={channel}
				isPremium={isPremium}
				errors={errors}
			/>

			<WorkplaceBrandingFields
				watchedUsername={watchedUsername}
				errors={errors}
				register={register}
			/>
		</form>
	)
}
