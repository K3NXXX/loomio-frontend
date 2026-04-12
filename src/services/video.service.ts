import axiosInstance from '@/lib/axios'
import type { IVideo } from '@/types/video.types'

class VideoService {
	private BASE_URL = `${process.env.NEXT_PUBLIC_API_URL!}/videos`

	async addVideo(videoData: FormData) {
		const { data } = await axiosInstance.post(this.BASE_URL, videoData)
		return data
	}

	async getAllVideos(): Promise<IVideo[]> {
		const { data } = await axiosInstance.get<IVideo[]>(
			`${this.BASE_URL}/public`,
		)
		return data
	}


	async getRecommendedVideos(videoId: string): Promise<IVideo[]> {
		const { data } = await axiosInstance.get<IVideo[]>(
			`${this.BASE_URL}/public/${videoId}/recommended`,
		)
		return data
	}

	async getOneVideo(videoId: string): Promise<IVideo> {
		const { data } = await axiosInstance.get<IVideo>(
			`${this.BASE_URL}/public/${videoId}`,
		)
		return data
	}

	async deleteVideo(videoId: string): Promise<IVideo> {
		const { data } = await axiosInstance.delete<IVideo>(
			`${this.BASE_URL}/${videoId}`,
		)
		return data
	}

	async deleteTempVideo(videoId: string): Promise<{ success: boolean }> {
		const { data } = await axiosInstance.delete(
			`${this.BASE_URL}/temp/${videoId}`,
		)
		return data
	}

	async editVideo(videoId: string, videoData: FormData) {
		const { data } = await axiosInstance.patch(
			`${this.BASE_URL}/${videoId}`,
			videoData,
		)
		return data
	}

	async addVideoToUserPlaylist(videoId: string, playlistId: string) {
		const { data } = await axiosInstance.patch(
			`${this.BASE_URL}/${videoId}/playlist/${playlistId}`,
		)
		return data
	}

	async removeVideoFromUserPlaylist(videoId: string, playlistId: string) {
		const { data } = await axiosInstance.delete(
			`${this.BASE_URL}/${videoId}/playlist/${playlistId}`,
		)
		return data
	}

	async getChannelStudioVideos(channelId: string): Promise<IVideo[]> {
		const { data } = await axiosInstance.get<IVideo[]>(
			`${this.BASE_URL}/studio/${channelId}`,
		)
		return data
	}

	async getUploadUrl(): Promise<{ uploadURL: string; videoId: string }> {
		const { data } = await axiosInstance.post(`${this.BASE_URL}/upload-url`)
		return data
	}

	async getVideoStatus(videoId: string) {
		const { data } = await axiosInstance.get(
			`${this.BASE_URL}/status/${videoId}`,
		)
		return data
	}
}

export const videoService = new VideoService()
