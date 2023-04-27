import { Redlock } from './redis-lock-client.js';

const t1 = performance.now();

const lock = await Redlock.acquire(['a'], 3000);

const t2 = performance.now();

console.log(t2 - t1);
process.exit(0);
