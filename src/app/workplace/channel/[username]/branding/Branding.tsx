'use client'

import { Button } from '@/components/ui/button'
import { WorkplaceBrandingAvatar } from '@/components/workplace/branding/WorkplaceBrandingAvatar'
import { WorkplaceBrandingBanner } from '@/components/workplace/branding/WorkplaceBrandingBanner'
import { WorkplaceBrandingFields } from '@/components/workplace/branding/WorkplaceBrandingFields'
import { PAGES } from '@/constants/pages.constants'
import { useEditChannel } from '@/hooks/channel/useEditChannel'
import {
	editingChannelSchema,
	TEditingChannelSchema,
} from '@/schemas/channel/edit-channel.schema'
import { useChannelStore } from '@/zustand/store/channelStore'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'

export function Branding() {
	const { channel } = useChannelStore()
	const { editChannel } = useEditChannel()

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
		formState: { errors, isDirty, isSubmitting, isValid },
	} = useForm<TEditingChannelSchema>({
		resolver: zodResolver(editingChannelSchema),
		mode: 'onChange',
		defaultValues,
	})

	// 🚀 must register file inputs for RHF
	useEffect(() => {
		register('avatarFile')
		register('bannerFile')
		register('removeAvatar')
		register('removeBanner')
	}, [register])

	const watchedUsername = watch('username')

	const onSelectAvatar = async (file: File | null) => {
		console.log('🖼️ onSelectAvatar called with:', file)
		setAvatarTouched(true)

		setValue('avatarFile', file ?? undefined, {
			shouldDirty: true,
			shouldValidate: true,
		})
		setValue('removeAvatar', !file, { shouldDirty: true })

		// ✅ форсуємо перевірку
		await trigger()
		console.log('✅ after trigger, current values:', getValues())
	}

	const onSelectBanner = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const f = e.target.files?.[0]
		console.log('🖼️ onSelectBanner called with:', f)
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
		console.log('🚀 onSubmit data:', data)

		const fd = new FormData()
		fd.append('name', data.name)
		fd.append('username', data.username.trim().toLowerCase())
		fd.append('description', data.description ?? '')

		if (data.avatarFile) {
			console.log('📤 appending avatar:', data.avatarFile)
			fd.append('avatar', data.avatarFile)
		}

		if (data.bannerFile) {
			console.log('📤 appending banner:', data.bannerFile)
			fd.append('banner', data.bannerFile)
		}

		fd.append('removeAvatar', String(data.removeAvatar ?? false))
		fd.append('removeBanner', String(data.removeBanner ?? false))

		if (!channel?.id) {
			console.error('❌ No channel id — aborting submit')
			return
		}

		editChannel({ channelId: channel.id, fd })
		setAvatarTouched(false)
		setBannerTouched(false)
	}

	useEffect(() => {
		reset(defaultValues)
		setAvatarTouched(false)
		setBannerTouched(false)
	}, [defaultValues, reset])

	const hasAnyChanges = isDirty || avatarTouched || bannerTouched
	const isPublishDisabled = isSubmitting || !hasAnyChanges

	return (
		<form
			onSubmit={handleSubmit(onSubmit)}
			className='p-10 flex flex-col items-start min-h-[calc(100vh-73px)] space-y-10'
		>
			<div className='sticky top-[73px] z-30 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border/40 flex justify-between w-full'>
				<div className='flex items-center justify-between w-full px-0 py-3'>
					<h1 className='text-[25px] font-bold tracking-tight'>
						Channel branding
					</h1>
					<div className='flex items-center gap-3'>
						<Button
							type='button'
							variant='secondary'
							className='rounded-full px-5 text-sm font-medium'
						>
							<Link href={PAGES.CHANNEL(channel?.username)}>Go to channel</Link>
						</Button>
						<Button
							type='button'
							variant='outline'
							className='rounded-full px-5 text-sm font-medium'
							onClick={onCancel}
						>
							Cancel
						</Button>
						<Button
							type='submit'
							disabled={isPublishDisabled}
							className='rounded-full px-6 text-sm font-medium'
						>
							Publish
						</Button>
					</div>
				</div>
			</div>

			<WorkplaceBrandingBanner
				onSelectBanner={onSelectBanner}
				watch={watch}
				setValue={setValue}
				channel={channel}
			/>

			<WorkplaceBrandingAvatar
				onSelectAvatar={onSelectAvatar}
				watch={watch}
				channel={channel}
			/>

			<WorkplaceBrandingFields
				watchedUsername={watchedUsername}
				errors={errors}
				register={register}
			/>
		</form>
	)
}
