import { CSSProperties } from 'react';
import { SEVERITY_COLORS, SEVERITY_LABELS, SeverityColors } from '../constants';
import { SeverityColorConfig, PanelOptions } from '../types';

export function getSeverityLabel(
  severity: number,
  severityColors?: Record<number, SeverityColorConfig>
): string {
  const custom = severityColors?.[severity]?.label;
  if (custom) {
    return custom;
  }
  return SEVERITY_LABELS[severity] ?? 'Not classified';
}

export function getSeverityColors(severity: number, customColor?: string): SeverityColors {
  const base = SEVERITY_COLORS[severity] ?? SEVERITY_COLORS[0];
  if (customColor) {
    return { ...base, bar: customColor };
  }
  return base;
}

export function getHighlightStyle(severityColor: string, options: PanelOptions): CSSProperties {
  if (!options.highlightBackground) {
    return {};
  }

  const intensity = options.highlightIntensity ?? 15;
  const alpha = intensity / 100;

  const hex = severityColor.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  const rgba = `rgba(${r}, ${g}, ${b}, ${alpha})`;

  if (options.highlightStyle === 'gradient') {
    const deg = options.highlightDirection ?? 90;
    const alphaEnd = alpha * 0.4;
    return {
      background: `linear-gradient(${deg}deg, rgba(${r}, ${g}, ${b}, ${alpha}) 0%, rgba(${r}, ${g}, ${b}, ${alphaEnd}) 100%)`,
      borderLeft: 'none',
    };
  }

  return {
    background: rgba,
    borderLeft: 'none',
  };
}
