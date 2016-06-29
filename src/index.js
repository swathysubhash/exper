import { extend } from 'underscore'


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

function E (exp) {
	if (!(this instanceof E)) return new E(exp)
	this.exp = exp
	this.processed = []
	this.parse()
}

extend(E.prototype, {
	parse () {
		let tokens = this.tokenize(this.exp)
		tokens = this.postfix(tokens)
		this.processed = this.process(tokens)
	},

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
		return tokens
	},

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

	process (tokens) {
		if (tokens.length < 3) {
			throw Error('Minimum number of elements in array is 3')
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

		return stack
	},

	objectify (a, b, o) {
		console.log('a')
		return {
			left: {
				value: a
			},
			operator: o,
			right: {
				value: b
			}
		}
	}
})

export default E

// console.log(JSON.stringify(E('(id = "123323" and price> 1299) or (skuid = 31231 and article in ( shoes, caps))'), 0, 4))