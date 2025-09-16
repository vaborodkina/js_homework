const min = 100; //ліва границя
const max = 1000; //права границя

function checkProbabilityTheory(count) {
  let counterOdd = 0; //лічильник для непарних чисел
  let counterEven = 0; //лічильник для парних чисел
  for (let i = 0; i < count; i++) {
    const randomNum = Math.floor(Math.random() * (max - min + 1)) + min; //+ min як зсув діапазону
    console.log("Рандомне число: " + randomNum); // Виведе рандомне число число від 100 до 1000 включно
    if (randomNum % 2 === 0) {
      counterEven++;
    } else {
      counterOdd++;
    }
  }

  const percentEven = ((counterEven / count) * 100).toFixed(2) + " %";
  const percentOdd = ((counterOdd / count) * 100).toFixed(2) + " %";
  console.log("Кількість згенерованих чисел: " + count);
  console.log("Кількість парних чисел: " + counterEven);
  console.log("Кількість непарних чисел: " + counterOdd);
  console.log("Співвідношення парних чисел: " + percentEven);
  console.log("Співвідношення непарних чисел: " + percentOdd);
}
checkProbabilityTheory(5);
