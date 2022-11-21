async function fun1(n) {
  console.log(`fun1: ${n}`);
  await fun2('fun1');
  console.log(`fun1: end`);
}

async function fun2(n) {
  console.log(`fun2: ${n}`);
  console.log(`fun2: end`);
}

console.log('start');
(async () => {
  console.log(0);
  await fun1(1);
  await fun2(2);
  console.log(3);
})();
console.log('end');
