
function e (exp) {
	this.exp = exp
	this.parse()
}

e.prototype = {
	parse: () => {
		console.log('in parse')
	},

	tokenize: () => {
		console.log('in tokenize')
	},

	postfix: () => {
		console.log('postfix')
	}
}