import { forwardRef } from 'react';

export default forwardRef(function Loading({
  className = '',
  size = 'md',
  variant = 'spinner',
  text,
  fullScreen = false,
  ...props
}, ref) {
  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
    xl: 'h-12 w-12'
  };

  const Spinner = () => (
    <svg
      className={`animate-spin ${sizes[size]}`}
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );

  const Dots = () => (
    <div className="flex space-x-1">
      <div className={`bg-current rounded-full animate-bounce ${size === 'sm' ? 'h-1 w-1' : size === 'md' ? 'h-2 w-2' : 'h-3 w-3'}`} style={{ animationDelay: '0ms' }} />
      <div className={`bg-current rounded-full animate-bounce ${size === 'sm' ? 'h-1 w-1' : size === 'md' ? 'h-2 w-2' : 'h-3 w-3'}`} style={{ animationDelay: '150ms' }} />
      <div className={`bg-current rounded-full animate-bounce ${size === 'sm' ? 'h-1 w-1' : size === 'md' ? 'h-2 w-2' : 'h-3 w-3'}`} style={{ animationDelay: '300ms' }} />
    </div>
  );

  const LoadingComponent = () => (
    <div className={`flex flex-col items-center justify-center space-y-2 ${className}`} ref={ref} {...props}>
      {variant === 'spinner' ? <Spinner /> : <Dots />}
      {text && <p className="text-sm text-muted-foreground">{text}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
        <LoadingComponent />
      </div>
    );
  }

  return <LoadingComponent />;
});
