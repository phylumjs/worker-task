'use strict'

const {raw} = require('../..')

module.exports = async ctx => {
	throw raw({foo: 'bar'})
}
