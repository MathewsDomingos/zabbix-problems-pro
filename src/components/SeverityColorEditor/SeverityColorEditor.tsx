import React from 'react';
import { ColorPicker, Switch, useTheme2 } from '@grafana/ui';
import { StandardEditorProps } from '@grafana/data';
import { SeverityColorConfig } from '../../types';

const SEVERITY_LABELS: Record<number, string> = {
  0: 'Not classified',
  1: 'Information',
  2: 'Warning',
  3: 'Average',
  4: 'High',
  5: 'Disaster',
};

const DEFAULT_COLORS: Record<number, string> = {
  0: '#6b7280',
  1: '#3b82f6',
  2: '#eab308',
  3: '#f97316',
  4: '#ef4444',
  5: '#dc2626',
};

type SeverityColorsValue = Record<number, SeverityColorConfig>;

export const SeverityColorEditor = ({ value, onChange }: StandardEditorProps<SeverityColorsValue>) => {
  const theme = useTheme2();

  const handleColorChange = (severity: number, color: string) => {
    onChange({ ...value, [severity]: { ...value[severity], color } });
  };

  const handleShowChange = (severity: number, show: boolean) => {
    onChange({ ...value, [severity]: { ...value[severity], show } });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
      {([0, 1, 2, 3, 4, 5] as number[]).map((severity) => (
        <div
          key={severity}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '5px 0',
            borderBottom: `1px solid ${theme.colors.border.weak}`,
          }}
        >
          <span
            style={{
              flex: 1,
              fontSize: '13px',
              color: theme.colors.text.primary,
            }}
          >
            {SEVERITY_LABELS[severity]}
          </span>

          <ColorPicker
            color={value?.[severity]?.color ?? DEFAULT_COLORS[severity]}
            onChange={(color) => handleColorChange(severity, color)}
          />

          <span
            style={{
              fontSize: '12px',
              color: theme.colors.text.secondary,
              minWidth: '28px',
            }}
          >
            Show
          </span>

          <Switch
            value={value?.[severity]?.show ?? true}
            onChange={(e) => handleShowChange(severity, (e.target as HTMLInputElement).checked)}
          />
        </div>
      ))}
    </div>
  );
};
