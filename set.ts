// Set: <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set>

// util

function printSet(set: Set<any>) {
  set.forEach((value) => console.log(`value: ${value}`));
}

// lab 1: 輸入重複的 Primitive value
// => 不會新增
// const mySet = new Set<any>();
// mySet.add('a');
// mySet.add('a');
// printSet(mySet);

// lab 2: key 是 object
// => 可以成功新增兩筆
// const mySet = new Set<any>();
// mySet.add({ a: 123 });
// mySet.add({ a: 123 });
// printSet(mySet);

// lab 3: key 是同一個 ref 的 object
// => 無法重覆新增
const mySet = new Set<any>();
const a = { a: 123 };
mySet.add(a);
mySet.add(a);
printSet(mySet);
