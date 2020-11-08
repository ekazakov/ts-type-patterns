import React, {ComponentProps, ComponentPropsWithoutRef, ElementType, forwardRef, ReactNode, useRef} from 'react';

function Link(props: {to: string}) {
    return <div />;
}

////////////////////////////////////////////////////////////////
//
// Abstract Polymorphic Components
//
// https://github.com/kripod/react-polymorphic-box
//
////////////////////////////////////////////////////////////////

interface BoxOwnProps<E extends ElementType = ElementType> {
    as?: E;
}

type BoxProps<E extends ElementType> = BoxOwnProps<E> & Omit<ComponentPropsWithoutRef<E>, keyof BoxOwnProps>;

const defaultElement = 'div';
type BoxComponent = <E extends ElementType = typeof defaultElement>(props: BoxProps<E>) => JSX.Element | null;

const Box: BoxComponent = forwardRef<Element, BoxOwnProps>((props, ref) => {
    const {as: Element = defaultElement, ...other} = props;
    return <Element {...other} ref={ref} />;
});

type PolymorphicComponentProps<P, E extends ElementType> = P & BoxProps<E>;
type PolymorphicComponent<P, E> = <P, E extends ElementType = 'div'>(
    props: PolymorphicComponentProps<P, E>
) => JSX.Element | null;

// example
type HeadingOwnProps = {
    color?: string;
};

const defaultHeadingElement = 'h1';
type HeadingProps<E extends ElementType> = PolymorphicComponentProps<HeadingOwnProps, E>;
type HeadingComponent = <E extends ElementType = typeof defaultHeadingElement>(
    props: HeadingProps<E>
) => JSX.Element | null;
type HeadingComponentWithRef = <E extends ElementType = typeof defaultHeadingElement>(
    props: HeadingProps<E> & {ref?: React.Ref<Element>}
) => JSX.Element | null;


const Heading: HeadingComponent = (props) => {
    const {color, style, ...restProps} = props;
    return <Box as={defaultHeadingElement} style={{color, ...style}} {...restProps} />;
};

const HeadingWithRef: HeadingComponentWithRef = forwardRef(
    <E extends React.ElementType = typeof defaultElement>(props: HeadingProps<E>, innerRef: typeof props.ref) => {
        const {color, style, ...restProps} = props;
        return <Box as={defaultHeadingElement} style={{color, ...style}} {...restProps} ref={innerRef} />;
    }
);

function App() {
    const ref = useRef<HTMLAnchorElement>(null);
    return (
        <>
            {/* @ts-ignore ref only for anchor, not for heading */}
            <HeadingWithRef color='red' ref={ref}>
                It works!
            </HeadingWithRef>
            <HeadingWithRef as='a' color='red' href='/foo' ref={ref}>
                It works!
            </HeadingWithRef>
        </>
    );
}
const samples1 = (
    <>
        <Heading>H1</Heading>
        {/* @ts-ignore  href unsupported */}
        <Heading as='h3' color='red' href='/foo'>
            H3
        </Heading>
        <Heading as='a' color='red' href='/foo'>
            Anchor
        </Heading>
        <App />
    </>
);

// typing styled component
/***
 * ```
 * import styled from "styled-components";
 *
 * export type HeadingProps = { color?: string; };
 *
 * const defaultElement = "h2";
 *
 * export const Heading: PolymorphicComponent<
 *    HeadingProps, // Merged with props from the underlying element type
 *    typeof defaultElement // Default element type (optional, defaults to 'div')
 *  > = styled(defaultElement)<HeadingProps>`
 *    color: ${(props) => props.color};
 * `;
 * ```
 */

////////////////////////////////////////////////////////////////
// Polymorphic Components with ref forwarding
////////////////////////////////////////////////////////////////

// https://github.com/typescript-cheatsheets/react/issues/167#issuecomment-562169713
interface ButtonProps extends ComponentPropsWithoutRef<'button'> {
    href?: undefined;
}
interface AnchorProps extends ComponentPropsWithoutRef<'a'> {
    href: string; // this should actually be required for TS to properly discriminate the two
}

type PolymorphicButtonProps = AnchorProps | ButtonProps;
interface PolymorphicButton {
    (props: ButtonProps): JSX.Element;
    (props: AnchorProps): JSX.Element;
}

const Button = (forwardRef<HTMLButtonElement | HTMLAnchorElement, PolymorphicButtonProps>(
    (props: PolymorphicButtonProps, ref) => {
        if (props.href != null) {
            return <a {...props} ref={ref as React.Ref<HTMLAnchorElement>} />;
        }

        return <button {...props} ref={ref as React.Ref<HTMLButtonElement>} />;
    }
) as unknown) as PolymorphicButton;

// e is inferred as MouseEvent<HTMLAnchorElement>
// disabled — causes an error
// @ts-ignore
const AnchorButton = <Button href='abc' type='reset' disabled onClick={(e) => {}} />;

// e is inferred as MouseEvent<HTMLButtonElement>
// target="_blank" — causes an error
// @ts-ignore
const ButtonButton = <Button target='_blank' disabled onClick={(e) => {}} />;

////////////////////////////////////////////////////////////////
//
// Polymorphic Components based on render prop
//
// https://blog.andrewbran.ch/polymorphic-react-components/
//
////////////////////////////////////////////////////////////////

interface Button2InjectedProps {
    className: string;
    children: JSX.Element;
}

interface PolymorphicButton2Props {
    className?: string;
    children?: ReactNode;
    renderContainer?: (props: Button2InjectedProps) => JSX.Element;
}

const defaultRenderContainer = (props: Button2InjectedProps) => <button {...props} />;

function Button2(props: PolymorphicButton2Props) {
    const {renderContainer = defaultRenderContainer, className, children} = props;
    return renderContainer({
        className: className || '',
        children: <div>{children}</div>
    });
}

const samples2 = (
    <>
        {/*Easy defaults*/}
        <Button2 />
        {/*Renders a Link, enforces `to` prop set*/}
        <Button2 renderContainer={(props) => <Link {...props} to='/' />} />

        {/*Renders an anchor, accepts `href` prop*/}
        <Button2 renderContainer={(props) => <a {...props} href='/' />} />
        {/*Renders a button with `aria-describedby`*/}
        <Button2 renderContainer={(props) => <button {...props} aria-describedby='tooltip-1' />} />
    </>
);
