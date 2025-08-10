import { z } from 'zod'

export const resetPasswordSchema = z
	.object({
		password: z
			.string()
			.nonempty({ message: 'Password is required' })
			.min(10, { message: 'Password requires min 10 characters' })
			.regex(
				/^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).+$/,
				{
					message:
						'Password must contain at least one latin letter, one digit, and one special character',
				},
			),
		confirmPassword: z
			.string()
			.nonempty({ message: 'Please confirm your password' }),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: 'Passwords do not match',
		path: ['confirmPassword'],
	})

export type TResetPasswordSchema = z.infer<typeof resetPasswordSchema>
