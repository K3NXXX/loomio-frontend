import axios from 'axios'

import axiosInstance from '@/lib/axios'

import type {
	IEmailVerification,
	IEmailVerificationResponse,
	IForgotPasswordRequest,
	IForgotPasswordResponse,
	ILogInRequest,
	IResendCodeRequest,
	IResendCodeResponse,
	IResetPasswordRequest,
	IResetPasswordResponse,
	ISignupRequest,
	ISignUpResponse,
	IUser,
} from '@/types/auth.types'

class AuthService {
	private BASE_URL = `${process.env.NEXT_PUBLIC_API_URL!}/auth`

	async signup(signUpData: ISignupRequest): Promise<ISignUpResponse> {
		const { data } = await axios.post<ISignUpResponse>(
			`${this.BASE_URL}/register`,
			signUpData,
		)
		return data
	}
	async login(logInData: ILogInRequest): Promise<IEmailVerificationResponse> {
		const { data } = await axios.post<IEmailVerificationResponse>(
			`${this.BASE_URL}/login`,
			logInData,
		)
		return data
	}

	async emailVerification(
		code: IEmailVerification,
	): Promise<IEmailVerificationResponse> {
		const { data } = await axios.post<IEmailVerificationResponse>(
			`${this.BASE_URL}/register/verify`,
			code,
		)
		return data
	}

	async resendCode(email: IResendCodeRequest): Promise<IResendCodeResponse> {
		const { data } = await axios.post<IResendCodeResponse>(
			`${this.BASE_URL}/register/resend`,
			email,
		)
		return data
	}

	async forgotPassword(
		email: IForgotPasswordRequest,
	): Promise<IForgotPasswordResponse> {
		const { data } = await axios.post<IForgotPasswordResponse>(
			`${this.BASE_URL}/password-reset/request`,
			email,
		)
		return data
	}

	async resetPassword(
		resetPasswordData: IResetPasswordRequest,
	): Promise<IResetPasswordResponse> {
		const { data } = await axios.post<IResetPasswordResponse>(
			`${this.BASE_URL}/password-reset/confirm`,
			resetPasswordData,
		)
		return data
	}

	async oauth(provider: string): Promise<void> {
		await axiosInstance.get(`${this.BASE_URL}${provider}/callback`)
	}

	async refreshToken(): Promise<IUser> {
		const { data } = await axiosInstance.post<IUser>(`${this.BASE_URL}/refresh`)
		return data
	}
}

export const authService = new AuthService()
