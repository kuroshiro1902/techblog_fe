'use client';

import { useState } from 'react';
import { StarIcon } from 'lucide-react';

const maxScore = 5;

interface props {
  postId: number;
}

function Rating({ postId }: props) {
  const [selected, setSelected] = useState<number>(0); // State khi chọn

  return (
    <div>
      <p>Đánh giá bài viết này</p>
      <form className='flex'>
        {Array.from({ length: maxScore }).map((_, i) => (
          <label
            title={`${i + 1} sao`}
            key={i}
            onClick={() => setSelected(i + 1)} // Chọn star khi click
            className='cursor-pointer p-1'
          >
            <input
              className='hidden'
              type='radio'
              name='score'
              value={i + 1}
              checked={selected === i + 1} // Đánh dấu input khi được chọn
              readOnly
            />
            <StarIcon
              className='transition-all stroke-primary'
              fill={i < selected ? 'hsl(var(--primary))' : 'transparent'}
            />
          </label>
        ))}
      </form>
    </div>
  );
}

export default Rating;
