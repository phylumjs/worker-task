'use strict'

const test = require('ava')
const path = require('path')
const {Writable} = require('stream')
const {Worker} = require('worker_threads')
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
	const err = await t.throwsAsync(new Pipeline(task).enable())
	t.true(err instanceof WorkerError)
	t.true(/foo123/.test(err.message))
})

test('missing module', async t => {
	const task = createWorkerTask(path.join(__dirname, 'workers/missing'))
	const err = await t.throwsAsync(new Pipeline(task).enable())
	t.true(err instanceof WorkerError)
})

test('missing export', async t => {
	const task = createWorkerTask(path.join(__dirname, 'workers/invalid-export'))
	const err = await t.throwsAsync(new Pipeline(task).enable())
	t.true(err instanceof WorkerError)
})

test('default export', async t => {
	const task = createWorkerTask(path.join(__dirname, 'workers/default-export'))
	t.is(await new Pipeline(task).enable(), 'foo')
})

test('task exports worker', async t => {
	const task = createWorkerTask(path.join(__dirname, 'workers/empty'))
	const pipeline = new Pipeline(task)
	await pipeline.enable()
	const worker = pipeline.getContext(task).exports.worker
	t.true(worker instanceof Worker)
	t.is(worker.stdin, null)
})

test('worker options', async t => {
	const task = createWorkerTask(path.join(__dirname, 'workers/empty'), {
		stdin: true
	})
	const pipeline = new Pipeline(task)
	await pipeline.enable()
	const worker = pipeline.getContext(task).exports.worker
	t.true(worker instanceof Worker)
	t.true(worker.stdin instanceof Writable)
})
