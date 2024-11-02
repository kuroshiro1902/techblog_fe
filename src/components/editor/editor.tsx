'use client';
import dynamic from 'next/dynamic';
import { memo, RefObject, useEffect, useRef, useState } from 'react';
// import ReactQuill from 'react-quill';
import 'react-quill-new/dist/quill.snow.css';
import './style.scss';
import ReactQuill from 'react-quill-new';
import { CldUploadWidget } from 'next-cloudinary';

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
  {
    ssr: false,
  }
);
QuillEditor.displayName = 'ReactQuillComponent';

const Editor = memo(
  () => {
    console.log('rerender Editor.');

    const ref = useRef<ReactQuill>(null);
    const uploadImgButtonRef = useRef<HTMLButtonElement>(null);
    const modules: ReactQuill.ReactQuillProps['modules'] = {
      toolbar: {
        container: [
          [{ header: [1, 2, 3, false] }],
          ['bold', 'italic', 'underline', 'strike'],
          [{ list: 'ordered' }, { list: 'bullet' }],
          ['link', 'image'],
          [{ align: [] }],
          ['clean'],
        ],
        handlers: {
          image: function (open: boolean) {
            open && uploadImgButtonRef?.current?.click();
          },
        },
      },
      clipboard: {
        matchVisual: false,
      },
    };

    const formats = [
      'header',
      'bold',
      'italic',
      'underline',
      'strike',
      'list',
      // 'bullet',
      'link',
      'image',
      'align', // Add align to formats
    ];

    return (
      <div id='editor' spellCheck={false}>
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
          {({ open }) => {
            return (
              <button
                type='button'
                hidden
                ref={uploadImgButtonRef}
                onClick={() => open()}
              ></button>
            );
          }}
        </CldUploadWidget>
        <QuillEditor
          placeholder='Nội dung bài viết...'
          forwardedRef={ref}
          id='quill'
          modules={modules}
          formats={formats}
          defaultValue={''}
        />
      </div>
    );
  },
  () => true
);
Editor.displayName = 'Editor';

export default Editor;
