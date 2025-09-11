//Оголошення ф-ії підведення до ступеня (х-число, у-ступінь)
function raisingToPower(x, y) {
  let result = 1; //Змінна для накопичення проміжних результатів

  //Умова для обробки при підведенні у 0 ступінь
  if (y === 0 && x > 0) {
    // prettier-ignore
    console.log("Результат підведення "+x+" до ступеня 0 = " + result);
  }
  //Умова для обробки при підведенні у від'ємну ступінь
  else if (y < 0) {
    for (let i = 1; i <= -y; i++) {
      result = result * x;
    }
    result = 1 / result;
    // prettier-ignore
    console.log("Результат підведення"+" "+x+" "+"до ступеня "+y+ " ="+" " + result);
    return result;
  }
  //Умова для обробки при підведенні 0 у 0 ступінь (вираз немає сенсу у математиці)
  else if (y === 0 && x === 0) {
    result = result;
    // prettier-ignore
    console.log("Результат підведення"+" "+x+" "+"до ступеня "+y+ " = undefind");
    return result;
  }
  //Умова для обробки при підведенні у будь-який ступінь
  else {
    for (let i = 1; i <= y; i++) {
      result = result * x;
      // prettier-ignore
      console.log("Результат підведення "+x+" "+"до ступеня "+ i+ " ="+" " + result);
    }
    return result;
  }
}
result = raisingToPower(3, 5);
