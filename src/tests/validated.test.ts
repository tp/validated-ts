import test from "ava";
import { Validated, zip2With } from "..";

test("zip2With", async t => {
  type ValidEven = Validated<number, string>;

  const validateEven = (n: number): ValidEven => {
    if (n % 2 === 0) {
      return { valid: true, value: n };
    } else {
      return { valid: false, errors: [`number ${n} is not even`] };
    }
  };

  const sum = (a: number, b: number): number => a + b;

  t.deepEqual(zip2With(sum)(validateEven(2), validateEven(4)), {
    valid: true,
    value: 6
  });

  t.deepEqual(zip2With(sum)(validateEven(1), validateEven(4)), {
    valid: false,
    errors: ["number 1 is not even"]
  });

  t.deepEqual(zip2With(sum)(validateEven(1), validateEven(5)), {
    valid: false,
    errors: ["number 1 is not even", "number 5 is not even"]
  });
});
