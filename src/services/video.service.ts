import axiosInstance from '@/lib/axios'

class VideoService {
	private BASE_URL = `${process.env.NEXT_PUBLIC_API_URL!}/videos`

	async addVideo(videoData: FormData) {
		const { data } = await axiosInstance.post(this.BASE_URL, videoData)
		return data
	}
}

export const videoService = new VideoService()
