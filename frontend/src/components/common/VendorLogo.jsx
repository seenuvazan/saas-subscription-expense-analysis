import React from 'react';
import { lookupVendor } from '../../utils/vendors';

/**
 * VendorLogo — shows a brand icon inside a rounded tile.
 *
 * Props:
 *   name: string   — vendor name (looked up in registry, case-insensitive)
 *   size: 'xs' | 'sm' | 'md' | 'lg' | 'xl'  (default 'md')
 *   className: string — extra Tailwind classes
 */
const SIZES = {
  xs: { tile: 'w-6 h-6 rounded-lg text-[10px]', icon: 12 },
  sm: { tile: 'w-8 h-8 rounded-xl text-xs', icon: 14 },
  md: { tile: 'w-10 h-10 rounded-xl text-sm', icon: 18 },
  lg: { tile: 'w-14 h-14 rounded-2xl text-lg', icon: 26 },
  xl: { tile: 'w-20 h-20 rounded-3xl text-2xl', icon: 38 },
};

const VendorLogo = ({ name, size = 'md', className = '' }) => {
  const entry = lookupVendor(name);
  const { tile, icon: iconSize } = SIZES[size] || SIZES.md;

  // brand colour — fallback to a slate when unknown
  const color = entry?.brandColor || '#6366f1';

  // Derive a very light tint for the tile background (10% opacity)
  const bgStyle = {
    backgroundColor: color + '18', // 18 = ~10% hex opacity
    border: `1.5px solid ${color}28`,
  };

  const iconStyle = { color };

  if (entry?.icon) {
    const IconComponent = entry.icon;
    return (
      <div
        className={`flex items-center justify-center flex-shrink-0 ${tile} ${className}`}
        style={bgStyle}
        title={entry.label || name}
      >
        <IconComponent style={{ ...iconStyle, width: iconSize, height: iconSize }} />
      </div>
    );
  }

  // Letter-tile fallback
  const letter = (entry?.label || name || '?').charAt(0).toUpperCase();
  return (
    <div
      className={`flex items-center justify-center flex-shrink-0 font-bold ${tile} ${className}`}
      style={{ ...bgStyle, color }}
      title={entry?.label || name}
    >
      {letter}
    </div>
  );
};

export default VendorLogo;
