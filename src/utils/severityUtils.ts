import { SEVERITY_COLORS, SEVERITY_LABELS, SeverityColors } from '../constants';
import { SeverityColorConfig } from '../types';

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
