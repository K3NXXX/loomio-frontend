import { SignUpForm } from '@/components/intro/auth/SignUpForm'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

// jest.mock('@/hooks/auth/useSignUp', () => ({
// 	useSignUp: () => ({
// 		signUp: jest.fn(),
// 		isSuccessSignUp: false,
// 		setIsSuccessSignUp: jest.fn(),
// 		isLoading: false,
// 		expiresAt: null,
// 		setExpiresAt: jest.fn(),
// 	}),
// }))

describe('SignUpForm', () => {
	test('shows validation errors on empty submit', async () => {
		render(<SignUpForm />)

		userEvent.click(screen.getByRole('button', { name: /sign up/i }))

		await waitFor(() => {
			expect(screen.getByText(/full name is required/i)).toBeInTheDocument()
			expect(screen.getByText(/username is required/i)).toBeInTheDocument()
			expect(screen.getByText(/incorrect email/i)).toBeInTheDocument() // or required error
			expect(
				screen.getByText(/password requires min 10 characters/i),
			).toBeInTheDocument()
			expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument()
			expect(
				screen.getByText(/you must agree to the terms and conditions/i),
			).toBeInTheDocument()
		})
	})

	test('validates password confirmation correctly', async () => {
		render(<SignUpForm />)

		userEvent.type(
			screen.getByPlaceholderText(/your password/i),
			'Password123!',
		)
		userEvent.type(
			screen.getByPlaceholderText(/confirm your password/i),
			'WrongPassword',
		)

		userEvent.click(screen.getByRole('button', { name: /sign up/i }))

		await waitFor(() => {
			expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument()
		})
	})

	// test('calls signUp with correct data on valid submit', async () => {
	// 	const mockSignUp = jest.fn()
	// 	jest.mocked(require('@/hooks/auth/useSignUp').useSignUp).mockReturnValue({
	// 		signUp: mockSignUp,
	// 		isSuccessSignUp: false,
	// 		setIsSuccessSignUp: jest.fn(),
	// 		isLoading: false,
	// 		expiresAt: null,
	// 		setExpiresAt: jest.fn(),
	// 	})

	// 	render(<SignUpForm />)

	// 	userEvent.type(screen.getByPlaceholderText(/full name/i), 'John Smith')
	// 	userEvent.type(screen.getByPlaceholderText(/username/i), 'johnsmith')
	// 	userEvent.type(
	// 		screen.getByPlaceholderText(/your email address/i),
	// 		'john@example.com',
	// 	)
	// 	userEvent.type(
	// 		screen.getByPlaceholderText(/your password/i),
	// 		'Password123!',
	// 	)
	// 	userEvent.type(
	// 		screen.getByPlaceholderText(/confirm your password/i),
	// 		'Password123!',
	// 	)
	// 	userEvent.click(screen.getByRole('checkbox')) // agree to terms

	// 	userEvent.click(screen.getByRole('button', { name: /sign up/i }))

	// 	await waitFor(() => {
	// 		expect(mockSignUp).toHaveBeenCalledWith({
	// 			email: 'john@example.com',
	// 			password: 'Password123!',
	// 			confirmPassword: 'Password123!',
	// 			fullName: 'John Smith',
	// 			username: 'johnsmith',
	// 		})
	// 	})
	// })

	// test('toggles password visibility when clicking eye icon', () => {
	// 	render(<SignUpForm />)

	// 	const passwordInput = screen.getByPlaceholderText(/your password/i)
	// 	const toggleButton = screen.getAllByRole('button').find(
	// 		(btn) => btn.querySelector('svg'), // Assuming eye icons are SVGs inside buttons
	// 	)

	// 	// initial type password
	// 	expect(passwordInput).toHaveAttribute('type', 'password')

	// 	if (toggleButton) {
	// 		userEvent.click(toggleButton)
	// 		expect(passwordInput).toHaveAttribute('type', 'text')

	// 		userEvent.click(toggleButton)
	// 		expect(passwordInput).toHaveAttribute('type', 'password')
	// 	}
	// })
})
