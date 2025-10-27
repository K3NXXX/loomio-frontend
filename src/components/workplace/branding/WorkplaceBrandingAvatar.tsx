import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import type { TEditingChannelSchema } from '@/schemas/channel/edit-channel.schema'
import type { IChannel } from '@/types/channel.types'
import { getInitials } from '@/utils/get-initials'
import type { UseFormSetValue, UseFormWatch } from 'react-hook-form'

interface IWorkplaceBrandingAvatar {
	watch: UseFormWatch<TEditingChannelSchema>
	channel: IChannel
	onSelectAvatar: (e: React.ChangeEvent<HTMLInputElement>) => void
	setValue: UseFormSetValue<TEditingChannelSchema>
}

export function WorkplaceBrandingAvatar({
	watch,
	channel,
	onSelectAvatar,
	setValue,
}: IWorkplaceBrandingAvatar) {
	return (
		<section className='w-[700px] rounded-2xl border border-border/40 bg-background/60 p-6 shadow-sm hover:shadow-md transition-all'>
			<h2 className='text-xl font-semibold mb-2'>Profile photo</h2>
			<p className='text-sm text-muted-foreground mb-5'>
				Your profile photo may appear next to your videos and comments.
			</p>
			<div className='flex flex-col gap-5'>
				<div className='flex items-center gap-6'>
					<Avatar className='size-40 ring-1 ring-border'>
						<AvatarImage src={channel?.avatarUrl} />
						<AvatarFallback>
							{getInitials(channel?.username ?? '')}
						</AvatarFallback>
					</Avatar>
					<div className='flex-1 flex flex-col gap-3'>
						<p className='text-sm text-muted-foreground leading-relaxed max-w-[400px]'>
							We recommend using an image at least <b>98 × 98 pixels</b> in{' '}
							<b>PNG</b> or <b>GIF</b> format. Animated images are not allowed.
							The file size should not exceed <b>4 MB</b>.
						</p>
						<div className='flex gap-2'>
							<input
								type='file'
								accept='image/png,image/gif'
								className='hidden'
								id='avatarFile'
								onChange={onSelectAvatar}
							/>
							<Button
								type='button'
								className='rounded-full px-8'
								onClick={() => document.getElementById('avatarFile')?.click()}
							>
								Edit
							</Button>
							<Button
								type='button'
								variant='outline'
								className='rounded-full px-5'
								onClick={() =>
									setValue('avatarFile', undefined, {
										shouldDirty: true,
									})
								}
							>
								Delete
							</Button>
						</div>
						{watch('avatarFile') && (
							<p className='mt-2 text-xs text-muted-foreground'>
								Selected: <b>{watch('avatarFile')?.name}</b>
							</p>
						)}
					</div>
				</div>
			</div>
		</section>
	)
}
