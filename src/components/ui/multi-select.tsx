// src/components/ui/multi-select.tsx
'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { CheckIcon, XCircle, ChevronDown, XIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';

/**
 * Variants for the multi-select component to handle different styles.
 * Uses class-variance-authority (cva) to define different styles based on "variant" prop.
 */
const multiSelectVariants = cva(
  'm-1 transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300',
  {
    variants: {
      variant: {
        default: 'border-foreground/10 text-foreground bg-card hover:bg-card/80',
        secondary:
          'border-foreground/10 bg-secondary text-secondary-foreground hover:bg-secondary/80',
        destructive:
          'border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80',
        inverted: 'inverted',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

interface MultiSelectProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'>,
    VariantProps<typeof multiSelectVariants> {
  options: {
    label: string;
    value: string;
    icon?: React.ComponentType<{ className?: string }>;
  }[];
  value?: string[];
  defaultValue?: string[];
  onChange?: (value: string[]) => void;
  placeholder?: string;
  maxCount?: number;
}

export const MultiSelect = React.forwardRef<HTMLDivElement, MultiSelectProps>(
  (
    {
      options,
      value,
      defaultValue = [],
      onChange,
      variant,
      placeholder = 'Select options',
      maxCount = 3,
      className,
      ...props
    },
    ref
  ) => {
    const [selectedValues, setSelectedValues] = React.useState<string[]>(value || defaultValue);
    const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);

    // Update internal state when external value changes
    React.useEffect(() => {
      if (value !== undefined) {
        setSelectedValues(value);
      }
    }, [value]);

    const handleSelect = React.useCallback(
      (optionValue: string) => {
        const newSelectedValues = selectedValues.includes(optionValue)
          ? selectedValues.filter((value) => value !== optionValue)
          : [...selectedValues, optionValue];

        setSelectedValues(newSelectedValues);
        onChange?.(newSelectedValues);
      },
      [selectedValues, onChange]
    );

    const handleClear = React.useCallback(() => {
      setSelectedValues([]);
      onChange?.([]);
    }, [onChange]);

    const handleRemove = React.useCallback(
      (valueToRemove: string) => {
        const newSelectedValues = selectedValues.filter((value) => value !== valueToRemove);
        setSelectedValues(newSelectedValues);
        onChange?.(newSelectedValues);
      },
      [selectedValues, onChange]
    );

    return (
      <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
        <PopoverTrigger asChild>
          <div
            ref={ref}
            className={cn(
              'flex w-full min-h-10 rounded-md border bg-background px-3 py-2 text-sm',
              className
            )}
            {...props}
          >
            <div className='flex flex-wrap gap-1'>
              {selectedValues.length === 0 && (
                <span className='text-muted-foreground'>{placeholder}</span>
              )}
              {selectedValues.slice(0, maxCount).map((selectedValue) => {
                const option = options.find((opt) => opt.value === selectedValue);
                return (
                  <Badge
                    key={selectedValue}
                    variant={variant === 'inverted' ? 'outline' : variant}
                    className='flex items-center gap-1'
                  >
                    {option?.icon && <option.icon className='h-3 w-3' />}
                    {option?.label}
                    <XCircle
                      className='h-3 w-3 cursor-pointer'
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemove(selectedValue);
                      }}
                    />
                  </Badge>
                );
              })}
              {selectedValues.length > maxCount && (
                <Badge variant='secondary'>+{selectedValues.length - maxCount}</Badge>
              )}
            </div>
            <div className='ml-auto flex items-center gap-2'>
              {selectedValues.length > 0 && (
                <XIcon
                  className='h-4 w-4 cursor-pointer text-muted-foreground'
                  onClick={(e) => {
                    e.stopPropagation();
                    handleClear();
                  }}
                />
              )}
              <ChevronDown className='h-4 w-4 text-muted-foreground' />
            </div>
          </div>
        </PopoverTrigger>
        <PopoverContent className='w-[200px] p-0' align='start'>
          <Command>
            <CommandInput placeholder='Search...' />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup>
                {options.map((option) => {
                  const isSelected = selectedValues.includes(option.value);
                  return (
                    <CommandItem key={option.value} onSelect={() => handleSelect(option.value)}>
                      <div
                        className={cn(
                          'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border',
                          isSelected ? 'bg-primary text-primary-foreground' : 'opacity-50'
                        )}
                      >
                        {isSelected && <CheckIcon className='h-4 w-4' />}
                      </div>
                      {option.icon && <option.icon className='mr-2 h-4 w-4' />}
                      {option.label}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
              {selectedValues.length > 0 && (
                <>
                  <CommandSeparator />
                  <CommandGroup>
                    <CommandItem onSelect={handleClear} className='justify-center text-red-500'>
                      Clear all
                    </CommandItem>
                  </CommandGroup>
                </>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    );
  }
);

MultiSelect.displayName = 'MultiSelect';
