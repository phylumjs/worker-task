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
