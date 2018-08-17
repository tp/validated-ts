export type NonEmptyArray<T> = [T, ...T[]];

export type Validated<T, E> =
  | {
      valid: true;
      value: T;
    }
  | {
      valid: false;
      errors: NonEmptyArray<E>;
    };

export function map<A, B, E>(
  f: (a: A) => B
): (v: Validated<A, E>) => Validated<B, E> {
  return v => {
    if (v.valid) {
      return { valid: true, value: f(v.value) };
    } else {
      return v;
    }
  };
}

export function zip2<A, B, E>(
  a: Validated<A, E>,
  b: Validated<B, E>
): Validated<[A, B], E> {
  if (a.valid && b.valid) {
    return { valid: true, value: [a.value, b.value] };
  } else if (!a.valid && b.valid) {
    return a;
  } else if (a.valid && !b.valid) {
    return b;
  } else if (!a.valid && !b.valid) {
    // `errors` currently requires type hint (TypeScript 3.0.1)
    return {
      valid: false,
      errors: [...a.errors, ...b.errors] as NonEmptyArray<E>
    };
  } else {
    throw new Error(`Unreachable case`);
  }
}

export function zip2With<A, B, C, E>(f: (a: A, b: B) => C): (a: Validated<A, E>, b: Validated<B, E>) => Validated<C, E> {
    return (vA, vB) => {
        return map<[A, B], C, E>(([a, b]) => f(a, b ))(zip2(vA, vB))
    }
}
