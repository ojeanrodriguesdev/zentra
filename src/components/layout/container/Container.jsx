import { forwardRef } from 'react';

export default forwardRef(function Container({
  className = '',
  children,
  size = 'default',
  center = true,
  ...props
}, ref) {
  const sizes = {
    sm: 'max-w-screen-sm',
    md: 'max-w-screen-md',
    lg: 'max-w-screen-lg',
    xl: 'max-w-screen-xl',
    '2xl': 'max-w-screen-2xl',
    default: 'max-w-7xl',
    full: 'max-w-full'
  };

  const centerClasses = center ? 'mx-auto' : '';
  const classes = `w-full px-4 sm:px-6 lg:px-8 ${sizes[size]} ${centerClasses} ${className}`;

  return (
    <div
      ref={ref}
      className={classes}
      {...props}
    >
      {children}
    </div>
  );
});
