// https://dev.to/macsikora/advanced-typescript-exercises-question-10-2n93

// Override A props with B props if exists
type Merge<A, B> = Omit<A, keyof B> & B;

type X = {a: 1; b: number};
type Y = {a: 2; b: string; c: boolean};

type Test1 = Assert<Merge<X, Y>, {a: 2; b: string; c: boolean}>; // Test should pass - means be Test1 should be true
type Test2 = Assert<Merge<{a: 'abc'; b: number}, {a: 'def'}>, {a: 'def'; b: number}>; // Test should pass - means be Test2 should be true
type Test3 = Assert<Merge<{c: 'abc'; b: number}, {a: 'def'; b: boolean}>, {c: 'abc'; a: 'def'; b: boolean}>;

type OnlyDiff<A, B> = Omit<A, keyof B> & Omit<B, keyof A>;

type Test4 = Assert<OnlyDiff<{a: 1; b: 2; c: 'a'}, {a: 1; b: number; c: boolean}>, {}>; // Test should pass - means be Test1 should be true
type Test5 = Assert<OnlyDiff<{a: 1; b: 2}, {a: 1; c: boolean}>, {b: 2; c: boolean}>; // Test should pass - means be Test1 should be true

type MergeWithOverride<A, B> = OnlyDiff<A, B> &
    {
        [key in keyof A & keyof B]: A[key] & B[key] extends never ? B[key] : A[key] & B[key];
    };

type Test6 = Assert<MergeWithOverride<{a: 1; b: 2}, {a: 1; c: boolean}>, {a:1, b: 2; c: boolean}>; // Test should pass - means be Test1 should be true
type Test7 = Assert<MergeWithOverride<{a: 1; b: 2}, {a: 2; c: boolean}>, {a:2, b: 2; c: boolean}>; // Test should pass - means be Test1 should be true

// ----------------------------------------
// utility for testing the result

type Assert<
    T1,
    T2,
    _Check1 = T1 extends T2 ? true : false,
    _Check2 = T2 extends T1 ? true : false
> = false extends _Check1 ? false : false extends _Check2 ? false : true;
