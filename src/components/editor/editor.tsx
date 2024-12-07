'use client';
import hljs from 'highlight.js';
import dynamic from 'next/dynamic';
import { memo, RefObject, useEffect, useRef } from 'react';
import 'react-quill-new/dist/quill.snow.css';
import './style.scss';
import ReactQuill from 'react-quill-new';
import { CldUploadWidget } from 'next-cloudinary';
import 'highlight.js/styles/github.min.css';
import javascript from 'highlight.js/lib/languages/javascript';

const QuillEditor = dynamic(
  async () => {
    const { default: RQ } = await import('react-quill-new');

    const Component = ({
      forwardedRef,
      ...props
    }: { forwardedRef: RefObject<ReactQuill> } & ReactQuill.ReactQuillProps) => (
      <RQ ref={forwardedRef} {...props} />
    );

    Component.displayName = 'ReactQuillComponent';
    return Component;
  },
  { ssr: false }
);

interface EditorProps extends ReactQuill.ReactQuillProps {
  enableImage?: boolean;
  className?: string;
}

const Editor = memo(
  ({
    value,
    onChange,
    placeholder = 'Nội dung...',
    enableImage = false,
    modules: customModules,
    formats: customFormats,
    className = '',
    ...props
  }: EditorProps) => {
    useEffect(() => {
      hljs.registerLanguage('javascript', javascript);
      hljs.highlightAll(); // Force highlight after registering
    }, []);
    const ref = useRef<ReactQuill>(null);
    const uploadImgButtonRef = useRef<HTMLButtonElement>(null);

    const handleChange = (content: string, d: any, s: any, e: any) => {
      const editor = ref.current?.getEditor();
      const hasText = editor?.getText().trim().length !== 0;
      if (!hasText) {
        onChange?.('', d, s, e);
        return;
      }
      onChange?.(content, d, s, e);
    };

    const defaultModules = {
      toolbar: {
        container: [
          ['bold', 'italic', 'underline'], // Inline styles
          ['code-block'], // Add code block button
          ['link', ...(enableImage ? ['image'] : [])], // Add image button if enabled
          ['clean'], // Remove formatting button
        ],
        handlers: enableImage
          ? {
              image: function (open: boolean) {
                open && uploadImgButtonRef?.current?.click();
              },
            }
          : undefined,
      },
      clipboard: {
        matchVisual: false,
      },
      syntax: { hljs },
    };

    const defaultFormats = [
      'bold',
      'italic',
      'underline',
      'code-block', // Add code block format
      'link',
      ...(enableImage ? ['image'] : []),
    ];

    return (
      <div spellCheck={false} className={'editor ' + className}>
        {enableImage && (
          <CldUploadWidget
            uploadPreset='techblog_upload_preset'
            config={{
              cloud: {
                cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
                apiKey: process.env.NEXT_PUBLIC_CLOUD_API_KEY,
                apiSecret: process.env.NEXT_PUBLIC_CLOUD_API_SECRET,
              },
            }}
            options={{
              maxFiles: 1,
              maxFileSize: 500 * 1024,
              uploadPreset: 'techblog_upload_preset',
              folder: 'techblog_images',
              resourceType: 'image',
            }}
            onSuccess={({ info }) => {
              const quill = ref.current?.getEditor();
              const range = quill?.getSelection();
              if (range) {
                if (typeof info === 'string') {
                  quill?.insertEmbed(range.index, 'image', info);
                } else if (typeof info !== 'undefined') {
                  quill?.insertEmbed(range.index, 'image', info.secure_url);
                } else {
                  alert('Lỗi gán ảnh vào bài viết, vui lòng thử lại.');
                }
              }
            }}
          >
            {({ open }) => (
              <button
                type='button'
                hidden
                ref={uploadImgButtonRef}
                onClick={() => open()}
              ></button>
            )}
          </CldUploadWidget>
        )}
        <QuillEditor
          forwardedRef={ref}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          modules={customModules || defaultModules}
          formats={customFormats || defaultFormats}
          {...props}
        />
      </div>
    );
  },
  (prevProps, nextProps) => prevProps.value === nextProps.value
);

Editor.displayName = 'Editor';

export default Editor;
