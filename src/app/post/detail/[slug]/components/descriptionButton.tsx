'use client';
import { Button } from '@/components/ui/button';
import { PostService } from '@/services/post/post.service';
import { InfoIcon } from 'lucide-react';
import { useState } from 'react';

function DescriptionButton({ postId }: { postId: number }) {
  const [isOpen, setIsOpen] = useState(false);
  const [description, setDescription] = useState<string | null>(null);
  const getDescription = () => {
    if (!description) {
      PostService.getDescription(postId).then((desc) => setDescription(desc));
    }
  };
  return (
    <div className='p-4'>
      <Button
        className='flex items-center w-full justify-start rounded-none text-foreground'
        variant='secondary'
        onClick={() => {
          if (!isOpen) {
            getDescription();
          }
          setIsOpen((open) => {
            if (open) {
            }
            return !open;
          });
        }}
      >
        <span>{isOpen ? 'Ẩn' : 'Hiện'} bản tóm tắt</span>
        <span title='Bản tóm tắt của bài viết được tạo bởi AI.'>
          <InfoIcon className='inline' />
        </span>
      </Button>
      {isOpen && (
        <div className='border p-2 bg-foreground/5'>
          {description ? (
            <div>
              <p className='text-justify'>{description}</p>
              <p className='text-sm text-right pt-2'>
                <i>Made by AI ✨</i>
              </p>
            </div>
          ) : (
            'Loading...'
          )}
        </div>
      )}
    </div>
  );
}

export default DescriptionButton;
