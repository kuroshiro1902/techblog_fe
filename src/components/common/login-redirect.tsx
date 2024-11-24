import { ROUTE } from '@/routes/routes';
import Link from 'next/link';
import { Button } from '../ui/button';

function LoginRedirect({ children }: { children: React.ReactNode }) {
  return (
    <Link href={ROUTE.LOGIN}>
      <Button className='px-0' type='button' variant='link'>
        {children}
      </Button>
    </Link>
  );
}

export default LoginRedirect;
