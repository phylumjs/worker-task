'use strict'

const {Pipeline} = require('@phylum/pipeline')
const WorkerContext = require('./worker-context')

class WorkerPipeline extends Pipeline {
	createContext(fn) {
		return new WorkerContext(this, fn)
	}
}

module.exports = WorkerPipeline
