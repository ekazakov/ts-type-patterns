/**
 *  XOR type for mutual exclusive unions
 *  */

type Without<T, U> = {[P in Exclude<keyof T, keyof U>]?: never};

// Creates mutual exclusive union
type XOR<T, U> = T | U extends object ? (Without<T, U> & U) | (Without<U, T> & T) : T | U;

// TODO: Extract Union back
type XorToUnion<T> = T extends XOR<infer A, infer B> ? (A | B) : never;


type MyObjX = {x: number; z: number};
type MyObjY = {y: number; z: number};


type T3 = XOR<XOR<{x: number}, {y: number}>, {z: number}>;
type MyObj = XOR<MyObjX, MyObjY>;

let value: T3 = {x: 1};
value = {y: 1};
value = {z: 1};
// @ts-expect-error
value = {m: 1};

let value2: MyObj = {x: 1, z: 1};
value2 = {y: 1, z: 1};
// @ts-expect-error
value2 = {x: 1, y: 1, z: 1};

// Redefine RenderProps via XOR instead of Union operator
// type RenderProps = XOR<
//   { children: (api: API) => ReactNode },
//   { render: (api: API) => ReactNode }
// >

// works with literals too
let stringOrNumber: XOR<string, number>;
stringOrNumber = 14;
stringOrNumber = 'foo';

let primitiveOrObject: XOR<string, {is: string; name: string}>;

primitiveOrObject = 'foo';
primitiveOrObject = {is: 'NameOnly', name: 'Foo'};


// type guard example
function foo(f: MyObjX) {}
function bar(b: MyObjY) {}

function test(p: MyObj) {
    const rest = {...p};
    if ('x' in rest && rest.x !== undefined) {
        foo(rest);
    } else {
        bar(rest); // (2)
    }
}

// TODO: and https://github.com/Microsoft/TypeScript/issues/14094#issuecomment-487760818
