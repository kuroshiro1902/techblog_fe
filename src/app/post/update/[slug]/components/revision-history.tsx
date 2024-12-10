'use client';

import { TPostRevision } from '@/models/post-revision.model';
import { PostService } from '@/services/post/post.service';
import { useEffect, useState } from 'react';
import { useToast } from '@/components/hooks/use-toast';
import { getApiErrorMessage } from '@/utils/getApiErrorMessage.util';
import { Button } from '@/components/ui/button';
import dayjs from 'dayjs';
import { SlidePanel } from '@/components/common/slide-panel';
import DynamicContent from '@/components/common/dynamic-content';
import { Badge } from '@/components/ui/badge';

interface RevisionHistoryProps {
  postId: number;
  onSelectRevision: (revision: TPostRevision) => Promise<void>;
}

export default function RevisionHistory({ postId, onSelectRevision }: RevisionHistoryProps) {
  const [revisions, setRevisions] = useState<TPostRevision[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRevision, setSelectedRevision] = useState<TPostRevision | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { toast } = useToast();

  const loadRevisions = async () => {
    try {
      const response = await PostService.getPostRevisions({
        postId,
        pageSize: 10,
        pageIndex: 1,
      });
      setRevisions(response.data);
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: getApiErrorMessage(error),
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRevisions();
  }, [postId]);

  const handleRestore = async (revision: TPostRevision) => {
    if (
      window.confirm(
        'Bạn có muốn khôi phục phiên bản này không? Các thay đổi hiện tại sẽ không được lưu.'
      )
    ) {
      await onSelectRevision(revision).catch((e) => {});
    }
  };

  if (loading) return <div>Đang tải lịch sử chỉnh sửa...</div>;
  if (!revisions.length) return <div>Chưa có lịch sử chỉnh sửa</div>;

  return (
    <>
      <div className='mt-8'>
        <h3 className='text-lg font-semibold'>Lịch sử chỉnh sửa</h3>
        <hr className='mt-2 mb-4' />
        <div className='space-y-4'>
          {revisions.map((revision) => (
            <div
              key={revision.id}
              className='flex items-center justify-between p-4 border rounded-lg bg-primary/5'
            >
              <div>
                {revision.isActive && (
                  <p>
                    <Badge variant='secondary' className='text-xs'>
                      Phiên bản hiện tại
                    </Badge>
                  </p>
                )}
                <div className='flex items-center gap-2'>
                  <h4 className='font-medium'>{revision.title}</h4>
                </div>
                <p className='text-sm text-gray-500'>
                  Chỉnh sửa lúc: {dayjs(revision.createdAt).format('DD/MM/YYYY HH:mm:ss')}
                </p>
              </div>
              <div className='flex gap-2'>
                <Button
                  variant='outline'
                  onClick={() => {
                    setSelectedRevision(revision);
                    setIsSidebarOpen(true);
                  }}
                >
                  Xem chi tiết
                </Button>
                <Button
                  variant='secondary'
                  onClick={() => handleRestore(revision)}
                  disabled={revision.isActive}
                >
                  Khôi phục
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedRevision && (
        <SlidePanel
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          title='Chi tiết phiên bản'
          footer={
            <Button
              className='w-full'
              onClick={() => {
                handleRestore(selectedRevision);
                setIsSidebarOpen(false);
              }}
              disabled={selectedRevision.isActive}
            >
              Khôi phục phiên bản này
            </Button>
          }
        >
          <div className='space-y-6'>
            <h4 className='font-semibold mb-2'>{selectedRevision.title}</h4>
            <p className='text-sm'>
              Thời gian tạo phiên bản:{' '}
              {dayjs(selectedRevision.createdAt).format('DD/MM/YYYY HH:mm:ss')}
            </p>
            <div>
              <DynamicContent content={selectedRevision.content} />
            </div>
          </div>
        </SlidePanel>
      )}
    </>
  );
}
