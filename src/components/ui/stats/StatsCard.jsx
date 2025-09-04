'use client';

// import PropTypes from 'prop-types'; // Removido temporariamente
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/cards';
import { Loader2 } from 'lucide-react';

export default function StatsCard({ 
  title, 
  value, 
  loading = false, 
  error = null,
  icon: Icon,
  color = 'purple',
  subtitle,
  trend
}) {
  const colorClasses = {
    purple: 'text-purple-600 dark:text-purple-400',
    blue: 'text-blue-600 dark:text-blue-400',
    green: 'text-green-600 dark:text-green-400',
    orange: 'text-orange-500 dark:text-orange-400',
    red: 'text-red-600 dark:text-red-400'
  };

  const iconBgClasses = {
    purple: 'bg-purple-100 dark:bg-purple-900/20',
    blue: 'bg-blue-100 dark:bg-blue-900/20', 
    green: 'bg-green-100 dark:bg-green-900/20',
    orange: 'bg-orange-100 dark:bg-orange-900/20',
    red: 'bg-red-100 dark:bg-red-900/20'
  };

  const getTrendColor = (positive) => {
    return positive ? 'text-green-600' : 'text-red-600';
  };

  const getTrendIcon = (positive) => {
    return positive ? '↗' : '↘';
  };

  return (
    <Card className="relative overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
          {title}
        </CardTitle>
        {Icon && (
          <div className={`p-2 rounded-md ${iconBgClasses[color]}`}>
            <Icon className={`w-4 h-4 ${colorClasses[color]}`} />
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {/* Valor principal */}
          <div className="flex items-center space-x-2">
            {loading ? (
              <div className="flex items-center space-x-2">
                <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
                <span className="text-slate-400">Carregando...</span>
              </div>
            ) : error ? (
              <span className="text-sm text-red-500">Erro ao carregar</span>
            ) : (
              <span className={`text-3xl font-bold ${colorClasses[color]}`}>
                {typeof value === 'number' ? value.toLocaleString() : value}
              </span>
            )}
          </div>

          {/* Subtitle */}
          {subtitle && !loading && !error && (
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {subtitle}
            </p>
          )}

          {/* Trend indicator */}
          {trend && !loading && !error && (
            <div className="flex items-center space-x-1">
              <span className={`text-xs ${getTrendColor(trend.positive)}`}>
                {getTrendIcon(trend.positive)} {trend.value}
              </span>
              <span className="text-xs text-slate-500">vs mês anterior</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// PropTypes removidas temporariamente
