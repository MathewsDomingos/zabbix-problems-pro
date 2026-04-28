import { PanelOptions } from './types';

export interface SeverityColors {
  bar: string;
  badgeBg: string;
  badgeText: string;
}

export const SEVERITY_COLORS: Record<number, SeverityColors> = {
  0: { bar: '#6b7280', badgeBg: '#141820', badgeText: '#6b7280' },
  1: { bar: '#3b82f6', badgeBg: '#001020', badgeText: '#3b82f6' },
  2: { bar: '#eab308', badgeBg: '#1a1500', badgeText: '#eab308' },
  3: { bar: '#f97316', badgeBg: '#1e0e00', badgeText: '#f97316' },
  4: { bar: '#ef4444', badgeBg: '#200000', badgeText: '#ef4444' },
  5: { bar: '#dc2626', badgeBg: '#2a0000', badgeText: '#f87171' },
};

export const SEVERITY_LABELS: Record<number, string> = {
  0: 'Not classified',
  1: 'Information',
  2: 'Warning',
  3: 'Average',
  4: 'High',
  5: 'Disaster',
};

export const DEFAULT_OPTIONS: PanelOptions = {
  layout: 'list',
  sortBy: 'lastChange',
  fontSize: 100,
  pageSize: 10,
  highlightBackground: false,

  severityColors: {
    0: { label: 'Not classified', color: '#6b7280', show: true },
    1: { label: 'Information',    color: '#3b82f6', show: true },
    2: { label: 'Warning',        color: '#eab308', show: true },
    3: { label: 'Average',        color: '#f97316', show: true },
    4: { label: 'High',           color: '#ef4444', show: true },
    5: { label: 'Disaster',       color: '#dc2626', show: true },
  },

  showSeverityBadge: true,
  showHostName: true,
  showTimestamp: true,
  showDescription: true,
  showTags: true,
  showEventId: true,
  showSuppressed: true,

  showTriggerExpression: true,
  showComment: true,
  showMonitoredItems: true,
  showDetailTags: true,
  showHostGroups: true,
  showZabbixLink: true,
  zabbixBaseUrl: '',
};
