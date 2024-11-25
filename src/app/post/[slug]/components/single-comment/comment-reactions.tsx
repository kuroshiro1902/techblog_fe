import { Button } from '@/components/ui/button';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { TComment } from '@/models/comment.model';
import { useState } from 'react';
import { PostService } from '@/services/post/post.service';
import { useLoadingStore } from '@/stores/loading.store';
import { toast } from '@/components/hooks/use-toast';
import { ERatingScore } from '@/constant/rating-score.const';
import { cn } from '@/lib/utils';
import useAuthStore from '@/stores/auth.store';

interface CommentReactionsProps {
  comment: TComment;
  onReplyClick: () => void;
}

export function CommentReactions({ comment, onReplyClick }: CommentReactionsProps) {
  const user = useAuthStore((s) => s.user);
  const [reactions, setReactions] = useState({
    likes: comment.rating?.likes ?? 0,
    dislikes: comment.rating?.dislikes ?? 0,
    ownRating: comment?.ownRating ?? ERatingScore.NONE,
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleReaction = async (score: ERatingScore) => {
    if (isLoading) return;

    const newScore = reactions.ownRating === score ? ERatingScore.NONE : score;

    try {
      setIsLoading(true);
      const response = await PostService.ratingComment(comment.id, newScore);
      setReactions({
        likes: response.rating?.likes ?? 0,
        dislikes: response.rating?.dislikes ?? 0,
        ownRating: response?.ownRating ?? ERatingScore.NONE,
      });
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: 'Không thể thực hiện thao tác này. Vui lòng thử lại sau.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div data-role='reaction' className='flex items-center gap-2'>
      <Button
        variant='outline'
        title='Thích'
        disabled={isLoading || !user}
        className={cn(
          'flex items-center gap-1',
          reactions.ownRating === ERatingScore.LIKE && 'bg-blue-50 text-blue-600'
        )}
        onClick={() => handleReaction(ERatingScore.LIKE)}
      >
        <ThumbsUp style={{ width: 14, height: 14 }} />
        {reactions.likes > 0 && <span className='text-xs'>{reactions.likes}</span>}
      </Button>
      <Button
        variant='outline'
        title='Không thích'
        disabled={isLoading || !user}
        className={cn(
          'flex items-center gap-1',
          reactions.ownRating === ERatingScore.DISLIKE && 'bg-red-50 text-red-600'
        )}
        onClick={() => handleReaction(ERatingScore.DISLIKE)}
      >
        <ThumbsDown style={{ width: 14, height: 14 }} />
        {reactions.dislikes > 0 && <span className='text-xs'>{reactions.dislikes}</span>}
      </Button>
      <Button
        className='!leading-[1.35]'
        variant='ghost'
        disabled={isLoading || !user}
        onClick={onReplyClick}
      >
        Trả lời
      </Button>
    </div>
  );
}
