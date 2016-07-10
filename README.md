# E

Expression evaluator


## Installation
`npm install e`

## Introduction
This module can be used for evaluating simple logical expressions. Expressions should be binary logical expressions. 
Currently supported operators are '=', '>', '<', '&&', '||', 'and', 'or', 'in'.
Expression example

`'(id = 123323 and price> 1299) or (skuid = 31231 and article in ( shoes, caps))'`

Return value will be true or false accordingly.

if any value is missing in given data or the expression is wrong, result will be false


### Usage

```javascript
let e
let exp1 = '(a = 3 or b > 5) and (c in (1,2) or d < 4)'

e = E(exp1)
e.evaluate({a: 3, b : 6, c: 1, d: 1}) // true
e.evaluate({a: 3, b : 4, c: 1, d: 6}) // true 
e.evaluate({a: 4, b : 4, c: 1, d: 1}) // false
e.evaluate({a: 3, b : 6, c: 4, d: 6}) // false


let exp2 = '(id = 123323 and price> 1299) or (skuid = 31231 and article in ( shoes, caps))'

e = E(exp2)
e.evaluate({ id: 123323, price: 2000, skuid: 31231, article: 'shoes' }) // true
e.evaluate({ id: 123523, price: 2000, skuid: 31231, article: 'shoes' }) // true
e.evaluate({ id: 123523, price: 2000, skuid: 41231, article: 'shoes' }) // false
e.evaluate({ id: 123523, price: 1000, skuid: 31231, article: 'shoes' }) // true
e.evaluate({ id: 123523, price: 1000, skuid: 31231, article: 'shirts' }) // false`
```


## Test

`npm test`



## License

MIT
