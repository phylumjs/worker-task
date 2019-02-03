'use strict'

const util = require('util')
const {workerData, parentPort: parent} = require('worker_threads')
const Serializable = require('./serializable')

process.on('uncaughtException', err => {
	parent.postMessage(['error', util.inspect(err)])
})
process.on('unhandledRejection', err => {
	parent.postMessage(['error', util.inspect(err)])
})

const WorkerPipeline = require('./worker-pipeline')

const {filename} = workerData
const entryModule = require(filename)
const entryTask = entryModule.default || entryModule
if (typeof entryTask !== 'function') {
	throw new TypeError(`Worker entry module must export a function: ${filename}`)
}

const pipeline = new WorkerPipeline(entryTask)

pipeline.on('resolve', value => {
	if (value instanceof Serializable) {
		parent.postMessage(['resolve', value.value])
	} else {
		parent.postMessage(['resolve'])
	}
})

pipeline.on('reject', value => {
	if (value instanceof Serializable) {
		parent.postMessage(['reject', value.value])
	} else {
		parent.postMessage(['error', util.inspect(value)])
	}
})

pipeline.enable()

parent.on('message', msg => {
	if (!Array.isArray(msg)) {
		reject(new TypeError(`Invalid message received from parent: ${util.inspect(msg)}`))
	}
	const [type, value] = msg
	switch (type) {
		case 'disable':
			pipeline.disable()
			break

		default:
			reject(new TypeError(`Invalid message received from parent: ${util.inspect(msg)}`))
	}
})
