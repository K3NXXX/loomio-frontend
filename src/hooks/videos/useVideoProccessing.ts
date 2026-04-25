import { useEffect, useState } from 'react'
import { videoService } from '@/services/video.service'

export const useVideoProcessing = (
	videoId: string | null,
	setStatus: (status: string) => void
) => {
	const [isProcessing, setIsProcessing] = useState(false)

	useEffect(() => {
		if (!videoId) return

		setIsProcessing(true)

		let attempts = 0
		const maxAttempts = 30

		const interval = setInterval(async () => {
			try {
				attempts++

				const status = await videoService.getVideoStatus(videoId)

				if (status?.toLowerCase().trim() === 'ready') {
					setIsProcessing(false)
					setStatus('ready')
					clearInterval(interval)
				}

				if (attempts >= maxAttempts) {
					console.warn('Polling stopped (timeout)')
					setIsProcessing(false)
					clearInterval(interval)
				}
			} catch (e) {
				console.error(e)
			}
		}, 2000)

		return () => clearInterval(interval)
	}, [videoId])

	return { isProcessing }
}
