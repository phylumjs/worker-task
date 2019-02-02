'use strict'

const {raw} = require('../..')

module.exports = async ctx => {
	setTimeout(() => {
		ctx.push(raw('bar'))
	}, 100)

	return raw('foo')
}
