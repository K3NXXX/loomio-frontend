import { create } from 'zustand'

interface VideoStore {
	uploadChannelId: string | null
	thumbnailPreview: string | null
	openUploadingVideo: boolean
	setThumbnailPreview: (url: string | null) => void

	thumbnailFile: File | null
	setOpenUploadingVideo: (value: boolean) => void
	setThumbnailFile: (file: File | null) => void
	setUploadChannelId: (id: string | null) => void
}

export const useVideoStore = create<VideoStore>((set) => ({
	uploadChannelId: null,
	thumbnailPreview: null,
	setThumbnailPreview: (url) => set({ thumbnailPreview: url }),

	setUploadChannelId: (id: string | null) => set({ uploadChannelId: id }),

	openUploadingVideo: false,
	setOpenUploadingVideo: (value) => set({ openUploadingVideo: value }),

	thumbnailFile: null,
	setThumbnailFile: (file) => set({ thumbnailFile: file }),
}))
