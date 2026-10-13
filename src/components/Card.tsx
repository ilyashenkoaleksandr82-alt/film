import React from 'react';

export type IconName = 'phone' | 'clock' | 'grid' | 'rings' | 'dollar';

const Icon: React.FC<{name: IconName; size: number; color: string}> = ({name, size, color}) => {
  const sw = Math.max(2, size * 0.075);
  const common = {fill: 'none', stroke: color, strokeWidth: sw, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const};
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      {name === 'phone' && (
        <>
          <rect x="30" y="8" width="40" height="84" rx="8" {...common} />
          <line x1="44" y1="78" x2="56" y2="78" {...common} />
        </>
      )}
      {name === 'clock' && (
        <>
          <circle cx="50" cy="50" r="40" {...common} />
          <polyline points="50,24 50,50 66,58" {...common} />
        </>
      )}
      {name === 'grid' && (
        <>
          <rect x="12" y="12" width="32" height="32" rx="5" {...common} />
          <rect x="56" y="12" width="32" height="32" rx="5" {...common} />
          <rect x="12" y="56" width="32" height="32" rx="5" {...common} />
          <rect x="56" y="56" width="32" height="32" rx="5" {...common} />
        </>
      )}
      {name === 'rings' && (
        <>
          <circle cx="35" cy="50" r="24" {...common} />
          <circle cx="65" cy="50" r="24" {...common} />
        </>
      )}
      {name === 'dollar' && (
        <>
          <circle cx="50" cy="50" r="40" {...common} />
          <text x="50" y="67" textAnchor="middle" fontSize="48" fontWeight="700" fill={color} fontFamily="Arial, sans-serif">
            $
          </text>
        </>
      )}
    </svg>
  );
};

type Props = {text: string; icon?: IconName; red?: boolean; height?: number; fontSize?: number};

/** Плашка в стиле шаблона канала: тёмная, оранжевая полоска слева, красная для «главной ошибки». */
export const Card: React.FC<Props> = ({text, icon, red = false, height = 120, fontSize = 54}) => {
  const bar = Math.round(height * 0.095);
  const iconSize = Math.round(height * 0.44);
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: Math.round(height * 0.22),
        height,
        paddingLeft: Math.round(height * 0.3),
        paddingRight: Math.round(height * 0.42),
        background: red ? '#E83E3A' : 'rgba(24,20,16,0.94)',
        borderLeft: `${bar}px solid #F6A826`,
        borderRadius: Math.round(height * 0.12),
        boxShadow: '0 14px 34px rgba(0,0,0,0.45)',
        color: '#fff',
        font: `700 ${fontSize}px Arial, "Liberation Sans", Helvetica, sans-serif`,
        whiteSpace: 'nowrap',
      }}
    >
      {icon ? <Icon name={icon} size={iconSize} color={red ? '#ffffff' : '#F5B03C'} /> : null}
      <span>{text}</span>
    </div>
  );
};
