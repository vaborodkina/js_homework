var services = {
  //prettier-ignore
  "haircut": "60 UAH",
  //prettier-ignore
  "shave": "80.34 UAH",
  "hair wash": "100 UAH",

  price: function () {
    let totalAmount = 0; //змінна для накопичення суми
    for (let value in this) {
      if (typeof this[value] === "string") {
        let priceValue = Number.parseFloat(this[value]); //перетворення значень до числа
        totalAmount = totalAmount + priceValue; //підрахунок суми
      }
    }
    console.log("Total price of the services = ", totalAmount);
  },
  minPrice: function () {
    let min = Infinity;
    for (let value in this) {
      if (typeof this[value] === "string") {
        let priceValue = Number.parseFloat(this[value]);
        if (priceValue < min) {
          min = priceValue;
        }
      }
    }
    console.log("Minimal price of the services = ", min);
  },
  maxPrice: function () {
    let max = -Infinity;
    for (let value in this) {
      if (typeof this[value] === "string") {
        let priceValue = Number.parseFloat(this[value]); //
        if (priceValue > max) {
          max = priceValue;
        }
      }
    }
    console.log("Maximal price of the services = ", max);
  },
};

services["break a window"] = "200 UAH";
services["manicure"] = "350 UAH";
services["design on one nail"] = "7.53 UAH";
services["make up"] = "199.99 UAH";
services["make up"] = "0.5 UAH";
services["make up"] = "10987654 UAH";
services.price();
services.minPrice();
services.maxPrice();
