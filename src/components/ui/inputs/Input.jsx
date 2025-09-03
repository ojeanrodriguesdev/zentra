import { forwardRef } from 'react';

export default forwardRef(function Input({
  className = '',
  type = 'text',
  disabled = false,
  error = false,
  label,
  placeholder,
  helperText,
  errorMessage,
  ...props
}, ref) {
  const baseClasses = 'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50';
  
  const errorClasses = error ? 'border-destructive focus-visible:ring-destructive' : '';
  
  const classes = `${baseClasses} ${errorClasses} ${className}`;

  return (
    <div className="space-y-2">
      {label && (
        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          {label}
        </label>
      )}
      <input
        ref={ref}
        type={type}
        className={classes}
        disabled={disabled}
        placeholder={placeholder}
        {...props}
      />
      {(helperText || errorMessage) && (
        <p className={`text-sm ${error ? 'text-destructive' : 'text-muted-foreground'}`}>
          {error ? errorMessage : helperText}
        </p>
      )}
    </div>
  );
});
