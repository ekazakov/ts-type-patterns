// The same as XOR

// PickOne<{ a: string, b: string }, "a"> ==> { a: string; b?: never };
type PickOne<T, K extends keyof T> = Pick<T, K> & {[P in keyof Omit<T, K>]?: never};

type M = {m: number; n: number; o: number};

type N = PickOne<M, 'm'> | PickOne<M, 'n'> | PickOne<M, 'o'>;

// OK
const n1: N = {m: 42};
const n2: N = {n: 42};
const n3: N = {o: 42};

// Type '{ o: number; x: number; }' is not assignable to type 'N'.
//  Object literal may only specify known properties, and 'x' does not exist in type 'N'.
// @ts-expect-error
const n4: N = {o: 42, x: 42};

// @ts-expect-error
const n5: N = {m: 42, n: 42};
