import { Control, FieldPath, FieldValues } from 'react-hook-form';
import { Editor } from '@tinymce/tinymce-react';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'; // Điều chỉnh đường dẫn này cho phù hợp
import { useRef } from 'react';
import { CldUploadWidget } from 'next-cloudinary';

interface FormEditorProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> {
  control: Control<TFieldValues>;
  name: TName;
  label?: string;
  placeholder?: string;
  required?: boolean;
}

const FormEditor = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  control,
  name,
  label,
  placeholder,
  required,
}: FormEditorProps<TFieldValues, TName>) => {
  const editorRef = useRef<any>(null); // Ref để truy cập editor khi cần
  const handleImageUpload = async (file: any) => {
    return new Promise((resolve: (val: any) => void, reject) => {
      CldUploadWidget({
        config: {
          cloud: {
            cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
            apiKey: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY!,
            apiSecret: process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET!,
          },
        },
        uploadPreset: 'techblog_img',
        onSuccess(results, widget) {
          resolve(results.info);
          widget.open();
        },
        onError(error, widget) {
          alert(error);
        },
      });
    });
  };

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {label && (
            <FormLabel>
              {label} {required && <span style={{ color: 'red' }}>*</span>}
            </FormLabel>
          )}
          <FormControl>
            <Editor
              licenseKey='gpl'
              onInit={(evt, editor) => (editorRef.current = editor)}
              tinymceScriptSrc='/tinymce/tinymce.min.js'
              initialValue={placeholder || '<p>Nhập nội dung...</p>'}
              init={{
                height: 400,
                menubar: false,
                // plugins: [
                //   'lists link image charmap print preview anchor',
                //   'code fullscreen',
                //   'table paste code help wordcount',
                // ],
                external_plugins: {
                  // print: '/tinymce/plugins/print/plugin.min.js',
                  preview: '/tinymce/plugins/preview/plugin.min.js',
                  searchreplace: '/tinymce/plugins/searchreplace/plugin.min.js',
                  directionality: '/tinymce/plugins/directionality/plugin.min.js',
                  visualchars: '/tinymce/plugins/visualchars/plugin.min.js',
                  visualblocks: '/tinymce/plugins/visualblocks/plugin.min.js',
                  autolink: '/tinymce/plugins/autolink/plugin.min.js',
                  fullscreen: '/tinymce/plugins/fullscreen/plugin.min.js',
                  media: '/tinymce/plugins/media/plugin.min.js',
                  // template: '/tinymce/plugins/template/plugin.min.js',
                  codesample: '/tinymce/plugins/codesample/plugin.min.js',
                  charmap: '/tinymce/plugins/charmap/plugin.min.js',
                  pagebreak: '/tinymce/plugins/pagebreak/plugin.min.js',
                  // hr: '/tinymce/plugins/hr/plugin.min.js',
                  anchor: '/tinymce/plugins/anchor/plugin.min.js',
                  nonbreaking: '/tinymce/plugins/nonbreaking/plugin.min.js',
                  insertdatetime: '/tinymce/plugins/insertdatetime/plugin.min.js',
                  // toc: '/tinymce/plugins/toc/plugin.min.js',
                  advlist: '/tinymce/plugins/advlist/plugin.min.js',
                  wordcount: '/tinymce/plugins/wordcount/plugin.min.js',
                  // imagetools: '/tinymce/plugins/imagetools/plugin.min.js',
                  // textpattern: '/tinymce/plugins/textpattern/plugin.min.js',
                  help: '/tinymce/plugins/help/plugin.min.js',
                },
                toolbar:
                  'undo redo | formatselect | bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help media',
                file_picker_types: 'image',
                file_picker_callback: async (callback, value, meta) => {
                  if (meta.filetype === 'image') {
                    handleImageUpload(callback);
                  }
                },
              }}
              value={field.value || ''} // Lấy giá trị từ react-hook-form
              onEditorChange={(content) => field.onChange(content)} // Cập nhật nội dung vào react-hook-form
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default FormEditor;
