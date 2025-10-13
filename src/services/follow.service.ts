import axiosInstance from '@/lib/axios'

class FollowService {
	private BASE_URL = `${process.env.NEXT_PUBLIC_API_URL!}/follow`

	async followUser(followingId: string): Promise<{ following: boolean }> {
		const { data } = await axiosInstance.post<{ following: boolean }>(
			`${this.BASE_URL}/${followingId}`,
		)
		return data
	}

	async isFollowing(followingId: string): Promise<boolean> {
		const { data } = await axiosInstance.get<{ isFollowing: boolean }>(
			`${this.BASE_URL}/is-following/${followingId}`,
		)
		return data.isFollowing
	}
}

export const followService = new FollowService()
