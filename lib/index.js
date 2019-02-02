'use strict'

const path = require('path')
const {Worker} = require('worker_threads')
const workerClient = require.resolve('./worker')

function createWorkerTask(filename) {
	return async ctx => new Promise((resolve, reject) => {
		const worker = new Worker(workerClient, {
			workerData: {
				filename: path.resolve(filename)
			}
		})
		worker.on('exit', () => {
			resolve()
		})
	})
}

exports.createWorkerTask = createWorkerTask
