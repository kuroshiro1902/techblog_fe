'use client';

import * as React from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar, CalendarProps } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { DayPickerSingleProps, SelectSingleEventHandler } from 'react-day-picker';
import { vi } from 'date-fns/locale';

interface DatePickerProps extends DayPickerSingleProps {
  mode: 'single';
  value?: Date;
  placeholder?: string;
  onSelect?: SelectSingleEventHandler;
}

export function DatePicker({ value, mode, placeholder, onSelect, ...props }: DatePickerProps) {
  const [date, setDate] = React.useState(value);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={'outline'}
          className={cn(
            'w-[280px] justify-start text-left font-normal',
            !date && 'text-muted-foreground'
          )}
        >
          <CalendarIcon className='mr-2 h-4 w-4' />
          {date ? format(date, 'dd/MM/yyyy') : <span>{placeholder ?? 'Chọn ngày'}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-auto p-0 z-[9999]'>
        <Calendar
          mode={mode}
          locale={vi}
          selected={date}
          initialFocus
          captionLayout='dropdown-buttons'
          fromYear={1920}
          toYear={2024}
          {...props}
          onSelect={(date, ...rest) => {
            setDate(date);
            onSelect?.(date, ...rest);
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
