import {
	IEmailVerification,
	IEmailVerificationResponse,
	IForgotPasswordApiData,
	ILogInApiData,
	IResendCode,
	IResetPasswordApiData,
	ISignupApiData,
} from '@/types/auth.types'
import axios from 'axios'

class AuthService {
	private BASE_URL = `${process.env.NEXT_PUBLIC_API_URL!}/auth`

	async signup(signUpData: ISignupApiData) {
		const { data } = await axios.post(`${this.BASE_URL}/register`, signUpData)
		return data
	}
	async login(logInData: ILogInApiData) {
		const { data } = await axios.post(`${this.BASE_URL}/login`, logInData)
		return data
	}

	async emailVerification(
		code: IEmailVerification
	): Promise<IEmailVerificationResponse> {
		const { data } = await axios.post(`${this.BASE_URL}/register/verify`, code)
		return data
	}

	async resendCode(email: IResendCode) {
		const { data } = await axios.post(`${this.BASE_URL}/register/resend`, email)
		return data
	}

	async forgotPassword(email: IForgotPasswordApiData) {
		const { data } = await axios.post(
			`${this.BASE_URL}/password-reset/request`,
			email
		)
		return data
	}

	async resetPassword(resetPasswordData: IResetPasswordApiData) {
		const { data } = await axios.post(
			`${this.BASE_URL}/password-reset/confirm`,
			resetPasswordData
		)
		return data
	}

	async oauth(provider: string) {
		const { data } = await axios.get(`${this.BASE_URL}${provider}/callback`, {
			withCredentials: true,
		})
		return data
	}
}

export const authService = new AuthService()
