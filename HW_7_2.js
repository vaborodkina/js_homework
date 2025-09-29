var str = "Wonderful, Happiness, Time, Task, Apple, Joyful";
//початок слова - не містить а чи А та пробільних символів - 6 або більше входжень (6 символів) - кінець слова - виведе усі співпадіння
var regex = /\b[^aA\s]{6,}\b/g;
console.log(str.match(regex));
