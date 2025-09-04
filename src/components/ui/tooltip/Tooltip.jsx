'use client';

import { useState, useRef, useEffect } from 'react';

export default function Tooltip({ 
  children, 
  content, 
  delay = 1000, 
  position = 'top',
  className = '' 
}) {
  const [isVisible, setIsVisible] = useState(false);
  const [timeoutId, setTimeoutId] = useState(null);
  const tooltipRef = useRef(null);

  const handleMouseEnter = () => {
    const id = setTimeout(() => {
      setIsVisible(true);
    }, delay);
    setTimeoutId(id);
  };

  const handleMouseLeave = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      setTimeoutId(null);
    }
    setIsVisible(false);
  };

  useEffect(() => {
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [timeoutId]);

  const getPositionClasses = () => {
    switch (position) {
      case 'top':
        return '-top-2 left-1/2 transform -translate-x-1/2 -translate-y-full';
      case 'bottom':
        return '-bottom-2 left-1/2 transform -translate-x-1/2 translate-y-full';
      case 'left':
        return 'top-1/2 -left-2 transform -translate-x-full -translate-y-1/2';
      case 'right':
        return 'top-1/2 -right-2 transform translate-x-full -translate-y-1/2';
      default:
        return '-top-2 left-1/2 transform -translate-x-1/2 -translate-y-full';
    }
  };

  const getArrowClasses = () => {
    switch (position) {
      case 'top':
        return 'top-full left-1/2 transform -translate-x-1/2 border-t-slate-800 border-l-transparent border-r-transparent border-b-transparent';
      case 'bottom':
        return 'bottom-full left-1/2 transform -translate-x-1/2 border-b-slate-800 border-l-transparent border-r-transparent border-t-transparent';
      case 'left':
        return 'left-full top-1/2 transform -translate-y-1/2 border-l-slate-800 border-t-transparent border-b-transparent border-r-transparent';
      case 'right':
        return 'right-full top-1/2 transform -translate-y-1/2 border-r-slate-800 border-t-transparent border-b-transparent border-l-transparent';
      default:
        return 'top-full left-1/2 transform -translate-x-1/2 border-t-slate-800 border-l-transparent border-r-transparent border-b-transparent';
    }
  };

  return (
    <div 
      className={`relative inline-block ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      
      {isVisible && (
        <div
          ref={tooltipRef}
          className={`absolute z-50 px-2 py-1 text-xs text-white bg-slate-800 dark:bg-slate-700 rounded shadow-lg whitespace-nowrap pointer-events-none animate-in fade-in-0 zoom-in-95 duration-200 ${getPositionClasses()}`}
        >
          {content}
          <div 
            className={`absolute w-0 h-0 border-2 ${getArrowClasses()}`}
          />
        </div>
      )}
    </div>
  );
}
