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

	async getOneVideo(videoId: string): Promise<IVideo> {
		const { data } = await axiosInstance.get<IVideo>(
			`${this.BASE_URL}/public/${videoId}`,
		)
		return data
	}
}

export const videoService = new VideoService()
