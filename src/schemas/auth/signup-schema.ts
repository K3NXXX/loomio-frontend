import { z } from 'zod'

export const signupSchema = z
	.object({
		name: z
			.string()
			.nonempty({ message: 'Name is required' })
			.min(2, { message: 'Name must be at least 2 letters' })
			.max(100, { message: 'Name must be less than 100 characters' })
			.regex(/^[A-Za-z]+$/, {
				message:
					'Name must contain only latin letters with no spaces or symbols',
			}),
		username: z
			.string()
			.nonempty({ message: 'Username is required' })
			.min(3, { message: 'Username must be at least 3 character' })
			.max(39, { message: 'Username must be at most 39 characters' })
			.regex(/^(?!-)(?!.*--)[a-zA-Z0-9-]{1,39}(?<!-)$/, {
				message:
					'Username should contain only letters, numbers, single hyphens.',
			}),
		email: z
			.string()
			.nonempty({ message: 'Email is required' })
			.email({ message: 'Incorrect email' })
			.max(100, { message: 'Email requires max 100 characters' }),
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
		passwordConfirm: z
			.string()
			.nonempty({ message: 'Please confirm your password' }),
		termsAccepted: z.boolean().refine((val) => val === true, {
			message: 'You must agree to the terms and conditions',
		}),
	})
	.refine((data) => data.password === data.passwordConfirm, {
		message: 'Passwords do not match',
		path: ['passwordConfirm'],
	})

export type TSignupSchema = z.infer<typeof signupSchema>
