import { checkBraces, format, type } from './util'
import { extend } from 'underscore'
import evaluate from './evaluate'



// Operators allowed
const operators = [ '=', '>', '<', '&&', '||', 'and', 'or', 'in' ],
	braces = [ '(', ')' ],
	prec = {
		'<': 1,
		'>': 1,
		'=': 1,
		and: 0,
		or: 0,
		in: 1
	}

/**
	E(exp)
		Creates json object and stores in this.processed
	@param {String} Expression string
**/
function E (exp) {
	if (!(this instanceof E)) return new E(exp)
	this.exp = exp
	this.processed = []
	this.parse()
}

extend(E.prototype, {
	/**
	  parse()
	  	Initialize function to create
	  	json object of given expression
	**/
	parse () {
		let tokens = this.tokenize(this.exp)
		tokens = this.postfix(tokens)
		this.processed = this.process(tokens)
	},

	/**
	  tokenize( str )
	  	Tokenize given string to to an array of tokens
	  @param {String} Expression string
	  @return {Array} Array of tokens
	**/
	tokenize (str) {
		let curr = '',
			tokens = []

		for (const ch of str) {
			if (curr && (ch === ' ' || ch === ',')) {
				tokens.push(curr)
				curr = ''
			} else if (curr && operators.includes(ch)) {
				tokens.push(curr, ch)
				curr = ''
			} else if (braces.indexOf(ch) !== -1) {
				curr && tokens.push(curr)
				curr = ''
				tokens.push(ch)
			} else if (ch !== ' ' && ch !== ',') {
				curr += ch
			}
		}

		if (curr) tokens.push(curr)

		tokens = this.inOperator(tokens)
		if (!checkBraces(tokens)) {
			console.error('Wrong number of braces')
			tokens = []
		}
		if (!this.correct(tokens)) {
			tokens = []
		}
		return tokens
	},

	/**
	  inOperator( arr )
	  	Special function for handling 'in' operator. Removes the opening braces
	  	and closing braces of in operands
	  @param {Array} Array of tokens
	  @return {Array} Same array with 'in' operands modified
	**/
	inOperator (arr) {
		let ind = arr.indexOf('in'),
			start,
			last

		while (ind !== -1) {
			start = ind + 1
			last = arr.indexOf(')', ind)
			arr.splice(ind + 1, last - start + 1, arr.slice(start + 1, last).join(','))
			ind = arr.indexOf('in', ind + 1)
		}

		return arr
	},

	/**
	  postfix( tokens )
	  	Convert the tokens to postfix so that we can evaluate from left to right
	  @param {Array} Array of tokens
	  @return {Array} Postfix array of the tokens
	**/
	postfix (tokens) {
		let o = [],
			e = []

		for (const t of tokens) {
			if (!operators.includes(t) && !braces.includes(t)) {
				e.push(t)
			} else if (t === '(') {
				o.push(t)
			} else if (t === ')') {
				if (o.length) {
					let top = o.pop()
					while (top !== '(' && o.length) {
						e.push(top)
						top = o.pop()
					}
				}
			} else if (o.length) {
				while (prec[o[o.length - 1]] >= prec[t]) {
					e.push(o.pop())
				}
				o.push(t)
			} else {
				o.push(t)
			}
		}

		while (o.length) {
			e.push(o.pop())
		}

		return e
	},

	/**
	  process( arr )
	  	Process the postfix array of tokens and create a json object
	  	of the original expression for easy evaluation
	  @param {Array} Array of tokens
	  @return {Object} Json object of original expression
	**/
	process (tokens) {
		if (tokens.length < 3) {
			console.error('Wrong expression', this.exp)
			return false
		}

		let stack = []

		for (let o of tokens) {
			if (stack.length < 2) {
				stack.push(o)
			} else if (operators.includes(o)) {
				let top = stack.pop(),
					secondTop = stack.pop()
				stack.push(this.objectify(secondTop, top, o))
			} else {
				stack.push(o)
			}
		}
		return stack.length ? stack[0] : ''
	},

	/**
	  objectify( a, b, o )
	  	Create json object for given operands and operator
	  @param {String} left operand
	  @param {String} right operand
	  @param {String} operator
	  @return {Object} Json object of operands and operator
	**/
	objectify (a, b, o) {
		if (o === 'in') b = b.split(',')
		let typea = type(a),
			typeb = type(b)
		return {
			left: {
				value: format(a),
				_value: typea !== 'object' ? format(a) : '',
				type: typea,
				variable: true
			},
			operator: o,
			right: {
				value: format(b),
				_value: typeb !== 'object' ? format(b) : '',
				type: typeb,
				variable: false
			}
		}
	},

	/**
	  evaluate( obj )
	  	Evaluate the expression with given object data
	  @param {Object} json object
	  @return {Boolean} true or false according to evaluation
	**/
	evaluate (obj) {
		if (!this.processed) return false
		return evaluate(this.processed, obj)
	},

	/**
	  correct( obj )
	  	Check for expression correctness
	  @param {Object} Expression array
	  @return {Boolean} true or false according to evaluation
	**/
	correct (exp) {
		let index = 0
		for (let e of exp) {
			if (braces.includes(e)) continue
			index++

			if (index % 2 == 0 && !operators.includes(e)) return false
		}
		return true
	}

})

module.exports = E
