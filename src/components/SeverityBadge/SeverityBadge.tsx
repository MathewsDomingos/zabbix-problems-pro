import React from 'react';
import { css, keyframes } from '@emotion/css';
import { useStyles2 } from '@grafana/ui';
import { SeverityColorConfig } from '../../types';
import { getSeverityColors, getSeverityLabel } from '../../utils/severityUtils';

const dotBlink = keyframes`
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.2; }
`;

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
    display: inline-flex;
    align-items: center;
    line-height: 1.6;
  `,
  dot: css`
    display: inline-block;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: currentColor;
    margin-right: 5px;
    animation: ${dotBlink} 1.5s ease-in-out infinite;
    vertical-align: middle;
    margin-bottom: 1px;
    flex-shrink: 0;
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
      {severity >= 4 && <span className={styles.dot} />}
      {getSeverityLabel(severity, severityColors)}
    </span>
  );
};
