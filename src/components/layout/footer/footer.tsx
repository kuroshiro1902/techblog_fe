import { Input } from '@/components/ui/input';
import { Logo } from '../logo';
import { Button } from '@/components/ui/button';
import { ArrowRightCircleIcon } from 'lucide-react';

function Footer() {
  return (
    <footer className='bg-gradient-to-r from-secondary/40 via-secondary/80 to-secondary/40'>
      <div className='w-full max-w-screen-lg py-4 m-auto '>
        <div className='flex justify-start p-2'>
          <Logo className='text-[32px]' iconSize={32} />
        </div>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6'>
          <div role='contentinfo' className='p-2'>
            <p>
              Nơi kết nối các lập trình viên, chia sẻ kiến thức, ý tưởng, và cùng nhau phát
              triển. Khám phá, học hỏi, và đóng góp ngay hôm nay!
            </p>
            <br />
            <h4>Address</h4>
            <p>Hà Nội, Việt Nam</p>
          </div>
          <div role='contentinfo' className='p-2 flex md:justify-center'>
            <div>
              <h4>Thể loại</h4>
              <p className='mt-2'>
                <a
                  className='hover:text-primary hover:underline'
                  target='_blank'
                  href='/post?categoryId=1'
                >
                  Frontend
                </a>
              </p>
              <p className='mt-2'>
                <a
                  className='hover:text-primary hover:underline'
                  target='_blank'
                  href='/post?categoryId=2'
                >
                  Backend
                </a>
              </p>
              <p className='mt-2'>
                <a
                  className='hover:text-primary hover:underline'
                  target='_blank'
                  href='/post?categoryId=3'
                >
                  Nodejs
                </a>
              </p>
            </div>
          </div>
          <div role='contentinfo' className='p-2'>
            <h4>Liên hệ với chúng tôi</h4>
            <br />
            <label className='block mb-4'>
              Họ tên
              <Input placeholder='Họ tên' />
            </label>
            <label className='block mb-4'>
              Email
              <Input placeholder='Email' />
            </label>
            <div className='flex justify-end'>
              <Button>
                Gửi <ArrowRightCircleIcon />
              </Button>
            </div>
          </div>
        </div>
        <div className='my-4 border' />

        <p>
          © 2024 Created by{' '}
          <a
            className='text-primary hover:underline'
            target='_blank'
            href='https://github.com/kuroshiro1902'
          >
            @kuroshiro1902
          </a>
        </p>
      </div>
    </footer>
  );
}

export default Footer;
