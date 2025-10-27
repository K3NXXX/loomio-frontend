import type { TEditingChannelSchema } from '@/schemas/channel/edit-channel.schema'
import type { IChannel } from '@/types/channel.types'
import { useEffect, useState } from 'react'
import type { UseFormSetValue, UseFormWatch } from 'react-hook-form'
import { FiTrash2 } from 'react-icons/fi'
import { BannerUploader } from './BannerUploader'

interface IWorkplaceBrandingBanner {
	watch: UseFormWatch<TEditingChannelSchema>
	setValue: UseFormSetValue<TEditingChannelSchema>
	onSelectBanner: (e: React.ChangeEvent<HTMLInputElement>) => void
	channel: IChannel | null
}

export function WorkplaceBrandingBanner({
	watch,
	setValue,
	onSelectBanner,
	channel,
}: IWorkplaceBrandingBanner) {
	console.log('c', channel)
	const [previewUrl, setPreviewUrl] = useState<string | undefined>(
		channel?.bannerUrl ?? undefined,
	)

	const bannerFile = watch('bannerFile')

	useEffect(() => {
		if (bannerFile instanceof File) {
			const objectUrl = URL.createObjectURL(bannerFile)
			setPreviewUrl(objectUrl)
			return () => URL.revokeObjectURL(objectUrl)
		}
	}, [bannerFile])

	useEffect(() => {
		if (!bannerFile && channel?.bannerUrl) {
			setPreviewUrl(channel?.bannerUrl)
		}
		if (!channel?.bannerUrl && !bannerFile) {
			setPreviewUrl(undefined)
		}
	}, [channel?.bannerUrl, bannerFile])

	const handleRemove = () => {
		setValue('bannerFile', undefined)
		setPreviewUrl(undefined)
		const fakeEvent = {
			target: { files: [] },
		} as unknown as React.ChangeEvent<HTMLInputElement>
		onSelectBanner(fakeEvent)
	}

	return (
		<section className='relative w-[700px] rounded-2xl border border-border/40 bg-background/60 p-6 shadow-sm hover:shadow-md transition-all'>
			<h2 className='text-xl font-semibold mb-2'>Banner</h2>
			<p className='text-sm text-muted-foreground mb-5'>
				This image is displayed at the top of your channel page.
			</p>

			<BannerUploader
				initialUrl={previewUrl}
				onChange={(file) => {
					if (file) {
						const fakeEvent = {
							target: { files: [file] },
						} as unknown as React.ChangeEvent<HTMLInputElement>
						onSelectBanner(fakeEvent)
					} else {
						handleRemove()
					}
				}}
			/>

			{previewUrl && (
				<button
					type='button'
					onClick={handleRemove}
					className='absolute top-6 right-6 p-2 rounded-full bg-primary text-destructive-foreground cursor-pointer hover:opacity-90 transition'
					title='Remove banner'
				>
					<FiTrash2 className='w-4 h-4' />
				</button>
			)}
		</section>
	)
}
