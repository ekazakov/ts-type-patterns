import React, {ComponentPropsWithoutRef, forwardRef} from 'react';

////////////////////////////////////////////////////////////////
// Polymorphic Components with ref forwarding
////////////////////////////////////////////////////////////////

interface ButtonProps extends ComponentPropsWithoutRef<'button'> {
    href?: undefined;
}
interface AnchorProps extends ComponentPropsWithoutRef<'a'> {
    href: string; // this should actually be required for TS to properly discriminate the two
}

type PolymorphicProps = AnchorProps | ButtonProps;
interface PolymorphicButton {
    (props: ButtonProps): JSX.Element;
    (props: AnchorProps): JSX.Element;
}

const Button = (forwardRef<HTMLButtonElement | HTMLAnchorElement, PolymorphicProps>((props: PolymorphicProps, ref) => {
    if (props.href != null) {
        return <a {...props} ref={ref as React.Ref<HTMLAnchorElement>} />;
    }

    return <button {...props} ref={ref as React.Ref<HTMLButtonElement>} />;
}) as unknown) as PolymorphicButton;

// e is inferred as MouseEvent<HTMLAnchorElement>
// disabled — causes an error
// @ts-ignore
const AnchorButton = <Button href='abc' type='reset' disabled onClick={(e) => {}} />;

// e is inferred as MouseEvent<HTMLButtonElement>
// target="_blank" — causes an error
// @ts-ignore
const ButtonButton = <Button target='_blank' disabled onClick={(e) => {}} />;


