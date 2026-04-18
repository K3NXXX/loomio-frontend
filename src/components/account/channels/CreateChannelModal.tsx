'use client'
import { AvatarUploader } from '@/app/(home)/account/edit-account/AvatarUploader'
import loader from '@/assets/animations/loader.json'
import { Button } from '@/components/ui/button'
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useCreateChannelFormErrors } from '@/hooks/account/useCreateChannelsFormErrors'
import { useGetMe } from '@/hooks/auth/useGetMe'
import { useCreateChannel } from '@/hooks/channel/useCreateChannel'
import {
	type CreateChannelSchema,
	createChannelSchema,
} from '@/schemas/account/create-channel.schema'
import { getInitials } from '@/utils/get-initials'
import { truncateName } from '@/utils/truncateName'
import { zodResolver } from '@hookform/resolvers/zod'
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar'
import Lottie from 'lottie-react'
import { useTranslations } from 'next-intl'
import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'

export interface CreateChannelModalProps {
	open: boolean
	onOpenChange: (open: boolean) => void
}

export default function CreateChannelModal({
	open,
	onOpenChange,
}: CreateChannelModalProps) {
	const t = useTranslations()
	const { userData } = useGetMe()

	const {
		register,
		handleSubmit,
		watch,
		formState: { errors, isValid },
		reset,
	} = useForm<CreateChannelSchema>({
		resolver: zodResolver(createChannelSchema),
		reValidateMode: 'onSubmit',
		defaultValues: { name: '', username: '' },
	})

	useCreateChannelFormErrors(errors)

	const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
	const [initialAvatar, setInitialAvatar] = useState<string | null>(null)
	const [avatarFile, setAvatarFile] = useState<File | null>(null)

	useEffect(() => {
		if (open) {
			setAvatarPreview(null)
			setInitialAvatar(null)
			setAvatarFile(null)
		}
	}, [open])

	const nameValue = watch('name')
	const usernameValue = watch('username')

	const previewName = useMemo(
		() =>
			nameValue?.trim()
				? nameValue.trim()
				: t('accountPage.createChannelModal.previewNameFallback'),
		[nameValue, t],
	)

	const previewUsername = useMemo(
		() =>
			usernameValue?.trim()
				? `@${usernameValue.trim()}`
				: t('accountPage.createChannelModal.previewUsernameFallback'),
		[usernameValue, t],
	)

	const { createChannel, channelCreatingLoading } = useCreateChannel()

	const handleAvatarChange = (value?: File | string | null) => {
		if (value instanceof File) {
			setAvatarFile(value)
			setAvatarPreview(URL.createObjectURL(value))
		} else if (typeof value === 'string') {
			setAvatarFile(null)
			setAvatarPreview(value)
		} else {
			setAvatarFile(null)
			setAvatarPreview(initialAvatar)
		}
	}

	const onSubmit = async (data: CreateChannelSchema) => {
		const fd = new FormData()
		fd.append('name', data.name)
		fd.append('username', data.username.toLowerCase().trim())

		if (avatarFile) {
			fd.append('avatar', avatarFile)
		}

		createChannel(fd, {
			onSuccess: () => {
				onOpenChange(false)
				reset()
				setAvatarFile(null)
				setAvatarPreview(null)
				setInitialAvatar(null)
			},
		})
	}

	return (
		<Dialog
			open={open}
			onOpenChange={(v) => {
				onOpenChange(v)
				if (!v) {
					reset()
					setAvatarPreview(null)
					setAvatarFile(null)
					setInitialAvatar(null)
				}
			}}
		>
			<DialogContent
				onInteractOutside={(e) => e.preventDefault()}
				className='fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 min-w-[960px] min-h-[600px] max-h-[90vh] overflow-y-auto rounded-2xl border border-neutral-800 bg-gradient-to-br from-neutral-900 via-neutral-950 to-black text-white shadow-2xl backdrop-blur-xl p-0'
			>
				<DialogHeader className='px-6 pt-6 pb-4 border-b border-neutral-800'>
					<DialogTitle className='text-lg font-semibold flex items-center justify-between'>
						<span className='flex items-center gap-2'>
							{t('accountPage.createChannelModal.title')}
						</span>
					</DialogTitle>
					<p className='text-sm text-neutral-400 mt-1'>
						{t('accountPage.createChannelModal.subtitle')}
					</p>
				</DialogHeader>

				<form
					onSubmit={handleSubmit(onSubmit)}
					className='px-6 py-8 grid grid-cols-2 gap-8'
				>
					<div className='flex flex-col gap-6'>
						<div>
							<Label className='block mb-2 text-sm text-neutral-300'>
								{t('accountPage.createChannelModal.avatarLabel')}
							</Label>
							<AvatarUploader
								value={avatarPreview}
								fallbackName={previewName}
								onChange={(file, preview) => {
									setAvatarFile(file)
									setAvatarPreview(preview)
								}}
							/>
						</div>

						<div className='space-y-2'>
							<Label
								htmlFor='channel-name'
								className='text-sm text-neutral-300'
							>
								{t('accountPage.createChannelModal.nameLabel')}
							</Label>
							<Input
								id='channel-name'
								placeholder={t('accountPage.createChannelModal.namePlaceholder')}
								className='bg-neutral-900/60 border-neutral-800 focus-visible:ring-primary'
								{...register('name')}
							/>
						</div>

						<div className='space-y-2'>
							<Label
								htmlFor='channel-username'
								className='text-sm text-neutral-300'
							>
								{t('accountPage.createChannelModal.usernameLabel')}
							</Label>
							<div className='relative'>
								<span className='absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500'>
									@
								</span>
								<Input
									id='channel-username'
									placeholder={t(
										'accountPage.createChannelModal.usernamePlaceholder',
									)}
									className='pl-7 bg-neutral-900/60 border-neutral-800 focus-visible:ring-primary'
									{...register('username', {
										setValueAs: (v) =>
											typeof v === 'string' ? v.toLowerCase().trim() : v,
									})}
								/>
							</div>
						</div>
					</div>

					<div className='flex flex-col'>
						<div className='rounded-2xl border border-neutral-800 bg-neutral-900/40 shadow-lg overflow-hidden transition-all'>
							<div className='h-24 bg-gradient-to-r from-primary/30 via-primary/10 to-transparent' />
							<div className='p-6 flex items-center gap-4'>
								<div className='w-16 h-16 rounded-full overflow-hidden ring-2 ring-primary/30 flex items-center justify-center bg-neutral-800'>
									<Avatar className='w-full h-full'>
										<AvatarImage src={avatarPreview || undefined} />
										<AvatarFallback className='flex items-center justify-center w-full h-full text-lg font-medium'>
											{getInitials(previewName)}
										</AvatarFallback>
									</Avatar>
								</div>
								<div className='flex flex-col'>
									<p className='text-base font-semibold text-white tracking-tight'>
										{truncateName(previewName, 25)}
									</p>
									<p className='text-sm text-neutral-400'>
										{truncateName(previewUsername, 25)}
									</p>
								</div>
							</div>
							<div className='px-6 py-3 text-sm text-neutral-400 border-t border-neutral-800/70'>
								{t('accountPage.createChannelModal.previewHint')}
							</div>
						</div>

						<div className='flex-1' />

						<div className='flex justify-end gap-3 pt-6'>
							<Button
								type='button'
								variant='secondary'
								className='bg-neutral-800/70 text-white hover:bg-neutral-800 rounded-xl px-6 py-2.5'
								onClick={() => {
									onOpenChange(false)
									reset()
									setAvatarPreview(null)
									setAvatarFile(null)
									setInitialAvatar(null)
								}}
							>
								{t('accountPage.createChannelModal.cancel')}
							</Button>
							<Button
								type='submit'
								disabled={!isValid || channelCreatingLoading}
								className='bg-primary text-primary-foreground font-semibold rounded-xl px-6 py-2.5 hover:bg-primary/90 disabled:opacity-50 disabled:pointer-events-none w-[142px]'
							>
								{channelCreatingLoading ? (
									<Lottie
										animationData={loader}
										loop
										className='absolute w-20 h-20'
									/>
								) : (
									t('accountPage.createChannelModal.submit')
								)}
							</Button>
						</div>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	)
}
