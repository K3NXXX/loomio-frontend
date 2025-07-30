export enum PROJECT_MEMBER_ROLES {
	MEMBER = 'Member',
	VIEWER = 'Viewer',
	ADMIN = 'Admin',
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
