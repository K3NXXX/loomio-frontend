'use client'

import { useCallback } from 'react'

import { useAuthPromptStore } from '@/zustand/store/authPromptStore'

import { useGetMe } from './useGetMe'

export function useAuthGate() {
	const { userData } = useGetMe()
	const openAuthPrompt = useAuthPromptStore((s) => s.openAuthPrompt)

	const requireAuth = useCallback(() => {
		if (userData) return true
		openAuthPrompt()
		return false
	}, [userData, openAuthPrompt])

	return { requireAuth }
}
