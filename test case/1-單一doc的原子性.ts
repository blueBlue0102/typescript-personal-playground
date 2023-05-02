import mongoose from '../mongo-client.js';

// 目標：驗證 https://www.mongodb.com/docs/manual/core/write-operations-atomicity/#atomicity 是否為真？
// 測試方法：多個程序不斷寫入同一個 doc，同時更新多個欄位，不能有任何一刻讀取到的 doc，其各個欄位只被更新一半
// doc 有 10 個欄位，每個欄位都會儲存數字，所有欄位的值總合必須是 10000

const docId = '6450cb0baa3727d3dc6d0eb0';
const sumNum = 10000;

// 建立多個 field 的 schema 及 collection
const mySchema = new mongoose.Schema({
  k0: Number,
  k1: Number,
  k2: Number,
  k3: Number,
  k4: Number,
  k5: Number,
  k6: Number,
  k7: Number,
  k8: Number,
  k9: Number,
});

// 創建一個 collection
const SingleDocAtomicityModel = mongoose.model('SingleDocAtomicity', mySchema);

// 生產隨機數字的 function
function generateNumbers(num: number): number[] {
  const nums = [];
  let total = 0;

  // 產生 9 個隨機數字
  for (let i = 0; i < 9; i++) {
    const rand = Math.floor(Math.random() * num);
    nums.push(rand);
    total += rand;
  }

  // 將總和差補到第 10 個數字
  nums.push(num - total);

  // 將數字隨機排序
  nums.sort(() => Math.random() - 0.5);

  return nums;
}

while (true) {
  // 寫入 doc
  const nums = generateNumbers(sumNum);
  const doc = await SingleDocAtomicityModel.findByIdAndUpdate(docId, {
    k0: nums[0],
    k1: nums[1],
    k2: nums[2],
    k3: nums[3],
    k4: nums[4],
    k5: nums[5],
    k6: nums[6],
    k7: nums[7],
    k8: nums[8],
    k9: nums[9],
  }).lean();
  // 驗證 doc
  if (doc.k0 + doc.k1 + doc.k2 + doc.k3 + doc.k4 + doc.k5 + doc.k6 + doc.k7 + doc.k8 + doc.k9 !== sumNum) {
    console.log('atomicity is break!');
    console.log(doc);
    process.exit(0);
  }
}
