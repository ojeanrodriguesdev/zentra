import clsx from 'clsx';

export default function Logo({ 
  className = '', 
  variant = 'default',
  onClick,
  ...props 
}) {
  const logoClasses = clsx(
    'flex items-center space-x-2 group cursor-pointer transition-all duration-200',
    {
      'hover:scale-105': variant === 'default',
      'text-lg font-heading font-bold': variant === 'default',
      'text-xl font-heading font-extrabold': variant === 'large',
    },
    className
  );

  const textClasses = clsx(
    'font-heading font-bold tracking-tight transition-colors duration-200',
    {
      'text-xl text-purple-600 dark:text-purple-400 group-hover:text-purple-700 dark:group-hover:text-purple-300': variant === 'default',
      'text-2xl text-purple-600 dark:text-purple-400 group-hover:text-purple-700 dark:group-hover:text-purple-300': variant === 'large',
    }
  );

  const iconClasses = clsx(
    'rounded-lg flex items-center justify-center transition-all duration-200',
    {
      'w-8 h-8 bg-purple-600 dark:bg-purple-500 group-hover:bg-purple-700 dark:group-hover:bg-purple-400': variant === 'default',
      'w-10 h-10 bg-purple-600 dark:bg-purple-500 group-hover:bg-purple-700 dark:group-hover:bg-purple-400': variant === 'large',
    }
  );

  return (
    <div 
      className={logoClasses}
      onClick={onClick}
      {...props}
    >
      <div className={iconClasses}>
        <span className="text-white font-black text-sm">Z</span>
      </div>
      <span className={textClasses}>
        Zentra
      </span>
    </div>
  );
}
