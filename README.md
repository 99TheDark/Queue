# Queue
A queue library for TypeScript! Simply download `queue.ts` and import it via `import {Queue, QueuedItem} from "./queue";`

## Documentation
`push(item)` — Add a `QueuedItem` as to the end of the queue. <br>
`discard(item)` — Remove the first instance of the given `item` from the queue, and stop it from running. <br>
`skip()` — Stop the currently running item, and start the next one. <br>
`repeat(times)` — Repeats the queue after finishing the given amount of `times`, which stacks, defaulting to forever. <br>
`clear()` — Clear the entire queue and stop the current item from running. <br>
`reverse()` — Reverse the direction of the queue. <br>
`next()` — Gives the currently running / next to complete item. <br>
`position()` — Gives the current index of the currently running / next to complete item. <br>
`size()` — Gives the current size of the queue. <br>
`end(waiter)` — Waits until the queue is completely finished, and runs the `waiter` callback function. <br>
`loop(waiter)` — Runs the `watier` callback function each time the queue is looped via the `repeat` function. <br>
`move(waiter)` — Runs the `watier` callback function each time an item in the queue is completed. <br>
`toString()` — Gives the string representation of the `queue`, being the generic `[object Queue]`. <br>

## QueuedItem interface
`start` — Runs when the queued item begins, and completes when the task is finished by awaiting some `Promise`. <br>
`stop` — Activated when the item must be forced stop, where implementation is meant to cancel the current task from running. <br>
