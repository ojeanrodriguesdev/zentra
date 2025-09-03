export default function SidebarSection({ 
  title, 
  children, 
  className = '' 
}) {
  return (
    <div className={`py-2 ${className}`}>
      {title && (
        <div className="px-6 pb-2">
          <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            {title}
          </h3>
        </div>
      )}
      <div className="space-y-1">
        {children}
      </div>
    </div>
  );
}
