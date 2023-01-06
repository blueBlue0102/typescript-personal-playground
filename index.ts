console.log('hi');
await new Promise((resolve) => {
  setTimeout(() => resolve(true), 3000);
});
console.log('bye');
