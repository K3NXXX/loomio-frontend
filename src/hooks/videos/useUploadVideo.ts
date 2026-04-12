import { useState } from 'react'
import axios from 'axios'
import { videoService } from '@/services/video.service'

export const useUploadVideo = () => {
	const [isUploading, setIsUploading] = useState(false)

	const uploadVideo = async ({
		file,
		onProgress,
		controller,
		uploadURL,
	}: {
		file: File
		onProgress?: (p: number) => void
		controller: AbortController
		uploadURL: string
	}) => {
		try {
			setIsUploading(true)

			const formData = new FormData()
			formData.append('file', file)

			await axios.post(uploadURL, formData, {
				signal: controller.signal,
				headers: {
					'Content-Type': 'multipart/form-data',
				},
				onUploadProgress: (event) => {
					if (!event.total) return
					const percent = Math.round((event.loaded * 100) / event.total)
					onProgress?.(percent)
				},
			})

			return true
		} catch (err: any) {
			if (err.code === 'ERR_CANCELED') {
				console.log('Upload cancelled')
				return null
			}
			throw err
		} finally {
			setIsUploading(false)
		}
	}

	return { uploadVideo, isUploading }
}
