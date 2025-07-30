export interface ICreateProjectFormData {
	name: string
	description: string
	members: string[]
}

export interface ISearchProjectMembersRequest {
	name: string
	take: number
	cursor?: string
}

export interface ISearchProjectMembersResponse {
	id: string
	fullName: string
	username: string
	avatarUrl: null | string
}
