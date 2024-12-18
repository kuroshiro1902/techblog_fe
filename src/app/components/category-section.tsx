'use client';

import { useCategoryStore } from '@/stores/category.store';
import Image from 'next/image';
import { useEffect } from 'react';

function CategorySection() {
  const { categories, fetchCategories, clear } = useCategoryStore();
  useEffect(() => {
    fetchCategories();
    return () => clear();
  }, []);
  return (
    <div className='w-full py-4 my-2'>
      <h1 className='mb-2 text-linear-primary'>Chủ đề nổi bật</h1>
      <div className='mx-auto border rounded flex flex-col md:flex-row justify-center flex-wrap overflow-hidden relative z-[1] gap-6 p-4'>
        <div className='py-2'>
          <h4>Chủ đề nổi bật</h4>
          <p className='text-wrap max-w-52'>
            Những chủ đề có nhiều bài viết nhất, được cộng đồng quan tâm.
          </p>
        </div>
        <div className='flex-1 flex flex-wrap gap-2 justify-between items-center'>
          {categories.slice(0, 3).map((c, i) => (
            <a key={i + 1} href={`/post?categoryId=${c.id}`} className='text-center'>
              <div className='relative overflow-hidden rounded-lg'>
                <Image
                  src={`/img${i + 1}.webp`}
                  alt={`slide${i + 1}`}
                  height={240}
                  width={240}
                  objectFit='cover' // Giữ tỷ lệ ảnh
                  quality={95}
                  className='transition-transform duration-300 ease-in-out hover:scale-110'
                />
              </div>
              {c.name}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CategorySection;
