// 當一個 api 在 long await 時，另一個 api 並不會被影響

import express from 'express';

const port = 8080;

const app = express();

function sleep(seconds: number) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, seconds * 1000);
  });
}

app.get('/', (req, res) => {
  console.log('Hi');
  res.end(`Hi: ${new Date()}`);
});

app.get('/1', async (req, res) => {
  console.log('start: 1');
  await sleep(50);
  console.log('end: 1');
  res.end(`ok: ${new Date()}`);
});

app.get('/2', async (req, res) => {
  console.log('start: 2');
  await sleep(0.5);
  console.log('end: 2');
  res.end(`ok: ${new Date()}`);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
