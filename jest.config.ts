import nextJest from 'next/jest.js'

import type { Config } from 'jest'

const createJestConfig = nextJest({
	dir: './',
})

const config: Config = {
	coverageProvider: 'v8',
	testEnvironment: 'jsdom',
	clearMocks: true,
	collectCoverage: true,
	setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
}

export default createJestConfig(config)
