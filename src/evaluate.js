/**
	evaluate( exp, data )
	  	Evaluate the json object with given data
	@param {Object} Expression in the form of Json object
	@param {Object} Give object with data to evaluate against
	@return {Boolean} Evaluated value
**/
function evaluate (exp, data) {
	if (exp.left.type === 'object') {
		exp.left._value = evaluate(exp.left.value, data)
	}

	if (exp.right.type === 'object') {
		exp.right._value = evaluate(exp.right.value, data)
	}

	if (typeof exp.left.value === 'string' && exp.left.value.indexOf('.') !== -1) {
		exp.left._value = at(data, exp.left.value)
	} else if (exp.left.variable && typeof data[exp.left.value] !== 'undefined') {
		exp.left._value = data[exp.left.value]
	}

	return operation(exp.left._value, exp.right._value, exp.operator)
}

/**
	at( data, loc )
	  	Find the property at the path location of data
	@param {Object} data object
	@param {String} location string
	@return {Object} Object at the specified path or string
**/
function at (obj, path) {
	var failed = false,
		o = obj

	if (!obj || !path) {
		return obj
	}

	path.split('.').forEach(p => {
		if (o[p] !== null && o[p] !== undefined && !failed) {
			o = o[p]
		} else {
			failed = true
		}
	})

	return failed ? o[path] : o
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
			return left || right
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