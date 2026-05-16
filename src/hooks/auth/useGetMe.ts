'use client'

import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { useEffect, useState } from 'react'

import { userService } from '@/services/user.service'
import type { IGetUserData } from '@/types/auth.types'

export const useGetMe = () => {
	const [mounted, setMounted] = useState(false)

	useEffect(() => {
		setMounted(true)
	}, [])

	const query = useQuery<IGetUserData | null>({
		queryKey: ['getMe'],
		queryFn: async () => {
			try {
				return await userService.getMe()
			} catch (e) {
				if (axios.isAxiosError(e) && e.response?.status === 401) {
					return null
				}
				throw e
			}
		},
		enabled: mounted,
		retry: false,
		staleTime: 60_000,
	})

	const userData = query.data ?? undefined

	/** Лише перше завантаження профілю; фонові `invalidate`/`refetch` це не вмикають. */
	const isLoading = !mounted || query.isLoading
	/** Профіль хоч раз успішно підвантажили (або гість/null); фонові refetch лишають isFetched=true. */
	const authReady = mounted && query.isFetched

	return {
		userData,
		isLoading,
		authReady,
		isGuest: Boolean(mounted && query.isSuccess && query.data === null),
		isAuthenticated: Boolean(userData),
	}
}
