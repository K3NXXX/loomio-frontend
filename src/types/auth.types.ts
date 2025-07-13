export interface ISignupData {
	firstName: string
	lastName: string
	email: string
	password: string
	passwordConfirm: string
	termsAccepted: boolean
}

export interface ILogInData {
	email: string
	password: string
}
