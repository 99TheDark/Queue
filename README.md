# Queue
A queue library for TypeScript! Simply download `queue.ts` and import it via `import {Queue, QueuedItem} from "./queue";`

## Documentation
`push(item)` — Add a `QueuedItem` as to the end of the queue. <br>
`discard(item)` — Remove the first instance of the given `item` from the queue, and stop it from running. <br>
`skip()` — Stop the currently running item, and start the next one.
`repeat(times)` — Repeats the queue after finishing the given amount of `times`, which stacks, defaulting to forever. <br>
`clear()` — Clear the entire queue and stop the current item from running. <br>
`reverse()` — Reverse the direction of the queue. <br>
`next()` — Gives the currently running / next to complete item. <br>
`position()` — Gives the current index of the currently running / next to complete item. <br>
`await(waiter)` — Waits until the queue is completely finished, and runs the `waiter` callback function.
