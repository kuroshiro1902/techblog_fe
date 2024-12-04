'use client';

import { useForm } from 'react-hook-form';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { PostService } from '@/services/post/post.service';
import { Button } from '@/components/ui/button';
import { useCallback, useEffect, useState } from 'react';
import { TRating } from '@/models/rating.model';
import { formatDate } from 'date-fns';
import { useToast } from '@/components/hooks/use-toast';
import useAuthStore from '@/stores/auth.store';
import Link from 'next/link';
import { ROUTE } from '@/routes/routes';
import { ERatingScore } from '@/constant/rating-score.const';

interface RatingProps {
  postId: number;
}

function Rating({ postId }: RatingProps) {
  const { toast } = useToast();
  const user = useAuthStore((s) => s.user);
  const [ownRating, setOwnRating] = useState<TRating>({
    score: undefined,
    updatedAt: undefined,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchOwnRating = useCallback(async () => {
    try {
      const rating = await PostService.getOwnRatingOfPost(postId);
      setOwnRating(rating);
    } catch (err) {
      console.error('Failed to fetch own rating:', err);
    }
  }, [postId]);

  useEffect(() => {
    fetchOwnRating();
  }, [fetchOwnRating]);

  const handleRating = async (score: ERatingScore) => {
    if (isSubmitting) return;
    try {
      setIsSubmitting(true);
      const newScore = ownRating.score === score ? ERatingScore.NONE : score;
      const { score: updatedScore, updatedAt } = await PostService.rating(postId, newScore);

      setOwnRating({ score: updatedScore, updatedAt: updatedAt.toString() });
      toast({
        variant: 'success',
        title: updatedScore === ERatingScore.NONE ? 'Đã hủy đánh giá.' : 'Đánh giá thành công!',
      });
    } catch (error) {
      console.error('Lỗi khi đánh giá bài viết:', error);
      toast({ variant: 'destructive', title: 'Đã xảy ra lỗi, vui lòng thử lại!' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderRatingButtons = () => (
    <>
      <RatingButton
        score={ERatingScore.LIKE}
        currentScore={ownRating.score}
        onClick={() => handleRating(ERatingScore.LIKE)}
        disabled={isSubmitting}
        icon={<ThumbsUp className='mr-1' />}
        label='Thích'
      />
      <RatingButton
        score={ERatingScore.DISLIKE}
        currentScore={ownRating.score}
        onClick={() => handleRating(ERatingScore.DISLIKE)}
        disabled={isSubmitting}
        icon={<ThumbsDown className='mr-1' />}
        label='Không thích'
      />
    </>
  );
  return (
    <div className='border-t-secondary border-t-2 py-2 my-2'>
      <p className='text-xs mb-2'>
        <RatingStatus ownRating={ownRating} />
      </p>
      <div className='flex items-center gap-4'>
        {user ? (
          renderRatingButtons()
        ) : (
          <Link href={ROUTE.LOGIN}>
            <Button className='px-0' type='button' variant='link'>
              Vui lòng đăng nhập để đánh giá bài viết
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}

interface RatingButtonProps {
  score?: ERatingScore | number | null;
  currentScore?: ERatingScore | number | null;
  onClick: () => void;
  disabled: boolean;
  icon: React.ReactNode;
  label: string;
}

const RatingStatus = ({ ownRating }: { ownRating: TRating }) => {
  if (ownRating.score === undefined) return <i>Bạn chưa đánh giá bài viết này</i>;
  if (ownRating.score === ERatingScore.NONE) return <i>Bạn chưa đánh giá bài viết này.</i>;

  const action = ownRating.score === ERatingScore.LIKE ? 'thích' : 'không thích';
  const date = ownRating.updatedAt
    ? formatDate(ownRating.updatedAt, 'HH:mm dd/MM/yyyy')
    : '<Không xác định>';

  return (
    <i>
      Bạn đã <b>{action}</b> bài viết này vào {date}.
    </i>
  );
};

const RatingButton: React.FC<RatingButtonProps> = ({
  score,
  currentScore,
  onClick,
  disabled,
  icon,
  label,
}) => (
  <Button
    variant={currentScore === score ? 'default' : 'outline'}
    className='h-8 px-2 flex items-center'
    onClick={onClick}
    disabled={disabled}
  >
    {icon}
    {label}
  </Button>
);
export default Rating;
