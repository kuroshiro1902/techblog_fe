'use client';

import { PostService } from '@/services/post/post.service';
import Link from 'next/link';
import { useEffect, useState } from 'react';

function RelativeKeywords({ search }: { search?: string }) {
  const [keywords, setKeywords] = useState<string[]>([]);
  useEffect(() => {
    if (search) {
      PostService.getRelativeKeywords(search)
        .then((v) => setKeywords(v))
        .catch((e) => {});
    }
    return () => setKeywords([]);
  }, [search]);
  return (
    <div className='w-full'>
      {keywords.length > 0 && (
        <span className='text-sm '>
          <i>
            Những từ khóa liên quan:{' '}
            {keywords.map((w, i) => (
              <span key={i}>
                <a
                  className='text-primary/80 hover:text-primary hover:underline'
                  href={`/post?search=${encodeURIComponent(w)}`}
                >
                  {w}
                </a>
                ,{' '}
              </span>
            ))}
            ...
          </i>
        </span>
      )}
    </div>
  );
}

export default RelativeKeywords;
