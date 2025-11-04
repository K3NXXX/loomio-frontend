import type { IVideo } from '@/types/video.types'
import { create } from 'zustand'

interface VideoStore {
	uploadChannelId: string | null
	thumbnailPreview: string | null
	openUploadingVideo: boolean
	setThumbnailPreview: (url: string | null) => void
	isEditingFormOpened: boolean
	editingVideo: IVideo | null

	thumbnailFile: File | null
	setOpenUploadingVideo: (value: boolean) => void
	setThumbnailFile: (file: File | null) => void
	setUploadChannelId: (id: string | null) => void
	setIsEditingFormOpened: (value: boolean) => void
	setEditingVideo: (video: IVideo | null) => void
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

	isEditingFormOpened: false,
	setIsEditingFormOpened: (value) => set({ isEditingFormOpened: value }),

	editingVideo: null,
	setEditingVideo: (video) => set({ editingVideo: video }),
}))
