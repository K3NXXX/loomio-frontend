import { z } from 'zod'

export const loginSchema = z.object({
	identifier: z
		.string()
		.nonempty({ message: 'Please enter your email or username' })
		.max(100, { message: 'Must be less than 100 characters' })
		.regex(
			/^([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}|(?!-)(?!.*--)[a-zA-Z0-9-]{1,39}(?<!-))$/,
			{ message: 'Enter a valid email address or username' },
		),
	password: z
		.string()
		.nonempty({ message: 'Password is required' })
		.min(10, { message: 'Password requires min 10 characters' }),
})

export type TLoginSchema = z.infer<typeof loginSchema>
