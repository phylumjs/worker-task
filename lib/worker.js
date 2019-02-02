'use strict'

const {workerData} = require('worker_threads')
const {Pipeline, Context} = require('@phylum/pipeline')

class WorkerPipeline extends Pipeline {
	createContext(fn) {
		return new WorkerContext(this, fn)
	}
}

class WorkerContext extends Context {
}

const {filename} = workerData

// TODO: Get and run entry task from module at <filename>.
// TODO: For each pipeline output, post a message.
