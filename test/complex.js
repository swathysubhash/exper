// Tests
const assert = require('chai').assert
const E = require('../lib')

console.error = function(){}

describe('Complex expressions', function() {
	'use strict'
	it('equal', function () {
		let exp = 'a = 2 and b = 3 and d in (4, 5)',
			e = E(exp)
		let res = e.evaluate({ a: 2, b: 3, d: 4 })
		assert.equal(res, true)
		res = e.evaluate({ a: 3, b: 3, d: 6 })
		assert.equal(res, false)
	})
	it('spaces', function () {
		let exp = 'a =   2 and b =    3 and d  in ( 4, 5)',
			e = E(exp)
		let res = e.evaluate({ a: 2, b: 3, d: 4 })
		assert.equal(res, true)
		res = e.evaluate({ a: 3, b: 3, d: 6 })
		assert.equal(res, false)
	})
	it('mix symbols', function () {
		let exp = 'a > 2 and b < 3 or d < 4'
		let res = E(exp).evaluate({ a: 1, b: 1, d: 2 })
		assert.equal(res, true)
		exp = 'a > 2 and (b < 3 or d < 4)'
		res = E(exp).evaluate({ a: 1, b: 1, d: 2 })
		assert.equal(res, false)
	})
	it('brackets', function () {
		let exp = '(a > 2) and ((b < 3) or (d > 5))',
			e = E(exp)
		let res = e.evaluate({ a: 4, b: 4, d: 3 })
		assert.equal(res, false)
		res = e.evaluate({ a: 1, b: 4, d: 3 })
		assert.equal(res, false)
		res = e.evaluate({ a: 4, b: 1, d: 3 })
		assert.equal(res, true)
		res = e.evaluate({ a: 4, b: 5, d: 7 })
		assert.equal(res, true)
	})
	it('in operator', function () {
		let exp = 'a in (4,3) or b in (6,3,7) and d=1',
			e = E(exp)
		let res = e.evaluate({ a: 4, b: 3, d: 1 })
		assert.equal(res, true)
		res = e.evaluate({ a: 1, b: 3, d: 1 })
		assert.equal(res, true)
		res = e.evaluate({ a: 1, b: 8, d: 1 })
		assert.equal(res, false)
	})
	it('example1', function () {
		let exp = '(a = 3 or b > 5) and (c in (1,2) or d < 4)',
			e = E(exp)
		let res = e.evaluate({a: 3, b : 6, c: 1, d: 1})
		assert.equal(res, true)
		res = e.evaluate({a: 3, b : 4, c: 1, d: 6})
		assert.equal(res, true)
		res = e.evaluate({a: 4, b : 4, c: 1, d: 1})
		assert.equal(res, false)
		res = e.evaluate({a: 3, b : 6, c: 4, d: 6})
		assert.equal(res, false)
	})
	it('example2', function () {
		let exp = '(id = 123323 and price> 1299) or (skuid = 31231 and article in ( shoes, caps))',
			e = E(exp)
		let res = e.evaluate({ id: 123323, price: 2000, skuid: 31231, article: 'shoes' })
		assert.equal(res, true)
		res = e.evaluate({ id: 123523, price: 2000, skuid: 31231, article: 'shoes' })
		assert.equal(res, true)
		res = e.evaluate({ id: 123523, price: 2000, skuid: 41231, article: 'shoes' })
		assert.equal(res, false)
		res = e.evaluate({ id: 123523, price: 1000, skuid: 31231, article: 'shoes' })
		assert.equal(res, true)
		res = e.evaluate({ id: 123523, price: 1000, skuid: 31231, article: 'shirts' })
		assert.equal(res, false)
	})
	it('example2 with dots operator - and', function () {
		let exp = '(id = 123323 and price> 1299) or (skuid = 31231 and article in ( shoes, caps)) and sizes.38 = available',
			e = E(exp)
		let res = e.evaluate({ id: 123323, price: 2000, skuid: 31231, article: 'shoes' })
		assert.equal(res, false)
		res = e.evaluate({ id: 123523, price: 2000, skuid: 31231, article: 'shoes',  sizes: { '38': 'available', '39': 'not-available'} })
		assert.equal(res, true)
		res = e.evaluate({ id: 123523, price: 2000, skuid: 41231, article: 'shoes',  sizes: { '38': 'not-available', '39': 'not-available'} })
		assert.equal(res, false)
	})
	it('example2 with dots operator - or', function () {
		let exp = '(id = 123323 and price> 1299) or (skuid = 31231 and article in ( shoes, caps)) or sizes.38 = available',
			e = E(exp)
		let res = e.evaluate({ id: 123323, price: 2000, skuid: 31231, article: 'shoes' })
		assert.equal(res, true)
		res = e.evaluate({ id: 123523, price: 2000, skuid: 31231, article: 'shoes',  sizes: { '38': 'available', '39': 'not-available'} })
		assert.equal(res, true)
		res = e.evaluate({ id: 123523, price: 2000, skuid: 41231, article: 'shoes',  sizes: { '38': 'not-available', '39': 'not-available'} })
		assert.equal(res, false)
	})
})