type Awaiter = () => Promise<void>;

interface QueueWaiter {
    end: Array<Function>;
    move: Array<Function>;
    loop: Array<Function>;
}

export interface QueuedItem {
    start: Awaiter;
    stop: () => void;
}

export class Queue {
    static readonly author = "TheDark";
    static readonly github = "https://github.com/99TheDark/Queue";
    private static curid = 0;

    readonly id = Queue.curid++;
    private items: Array<QueuedItem>;
    private current: number;
    private running: boolean;
    private repeatCount: number;
    private waiters: QueueWaiter;

    constructor() {
        this.items = [];
        this.current = 0;
        this.running = false;
        this.repeatCount = 0;
        this.waiters = {
            end: [],
            move: [],
            loop: []
        };
    }
    private async run() {
        this.running = true;

        await this.next().start();
        this.current++;

        if(this.current < this.items.length) {
            this.waiters.move.forEach(func => func());
            this.run();
        } else if(this.repeatCount > 0) {
            this.waiters.loop.forEach(func => func());
            this.current = 0;
            this.repeatCount--;
            this.run();
        } else {
            this.waiters.end.forEach(resolve => resolve());
        }

        this.running = false;
    }
    push(item: QueuedItem): void {
        this.items.push(item);
        if(!this.running) this.run();
    }
    skip() {
        if(this.current < this.items.length) this.next().stop();
        this.run();
    }
    clear(): void {
        if(this.current < this.items.length) this.next().stop();
        this.items.length = 0;
    }
    discard(item: QueuedItem): void {
        let idx = this.items.indexOf(item);
        if(idx != -1) {
            let item = this.items[idx];

            if(idx == this.current) item.stop();
            if(idx <= this.current) this.current--;

            this.items.splice(idx, 1);
        }
    }
    reverse(): void {
        this.items.reverse();
        this.current = this.items.length - this.current - 1;
    }
    repeat(count: number = Infinity): void {
        if(count <= 0) return;
        this.repeatCount += count;
    }
    next(): QueuedItem {
        return this.items[this.current];
    }
    position(): number {
        return this.current;
    }
    size(): number {
        return this.items.length;
    }
    move(waiter: Awaiter): void {
        this.waiters.move.push(waiter);
    }
    loop(waiter: Awaiter): void {
        this.waiters.loop.push(waiter);
    }
    async end(waiter: Awaiter): Promise<void> {
        await new Promise<void>(resolve => this.waiters.end.push(resolve));
        waiter();
    }
    toString(): string {
        return "[object Queue]";
    }
}
