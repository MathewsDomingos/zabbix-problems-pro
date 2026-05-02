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

export const LAYOUT_DEFAULTS: Record<string, Partial<PanelOptions>> = {
  list: {
    showSeverityBadge: true,
    showHostName: true,
    showTimestamp: true,
    showDescription: true,
    showTags: true,
    showEventId: false,
    showSuppressed: false,
    showStatus: false,
    showAck: false,
    showAge: false,
    showOperationalData: false,
    showTableHostGroups: false,
    showDatasourceName: false,
  },
  macro: {
    showSeverityBadge: true,
    showHostName: true,
    showTimestamp: true,
    showDescription: false,
    showTags: false,
    showEventId: false,
    showSuppressed: false,
    showStatus: false,
    showAck: false,
    showAge: false,
    showOperationalData: false,
    showTableHostGroups: false,
    showDatasourceName: false,
  },
  table: {
    showSeverityBadge: true,
    showHostName: true,
    showTimestamp: true,
    showDescription: false,
    showTags: false,
    showEventId: false,
    showSuppressed: false,
    showStatus: true,
    showAck: true,
    showAge: true,
    showOperationalData: false,
    showTableHostGroups: false,
    showDatasourceName: false,
  },
};

export const DEFAULT_OPTIONS: PanelOptions = {
  // Style
  showScrollbar: true,
  showPagination: true,

  // Zabbix Problems View
  layout: 'list',
  sortBy: 'lastChange',
  fontSize: 100,
  pageSize: 10,
  highlightBackground: false,
  highlightStyle: 'solid',
  highlightIntensity: 15,
  highlightDirection: 90,

  // Colors
  timestampColor: '#4a6178',
  severityColors: {
    0: { label: 'Not classified', color: '#6b7280', show: true },
    1: { label: 'Information',    color: '#3b82f6', show: true },
    2: { label: 'Warning',        color: '#eab308', show: true },
    3: { label: 'Average',        color: '#f97316', show: true },
    4: { label: 'High',           color: '#ef4444', show: true },
    5: { label: 'Disaster',       color: '#dc2626', show: true },
  },

  // Card Fields — mirrors LAYOUT_DEFAULTS.list (layout padrão)
  showSeverityBadge: true,
  showHostName: true,
  showTimestamp: true,
  showDescription: true,
  showTags: true,
  showEventId: false,
  showSuppressed: false,
  showStatus: false,
  showAck: false,
  showAge: false,
  showOperationalData: false,
  showTableHostGroups: false,
  showDatasourceName: false,

  hideTableHeader: false,

  // Details Fields
  showTriggerExpression: true,
  showComment: true,
  showMonitoredItems: true,
  showDetailTags: true,
  showHostGroups: true,
  showZabbixLink: true,
  zabbixBaseUrl: '',
};
