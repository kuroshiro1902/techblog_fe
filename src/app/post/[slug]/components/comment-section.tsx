'use client';

import { TComment, TCreateComment } from '@/models/comment.model';
import { PostService } from '@/services/post/post.service';
import { useCallback, useEffect, useState } from 'react';
import CreateComment from './create-comment';
import SingleComment from './single-comment';

interface CommentProps {
  postId: number;
}

// interface CommentState {
//   [key: number]: {
//     data: TComment;
//     replies: {
//       data: TComment[];
//       hasMore: boolean;
//       isLoading: boolean;
//       page: number;
//     };
//   };
// }

export default function CommentSection({ postId }: CommentProps) {
  const [comments, setComments] = useState<TComment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [content, setContent] = useState('');

  const loadComments = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await PostService.loadCommentOfPost(postId).catch((err) => []);
      console.log({ data });
      setComments(data);
    } catch (error) {
      console.error('Failed to load comments:', error);
    } finally {
      setIsLoading(false);
    }
  }, [postId]);

  // const loadReplies = useCallback(
  //   async (commentId: number) => {
  //     const comment = comments[commentId];
  //     if (!comment || comment.replies.isLoading || !comment.replies.hasMore) return;

  //     try {
  //       setComments((prev) => ({
  //         ...prev,
  //         [commentId]: {
  //           ...prev[commentId],
  //           replies: {
  //             ...prev[commentId].replies,
  //             isLoading: true,
  //           },
  //         },
  //       }));

  //       const replies = await PostService.loadReplies(commentId, comment.replies.page);

  //       setComments((prev) => ({
  //         ...prev,
  //         [commentId]: {
  //           ...prev[commentId],
  //           replies: {
  //             data: [...prev[commentId].replies.data, ...replies],
  //             hasMore: replies.length === 10, // Assuming page size is 10
  //             isLoading: false,
  //             page: prev[commentId].replies.page + 1,
  //           },
  //         },
  //       }));
  //     } catch (error) {
  //       console.error('Failed to load replies:', error);
  //       setComments((prev) => ({
  //         ...prev,
  //         [commentId]: {
  //           ...prev[commentId],
  //           replies: {
  //             ...prev[commentId].replies,
  //             isLoading: false,
  //           },
  //         },
  //       }));
  //     }
  //   },
  //   [comments]
  // );

  useEffect(() => {
    loadComments();
  }, [loadComments]);

  return (
    <div>
      <span className='font-bold text-lg'>Bình luận</span>
      <hr className='mb-2' />
      <CreateComment
        postId={postId}
        onSuccess={(comment) => {
          setComments((prev) => [comment, ...prev]);
        }}
      />
      <div className='mt-2'>
        {comments.map((comment) => (
          <SingleComment key={comment.id} comment={comment} />
        ))}
      </div>
    </div>
  );
}
