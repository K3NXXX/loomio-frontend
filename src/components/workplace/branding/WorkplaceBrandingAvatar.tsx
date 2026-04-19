import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import type { TEditingChannelSchema } from '@/schemas/channel/edit-channel.schema'
import type { IChannel } from '@/types/channel.types'
import { getInitials } from '@/utils/get-initials'
import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'
import type { UseFormWatch } from 'react-hook-form'
import { AvatarUploader } from './AvatarUploader'

interface IWorkplaceBrandingAvatar {
	watch: UseFormWatch<TEditingChannelSchema>
	channel: IChannel | null
	onSelectAvatar: (file: File | null) => void
}

export function WorkplaceBrandingAvatar({
	watch,
	channel,
	onSelectAvatar,
}: IWorkplaceBrandingAvatar) {
	const t = useTranslations('workplaceBranding.avatar')
	const [previewUrl, setPreviewUrl] = useState<string | undefined>(
		channel?.avatarUrl ?? undefined,
	)

	const avatarFile = watch('avatarFile')

	useEffect(() => {
		if (avatarFile instanceof File) {
			const objectUrl = URL.createObjectURL(avatarFile)
			setPreviewUrl(objectUrl)
			return () => URL.revokeObjectURL(objectUrl)
		}
	}, [avatarFile])

	useEffect(() => {
		if (!avatarFile && channel?.avatarUrl) setPreviewUrl(channel.avatarUrl)
		if (!channel?.avatarUrl && !avatarFile) setPreviewUrl(undefined)
	}, [channel?.avatarUrl, avatarFile])

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
					<div className='size-24 min-[500px]:size-32 min-[700px]:size-40 rounded-full overflow-hidden ring-1 ring-border'>
						<Avatar className='size-24 min-[500px]:size-32 min-[700px]:size-40'>
							<AvatarImage src={previewUrl} />
							<AvatarFallback className='text-base min-[500px]:text-lg'>
								{getInitials(channel?.username ?? '')}
							</AvatarFallback>
						</Avatar>
					</div>
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
				</div>
			</div>
		</section>
	)
}
