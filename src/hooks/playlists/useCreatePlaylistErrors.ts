'use client'

import type { TCreatePlaylistSchema } from '@/schemas/playlists/create-playlist.schema'
import { getValidationMessage } from '@/utils/validationMessage'
import { useTranslations } from 'next-intl'
import { useEffect } from 'react'
import type { FieldErrors } from 'react-hook-form'

import { toast } from 'sonner'

export const useCreatePlaylistErrors = (
	errors: FieldErrors<TCreatePlaylistSchema>,
) => {
	const t = useTranslations()

	useEffect(() => {
		const fields = ['name', 'description'] as const

		fields.forEach((field) => {
			const message = errors[field]?.message
			if (message) {
				toast.error(getValidationMessage(String(message), t))
			}
		})
	}, [errors, t])
}
