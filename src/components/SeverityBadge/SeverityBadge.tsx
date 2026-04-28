import React from 'react';
import { css } from '@emotion/css';
import { useStyles2 } from '@grafana/ui';
import { SeverityColorConfig } from '../../types';
import { getSeverityColors, getSeverityLabel } from '../../utils/severityUtils';

interface Props {
  severity: number;
  customColor?: string;
  severityColors?: Record<number, SeverityColorConfig>;
}

const getStyles = () => ({
  badge: css`
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.5px;
    padding: 2px 9px;
    border-radius: 100px;
    text-transform: uppercase;
    flex-shrink: 0;
    display: inline-block;
    line-height: 1.6;
  `,
});

export const SeverityBadge: React.FC<Props> = ({ severity, customColor, severityColors }) => {
  const styles = useStyles2(getStyles);
  const colors = getSeverityColors(severity, customColor);

  return (
    <span
      className={styles.badge}
      style={{ background: colors.badgeBg, color: colors.badgeText }}
    >
      {getSeverityLabel(severity, severityColors)}
    </span>
  );
};
