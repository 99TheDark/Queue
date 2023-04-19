import {Queue, QueuedItem} from "./queue";

class Waiting implements QueuedItem {
    time: number;
    completed: boolean;

    private stoppedEarly: boolean;

    constructor(seconds: number) {
        this.time = seconds * 1000;
        this.completed = false;
        this.stoppedEarly = false;
    }
    async start() {
        await new Promise<void>(resolve => setTimeout(() => {
            if(!this.stoppedEarly) {
                console.log(`Waited ${this.time / 1000} seconds.`)
                this.completed = true;
            }
            resolve();
        }, this.time));
    }
    stop() {
        this.stoppedEarly = true;
    }
}

const queue = new Queue();

let sec = new Waiting(1);

queue.push(new Waiting(0.1));
queue.push(new Waiting(0.05));
queue.push(sec);
queue.push(new Waiting(0.2));

queue.discard(sec);

queue.await(async () => console.log("Ended."));