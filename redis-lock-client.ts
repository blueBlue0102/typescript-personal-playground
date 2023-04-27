// Redlock 在 esm module 下無法成功取得 type，需修改 node_modules\redlock\package.json
// https://github.com/mike-marcacci/node-redlock/pull/216/files

import { Redis } from 'ioredis';
import Redlock from 'redlock';

const redis_uri = '192.168.118.50:30579';

const redisClient = new Redis(redis_uri);
const redlock: Redlock = new Redlock([redisClient], {
  // acquire key 失敗時的重試次數，設為 -1 表示無限
  retryCount: -1,
});

export { redlock as Redlock };
