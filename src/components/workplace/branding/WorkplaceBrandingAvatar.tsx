import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import type { TEditingChannelSchema } from '@/schemas/channel/edit-channel.schema'
import type { IChannel } from '@/types/channel.types'
import { getInitials } from '@/utils/get-initials'
import { useEffect, useState } from 'react'
import type { UseFormWatch } from 'react-hook-form'
import { AvatarUploader } from './AvatarUploader'

interface IWorkplaceBrandingAvatar {
	watch: UseFormWatch<TEditingChannelSchema>
	channel: IChannel
	onSelectAvatar: (file: File | null) => void
}

export function WorkplaceBrandingAvatar({
	watch,
	channel,
	onSelectAvatar,
}: IWorkplaceBrandingAvatar) {
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

	// коли змінюється канал або аватар з бекенду
	useEffect(() => {
		if (!avatarFile && channel?.avatarUrl) setPreviewUrl(channel.avatarUrl)
		if (!channel?.avatarUrl && !avatarFile) setPreviewUrl(undefined)
	}, [channel?.avatarUrl, avatarFile])

	return (
		<section className='w-[700px] rounded-2xl border border-border/40 bg-background/60 p-6 shadow-sm hover:shadow-md transition-all'>
			<h2 className='text-xl font-semibold mb-2'>Profile photo</h2>
			<p className='text-sm text-muted-foreground mb-5'>
				Your profile photo may appear next to your videos and comments.
			</p>

			<div className='flex items-center gap-6'>
				<div className='shrink-0'>
					<div className='size-40 rounded-full overflow-hidden ring-1 ring-border'>
						<Avatar className='size-40'>
							<AvatarImage src={previewUrl} />
							<AvatarFallback>
								{getInitials(channel?.username ?? '')}
							</AvatarFallback>
						</Avatar>
					</div>
				</div>

				<div className='flex-1'>
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
							Selected: <b>{watch('avatarFile')?.name}</b>
						</p>
					)}
				</div>
			</div>
		</section>
	)
}
