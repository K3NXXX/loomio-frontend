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

	async toggleChannelNotifications(channelId: string) {
		const { data } = await axiosInstance.patch(
			`${this.BASE_URL}/${channelId}/notifications`,
		)
		return data
	}

	async getChannelNotificationsStatus(channelId: string): Promise<boolean> {
		const { data } = await axiosInstance.get<{
			notificationsEnabled: boolean
		}>(`${this.BASE_URL}/${channelId}/notifications`)

		return data.notificationsEnabled
	}
}

export const followService = new FollowService()
