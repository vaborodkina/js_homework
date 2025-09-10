function raisingToPower(x, y) {
  let result = 1;
  if (y === 0) {
    // prettier-ignore
    console.log("Результат підведення "+x+" до ступеня 0 = " + result);
  } else if (y < 0) {
    for (let i = 1; i <= -y; i++) {
      result = result * x;
    }
    result = 1 / result;
    // prettier-ignore
    console.log("Результат підведення"+" "+x+" "+"до ступеня "+y+ " ="+" " + result);
    return result;
  } else {
    for (let i = 1; i <= y; i++) {
      result = result * x;
      // prettier-ignore
      console.log("Результат підведення "+x+" "+"до ступеня "+ i+ " ="+" " + result);
    }
    return result;
  }
}
result = raisingToPower(2, -25);
