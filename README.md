# Exper

[![Build Status](https://travis-ci.org/swathysubhash/exper.svg?branch=master)](https://travis-ci.org/swathysubhash/exper)

Simple logical Expression Evaluator


## Installation
`npm install exper`

## Introduction
This module can be used for evaluating simple logical expressions. Expressions should be binary logical expressions. 
Currently supported operators are '=', '>', '<', '&&', '||', 'and', 'or', 'in'.
Expression example

`'(id = 123323 and price> 1299) or (skuid = 31231 and article in ( shoes, caps)) and  sizes.38 = available'`

We need to pass an object which can provide values for this expression. 
`Eg. { id: 123323, price: 2000, skuid: 31231, article: 'shoes', sizes: { '38': 'available', '39': 'not-available'} }`

Return value will be true or false accordingly.

if any value is missing in given data or the expression is wrong, result will be false


### Usage

```javascript
let e
let exp1 = '(a = 3 or b > 5) and (c in (1,2) or d < 4)'

e = Exper(exp1)
e.evaluate({a: 3, b : 6, c: 1, d: 1}) // true
e.evaluate({a: 3, b : 4, c: 1, d: 6}) // true 
e.evaluate({a: 4, b : 4, c: 1, d: 1}) // false
e.evaluate({a: 3, b : 6, c: 4, d: 6}) // false


let exp2 = '(id = 123323 and price> 1299) or (skuid = 31231 and article in ( shoes, caps))'

e = Exper(exp2)
e.evaluate({ id: 123323, price: 2000, skuid: 31231, article: 'shoes' }) // true
e.evaluate({ id: 123523, price: 2000, skuid: 31231, article: 'shoes' }) // true
e.evaluate({ id: 123523, price: 2000, skuid: 41231, article: 'shoes' }) // false
e.evaluate({ id: 123523, price: 1000, skuid: 31231, article: 'shoes' }) // true
e.evaluate({ id: 123523, price: 1000, skuid: 31231, article: 'shirts' }) // false

let exp3 = '(id = 123323 and price> 1299) or (skuid = 31231 and article in ( shoes, caps)) and sizes.38 = available'

e = Exper(exp2)
e.evaluate({ id: 123323, price: 2000, skuid: 31231, article: 'shoes' }) // false
e.evaluate({ id: 123523, price: 2000, skuid: 31231, article: 'shoes',
  				  sizes: { '38': 'available', '39': 'not-available'} }) // true
e.evaluate({ id: 123523, price: 2000, skuid: 41231, article: 'shoes',
              sizes: { '38': 'not-available', '39': 'not-available'} }) // false

```


## Test

`npm test`



## License

MIT
