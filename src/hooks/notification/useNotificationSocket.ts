'use client'

import type { Notification } from '@/types/notification.types'
import { useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { io, type Socket } from 'socket.io-client'

export function useNotificationSocket(userId: string | undefined) {
	const queryClient = useQueryClient()

	useEffect(() => {
		if (!userId) return

		const socket: Socket = io(process.env.NEXT_PUBLIC_WS_URL!, {
			query: { userId },
			transports: ['websocket'],
		})

		socket.on('notification', (_payload: Notification) => {
			queryClient.invalidateQueries({ queryKey: ['getNotifications'] })
		})

		socket.on('disconnect', () => {})

		return () => {
			socket.disconnect()
		}
	}, [userId, queryClient])
}
