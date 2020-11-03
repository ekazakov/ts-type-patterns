import React, {ComponentProps, ComponentPropsWithoutRef, ComponentPropsWithRef, forwardRef, useRef} from 'react';

////////////////////////////////////////////////////////////////
// Wrapping/Mirroring a HTML Element
////////////////////////////////////////////////////////////////

/***
 * You CAN use  ComponentProps, but you may prefer to be explicit about whether or not
 * the component's refs are forwarded, which is what we have chosen to demonstrate.
 * The tradeoff is slightly more intimidating terminology.
 *
 * Will get runtime error for function component and  ref prop if use ComponentProps without forwardRef
 */

interface ButtonProps extends ComponentPropsWithoutRef<'button'> {
    customProp?: boolean;
}

const Button = ({children, customProp, ...restProps}: ButtonProps) => {
    console.log('customProp:', customProp);
    return <button {...restProps}>{children}</button>;
};

interface ButtonProps2 extends ComponentPropsWithoutRef<'button'> {
    customProp?: boolean;
}

const Button2 = forwardRef<HTMLButtonElement, ButtonProps2>(({children, customProp, ...restProps}, ref) => {
    console.log('customProp:', customProp);
    return (
        <button ref={ref} {...restProps}>
            {children}
        </button>
    );
});

interface ButtonProps3 extends ComponentPropsWithoutRef<typeof Button2> {}

const Button3 = ({...other}: ButtonProps3) => {
    const ref = useRef<HTMLButtonElement>(null!);
    return <Button2 ref={ref} {...other} />;
};

function App() {
    const ref = useRef<HTMLButtonElement>(null!);
    return (
        <>
            {/* @ts-ignore */}
            <Button type='foo'>text 1</Button>
            {/* @ts-ignore */}
            <Button href='//' type='button'>
                text 2
            </Button>
            <Button type='button'>text 3</Button>
            <Button2 type='button' ref={ref}>
                text 3
            </Button2>
            {/* @ts-ignore */}
            <Button3 type='button' ref={ref}>
                text 3
            </Button3>
        </>
    );
}
