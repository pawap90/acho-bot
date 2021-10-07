module.exports = {
	'root': true,
	'parser': '@typescript-eslint/parser',
	'plugins': [
		'@typescript-eslint',
	],
	'extends': [
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended'
	],
	'rules': {
		'semi': ['error', 'always'],
		'no-console': ['error', { allow: ['warn', 'error', 'info'] }],
		'quotes': ['error', 'single'],
		'curly': 0,
		'brace-style': ['error', 'stroustrup'],
		'indent': ['error', 4],
		'eol-last': ['error', 'never'],
		'@typescript-eslint/no-unused-vars': 2,
		'@typescript-eslint/no-non-null-assertion': 'off',
		'@typescript-eslint/no-explicit-any': 'off'
	}
}