let array = [10, 26, 38, 99, 14];

const parNumbers = array.filter((number) => number % 2 === 0);
const neParNumbers = array.filter((number) => number % 2 !== 0);
console.log("Парні числа: " + parNumbers);
console.log("Не парні числа: " + neParNumbers);
