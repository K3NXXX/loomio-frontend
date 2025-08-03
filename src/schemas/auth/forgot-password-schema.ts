import { z } from 'zod'

export const forgotPasswordSchema = z.object({
	email: z
		.email({ message: 'Incorrect email' })
		.max(100, { message: 'Email requires max 100 characters' })
		.refine((val) => val.trim().length > 0, { message: 'Email is required' }),
})

export type TForgotPasswordSchema = z.infer<typeof forgotPasswordSchema>
