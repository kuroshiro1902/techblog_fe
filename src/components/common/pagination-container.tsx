'use client';

import { useCallback, useEffect, useState } from 'react';
import { LoadingOverlay } from '../layout/loading';
import Pagination from './pagination';
import { useRouter, useSearchParams } from 'next/navigation';

const paginationClass = {
  left: 'justify-start',
  center: 'justify-center',
  right: 'justify-end',
};

export type PaginationConfig = {
  pageSize?: number;
  initialPage?: number;
  paramName?: string;
  preserveQuery?: boolean;
  scrollToTop?: boolean;
  paginationPosition?: 'center' | 'right' | 'left';
};

export type PaginatedData<T> = {
  data: T[];
  total: number;
  currentPage: number;
  pageSize: number;
  totalPages: number;
};

export type FetchDataFunction<T> = (
  page: number,
  pageSize: number
) => Promise<PaginatedData<T>>;

interface PaginationContainerProps<T> {
  // Hàm fetch data, trả về Promise với kiểu PaginatedData<T>
  fetchData: FetchDataFunction<T>;

  // Cấu hình pagination
  config?: PaginationConfig;

  // Hàm render cho mỗi item trong data
  renderItem: (item: T) => React.ReactNode;

  // Hàm render container chứa tất cả items (optional)
  renderContainer?: (items: React.ReactNode[]) => React.ReactNode;

  // Component hiển thị khi đang loading
  loadingComponent?: React.ReactNode;

  // Component hiển thị khi không có data
  emptyComponent?: React.ReactNode;

  // Custom CSS classes
  className?: string;

  // Callback khi trang thay đổi
  onPageChange?: (page: number) => void;

  // Callback khi data được load xong
  onDataLoaded?: (data: PaginatedData<T>) => void;
}

function PaginationContainer<T>({
  fetchData,
  config = {},
  renderItem,
  renderContainer,
  loadingComponent = <LoadingOverlay />,
  emptyComponent = <div>No data available</div>,
  className = '',
  onPageChange,
  onDataLoaded,
}: PaginationContainerProps<T>) {
  const {
    pageSize = 10,
    initialPage = 1,
    paramName = 'pageIndex',
    preserveQuery = true,
    scrollToTop = true,
    paginationPosition = 'center',
  } = config;

  const [paginatedData, setPaginatedData] = useState<PaginatedData<T> | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(
    async (page: number) => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await fetchData(page, pageSize);
        setPaginatedData(data);
        onDataLoaded?.(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Error loading data:', err);
      } finally {
        setIsLoading(false);
      }
    },
    [fetchData, pageSize, onDataLoaded]
  );

  // Không cần xử lý URL ở đây nữa vì Pagination component sẽ tự xử lý
  const handlePageChange = useCallback(
    (newPage: number) => {
      if (scrollToTop) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      onPageChange?.(newPage);
      loadData(newPage);
    },
    [loadData, scrollToTop, onPageChange]
  );

  // Load data lần đầu
  useEffect(() => {
    loadData(initialPage);
  }, [initialPage, loadData]);

  if (error) {
    return (
      <div className='text-red-500 p-4 rounded-md bg-red-50 border border-red-200'>
        <h3 className='font-semibold'>Error loading data</h3>
        <p>{error}</p>
      </div>
    );
  }

  if (isLoading && !paginatedData) {
    return loadingComponent;
  }

  if (!paginatedData || paginatedData.data.length === 0) {
    return emptyComponent;
  }

  const renderedItems = paginatedData.data.map(renderItem);

  return (
    <div className={className}>
      {renderContainer ? (
        renderContainer(renderedItems)
      ) : (
        <div className='space-y-4'>{renderedItems}</div>
      )}

      <div className={`mt-4 flex ${paginationClass[paginationPosition]}`}>
        <Pagination
          totalPage={paginatedData.totalPages}
          paramName={paramName}
          preserveQuery={preserveQuery}
          onPageChange={handlePageChange}
          disabled={isLoading}
        />
      </div>
    </div>
  );
}

export default PaginationContainer;
