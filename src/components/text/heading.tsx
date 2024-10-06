import React, { forwardRef } from 'react';

interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  level?: 1 | 2 | 3 | 4 | 5 | 6; // Allow levels from 1 to 6 (h1-h6)
}

export const Heading = forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ children, className, level = 1, ...props }, ref) => {
    // Ensure the level is within 1-6
    const Tag = `h${level}` as any;

    return (
      <Tag
        ref={ref}
        className={`text-2xl font-bold ${className ?? ''}`}
        {...props} // Spread additional h1-h6 attributes
      >
        {children}
      </Tag>
    );
  }
);

Heading.displayName = 'Heading';
