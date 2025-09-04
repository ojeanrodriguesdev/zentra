export default function Input({
  className = '',
  type = 'text',
  disabled = false,
  error = false,
  label,
  placeholder,
  helperText,
  errorMessage,
  ...props
}) {
  const baseClasses = 'flex h-10 w-full rounded-md border border-slate-300 dark:border-zinc-600 bg-white dark:bg-zinc-700 px-3 py-2 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 disabled:cursor-not-allowed disabled:opacity-50';
  
  const errorClasses = error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : '';
  
  const classes = `${baseClasses} ${errorClasses} ${className}`;

  return (
    <div className="space-y-2">
      {label && (
        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
          {label}
        </label>
      )}
      <input
        type={type}
        className={classes}
        disabled={disabled}
        placeholder={placeholder}
        {...props}
      />
      {(helperText || errorMessage) && (
        <p className={`text-sm ${error ? 'text-red-500' : 'text-slate-500 dark:text-slate-400'}`}>
          {error ? errorMessage : helperText}
        </p>
      )}
    </div>
  );
}
