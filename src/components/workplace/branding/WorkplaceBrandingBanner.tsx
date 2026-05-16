import type { TEditingChannelSchema } from '@/schemas/channel/edit-channel.schema'
import type { IChannel } from '@/types/channel.types'
import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import type { UseFormSetValue, UseFormWatch } from 'react-hook-form'
import { FiTrash2 } from 'react-icons/fi'
import { BannerUploader } from './BannerUploader'

interface IWorkplaceBrandingBanner {
	watch: UseFormWatch<TEditingChannelSchema>
	setValue: UseFormSetValue<TEditingChannelSchema>
	onSelectBanner: (e: React.ChangeEvent<HTMLInputElement>) => void
	channel: IChannel | null
	allowAnimatedBanner?: boolean
}

export function WorkplaceBrandingBanner({
	watch,
	setValue,
	onSelectBanner,
	channel,
	allowAnimatedBanner = false,
}: IWorkplaceBrandingBanner) {
	const t = useTranslations('workplaceBranding.banner')
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
		setValue('bannerFile', undefined, {
			shouldDirty: true,
			shouldValidate: true,
		})
		setValue('bannerUrl', undefined as any, { shouldDirty: true })
		setValue('removeBanner', true, { shouldDirty: true })
		setPreviewUrl(undefined)

		const fakeEvent = {
			target: { files: [] },
		} as unknown as React.ChangeEvent<HTMLInputElement>
		onSelectBanner(fakeEvent)
	}

	return (
		<section className='relative w-full rounded-2xl border border-border/40 bg-background/60 p-4 min-[500px]:p-6 shadow-sm hover:shadow-md transition-all'>
			<h2 className='text-base min-[500px]:text-xl font-semibold mb-2'>
				{t('sectionTitle')}
			</h2>
			<p className='text-xs min-[500px]:text-sm text-muted-foreground mb-4 min-[500px]:mb-5'>
				{t('sectionDescription')}
			</p>

			<BannerUploader
				initialUrl={previewUrl}
				allowAnimatedBanner={allowAnimatedBanner}
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
					className='absolute top-4 min-[500px]:top-6 right-4 min-[500px]:right-6 p-1.5 min-[500px]:p-2 rounded-full bg-primary text-destructive-foreground cursor-pointer hover:opacity-90 transition'
					title={t('removeBannerTitle')}
				>
					<FiTrash2 className='w-3.5 h-3.5 min-[500px]:w-4 min-[500px]:h-4' />
				</button>
			)}
		</section>
	)
}
