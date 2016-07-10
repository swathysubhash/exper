/**
	evaluate( exp, data )
	  	Evaluate the json object with given data
	@param {Object} Expression in the form of Json object
	@param {Object} Give object with data to evaluate against
	@return {Boolean} Evaluated value
**/
function evaluate (exp, data) {
	if (exp.left.type === 'object') {
		exp.left.value = evaluate(exp.left.value, data)
	}

	if (exp.right.type === 'object') {
		exp.right.value = evaluate(exp.right.value, data)
	}

	if (exp.left.variable && typeof data[exp.left.value] !== 'undefined') {
		exp.left.value = data[exp.left.value]
	}

	return operation(exp.left.value, exp.right.value, exp.operator)
}

/**
	operation( left, right, operator )
	  	Find the boolean value of 'left operator operator right operator'
	@param {Object} left operator
	@param {Object} right operator
	@param {String} Operator string
	@return {Boolean} Evaluated value of given operator and operands
**/
function operation (left, right, operator) {
	switch (operator) {
		case '===':
		case '==':
		case '=':
			return left === right
		case 'and':
		case '&&':
		case '&':
			return left && right
		case 'or':
		case '||':
		case '|':
			return left && right
		case '>':
			return left > right
		case '<':
			return left < right
		case 'in':
			if (right.length) {
				return right.indexOf(left) !== -1
			} else {
				return left === right
			}
		default:
			return false
	}
}


export default evaluate