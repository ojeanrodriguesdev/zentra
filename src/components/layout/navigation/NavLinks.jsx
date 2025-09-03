import clsx from 'clsx';

export default function NavLinks({ 
  className = '',
  variant = 'default',
  isAuthenticated = false,
  ...props 
}) {
  const navClasses = clsx(
    'hidden md:flex items-center space-x-1',
    className
  );

  const linkClasses = clsx(
    'px-3 py-2 rounded-md text-sm font-medium transition-all duration-200',
    'text-slate-600 dark:text-slate-300',
    'hover:text-slate-900 dark:hover:text-white',
    'hover:bg-slate-100 dark:hover:bg-slate-800'
  );

  // Links diferentes baseados no estado de autenticação
  const publicLinks = [
    { href: '#features', label: 'Funcionalidades' },
    { href: '#pricing', label: 'Preços' },
    { href: '#about', label: 'Sobre' },
  ];

  const authenticatedLinks = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/clients', label: 'Clientes' },
    { href: '/tasks', label: 'Tarefas' },
    { href: '/calendar', label: 'Agenda' },
  ];

  const links = isAuthenticated ? authenticatedLinks : publicLinks;

  if (variant === 'mobile') {
    return (
      <nav className="flex flex-col space-y-2 md:hidden">
        {links.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className={clsx(
              linkClasses,
              'block text-center py-3'
            )}
          >
            {link.label}
          </a>
        ))}
      </nav>
    );
  }

  return (
    <nav className={navClasses} {...props}>
      {links.map((link) => (
        <a
          key={link.href}
          href={link.href}
          className={linkClasses}
        >
          {link.label}
        </a>
      ))}
    </nav>
  );
}
