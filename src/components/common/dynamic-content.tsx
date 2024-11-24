import { HTMLAttributes } from 'react';

interface DynamicContentProps extends HTMLAttributes<HTMLDivElement> {
  content?: string;
}

export default function DynamicContent({
  content = '',
  className,
  ...props
}: DynamicContentProps) {
  return (
    <div
      className={`dynamic-content ql-editor ${className || ''}`}
      dangerouslySetInnerHTML={{ __html: content }}
      {...props}
    />
  );
}
