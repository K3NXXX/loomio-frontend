export interface ISignupFormData {
	firstName: string
	lastName: string
	email: string
	password: string
	passwordConfirm: string
	termsAccepted: boolean
}

export interface ILogInFormData {
	email: string
	password: string
}

export interface ISignupApiData {
	firstName: string
	lastName: string
	email: string
	password: string
}

export interface ILogInApiData {
	email: string
	password: string
}

export interface IEmailVerification {
	code: string
}

export interface IResendCode{
	email: string
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

export interface IEmailVerificationResponse {
	message: string
	user: IUser
	accessToken: string
}
