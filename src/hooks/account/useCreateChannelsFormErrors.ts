'use client'

import type { CreateChannelSchema } from '@/schemas/account/create-channel.schema'
import { useEffect } from 'react'
import { toast } from 'sonner'

type ErrorsType = Partial<
	Record<keyof CreateChannelSchema, { message?: string }>
>

export const useCreateChannelFormErrors = (errors: ErrorsType) => {
	useEffect(() => {
		const fields: (keyof CreateChannelSchema)[] = ['name', 'username']

		fields.forEach((field) => {
			const message = errors[field]?.message
			if (message) toast.error(message)
		})
	}, [errors])
}
