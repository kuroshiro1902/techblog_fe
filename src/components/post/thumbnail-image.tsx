import Image from 'next/image';

export type ThumbnailImgProps = {
  src: string;
  alt?: string;
};
function ThumbnailImg({ src, alt }: ThumbnailImgProps) {
  return (
    <div className='image-ctn text-center relative'>
      <div
        className='absolute inset-0 z-[-2] rounded-sm'
        style={{
          backgroundImage: `url(${src})`,
          backgroundPosition: 'center',
          filter: 'blur(10px)',
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
        }}
      ></div>
      <div
        className='absolute inset-0 z-[-1] rounded-sm'
        style={{
          backgroundColor: 'rgba(0,0,0, 0.5)',
          filter: 'blur(10px)',
          backgroundRepeat: 'no-repeat',
        }}
      ></div>
      <Image
        className='max-w-[480px] m-auto'
        src={src}
        alt={alt ?? 'Ảnh bìa'}
        width={400}
        height={400}
        quality={100}
        style={{ width: 'auto', height: 'auto' }}
      />
    </div>
  );
}

export default ThumbnailImg;
