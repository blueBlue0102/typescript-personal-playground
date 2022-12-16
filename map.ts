// <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map>

// util

function printMap(map: Map<any, any>) {
  map.forEach((value, key) => console.log(`key: ${key} : value: ${value}`));
}

// lab 1: 輸入重複的 key
// => 會被覆蓋
// const myMap = new Map<string, number>();
// myMap.set('a', 0);
// myMap.set('a', 1);
// printMap(myMap);

// lab 2: key 是 object
// => 不會覆蓋
// const myMap = new Map<any, number>();
// myMap.set({ a: 123 }, 0);
// myMap.set({ a: 123 }, 1);
// printMap(myMap);

// lab 3: key 是同一個 ref 的 object
// => 會被覆蓋
const myMap = new Map<any, number>();
const a = { a: 123 };
myMap.set(a, 0);
myMap.set(a, 1);
printMap(myMap);
