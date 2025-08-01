export enum PROJECT_MEMBER_ROLES {
	MEMBER = 'MEMBER',
	VIEWER = 'VIEWER',
	ADMIN = 'ADMIN',
}

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
	name: string
	username: string
	avatarUrl: null | string
}

export interface IAddedProjectMembersList
	extends ISearchProjectMembersResponse {
	role: PROJECT_MEMBER_ROLES
}

export interface ICreateProjectRequest {
	name: string
	description: string
	members: {
		userId: string
		role: PROJECT_MEMBER_ROLES
	}[]
}

export interface ICreateProjectRequestResponse {
	id: string
	name: string
	description: string
	color: string | null
	ownerId: string
	isArchived: boolean
	isPrivate: boolean
	createdAt: Date
	updatedAt: Date
}
