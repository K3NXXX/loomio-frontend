import { createProjectSchema } from '@/schemas/create-project.schema'

describe('createProjectSchema validation', () => {
	it('valid data passes', () => {
		const data = {
			name: 'Valid Project Name',
			description: 'Valid description!',
			members: [
				{ userId: '1', role: 'MEMBER' },
				{ userId: '2', role: 'ADMIN' },
			],
		}
		expect(() => createProjectSchema.parse(data)).not.toThrow()
	})

	it('name too short fails', () => {
		const data = { name: 'ab' }
		expect(() => createProjectSchema.parse(data)).toThrow()
	})

	it('name with double spaces fails', () => {
		const data = { name: 'Invalid  Name' }
		expect(() => createProjectSchema.parse(data)).toThrow(/double spaces/)
	})

	it('description too long fails', () => {
		const data = { name: 'Valid Name', description: 'a'.repeat(501) }
		expect(() => createProjectSchema.parse(data)).toThrow()
	})

	it('members role invalid fails', () => {
		const data = {
			name: 'Valid Name',
			members: [{ userId: '1', role: 'INVALID_ROLE' }],
		}
		expect(() => createProjectSchema.parse(data)).toThrow()
	})
})
