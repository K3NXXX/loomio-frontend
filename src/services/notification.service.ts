import axiosInstance from '@/lib/axios'
import type { INotification } from '@/types/notification.types'

class NotificationService {
	private BASE_URL = `${process.env.NEXT_PUBLIC_API_URL!}/notifications`

	async getNotifications(): Promise<INotification> {
		const { data } = await axiosInstance.get<INotification>(this.BASE_URL)
		return data
	}

	async deleteAllForChannel(channelId: string): Promise<{ success: boolean }> {
		const { data } = await axiosInstance.delete(
			`${this.BASE_URL}/channel/${channelId}`,
		)
		return data
	}

	async deletePersonal(): Promise<{ success: boolean }> {
		const { data } = await axiosInstance.delete(`${this.BASE_URL}/personal`)
		return data
	}

	async markAllChannelRead(channelId: string): Promise<{ success: boolean }> {
		const { data } = await axiosInstance.post(
			`${this.BASE_URL}/read/channel/${channelId}`,
		)
		return data
	}

	async markAllPersonalRead(): Promise<{ success: boolean }> {
		const { data } = await axiosInstance.post(`${this.BASE_URL}/read/personal`)
		return data
	}
}

export const notificationService = new NotificationService()
