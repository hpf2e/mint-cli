module.exports = {
	'env': {
		'es6': true,
		'node': true
	},
	'extends': [
		'eslint:recommended',
		'plugin:@typescript-eslint/eslint-recommended',
		'plugin:prettier/recommended'
	],
	'globals': {
		'Atomics': 'readonly',
		'SharedArrayBuffer': 'readonly'
	},
	'parser': '@typescript-eslint/parser',
	'parserOptions': {
		'ecmaVersion': 2018,
		'sourceType': 'module'
	},
	'plugins': [
		'@typescript-eslint',
    'prettier'
	],
	'rules': {
		"prettier/prettier": "error",
    '@typescript-eslint/no-empty-interface': ['off'],
    '@typescript-eslint/camelcase': ['off'],
    '@typescript-eslint/array-type': ['off'],
    '@typescript-eslint/no-use-before-define': ['off'],
    '@typescript-eslint/no-angle-bracket-type-assertion': ['off'],
    '@typescript-eslint/interface-name-prefix': ['off'],
    '@typescript-eslint/explicit-member-accessibility': ['warn'],
    '@typescript-eslint/consistent-type-assertions': ['warn'],
    '@typescript-eslint/no-inferrable-types': ['warn'],
    'no-console': ['error', { 'allow': ['warn', 'error', 'info'] }],
		'no-unused-vars': 0,
		'no-useless-escape': 0,
		'prefer-const': 0,
		'no-console': 0,
		'semi': ['error', 'always'],
	}
};
