'use client'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import type { IVideo } from '@/types/video.types'
import { DialogTitle } from '@radix-ui/react-dialog'
import { Mail } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import {
	FacebookIcon,
	FacebookShareButton,
	TelegramIcon,
	TelegramShareButton,
	TwitterIcon,
	TwitterShareButton,
	WhatsappIcon,
	WhatsappShareButton,
} from 'react-share'
import { toast } from 'sonner'

interface ShareVideoModalProps {
	video: IVideo
	open: boolean
	onClose: () => void
}

export function ShareVideoModal({
	video,
	open,
	onClose,
}: ShareVideoModalProps) {
	const t = useTranslations('shareVideoModal')
	const videoUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/watch?v=${video.id}`
	const [copied, setCopied] = useState(false)

	const handleCopy = async () => {
		await navigator.clipboard.writeText(videoUrl)
		setCopied(true)
		toast.success(t('linkCopiedToast'))
		setTimeout(() => setCopied(false), 2000)
	}

	const handleGmailShare = () => {
		const subject = encodeURIComponent(t('emailSubject', { title: video.title }))
		const body = encodeURIComponent(t('emailBody', { url: videoUrl }))
		const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&tf=1&to=&su=${subject}&body=${body}`
		window.open(gmailUrl, '_blank', 'width=800,height=600')
	}

	return (
		<Dialog open={open} onOpenChange={onClose}>
			<DialogContent className='max-w-md rounded-2xl border-none p-6 bg-background shadow-xl text-center'>
				<DialogTitle className='text-base font-semibold mb-5'>
					{t('title')}
				</DialogTitle>

				<div className='grid grid-cols-3 sm:grid-cols-5 gap-5 justify-center mb-6'>
					<div className='flex flex-col items-center gap-1'>
						<WhatsappShareButton url={videoUrl}>
							<WhatsappIcon size={48} round className='cursor-pointer' />
						</WhatsappShareButton>
						<span className='text-xs text-muted-foreground'>{t('whatsapp')}</span>
					</div>

					<div className='flex flex-col items-center gap-1'>
						<FacebookShareButton url={videoUrl}>
							<FacebookIcon size={48} round className='cursor-pointer' />
						</FacebookShareButton>
						<span className='text-xs text-muted-foreground'>{t('facebook')}</span>
					</div>

					<div className='flex flex-col items-center gap-1'>
						<TwitterShareButton
							url={videoUrl}
							title={video.title}
							hashtags={['video', 'share']}
						>
							<TwitterIcon size={48} round className='cursor-pointer' />
						</TwitterShareButton>
						<span className='text-xs text-muted-foreground'>{t('twitter')}</span>
					</div>

					<div className='flex flex-col items-center gap-1'>
						<TelegramShareButton url={videoUrl} title={video.title}>
							<TelegramIcon size={48} round className='cursor-pointer' />
						</TelegramShareButton>
						<span className='text-xs text-muted-foreground'>{t('telegram')}</span>
					</div>

					<div
						onClick={handleGmailShare}
						className='flex flex-col items-center gap-1 cursor-pointer'
					>
						<div className='flex items-center justify-center w-12 h-12 rounded-full bg-red-500'>
							<Mail size={28} color='white' />
						</div>
						<span className='text-xs text-muted-foreground'>{t('gmail')}</span>
					</div>
				</div>

				<div className='flex w-full items-center bg-muted/60 rounded-xl overflow-hidden'>
					<input
						readOnly
						value={videoUrl}
						className='flex-1 bg-transparent px-3 py-2 text-sm outline-none cursor-pointer'
						onClick={handleCopy}
					/>
					<Button
						onClick={handleCopy}
						className='rounded-none rounded-r-xl bg-primary text-white font-medium px-4 cursor-pointer'
					>
						{copied ? t('copied') : t('copyLink')}
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	)
}
