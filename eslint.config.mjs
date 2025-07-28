import { FlatCompat } from '@eslint/eslintrc'
import { dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({
	baseDirectory: __dirname,
})

const eslintConfig = [
	...compat.extends('next/core-web-vitals', 'next/typescript'),
	{
		rules: {
			semi: ['error', 'never'],
			quotes: ['error', 'single'],
			'no-unused-vars': 'warn',
			eqeqeq: ['error', 'always'],
		},
	},
]

export default eslintConfig