'use strict'

const test = require('ava')
const path = require('path')
const {Pipeline} = require('@phylum/pipeline')
const {createWorkerTask, WorkerError} = require('..')

test('basic usage', async t => {
	const task = createWorkerTask(path.join(__dirname, 'workers/basic-usage'))
	const pipeline = new Pipeline(task)
	const values = []
	await new Promise(resolve => {
		pipeline.enable()
		pipeline.on('resolve', value => {
			values.push(value)
			if (value === 'bar') {
				resolve()
			}
		})
	})
	t.deepEqual(values, ['foo', 'bar'])
})

test('reject', async t => {
	const task = createWorkerTask(path.join(__dirname, 'workers/reject'))
	const err = await new Pipeline(task).enable().then(() => t.fail(), v => v)
	t.deepEqual(err, {foo: 'bar'})
})

test('error', async t => {
	const task = createWorkerTask(path.join(__dirname, 'workers/error'))
	const err = await new Pipeline(task).enable().then(() => t.fail(), v => v)
	t.true(err instanceof WorkerError)
	t.true(/foo123/.test(err.message))
})
