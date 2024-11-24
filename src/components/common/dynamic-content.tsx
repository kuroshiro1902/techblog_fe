import { forwardRef, HTMLAttributes } from 'react';

interface DynamicContentProps extends HTMLAttributes<HTMLDivElement> {
  content?: string;
}

const DynamicContent = forwardRef<HTMLDivElement, DynamicContentProps>(
  ({ content = '', className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`dynamic-content ql-editor ${className || ''}`}
        dangerouslySetInnerHTML={{ __html: content }}
        {...props}
      ></div>
    );
  }
);

DynamicContent.displayName = 'DynamicContent';

export default DynamicContent;
