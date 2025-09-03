'use client';

import { useState, useEffect } from 'react';

export default function SidebarClock() {
  const [time, setTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      setTime(`${hours}:${minutes}`);
    };

    // Atualizar imediatamente
    updateTime();

    // Atualizar a cada minuto
    const interval = setInterval(updateTime, 60000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="px-6 py-4">
      <div className="text-center">
        <div className="text-2xl font-bold text-slate-800 dark:text-white font-mono tracking-wider">
          {time}
        </div>
        <div className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide mt-1">
          {new Date().toLocaleDateString('pt-BR', { 
            weekday: 'short', 
            day: '2-digit', 
            month: 'short' 
          })}
        </div>
      </div>
    </div>
  );
}
