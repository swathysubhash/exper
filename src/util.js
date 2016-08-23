
const util = {
	/**
		format( str )
		  	Remove the quotes, convert string to integer
		@param {String} Input string
		@return {String} Formatted string
	**/
	format: str => {
		if (typeof str === 'string') {
			if (str.indexOf('"') === -1 && !isNaN(+str)) {
				str = +str
			} else {
				str = str.trim()
				if (str === 'true') return true
				if (str === 'false') return false
				if (str.indexOf('"') !== -1) str = str.replace(/\"/g, '')
				if (str.indexOf('\'') !== -1) str = str.replace(/\'/g, '')
			}
		}
		if (str instanceof Array) str = str.map(util.format)

		return str
	},
	/**
		type( t )
		  	Find the type of the given object
		@param {Object} Input object
		@return {String} Find the type of object
	**/
	type: t => {
		if (typeof t === 'number') return 'number'
		if (t instanceof Array) return 'array'
		if (typeof t === 'string') return 'string'
		if (typeof t === 'object') return 'object'
	},

	/**
	  checkBraces( arr )
	  	Check the braces are correct in an expression
	  @param {Array} expression array
	  @return {Boolean}
	**/
	checkBraces: arr => {
		let braces = 0
		for (let item of arr) {
			switch (item) {
				case '(' :
					++braces
					break
				case ')' :
					--braces
					break
			}
			if (braces < 0) {
				return false
			}
		}

		if (braces) return false
		return true
	}
}

module.exports = util