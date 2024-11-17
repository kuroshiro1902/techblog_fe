import { POST_MAX_RATING_SCORE } from '@/constant/post-max-rating-score.const';
import { StarIcon } from 'lucide-react';

interface RatingsProps {
  score: number; // Điểm đánh giá trung bình
}

export const Ratings: React.FC<RatingsProps> = ({ score }) => {
  if (score === 0) {
    return (
      <p className='flex gap-4 flex-wrap items-center mb-4 text-sm'>
        <i>Bài viết chưa có lượt đánh giá nào.</i>
      </p>
    );
  }
  const fullStars = Math.floor(score); // Số sao đầy đủ
  const hasHalfStar = score - fullStars > 0; // Có cần thêm một sao lấp một phần không?
  const emptyStars = POST_MAX_RATING_SCORE - fullStars - (hasHalfStar ? 1 : 0); // Số sao trống

  return (
    <div className='flex gap-4 flex-wrap items-center mb-4'>
      <div className='flex items-center' title={`${score}/${POST_MAX_RATING_SCORE}`}>
        {/* Hiển thị sao đầy đủ */}
        {Array.from({ length: fullStars }).map((_, index) => (
          <StarIcon key={`full-${index}`} className='fill-primary stroke-primary' />
        ))}

        {/* Hiển thị sao lấp một phần */}
        {hasHalfStar && <StarIcon className='fill-primary stroke-primary opacity-50' />}

        {/* Hiển thị sao trống */}
        {Array.from({ length: emptyStars }).map((_, index) => (
          <StarIcon key={`empty-${index}`} className='fill-transparent stroke-primary' />
        ))}
      </div>
      <span>-</span>
      <span>
        {score}/{POST_MAX_RATING_SCORE}
      </span>
    </div>
  );
};
