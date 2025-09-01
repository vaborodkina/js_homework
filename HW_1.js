"number" + 3 + 3; //number33 -> concatenation

null + 3; //3 -> 0+3=3

5 &&
  "qwerty" /*qwerty -> && returns 1st "false", as 5 is true and qwerty is true,
              - it returns the last value*/ +
    "40" +
    +"2" +
    "hillel"; //42hillel -> 40+2 and concatenation

"10" - 5 === 6; //false -> 10-5=5; 5!=6

true + false; //1 -> 1+0=1

"4px" - 3; //NaN -> NaN-3=NaN

"4" - 3; //1 -> 4-3=1

"6" + 3 ** 0; //61 -> 6 concatenation 3**0=1

12 / "6"; //2 -> 12/6=2

"10" + (5 === 6); //10false -> 10 concatenation false

null == ""; //false -> ONLY null == undefined is true

3 ** (9 / 3); //27 -> 3**3=27

!!"false" == !!"true"; //true -> Not empty string = true; true == true

0 ||
  ("0" &&
    1(
      //1 -> && has the priority on the || -> 0 || ('0' && 1) -> 0 || 1

      +null == false
    ) < 1); //false -> false == 0; true == 1 -> (0 == 0) <1 -> 1<1

(false && true) || true; //true -> true || false -> true

false && (false || true); //false false && true -> && returns first false -> false

(+null == false) < 1 ** 5; //false -> (0 == false) -> true == 1 -> 1<1
