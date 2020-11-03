const fnObject = {
    doo: () => 1,
    bar: () => ({x: 1}),
    baz: () => true
}

type FnObject = {
    [key: string]: (...args: any[]) => any
}

type ReturnTypesUnion<T extends FnObject> = ReturnType<T[keyof T]>

type MyFnObject = ReturnTypesUnion<typeof fnObject>;
