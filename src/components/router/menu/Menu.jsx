import { forwardRef, useState } from 'react';

export const Menu = forwardRef(function Menu({
  className = '',
  children,
  trigger,
  align = 'start',
  side = 'bottom',
  ...props
}, ref) {
  const [isOpen, setIsOpen] = useState(false);

  const alignmentClasses = {
    start: 'left-0',
    center: 'left-1/2 transform -translate-x-1/2',
    end: 'right-0'
  };

  const sideClasses = {
    top: 'bottom-full mb-2',
    bottom: 'top-full mt-2',
    left: 'right-full mr-2',
    right: 'left-full ml-2'
  };

  return (
    <div className="relative inline-block text-left" ref={ref} {...props}>
      <div onClick={() => setIsOpen(!isOpen)}>
        {trigger}
      </div>
      
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div
            className={`absolute z-20 ${sideClasses[side]} ${alignmentClasses[align]} min-w-56 rounded-md border bg-popover p-1 text-popover-foreground shadow-lg ${className}`}
          >
            {children}
          </div>
        </>
      )}
    </div>
  );
});

export const MenuItem = forwardRef(function MenuItem({
  className = '',
  children,
  onClick,
  disabled = false,
  ...props
}, ref) {
  return (
    <div
      ref={ref}
      className={`relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground ${disabled ? 'pointer-events-none opacity-50' : 'cursor-pointer'} ${className}`}
      onClick={disabled ? undefined : onClick}
      {...props}
    >
      {children}
    </div>
  );
});

export const MenuSeparator = forwardRef(function MenuSeparator({
  className = '',
  ...props
}, ref) {
  return (
    <div
      ref={ref}
      className={`-mx-1 my-1 h-px bg-muted ${className}`}
      {...props}
    />
  );
});
