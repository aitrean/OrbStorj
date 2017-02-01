module.exports = {
	"parserOptions": {
		"ecmaVersion": 8,
	},
	"env": {
		"es6": true,
		"node": true
	},
	"plugins": [
		"no-async-without-await"
	],
	"extends": "eslint:recommended",
	"rules": {
		"linebreak-style": [
			"error",
			"unix"
		],
		"no-console": 0,
		"quotes": [
			"error",
			"single"
		],
		"semi": [
			"error",
			"always"
		],
		"no-async-without-await/no-async-without-await": 1
	}
};
