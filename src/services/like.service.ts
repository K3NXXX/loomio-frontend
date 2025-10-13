import axiosInstance from '@/lib/axios'

class LikeService {
	private BASE_URL = `${process.env.NEXT_PUBLIC_API_URL!}/likes`

	async toggleVideoLike(videoId: string): Promise<{ success: boolean }> {
		const { data } = await axiosInstance.post<{ success: boolean }>(
			`${this.BASE_URL}/video/${videoId}/like`,
		)
		return data
	}

	async toggleVideoDislike(videoId: string): Promise<{ success: boolean }> {
		const { data } = await axiosInstance.post<{ success: boolean }>(
			`${this.BASE_URL}/video/${videoId}/dislike`,
		)
		return data
	}

	async hasVideoLiked(videoId: string): Promise<boolean> {
		const { data } = await axiosInstance.get<{ liked: boolean }>(
			`${this.BASE_URL}/video/${videoId}/has-liked`,
		)
		return data.liked
	}

	async hasVideoDisliked(videoId: string): Promise<boolean> {
		const { data } = await axiosInstance.get<{ disliked: boolean }>(
			`${this.BASE_URL}/video/${videoId}/has-disliked`,
		)
		return data.disliked
	}
}

export const likeService = new LikeService()
