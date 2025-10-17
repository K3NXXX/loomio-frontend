import { create } from 'zustand'

interface VideoStore {
	thumbnailPreview: string | null
	openUploadingVideo: boolean
	setThumbnailPreview: (url: string | null) => void

	thumbnailFile: File | null
	setOpenUploadingVideo: (value: boolean) => void
	setThumbnailFile: (file: File | null) => void
}

export const useVideoStore = create<VideoStore>((set) => ({
	thumbnailPreview: null,
	setThumbnailPreview: (url) => set({ thumbnailPreview: url }),

	openUploadingVideo: false,
	setOpenUploadingVideo: (value) => set({ openUploadingVideo: value }),

	thumbnailFile: null,
	setThumbnailFile: (file) => set({ thumbnailFile: file }),
}))
