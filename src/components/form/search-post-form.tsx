'use client';

import { useRouter } from 'next/navigation';
import queryString from 'query-string';
import { Input } from '@/components/ui/input';
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { SearchIcon } from 'lucide-react';
import { MultiSelect } from '../ui/multi-select';
import { useCategoryStore } from '@/stores/category.store';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { useForm } from 'react-hook-form';

export interface ISearchPostParams {
  categoryId?: number[] | number;
  search?: string;
  // pageIndex?: number;
  orderBy?: string;
}

function debounce(fn: (...args: any[]) => void, delay: number) {
  let timeoutId: NodeJS.Timeout;
  return function (...args: any[]) {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };

  // return (...args: any[]) => fn(...args);
}

const orderBys = [
  { label: 'Mới nhất (mặc định)', value: 'createdAt-desc' },
  { label: 'Cũ nhất', value: 'createdAt-asc' },
  { label: 'Lượt xem nhiều nhất', value: 'views-desc' },
  { label: 'Lượt vote cao nhất (chưa hỗ trợ)', value: 'score-desc', disabled: true },
];
function SearchPostForm({
  defaultValue,
}: {
  defaultValue: ISearchPostParams;
  disabled?: boolean;
}) {
  const {
    categoryId: defaultCategoryIds = [],
    orderBy: defaultOrderBy = '',
    // pageIndex: defaultPageIndex = 1,
    search: defaultSearch = '',
  } = defaultValue;
  const router = useRouter();
  const categories = useCategoryStore((state) => state.categories);
  const fetchCategories = useCategoryStore((state) => state.fetchCategories);

  const form = useForm<ISearchPostParams>({
    defaultValues: {
      categoryId: defaultCategoryIds,
      search: defaultSearch,
      orderBy: defaultOrderBy,
      // pageIndex: defaultPageIndex,
    },
  });

  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch categories when the component mounts
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Debounced form submission
  const handleSubmit = debounce(() => {
    const values = form.getValues();
    const query = queryString.stringify(
      { ...values, pageIndex: 1 },
      {
        skipNull: true,
        skipEmptyString: true,
      }
    );

    router.push(`/post?${query}`);
    setIsSubmitting(false);

    setTimeout(() => inputRef.current?.focus(), 100);
  }, 1000);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    handleSubmit();
  };

  return (
    <form onSubmit={onSubmit} className='flex flex-col gap-2 w-full max-w-screen-md m-auto'>
      {/* Search Input */}
      <div className='flex w-full items-center gap-2'>
        <Input
          ref={inputRef}
          placeholder='Tìm kiếm theo tiêu đề'
          name='search'
          max={120}
          disabled={isSubmitting}
          defaultValue={defaultSearch}
          onChange={(e) => {
            form.setValue('search', e.target.value.trim());
          }}
        />
      </div>

      {/* Filters */}
      <div className='flex w-full justify-between items-end gap-2'>
        <div className='flex flex-1 items-center gap-4'>
          {/* Category Filter */}
          <div>
            <small>Chủ đề:</small>
            <MultiSelect
              className='max-w-[520px]'
              placeholder='Chọn chủ đề'
              maxCount={1}
              defaultValue={
                Array.isArray(defaultCategoryIds)
                  ? defaultCategoryIds.map((cid) => '' + cid)
                  : ['' + defaultCategoryIds]
              }
              options={categories.map(({ id, name }) => ({
                label: name,
                value: '' + id,
              }))}
              onValueChange={(categoryIds) =>
                form.setValue(
                  'categoryId',
                  categoryIds.map((cid) => +cid).filter((cid) => !isNaN(cid))
                )
              }
            />
          </div>
          {/* Order By Filter */}
          <div>
            <small>Sắp xếp:</small>
            <Select
              name='orderBy'
              defaultValue={defaultOrderBy}
              onValueChange={(value) => {
                form.setValue('orderBy', value);
              }}
            >
              <SelectTrigger className='w-[180px]'>
                <SelectValue placeholder='Sắp xếp theo' />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {orderBys.map((o, i) => (
                    <SelectItem key={i} value={o.value} disabled={o.disabled}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
        <Button type='submit' disabled={isSubmitting}>
          <SearchIcon />
        </Button>
      </div>
    </form>
  );
}

export default SearchPostForm;
