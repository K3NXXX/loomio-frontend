export enum PROJECT_MEMBER_ROLES {
	MEMBER = 'MEMBER',
	VIEWER = 'VIEWER',
	ADMIN = 'ADMIN',
}

export const CREATE_PROJECT_FORM_STEPS = {
	FIRST: 1,
	SECOND: 2,
	THIRD: 3,
}

export type TCreateProjectSteps =
	(typeof CREATE_PROJECT_FORM_STEPS)[keyof typeof CREATE_PROJECT_FORM_STEPS]

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
	description: string | undefined
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

export interface IGetAllProjects {
	id: string
	name: string
	description: string
	color: string | null
	isPrivate: boolean
	isArchived: boolean
	ownerId: string
	createdAt: string
	updatedAt: string
}
