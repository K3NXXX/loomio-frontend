import type { TEditPlaylistSchema } from '@/schemas/playlists/edit-playlist.schema'
import { useEffect } from 'react'
import type { FieldErrors } from 'react-hook-form'

import { toast } from 'sonner'

export const useEditPlaylistErrors = (
	errors: FieldErrors<TEditPlaylistSchema>,
) => {
	useEffect(() => {
		const fields = ['name', 'description'] as const

		fields.forEach((field) => {
			const message = errors[field]?.message
			if (message) {
				toast.error(message)
			}
		})
	}, [errors])
}
