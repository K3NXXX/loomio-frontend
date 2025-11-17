import type { Notification } from '@/types/notification.types'
import { create } from 'zustand'

export interface NotificationState {
	notifications: Notification[]
	isLoading: boolean
	setNotifications: (data: Notification[]) => void
	addNotification: (notification: Notification) => void
}

export const useNotificationStore = create<NotificationState>((set) => ({
	notifications: [],
	isLoading: false,

	setNotifications(data) {
		set({ notifications: data })
	},

	addNotification(notification) {
		set((state) => ({
			notifications: [notification, ...state.notifications],
		}))
	},
}))
