import { create } from 'zustand'

interface VideoStore {
	thumbnailPreview: string | null
	setThumbnailPreview: (url: string | null) => void

	thumbnailFile: File | null
	setThumbnailFile: (file: File | null) => void
}

export const useVideoStore = create<VideoStore>((set) => ({
	thumbnailPreview: null,
	setThumbnailPreview: (url) => set({ thumbnailPreview: url }),

	thumbnailFile: null,
	setThumbnailFile: (file) => set({ thumbnailFile: file }),
}))
