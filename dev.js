'use strict'

const {cli} = require('@phylum/pipeline')
const {createWorkerTask} = require('.')

const task = createWorkerTask('dev-worker')

cli(async ctx => {
	await ctx.use(task)
})
