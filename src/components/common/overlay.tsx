import React, { ReactNode } from 'react';
import { Button } from '../ui/button';
import { XIcon } from 'lucide-react';

interface OverlayProps {
  children: ReactNode;
  onClose: () => void;
}

const Overlay: React.FC<OverlayProps> = ({ children, onClose }) => {
  return (
    <div
      className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]'
      onClick={onClose}
    >
      <div
        className='w-full max-w-[400px] bg-background p-4 rounded shadow-lg relative max-h-full overflow-y-auto overflow-x-hidden'
        onClick={(e) => e.stopPropagation()}
      >
        <Button
          variant='destructive'
          className='rounded-full inline-block aspect-square h-8 w-8 p-2 absolute top-0 right-0'
          onClick={onClose}
        >
          <XIcon />
        </Button>
        {children}
      </div>
    </div>
  );
};

export default Overlay;
