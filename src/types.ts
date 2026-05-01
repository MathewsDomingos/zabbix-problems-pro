export interface ZabbixTag {
  tag: string;
  value: string;
}

export interface ZabbixItem {
  key: string;
  name: string;
  lastvalue: string;
}

export interface ZabbixProblem {
  eventid: string;
  triggerid: string;
  description: string;
  host: string;
  severity: number;
  time: Date;
  acknowledged: boolean;
  suppressed: boolean;
  comments: string;
  expression: string;
  tags: ZabbixTag[];
  groups: string[];
  items: ZabbixItem[];
}

export interface SeverityColorConfig {
  label: string;
  color: string;
  show: boolean;
}

export interface PanelOptions {
  // Section 0 — Style
  showScrollbar: boolean;
  showPagination: boolean;

  // Section 1 — Zabbix Problems View
  layout: 'list' | 'macro';
  sortBy: 'lastChange' | 'severity' | 'default';
  fontSize: number;
  pageSize: number;
  highlightBackground: boolean;

  // Section 2 — Colors
  severityColors: Record<number, SeverityColorConfig>;

  // Section 3 — Card Fields
  showSeverityBadge: boolean;
  showHostName: boolean;
  showTimestamp: boolean;
  showDescription: boolean;
  showTags: boolean;
  showEventId: boolean;
  showSuppressed: boolean;

  // Section 4 — Details Fields
  showTriggerExpression: boolean;
  showComment: boolean;
  showMonitoredItems: boolean;
  showDetailTags: boolean;
  showHostGroups: boolean;
  showZabbixLink: boolean;
  zabbixBaseUrl: string;

  // Dummy field for the reset button editor (no runtime value)
  resetOptions?: unknown;
}
