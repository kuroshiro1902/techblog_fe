'use client';

import { useForm, Controller } from 'react-hook-form';
import { StarIcon } from 'lucide-react';
import { PostService } from '@/services/post/post.service';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { TRating } from '@/models/rating.model';
import { formatDate } from 'date-fns';
import { useToast } from '@/components/hooks/use-toast';
import { POST_MAX_RATING_SCORE } from '@/constant/post-max-rating-score.const';
import useAuthStore from '@/stores/auth.store';
import Link from 'next/link';
import { ROUTE } from '@/routes/routes';

interface RatingProps {
  postId: number;
}

interface RatingFormValues {
  score: number;
}

function Rating({ postId }: RatingProps) {
  const { toast } = useToast();
  const user = useAuthStore((s) => s.user);
  const [ownRating, setOwnRating] = useState<TRating>({
    score: undefined,
    updatedAt: undefined,
  });
  const {
    handleSubmit,
    control,
    reset,
    formState: { isSubmitting, isDirty },
  } = useForm<RatingFormValues>({
    defaultValues: { score: 0 },
  });

  const resetOwnRating = (rating: TRating) => {
    const score = rating.score ?? 0;
    if ((score ?? 0) > 0) {
      reset({ score });
      setOwnRating(rating);
    }
  };

  const onSubmit = async (data: RatingFormValues) => {
    try {
      const { score, updatedAt } = await PostService.rating(postId, data.score);
      toast({ variant: 'success', title: 'Đánh giá bài viết thành công' });
      resetOwnRating({ score, updatedAt: updatedAt.toString() });
    } catch (error) {
      console.error('Lỗi khi đánh giá bài viết:', error);
      alert('Đã xảy ra lỗi, vui lòng thử lại!');
    }
  };

  useEffect(() => {
    PostService.getOwnRatingOfPost(postId)
      .then((rating) => {
        resetOwnRating(rating);
      })
      .catch((err) => {});
  }, [postId, reset]);

  return (
    <div className='border-t-secondary border-t-2 py-2 my-2'>
      {ownRating.score && (
        <p className='text-xs'>
          <i>
            Bạn đã đánh giá <b>{ownRating.score}</b> sao cho bài viết này vào{' '}
            {ownRating.updatedAt
              ? formatDate(ownRating.updatedAt, 'HH:mm dd/MM/yyyy')
              : '<Không xác định>'}
            .
          </i>
        </p>
      )}
      {!ownRating.score && <p>Bạn chưa đánh giá bài viết này</p>}
      <small>Đánh giá bài viết:</small>
      <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col items-start gap-2'>
        {/* Rating Stars */}
        <fieldset disabled={isSubmitting} className='flex'>
          <Controller
            name='score'
            control={control}
            render={({ field: { value, onChange } }) => (
              <div className='flex'>
                {Array.from({ length: POST_MAX_RATING_SCORE }).map((_, i) => {
                  const score = i + 1;
                  return (
                    <label title={`${score} sao`} key={i} className='cursor-pointer p-1'>
                      <input
                        className='hidden'
                        type='radio'
                        name='score'
                        value={score}
                        readOnly
                        checked={value === score}
                        onChange={(e) => {
                          if (e.target.checked) {
                            onChange(score);
                          }
                        }}
                      />
                      <StarIcon
                        className='transition-all stroke-primary'
                        fill={i < value ? 'hsl(var(--primary))' : 'transparent'}
                      />
                    </label>
                  );
                })}
              </div>
            )}
          />
        </fieldset>

        {/* Submit Button */}
        {user ? (
          <Button
            type='submit'
            disabled={isSubmitting || !isDirty} // Disable nếu đang submit hoặc form không thay đổi
          >
            {isSubmitting ? 'Đang gửi...' : 'Gửi đánh giá'}
          </Button>
        ) : (
          <Link href={ROUTE.LOGIN}>
            <Button className='px-0' type='button' variant='link'>
              Vui lòng đăng nhập để đánh giá bài viết
            </Button>
          </Link>
        )}
      </form>
    </div>
  );
}

export default Rating;
