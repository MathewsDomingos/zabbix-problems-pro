import React from 'react';
import { css, cx } from '@emotion/css';
import { useStyles2 } from '@grafana/ui';
import { ZabbixProblem, PanelOptions } from '../../types';
import { getSeverityColors } from '../../utils/severityUtils';
import { buildZabbixEventLink } from '../../utils/linkBuilder';

interface Props {
  problem: ZabbixProblem;
  isOpen: boolean;
  options: PanelOptions;
}

const getStyles = () => ({
  details: css`
    overflow: hidden;
    max-height: 0;
    opacity: 0;
    transition: max-height 0.45s cubic-bezier(0.34, 1.56, 0.64, 1),
                opacity 0.3s ease;
    background: #0d131c;
    border-top: 0 solid transparent;
  `,
  detailsOpen: css`
    max-height: 900px;
    opacity: 1;
    border-top: 1px solid #1a2535;
  `,
  inner: css`
    padding: 22px 20px 22px 24px;
    position: relative;
    &::before {
      content: '';
      position: absolute;
      left: 37px;
      top: 32px;
      bottom: 32px;
      width: 1px;
      background: #1a2535;
    }
  `,
  section: css`
    display: flex;
    gap: 16px;
    margin-bottom: 20px;
    position: relative;
    &:last-child {
      margin-bottom: 0;
    }
  `,
  dot: css`
    width: 10px;
    height: 10px;
    border-radius: 50%;
    flex-shrink: 0;
    margin-top: 2px;
    border: 2px solid;
    background: #0d131c;
    position: relative;
    z-index: 1;
  `,
  sectionBody: css`
    flex: 1;
    min-width: 0;
  `,
  label: css`
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.9px;
    text-transform: uppercase;
    color: #3a5168;
    margin-bottom: 7px;
  `,
  expr: css`
    font-family: 'JetBrains Mono', 'Roboto Mono', monospace;
    font-size: 11px;
    color: #5a8090;
    background: #0a1018;
    border: 1px solid #1a2535;
    border-radius: 6px;
    padding: 10px 13px;
    line-height: 1.65;
    word-break: break-all;
  `,
  comment: css`
    font-size: 12.5px;
    color: #7090a0;
    line-height: 1.65;
    background: #0a1018;
    border: 1px solid #1a2535;
    border-left: 3px solid #1e3550;
    border-radius: 0 6px 6px 0;
    padding: 9px 13px;
  `,
  itemsList: css`
    display: flex;
    flex-direction: column;
    gap: 6px;
  `,
  itemRow: css`
    background: #0a1018;
    border: 1px solid #1a2535;
    border-radius: 6px;
    padding: 9px 13px;
    display: flex;
    align-items: center;
    gap: 10px;
  `,
  itemInfo: css`
    flex: 1;
    min-width: 0;
  `,
  itemKey: css`
    font-family: 'JetBrains Mono', 'Roboto Mono', monospace;
    font-size: 11px;
    color: #4a7090;
  `,
  itemName: css`
    font-size: 11.5px;
    color: #567890;
    margin-top: 2px;
  `,
  itemValue: css`
    font-family: 'JetBrains Mono', 'Roboto Mono', monospace;
    font-size: 12px;
    font-weight: 500;
    padding: 3px 10px;
    border-radius: 4px;
    background: #0f2030;
    color: #5fa0c8;
    border: 1px solid #1e3550;
    white-space: nowrap;
    flex-shrink: 0;
  `,
  tagsGrid: css`
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
  `,
  detailTag: css`
    font-family: 'JetBrains Mono', 'Roboto Mono', monospace;
    font-size: 11px;
    padding: 3px 10px;
    border-radius: 4px;
    background: #0a1018;
    border: 1px solid #1a2535;
  `,
  tagKey: css`
    color: #3a5168;
  `,
  tagSep: css`
    color: #1e2d3d;
  `,
  tagVal: css`
    color: #6090a8;
  `,
  groupsRow: css`
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
  `,
  groupChip: css`
    font-size: 11.5px;
    padding: 3px 10px;
    border-radius: 4px;
    background: #0a1018;
    color: #567090;
    border: 1px solid #1a2535;
  `,
  link: css`
    display: inline-flex;
    align-items: center;
    gap: 7px;
    font-family: 'JetBrains Mono', 'Roboto Mono', monospace;
    font-size: 11px;
    color: #4a7fa5;
    text-decoration: none;
    background: #0a1018;
    border: 1px solid #1e3550;
    border-radius: 6px;
    padding: 6px 13px;
    transition: all 0.15s;
    &:hover {
      color: #6ea8d0;
      background: #0f2035;
      border-color: #2d6090;
    }
  `,
  linkDisaster: css`
    border-color: #3d1010;
    color: #f87171;
  `,
  linkArrow: css`
    font-size: 12px;
    opacity: 0.7;
  `,
});

export const ProblemDetails: React.FC<Props> = ({ problem, isOpen, options }) => {
  const styles = useStyles2(getStyles);
  const customColor = options.severityColors?.[problem.severity]?.color;
  const colors = getSeverityColors(problem.severity, customColor);
  const isDisaster = problem.severity === 5;
  const eventUrl = buildZabbixEventLink(options.zabbixBaseUrl ?? '', problem.triggerid, problem.eventid);

  return (
    <div className={cx(styles.details, isOpen && styles.detailsOpen)}>
      <div className={styles.inner}>

        {options.showTriggerExpression && problem.expression && (
          <div className={styles.section}>
            <div className={styles.dot} style={{ borderColor: colors.bar }} />
            <div className={styles.sectionBody}>
              <div className={styles.label}>Trigger Expression</div>
              <div className={styles.expr}>{problem.expression}</div>
            </div>
          </div>
        )}

        {options.showComment && problem.comments && (
          <div className={styles.section}>
            <div className={styles.dot} style={{ borderColor: colors.bar }} />
            <div className={styles.sectionBody}>
              <div className={styles.label}>Comment</div>
              <div className={styles.comment}>{problem.comments}</div>
            </div>
          </div>
        )}

        {options.showMonitoredItems && problem.items.length > 0 && (
          <div className={styles.section}>
            <div className={styles.dot} style={{ borderColor: colors.bar }} />
            <div className={styles.sectionBody}>
              <div className={styles.label}>Monitored Items</div>
              <div className={styles.itemsList}>
                {problem.items.map((item, idx) => (
                  <div key={idx} className={styles.itemRow}>
                    <div className={styles.itemInfo}>
                      <div className={styles.itemKey}>{item.key}</div>
                      {item.name && <div className={styles.itemName}>{item.name}</div>}
                    </div>
                    <span className={styles.itemValue}>{item.lastvalue}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {options.showDetailTags && problem.tags.length > 0 && (
          <div className={styles.section}>
            <div className={styles.dot} style={{ borderColor: colors.bar }} />
            <div className={styles.sectionBody}>
              <div className={styles.label}>Tags</div>
              <div className={styles.tagsGrid}>
                {problem.tags.map((tag, idx) => (
                  <span key={idx} className={styles.detailTag}>
                    <span className={styles.tagKey}>{tag.tag}</span>
                    {tag.value && (
                      <>
                        <span className={styles.tagSep}>:</span>
                        <span className={styles.tagVal}>{tag.value}</span>
                      </>
                    )}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {options.showHostGroups && problem.groups.length > 0 && (
          <div className={styles.section}>
            <div className={styles.dot} style={{ borderColor: colors.bar }} />
            <div className={styles.sectionBody}>
              <div className={styles.label}>Host Groups</div>
              <div className={styles.groupsRow}>
                {problem.groups.map((group, idx) => (
                  <span key={idx} className={styles.groupChip}>{group}</span>
                ))}
              </div>
            </div>
          </div>
        )}

        {options.showZabbixLink && (
          <div className={styles.section}>
            <div className={styles.dot} style={{ borderColor: colors.bar }} />
            <div className={styles.sectionBody}>
              <div className={styles.label}>Zabbix Direct Link</div>
              <a
                className={cx(styles.link, isDisaster && styles.linkDisaster)}
                href={eventUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className={styles.linkArrow}>↗</span>
                {`tr_events.php?triggerid=${problem.triggerid}&eventid=${problem.eventid}`}
              </a>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
