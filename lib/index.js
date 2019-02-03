'use strict'

const path = require('path')
const util = require('util')
const {Worker} = require('worker_threads')
const {outputStream} = require('@phylum/pipeline')
const Serializable = require('./serializable')
const WorkerError = require('./worker-error')
const workerClient = require.resolve('./worker-client')

function createWorkerTask(filename, options = {}) {
	return outputStream((ctx, resolve, reject) => {
		const worker = new Worker(workerClient, {
			workerData: {
				filename: path.resolve(filename)
			},
			stdin: options.stdin,
			stdout: options.stdout,
			stderr: options.stderr,
			execArgv: options.execArgv
		})
		worker.on('exit', code => {
			if (code !== 0) {
				reject(new Error(`Worker thread exited with non-zero exit code: ${code}`))
			}
		})
		worker.on('error', err => {
			reject(err)
		})
		worker.on('message', msg => {
			if (!Array.isArray(msg)) {
				reject(new TypeError(`Invalid message received from worker: ${util.inspect(msg)}`))
			}
			const [type, value] = msg
			switch (type) {
				case 'error':
					reject(new WorkerError(value))
					break

				case 'resolve':
					resolve(value)
					break

				case 'reject':
					reject(value)
					break
			}
		})
		if (options.terminateOnDispose) {
			ctx.on('dispose', () => {
				worker.terminate()
			})
		}
		ctx.exports.worker = worker
	})
}

exports.createWorkerTask = createWorkerTask
exports.WorkerError = WorkerError
exports.Serializable = Serializable
exports.raw = value => new Serializable(value)
