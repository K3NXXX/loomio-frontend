import { ChannelAvatarFrame } from '@/components/account/channels/channel/ChannelAvatarFrame'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import {
	AVATAR_FRAME_STYLE_VALUES,
	AVATAR_FRAME_THICKNESS_VALUES,
} from '@/constants/avatar-frame.constants'
import type { TEditingChannelSchema } from '@/schemas/channel/edit-channel.schema'
import type { IChannel } from '@/types/channel.types'
import { cn } from '@/lib/utils'
import { getInitials } from '@/utils/get-initials'
import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'
import type {
	FieldErrors,
	UseFormSetValue,
	UseFormWatch,
} from 'react-hook-form'
import { AvatarUploader } from './AvatarUploader'

const THICKNESS_SELECT_DEFAULT = '_default'
const STYLE_SELECT_DEFAULT = '_default'

interface IWorkplaceBrandingAvatar {
	watch: UseFormWatch<TEditingChannelSchema>
	setValue: UseFormSetValue<TEditingChannelSchema>
	channel: IChannel | null
	onSelectAvatar: (file: File | null) => void
	isPremium: boolean
	errors: FieldErrors<TEditingChannelSchema>
}

export function WorkplaceBrandingAvatar({
	watch,
	setValue,
	channel,
	onSelectAvatar,
	isPremium,
	errors,
}: IWorkplaceBrandingAvatar) {
	const t = useTranslations('workplaceBranding.avatar')
	const [previewUrl, setPreviewUrl] = useState<string | undefined>(
		channel?.avatarUrl ?? undefined,
	)

	const avatarFile = watch('avatarFile')
	const removeAvatar = watch('removeAvatar')
	const avatarFrameColor = (watch('avatarFrameColor') ?? '').trim()
	const avatarFrameThickness = (watch('avatarFrameThickness') ?? '').trim()
	const avatarFrameStyle = (watch('avatarFrameStyle') ?? '').trim()

	const framePreviewColor = /^#[0-9A-Fa-f]{6}$/.test(avatarFrameColor)
		? avatarFrameColor
		: undefined

	const previewThickness =
		avatarFrameThickness !== '' ? avatarFrameThickness : undefined
	const previewStyle = avatarFrameStyle !== '' ? avatarFrameStyle : undefined

	const colorInputValue = framePreviewColor ?? '#6366f1'

	const resetFrameToDefaults = () => {
		setValue('avatarFrameColor', '', { shouldDirty: true, shouldValidate: true })
		setValue('avatarFrameThickness', '', { shouldDirty: true, shouldValidate: true })
		setValue('avatarFrameStyle', '', { shouldDirty: true, shouldValidate: true })
	}

	useEffect(() => {
		if (avatarFile instanceof File) {
			const objectUrl = URL.createObjectURL(avatarFile)
			setPreviewUrl(objectUrl)
			return () => URL.revokeObjectURL(objectUrl)
		}
	}, [avatarFile])

	useEffect(() => {
		if (removeAvatar) {
			setPreviewUrl(undefined)
			return
		}
		if (avatarFile instanceof File) return
		if (channel?.avatarUrl) setPreviewUrl(channel.avatarUrl)
		else setPreviewUrl(undefined)
	}, [channel?.avatarUrl, avatarFile, removeAvatar])

	return (
		<section className='w-full rounded-2xl border border-border/40 bg-background/60 p-4 min-[500px]:p-6 shadow-sm hover:shadow-md transition-all max-w-[700px]'>
			<h2 className='text-base min-[500px]:text-xl font-semibold mb-2'>
				{t('sectionTitle')}
			</h2>
			<p className='text-xs min-[500px]:text-sm text-muted-foreground mb-4 min-[500px]:mb-5'>
				{t('sectionDescription')}
			</p>

			<div className='flex flex-col min-[500px]:flex-row items-center min-[500px]:items-start gap-4 min-[500px]:gap-6'>
				<div className='shrink-0'>
					<ChannelAvatarFrame
						variant='studio'
						frameColor={framePreviewColor}
						frameThickness={previewThickness}
						frameStyle={previewStyle}
					>
						<Avatar className='size-24 min-[500px]:size-32 min-[700px]:size-40'>
							<AvatarImage src={previewUrl} />
							<AvatarFallback className='text-base min-[500px]:text-lg'>
								{getInitials(channel?.username ?? '')}
							</AvatarFallback>
						</Avatar>
					</ChannelAvatarFrame>
				</div>

				<div className='flex-1 w-full min-[500px]:w-auto'>
					<AvatarUploader
						initialUrl={previewUrl}
						valueUrl={previewUrl}
						minWidth={256}
						minHeight={256}
						maxSizeMB={4}
						outputSize={512}
						onChange={(file, dataUrl) => {
							onSelectAvatar(file)
							setPreviewUrl(dataUrl ?? undefined)
						}}
					/>

					{watch('avatarFile') && (
						<p className='mt-2 text-xs text-muted-foreground'>
							{t('selectedPrefix')} <b>{watch('avatarFile')?.name}</b>
						</p>
					)}

					<div className='mt-4 min-[500px]:mt-5 pt-4 border-t border-border/40 space-y-4'>
						<div>
							<h3 className='text-sm font-medium mb-1.5'>
								{t('frameColorTitle')}
							</h3>
							{isPremium ? (
								<div className='flex flex-col gap-2'>
									<p className='text-xs text-muted-foreground'>
										{t('frameColorHintPremium')}
									</p>
									<div className='flex flex-wrap items-center gap-3'>
										<label className='flex items-center gap-2 text-xs font-medium cursor-pointer'>
											<input
												type='color'
												value={colorInputValue}
												onChange={(e) => {
													const hex = e.target.value
													setValue('avatarFrameColor', hex, {
														shouldDirty: true,
														shouldValidate: true,
													})
												}}
												className={cn(
													'size-9 rounded-md border border-border bg-background p-0.5 cursor-pointer',
													'[&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:rounded',
												)}
												aria-label={t('frameColorPickerAria')}
											/>
											<span className='font-mono text-muted-foreground'>
												{framePreviewColor ?? t('frameColorDefaultBadge')}
											</span>
										</label>
									</div>
									{errors.avatarFrameColor && (
										<p className='text-xs text-destructive'>
											{errors.avatarFrameColor.message}
										</p>
									)}
								</div>
							) : (
								<p className='text-xs text-muted-foreground'>
									{t('frameColorLocked')}
								</p>
							)}
						</div>

						<div>
							<h3 className='text-sm font-medium mb-1.5'>
								{t('frameThicknessTitle')}
							</h3>
							{isPremium ? (
								<>
									<Select
										value={
											avatarFrameThickness === ''
												? THICKNESS_SELECT_DEFAULT
												: avatarFrameThickness
										}
										onValueChange={(v) => {
											setValue(
												'avatarFrameThickness',
												v === THICKNESS_SELECT_DEFAULT ? '' : v,
												{ shouldDirty: true, shouldValidate: true },
											)
										}}
									>
										<SelectTrigger className='w-full min-[500px]:w-[220px] h-9 text-xs'>
											<SelectValue placeholder={t('frameThicknessTitle')} />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value={THICKNESS_SELECT_DEFAULT}>
												{t('frameOptionDefault')}
											</SelectItem>
											{AVATAR_FRAME_THICKNESS_VALUES.map((v) => (
												<SelectItem key={v} value={v}>
													{t(`frameThickness.${v}`)}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									{errors.avatarFrameThickness && (
										<p className='text-xs text-destructive mt-1'>
											{errors.avatarFrameThickness.message}
										</p>
									)}
								</>
							) : (
								<p className='text-xs text-muted-foreground'>
									{t('frameThicknessLocked')}
								</p>
							)}
						</div>

						<div>
							<h3 className='text-sm font-medium mb-1.5'>
								{t('frameStyleTitle')}
							</h3>
							{isPremium ? (
								<>
									<Select
										value={
											avatarFrameStyle === ''
												? STYLE_SELECT_DEFAULT
												: avatarFrameStyle
										}
										onValueChange={(v) => {
											setValue(
												'avatarFrameStyle',
												v === STYLE_SELECT_DEFAULT ? '' : v,
												{ shouldDirty: true, shouldValidate: true },
											)
										}}
									>
										<SelectTrigger className='w-full min-[500px]:w-[220px] h-9 text-xs'>
											<SelectValue placeholder={t('frameStyleTitle')} />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value={STYLE_SELECT_DEFAULT}>
												{t('frameOptionDefault')}
											</SelectItem>
											{AVATAR_FRAME_STYLE_VALUES.map((v) => (
												<SelectItem key={v} value={v}>
													{t(`frameStyle.${v}`)}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									{errors.avatarFrameStyle && (
										<p className='text-xs text-destructive mt-1'>
											{errors.avatarFrameStyle.message}
										</p>
									)}
								</>
							) : (
								<p className='text-xs text-muted-foreground'>
									{t('frameStyleLocked')}
								</p>
							)}
						</div>

						{isPremium && (
							<Button
								type='button'
								variant='outline'
								size='sm'
								className='h-8 text-xs rounded-full'
								onClick={resetFrameToDefaults}
							>
								{t('frameResetAll')}
							</Button>
						)}
					</div>
				</div>
			</div>
		</section>
	)
}
