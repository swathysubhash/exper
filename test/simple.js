// Tests
const assert = require('chai').assert
const E = require('../lib')

console.error = function(){}

describe('Simple expressions', function() {
	'use strict'
	it('equal', function () {
		let exp = 'a = 2 and b = 3',
			e = E(exp)
		let res = e.evaluate({ a: 2, b: 3 })
		assert.equal(res, true)
		res = e.evaluate({ a: 3, b: 3 })
		assert.equal(res, false)
	})
	it('spaces', function () {
		let exp = 'a =   2 and b =    3',
			e = E(exp)
		let res = e.evaluate({ a: 2, b: 3 })
		assert.equal(res, true)
		res = e.evaluate({ a: 3, b: 3 })
		assert.equal(res, false)
	})
	it('mix symbols', function () {
		let exp = 'a > 2 and b < 3',
			e = E(exp)
		let res = e.evaluate({ a: 4, b: 1 })
		assert.equal(res, true)
		res = e.evaluate({ a: 3, b: 3 })
		assert.equal(res, false)
	})
	it('or', function () {
		let exp = 'a > 2 or b < 3',
			e = E(exp)
		let res = e.evaluate({ a: 4, b: 5 })
		assert.equal(res, true)
		res = e.evaluate({ a: 1, b: 1 })
		assert.equal(res, true)
		res = e.evaluate({ a: 1, b: 5 })
		assert.equal(res, false)
	})
	it('brackets', function () {
		let exp = '(a > 2) and (b < 3)',
			e = E(exp)
		let res = e.evaluate({ a: 4, b: 1 })
		assert.equal(res, true)
		res = e.evaluate({ a: 3, b: 3 })
		assert.equal(res, false)
	})
	it('wrong brackets', function () {
		let exp = '((a > 2) and (b < 3)',
			e = E(exp)
		let res = e.evaluate({ a: 4, b: 1 })
		assert.equal(res, false)
		res = e.evaluate({ a: 3, b: 3 })
		assert.equal(res, false)
	})
	it('smallest case', function () {
		let exp = 'a > 2',
			e = E(exp)
		let res = e.evaluate({ a: 4, b: 1 })
		assert.equal(res, true)
		res = e.evaluate({ a: 1, b: 3 })
		assert.equal(res, false)
	})
	it('no expression', function () {
		let exp = '',
			e = E(exp)
		let res = e.evaluate({ a: 4, b: 1 })
		assert.equal(res, false)
		res = e.evaluate({ a: 1, b: 3 })
		assert.equal(res, false)
	})
	it('in operator', function () {
		let exp = 'a in (4,3)',
			e = E(exp)
		let res = e.evaluate({ a: 4, b: 1 })
		assert.equal(res, true)
		res = e.evaluate({ a: 1, b: 3 })
		assert.equal(res, false)
	})
	it('in operator - different types', function () {
		let exp = 'a in ("4",3)',
			e = E(exp)
		let res = e.evaluate({ a: "4", b: 1 })
		assert.equal(res, true)
		res = e.evaluate({ a: 4, b: 3 })
		assert.equal(res, false)
		res = e.evaluate({ a: "1", b: 3 })
		assert.equal(res, false)
		res = e.evaluate({ a: "3", b: 3 })
		assert.equal(res, false)
		res = e.evaluate({ a: 3, b: 3 })
		assert.equal(res, true)
	})
})