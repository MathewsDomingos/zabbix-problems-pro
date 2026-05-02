import { FieldConfigProperty, PanelPlugin } from '@grafana/data';
import { PanelOptions } from './types';
import { SimplePanel } from './components/SimplePanel';
import { SeverityColorEditor } from './components/SeverityColorEditor';
import { DEFAULT_OPTIONS } from './constants';

export const plugin = new PanelPlugin<PanelOptions>(SimplePanel)
  .useFieldConfig({
    disableStandardOptions: Object.values(FieldConfigProperty) as FieldConfigProperty[],
  })
  .setPanelOptions((builder) => {
    return builder
      // ─── Section 0: Style ───────────────────────────────────────────────
      .addBooleanSwitch({
        path: 'showScrollbar',
        name: 'Use Grafana scrollbar',
        description: 'Show or hide the panel scrollbar',
        category: ['Style'],
        defaultValue: DEFAULT_OPTIONS.showScrollbar,
      })
      .addBooleanSwitch({
        path: 'showPagination',
        name: 'Show pagination',
        description: 'Show or hide the pagination controls',
        category: ['Style'],
        defaultValue: DEFAULT_OPTIONS.showPagination,
      })

      // ─── Section 1: Zabbix Problems View ───────────────────────────────
      .addSelect({
        path: 'layout',
        name: 'Layout',
        category: ['Zabbix Problems View'],
        defaultValue: DEFAULT_OPTIONS.layout,
        settings: {
          options: [
            { value: 'list',  label: 'List'  },
            { value: 'macro', label: 'Macro' },
            { value: 'table', label: 'Table' },
          ],
        },
      })
      .addBooleanSwitch({
        path: 'hideTableHeader',
        name: 'Hide header',
        description: 'Hide the table column headers',
        category: ['Zabbix Problems View'],
        defaultValue: DEFAULT_OPTIONS.hideTableHeader,
        showIf: (options) => options.layout === 'table',
      })
      .addSelect({
        path: 'sortBy',
        name: 'Sort by',
        category: ['Zabbix Problems View'],
        defaultValue: DEFAULT_OPTIONS.sortBy,
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
        defaultValue: DEFAULT_OPTIONS.fontSize,
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
        defaultValue: DEFAULT_OPTIONS.pageSize,
        settings: { min: 1, max: 500 },
      })
      .addBooleanSwitch({
        path: 'highlightBackground',
        name: 'Highlight background',
        category: ['Zabbix Problems View'],
        defaultValue: DEFAULT_OPTIONS.highlightBackground,
      })
      .addRadio({
        path: 'highlightStyle',
        name: 'Style',
        category: ['Zabbix Problems View'],
        defaultValue: DEFAULT_OPTIONS.highlightStyle,
        settings: {
          options: [
            { value: 'solid',    label: 'Solid' },
            { value: 'gradient', label: 'Gradient' },
          ],
        },
        showIf: (options) => options.highlightBackground === true,
      })
      .addSliderInput({
        path: 'highlightIntensity',
        name: 'Intensity',
        category: ['Zabbix Problems View'],
        defaultValue: DEFAULT_OPTIONS.highlightIntensity,
        settings: {
          min: 0,
          max: 100,
          step: 1,
        },
        showIf: (options) => options.highlightBackground === true,
      })
      .addRadio({
        path: 'highlightDirection',
        name: 'Direction',
        category: ['Zabbix Problems View'],
        defaultValue: DEFAULT_OPTIONS.highlightDirection,
        settings: {
          options: [
            { value: 0,   label: '0°'   },
            { value: 45,  label: '45°'  },
            { value: 90,  label: '90°'  },
            { value: 135, label: '135°' },
            { value: 180, label: '180°' },
          ],
        },
        showIf: (options) =>
          options.highlightBackground === true &&
          options.highlightStyle === 'gradient',
      })

      // ─── Section 2: Colors ──────────────────────────────────────────────
      .addCustomEditor({
        id: 'severityColors',
        path: 'severityColors',
        name: 'Problem colors',
        category: ['Colors'],
        editor: SeverityColorEditor,
        defaultValue: DEFAULT_OPTIONS.severityColors,
      })

      .addColorPicker({
        path: 'timestampColor',
        name: 'Timestamp color',
        defaultValue: DEFAULT_OPTIONS.timestampColor,
        category: ['Colors'],
      })

      // ─── Section 3: Card Fields ─────────────────────────────────────────
      .addBooleanSwitch({
        path: 'showSeverityBadge',
        name: 'Severity badge',
        description: 'Configure which fields are visible on the collapsed card',
        category: ['Card Fields'],
        defaultValue: DEFAULT_OPTIONS.showSeverityBadge,
      })
      .addBooleanSwitch({
        path: 'showHostName',
        name: 'Host name',
        category: ['Card Fields'],
        defaultValue: DEFAULT_OPTIONS.showHostName,
      })
      .addBooleanSwitch({
        path: 'showTimestamp',
        name: 'Timestamp',
        category: ['Card Fields'],
        defaultValue: DEFAULT_OPTIONS.showTimestamp,
      })
      .addBooleanSwitch({
        path: 'showDescription',
        name: 'Description',
        category: ['Card Fields'],
        defaultValue: DEFAULT_OPTIONS.showDescription,
        showIf: (options) => options.layout === 'list',
      })
      .addBooleanSwitch({
        path: 'showTags',
        name: 'Tags',
        category: ['Card Fields'],
        defaultValue: DEFAULT_OPTIONS.showTags,
      })
      .addBooleanSwitch({
        path: 'showEventId',
        name: 'Event ID',
        category: ['Card Fields'],
        defaultValue: DEFAULT_OPTIONS.showEventId,
        showIf: (options) => options.layout === 'list',
      })
      .addBooleanSwitch({
        path: 'showSuppressed',
        name: 'Show suppressed',
        category: ['Card Fields'],
        defaultValue: DEFAULT_OPTIONS.showSuppressed,
      })
      .addBooleanSwitch({
        path: 'showStatus',
        name: 'Status',
        description: 'Show PROBLEM / OK status text',
        category: ['Card Fields'],
        defaultValue: DEFAULT_OPTIONS.showStatus,
      })
      .addBooleanSwitch({
        path: 'showAck',
        name: 'Ack',
        description: 'Show acknowledged indicator',
        category: ['Card Fields'],
        defaultValue: DEFAULT_OPTIONS.showAck,
      })
      .addBooleanSwitch({
        path: 'showAge',
        name: 'Age',
        description: 'Show time elapsed since problem started',
        category: ['Card Fields'],
        defaultValue: DEFAULT_OPTIONS.showAge,
      })
      .addBooleanSwitch({
        path: 'showOperationalData',
        name: 'Operational data',
        description: 'Show Zabbix operational data (opdata)',
        category: ['Card Fields'],
        defaultValue: DEFAULT_OPTIONS.showOperationalData,
      })
      .addBooleanSwitch({
        path: 'showTableHostGroups',
        name: 'Host groups',
        description: 'Show host group names',
        category: ['Card Fields'],
        defaultValue: DEFAULT_OPTIONS.showTableHostGroups,
      })
      .addBooleanSwitch({
        path: 'showDatasourceName',
        name: 'Datasource name',
        description: 'Show the datasource name',
        category: ['Card Fields'],
        defaultValue: DEFAULT_OPTIONS.showDatasourceName,
      })

      // ─── Section 4: Details Fields ──────────────────────────────────────
      .addBooleanSwitch({
        path: 'showTriggerExpression',
        name: 'Trigger expression',
        description: 'Configure which fields are visible when a card is expanded',
        category: ['Details Fields'],
        defaultValue: DEFAULT_OPTIONS.showTriggerExpression,
      })
      .addBooleanSwitch({
        path: 'showComment',
        name: 'Comment',
        category: ['Details Fields'],
        defaultValue: DEFAULT_OPTIONS.showComment,
      })
      .addBooleanSwitch({
        path: 'showMonitoredItems',
        name: 'Monitored items',
        category: ['Details Fields'],
        defaultValue: DEFAULT_OPTIONS.showMonitoredItems,
      })
      .addBooleanSwitch({
        path: 'showDetailTags',
        name: 'Tags',
        category: ['Details Fields'],
        defaultValue: DEFAULT_OPTIONS.showDetailTags,
      })
      .addBooleanSwitch({
        path: 'showHostGroups',
        name: 'Host groups',
        category: ['Details Fields'],
        defaultValue: DEFAULT_OPTIONS.showHostGroups,
      })
      .addBooleanSwitch({
        path: 'showZabbixLink',
        name: 'Zabbix direct link',
        category: ['Details Fields'],
        defaultValue: DEFAULT_OPTIONS.showZabbixLink,
      })
      .addTextInput({
        path: 'zabbixBaseUrl',
        name: 'Zabbix base URL',
        description: 'Used to build direct event links. E.g.: https://zabbix.company.com',
        category: ['Details Fields'],
        defaultValue: DEFAULT_OPTIONS.zabbixBaseUrl,
      })
;
  });
