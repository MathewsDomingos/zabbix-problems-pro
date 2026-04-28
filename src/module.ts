import { FieldConfigProperty, PanelPlugin } from '@grafana/data';
import { PanelOptions } from './types';
import { SimplePanel } from './components/SimplePanel';
import { SeverityColorEditor } from './components/SeverityColorEditor';

const defaultOptions: PanelOptions = {
  layout: 'list',
  sortBy: 'lastChange',
  fontSize: 100,
  pageSize: 10,
  highlightBackground: false,

  severityColors: {
    0: { color: '#6b7280', show: true },
    1: { color: '#3b82f6', show: true },
    2: { color: '#eab308', show: true },
    3: { color: '#f97316', show: true },
    4: { color: '#ef4444', show: true },
    5: { color: '#dc2626', show: true },
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

export const plugin = new PanelPlugin<PanelOptions>(SimplePanel)
  .useFieldConfig({
    disableStandardOptions: [
      FieldConfigProperty.Color,
      FieldConfigProperty.DisplayName,
      FieldConfigProperty.Decimals,
      FieldConfigProperty.Links,
      FieldConfigProperty.Mappings,
      FieldConfigProperty.Max,
      FieldConfigProperty.Min,
      FieldConfigProperty.NoValue,
      FieldConfigProperty.Thresholds,
      FieldConfigProperty.Unit,
    ],
  })
  .setPanelOptions((builder) => {
    return builder
      // ─── Section 1: Zabbix Problems View ───────────────────────────────
      .addSelect({
        path: 'layout',
        name: 'Layout',
        category: ['Zabbix Problems View'],
        defaultValue: defaultOptions.layout,
        settings: {
          options: [{ value: 'list', label: 'List' }],
        },
      })
      .addSelect({
        path: 'sortBy',
        name: 'Sort by',
        category: ['Zabbix Problems View'],
        defaultValue: defaultOptions.sortBy,
        settings: {
          options: [
            { value: 'lastChange', label: 'Last change' },
            { value: 'severity', label: 'Severity' },
            { value: 'default', label: 'Default' },
          ],
        },
      })
      .addSelect({
        path: 'fontSize',
        name: 'Font size',
        category: ['Zabbix Problems View'],
        defaultValue: defaultOptions.fontSize,
        settings: {
          options: [
            { value: 80, label: '80%' },
            { value: 90, label: '90%' },
            { value: 100, label: '100%' },
            { value: 110, label: '110%' },
            { value: 120, label: '120%' },
          ],
        },
      })
      .addNumberInput({
        path: 'pageSize',
        name: 'Page size',
        category: ['Zabbix Problems View'],
        defaultValue: defaultOptions.pageSize,
        settings: { min: 1, max: 500 },
      })
      .addBooleanSwitch({
        path: 'highlightBackground',
        name: 'Highlight background',
        category: ['Zabbix Problems View'],
        defaultValue: defaultOptions.highlightBackground,
      })

      // ─── Section 2: Colors ──────────────────────────────────────────────
      .addCustomEditor({
        id: 'severityColors',
        path: 'severityColors',
        name: 'Problem colors',
        category: ['Colors'],
        editor: SeverityColorEditor,
        defaultValue: defaultOptions.severityColors,
      })

      // ─── Section 3: Card Fields ─────────────────────────────────────────
      .addBooleanSwitch({
        path: 'showSeverityBadge',
        name: 'Severity badge',
        description: 'Configure which fields are visible on the collapsed card',
        category: ['Card Fields'],
        defaultValue: true,
      })
      .addBooleanSwitch({
        path: 'showHostName',
        name: 'Host name',
        category: ['Card Fields'],
        defaultValue: true,
      })
      .addBooleanSwitch({
        path: 'showTimestamp',
        name: 'Timestamp',
        category: ['Card Fields'],
        defaultValue: true,
      })
      .addBooleanSwitch({
        path: 'showDescription',
        name: 'Description',
        category: ['Card Fields'],
        defaultValue: true,
      })
      .addBooleanSwitch({
        path: 'showTags',
        name: 'Tags',
        category: ['Card Fields'],
        defaultValue: true,
      })
      .addBooleanSwitch({
        path: 'showEventId',
        name: 'Event ID',
        category: ['Card Fields'],
        defaultValue: true,
      })
      .addBooleanSwitch({
        path: 'showSuppressed',
        name: 'Show suppressed',
        category: ['Card Fields'],
        defaultValue: true,
      })

      // ─── Section 4: Details Fields ──────────────────────────────────────
      .addBooleanSwitch({
        path: 'showTriggerExpression',
        name: 'Trigger expression',
        description: 'Configure which fields are visible when a card is expanded',
        category: ['Details Fields'],
        defaultValue: true,
      })
      .addBooleanSwitch({
        path: 'showComment',
        name: 'Comment',
        category: ['Details Fields'],
        defaultValue: true,
      })
      .addBooleanSwitch({
        path: 'showMonitoredItems',
        name: 'Monitored items',
        category: ['Details Fields'],
        defaultValue: true,
      })
      .addBooleanSwitch({
        path: 'showDetailTags',
        name: 'Tags',
        category: ['Details Fields'],
        defaultValue: true,
      })
      .addBooleanSwitch({
        path: 'showHostGroups',
        name: 'Host groups',
        category: ['Details Fields'],
        defaultValue: true,
      })
      .addBooleanSwitch({
        path: 'showZabbixLink',
        name: 'Zabbix direct link',
        category: ['Details Fields'],
        defaultValue: true,
      })
      .addTextInput({
        path: 'zabbixBaseUrl',
        name: 'Zabbix base URL',
        description: 'Used to build direct event links. E.g.: https://zabbix.company.com',
        category: ['Details Fields'],
        defaultValue: '',
      });
  });
