import { TComment } from '@/models/comment.model';
import { TFilterResponse } from '@/models/filter-response.model';
import { PostService } from '@/services/post/post.service';
import { useState, useCallback } from 'react';

interface UseCommentsParams {
  postId?: number;
  parentCommentId?: number;
  pageSize?: number;
}

export function usePaginatedComments({ 
  postId, 
  parentCommentId, 
  pageSize = 5 
}: UseCommentsParams) {
  const [comments, setComments] = useState<TFilterResponse<TComment>>({
    data: [],
    pageInfo: {
      pageIndex: 0,
      pageSize,
      totalPage: 1,
      hasNextPage: true,
    },
  });
  const [isLoading, setIsLoading] = useState(false);

  const fetchComments = useCallback(async (pageIndex: number) => {
    if (!postId && !parentCommentId) return;

    try {
      setIsLoading(true);

      const response = await PostService.loadComments({
        postId,
        parentCommentId,
        pageIndex,
        pageSize,
      });

      setComments(prev => ({
        data: pageIndex === 0 ? response.data : [...prev.data, ...response.data],
        pageInfo: response.pageInfo,
      }));
    } catch (error) {
      console.error('Failed to load comments:', error);
    } finally {
      setIsLoading(false);
    }
  }, [postId, parentCommentId, pageSize]);

  const addComment = useCallback((newComment: TComment) => {
    setComments(prev => ({
      data: [newComment, ...prev.data],
      pageInfo: { ...prev.pageInfo },
    }));
  }, []);

  const handleLoadMore = useCallback(() => {
    if (!isLoading && comments.pageInfo.hasNextPage) {
      const nextPageIndex = comments.pageInfo.pageIndex + 1;
      fetchComments(nextPageIndex);
    }
  }, [isLoading, comments.pageInfo, fetchComments]);

  return {
    comments,
    isLoading,
    loadComments: fetchComments,
    handleLoadMore,
    addComment,
  };
}
