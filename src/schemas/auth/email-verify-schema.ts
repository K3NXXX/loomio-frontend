import { z } from 'zod'

export const emailVerificationSchema = z.object({
	code: z
		.string()
		.trim()
		.min(6, { message: 'Invalid code' })
		.max(6, { message: 'Invalid code' })
		.regex(/^[A-Z0-9]+$/i, {
			message: 'Code must contain only letters and digits',
		}),
})

export type TEmailVerificationSchema = z.infer<typeof emailVerificationSchema>
