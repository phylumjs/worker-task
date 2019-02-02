# worker-task
Move tasks that are computationally heavy or use synchronous io to [a worker thread](https://nodejs.org/dist/latest/docs/api/worker_threads.html).<br>

## Installation
```bash
npm i @phylum/worker-task
```
**Please note that node worker threads are currently experimental!**
```bash
# In order to enable worker thread support, you
# have to pass the following flag to node:
node --experimental-worker ...
```

<br>

# Basic Usage
```js
// parent.js

const {createWorkerTask} = require('@phylum/worker-task')

const task = createWorkerTask(path.join(__dirname, 'worker'))
```

```js
// worker.js

module.exports = async ctx => {
	console.log('Hello World!')
}
```

## Serialization
By default, errors are converted to strings using `util.inspect(..)` before passing them to the parent thread and results are not passed at all. You can use the [v8 serialization api](https://nodejs.org/dist/latest/docs/api/v8.html#v8_serialization_api) by wrapping a value into a `Serializable` instance. However if the wrapped value is not serializable, an error will be passed to the parent thread.
```js
// worker.js

const {Serializable, raw} = require('@phylum/worker-task')

module.exports = async ctx => {
	return new Serializable({foo: 'bar'})

	// Or use the shorthand function:
	return raw({foo: 'bar'})
}
```
