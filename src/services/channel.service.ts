import axiosInstance from '@/lib/axios'
import type { IChannel } from '@/types/channel.types'

class ChannelService {
	private BASE_URL = `${process.env.NEXT_PUBLIC_API_URL!}/channel`

	async createChannel(fd: FormData): Promise<{ success: boolean }> {
		const { data } = await axiosInstance.post<{ success: boolean }>(
			this.BASE_URL,
			fd,
		)
		return data
	}

	async getUserChannels(): Promise<IChannel[]> {
		const { data } = await axiosInstance.get<IChannel[]>(`${this.BASE_URL}/me`)
		return data
	}

	async getChannel(channelId: string): Promise<IChannel> {
		const { data } = await axiosInstance.get<IChannel>(
			`${this.BASE_URL}/${channelId}`,
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
}

export const channelService = new ChannelService()
