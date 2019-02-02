'use strict'

class WorkerError extends Error {
	constructor(message) {
		super(message)
	}

	get name() {
		return 'WorkerError'
	}
}

module.exports = WorkerError
