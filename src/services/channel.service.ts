import axiosInstance from '@/lib/axios'
import type { IChannel } from '@/types/channel.types'

class ChannelService {
	private BASE_URL = `${process.env.NEXT_PUBLIC_API_URL!}/channel`

	async createChannel(fd: FormData): Promise<IChannel> {
		const { data } = await axiosInstance.post<IChannel>(
			this.BASE_URL,
			fd,
		)
		return data
	}

	async getUserChannels(): Promise<IChannel[]> {
		const { data } = await axiosInstance.get<IChannel[]>(`${this.BASE_URL}/me`)
		return data
	}

	async getChannel(
		username: string,
		opts?: { scope?: 'studio' },
	): Promise<IChannel> {
		const params =
			opts?.scope === 'studio' ? { scope: 'studio' as const } : undefined
		const { data } = await axiosInstance.get<IChannel>(
			`${this.BASE_URL}/${username}`,
			{ params },
		)
		return data
	}

	async editChannel(channelId: string, fd: FormData) {
		const { data } = await axiosInstance.patch(
			`${this.BASE_URL}/${channelId}`,
			fd,
		)
		return data
	}

	async getChannelViews(username: string): Promise<{ totalViews: number }> {
		const { data } = await axiosInstance.get<{ totalViews: number }>(
			`${this.BASE_URL}/${username}/views`,
		)
		return data
	}

	async deleteChannel(channelId: string): Promise<{ success: boolean }> {
		const { data } = await axiosInstance.delete<{ success: boolean }>(
			`${this.BASE_URL}/${channelId}`,
		)
		return data
	}
}

export const channelService = new ChannelService()
