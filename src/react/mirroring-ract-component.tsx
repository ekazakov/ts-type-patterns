import React from 'react';
// Usecase the same as for html tag, but for a React Component and you don't have access to the underlying props

const Box = (props: React.CSSProperties) => <div style={props} />;

type $ElementProps<T> = any;

const Card = (
    {title, children, ...props}: {title: string} & $ElementProps<typeof Box> // new utility, see below
) => (
    <Box {...props}>
        {title}: {children}
    </Box>
);
