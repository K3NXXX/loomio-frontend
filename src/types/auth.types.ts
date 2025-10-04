export enum FORGOT_PASSWORD_STEPS {
	FIRST = 1,
	SECOND = 2,
}

export interface ISignupRequest {
	fullName: string
	username: string
	email: string
	password: string
	confirmPassword: string
}

export interface ISignUpResponse {
	message: string
	expiresAt: Date | undefined
}

export interface ILogInRequest {
	identifier: string
	password: string
}

export interface ILogInResponse {
	id: string
	fullName: string
	username: string
	email: string
	password: string | null
	avatarUrl: string | null
	avatarPublicId: string | null
}

export interface IResetPasswordFormData {
	password: string
	confirmPassword: string
}

export interface IResetPasswordRequest {
	password: string
	confirmPassword: string
	token: string
}

export interface IResetPasswordResponse {
	message: string
}

export interface IForgotPasswordFormData {
	email: string
}

export type IForgotPasswordRequest = IResendCodeRequest

export interface IForgotPasswordResponse {
	expiresAt: Date | undefined
}

export interface IEmailVerification {
	code: string
}

export interface IEmailVerificationResponse {
	message: string
	user: IUser
	accessToken: string
}

export interface IResendCodeRequest {
	email: string
}

export interface IResendCodeResponse {
	message: string
	expiresAt: Date | undefined
}

export interface IUser {
	id: string
	firstName: string
	lastName: string
	email: string
	avatarUrl: string | null
	avatarPublicId: string | null
	role: 'USER' | 'ADMIN'
	createdAt: string
	updatedAt: string
}

export interface IGetUserData {
	avatarUrl: string
	email: string
	fullName: string
	id: string
	isActive: boolean
	username: string
}

interface AxiosErrorResponse {
	status?: number
	data?: {
		message?: string
		expiresAt?: string | number
	}
}

interface ResponseData {
	message?: string
	expiresAt?: string | number
}

interface AxiosErrorResponse {
	status?: number
	data?: ResponseData
}

export interface AxiosError {
	response?: AxiosErrorResponse
}

export interface IRefreshTokenResponse {
	accessToken: string
}

export interface ILogoutResponse {
	message: string
}
