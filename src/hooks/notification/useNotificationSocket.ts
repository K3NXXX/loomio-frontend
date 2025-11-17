'use client'

import type { Notification } from '@/types/notification.types'
import { useNotificationStore } from '@/zustand/store/notificationStore'
import { useEffect } from 'react'
import { io, type Socket } from 'socket.io-client'

export function useNotificationSocket(userId: string | undefined) {
	const addNotification = useNotificationStore((s) => s.addNotification)

	useEffect(() => {
		if (!userId) return

		const socket: Socket = io(process.env.NEXT_PUBLIC_WS_URL!, {
			query: { userId },
			transports: ['websocket'],
		})

		socket.on('notification', (payload: Notification) => {
			addNotification(payload)
		})

		socket.on('disconnect', () => {})

		return () => {
			socket.disconnect()
		}
	}, [userId])
}
