'use client';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { useState, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';

function debounce(fn: Function, delay: number) {
  let timeoutId: NodeJS.Timeout;
  return function (...args: any) {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      fn(...args);
    }, delay);
  };
}

function SearchForm({ defaultValue }: { defaultValue?: string }) {
  const router = useRouter();
  const inputRef = useRef<any>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = useCallback(
    debounce((e: any) => {
      e.preventDefault();
      const search = e.target.search?.value?.trim?.()?.substring?.(0, 150);
      router.push(`/?search=${search}&pageIndex=1`);
      setIsSubmitting(false);
      setTimeout(() => {
        inputRef.current?.focus?.();
      }, 100);
    }, 500),
    []
  );

  const handleFormSubmit = (e: any) => {
    e.preventDefault();
    setIsSubmitting(true);
    handleSubmit(e);
  };

  return (
    <form
      onSubmit={handleFormSubmit}
      className='flex w-full max-w-lg items-center space-x-2 m-auto mb-8'
    >
      <Input
        ref={inputRef}
        placeholder={'Tìm kiếm theo tiêu đề'}
        name='search'
        max={120}
        disabled={isSubmitting}
        defaultValue={defaultValue ?? ''}
      />
      <Button type='submit' disabled={isSubmitting}>
        Tìm kiếm
      </Button>
    </form>
  );
}

export default SearchForm;
