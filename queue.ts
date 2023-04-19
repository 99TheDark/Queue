type Awaiter = () => Promise<void>;

export interface QueuedItem {
    start: Awaiter;
    stop: () => void;
}

export class Queue {
    private items: Array<QueuedItem>;
    private current: number;
    private running: boolean;
    private waiters: Array<Function>;
    private repeatCount: number;

    constructor() {
        this.items = [];
        this.current = 0;
        this.running = false;
        this.waiters = [];
        this.repeatCount = 0;
    }
    private async run() {
        this.running = true;

        await this.next().start();
        this.current++;

        if(this.current < this.items.length) {
            this.run();
        } else if(this.repeatCount > 0) {
            this.current = 0;
            this.repeatCount--;
            this.run();
        } else {
            this.waiters.forEach(resolve => resolve());
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
    async await(waiter: Awaiter = async () => {}): Promise<void> {
        await new Promise<void>(resolve => this.waiters.push(resolve));
        waiter();
    }
}