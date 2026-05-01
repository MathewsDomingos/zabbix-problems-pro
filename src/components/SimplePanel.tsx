import React, { useMemo } from 'react';
import { PanelProps } from '@grafana/data';
import { css } from '@emotion/css';
import { useStyles2 } from '@grafana/ui';
import { PanelOptions, ZabbixProblem } from '../types';
import { mapDataFrameToProblems } from '../utils/dataMapper';
import { ProblemsList } from './ProblemsList';

interface Props extends PanelProps<PanelOptions> {}

const getStyles = () => ({
  container: css`
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
    overflow-y: auto;
    background: transparent;
  `,
});

const MOCK_PROBLEMS: ZabbixProblem[] = [
  {
    eventid: '2138099',
    triggerid: '34720',
    description: 'MySQL: instância inacessível — sem resposta na porta TCP 3306',
    host: 'SRV-DB01',
    severity: 5,
    time: new Date('2026-04-26T10:01:55'),
    acknowledged: false,
    suppressed: false,
    comments:
      'O MySQL não respondeu ao ping do agente e a porta TCP 3306 está fechada. Todas as aplicações que dependem deste banco estão impactadas. Escalação imediata recomendada ao DBA de plantão.',
    expression:
      'last(/SRV-DB01/net.tcp.port[,3306])=0 and nodata(/SRV-DB01/mysql.ping,2m)=1',
    tags: [
      { tag: 'class', value: 'database' },
      { tag: 'component', value: 'mysql' },
      { tag: 'scope', value: 'availability' },
    ],
    groups: ['Servidores', 'Servidores/Databases'],
    items: [
      { key: 'net.tcp.port[,3306]', name: 'MySQL port 3306 availability', lastvalue: '0 (closed)' },
      { key: 'mysql.ping', name: 'MySQL server ping', lastvalue: 'sem dados' },
    ],
  },
  {
    eventid: '2138020',
    triggerid: '34715',
    description: 'Linux: Agente Zabbix indisponível há mais de 3 minutos',
    host: 'CP-ASTERISK',
    severity: 4,
    time: new Date('2026-04-25T15:18:30'),
    acknowledged: false,
    suppressed: true,
    comments:
      'Para agentes passivos, a disponibilidade é verificada com limiar de 3m. O agente não enviou dados dentro do período configurado. Verifique conectividade e status do serviço zabbix-agent2.',
    expression: 'nodata(/CP-ASTERISK/agent.ping,3m)=1',
    tags: [
      { tag: 'class', value: 'os' },
      { tag: 'component', value: 'agent' },
    ],
    groups: ['Servidores', 'Servidores/VoIP'],
    items: [{ key: 'agent.ping', name: 'Zabbix agent ping', lastvalue: 'sem dados' }],
  },
  {
    eventid: '2138085',
    triggerid: '34710',
    description: 'Windows: "GoogleUpdaterService148.0.7730.0" parado (inicialização automática)',
    host: 'SRV-ALTOMAR',
    severity: 3,
    time: new Date('2026-04-26T07:05:22'),
    acknowledged: false,
    suppressed: false,
    comments:
      'O serviço possui estado diferente de "Running" nas últimas três verificações consecutivas. Pode indicar falha na inicialização ou dependência não satisfeita pelo sistema operacional.',
    expression:
      'min(/SRV-ALTOMAR/service.info["GoogleUpdaterService148.0.7730.0",state],#3)<>0',
    tags: [
      { tag: 'class', value: 'os' },
      { tag: 'component', value: 'system' },
      { tag: 'name', value: 'Google Updater Service' },
      { tag: 'scope', value: 'notice' },
      { tag: 'target', value: 'windows' },
    ],
    groups: ['Servidores', 'Servidores/Windows'],
    items: [
      {
        key: 'service.info["GoogleUpdaterService148.0.7730.0",state]',
        name: 'State of service "Google Updater Service"',
        lastvalue: '6 (stopped)',
      },
    ],
  },
  {
    eventid: '2138060',
    triggerid: '34705',
    description: 'Câmera 2 desconectada — sem sinal de vídeo detectado pelo NVR',
    host: 'CAMERA-NVR',
    severity: 2,
    time: new Date('2026-04-25T06:51:04'),
    acknowledged: false,
    suppressed: false,
    comments:
      'O status da câmera é verificado a cada 60 segundos. Retorno igual a 0 indica ausência de sinal de vídeo ativo na porta monitorada do NVR.',
    expression: 'last(/CAMERA-NVR/camera.status[cam2])=0',
    tags: [
      { tag: 'class', value: 'camera' },
      { tag: 'component', value: 'nvr' },
      { tag: 'target', value: 'cftv' },
    ],
    groups: ['Monitoramento', 'Monitoramento/CFTV'],
    items: [
      { key: 'camera.status[cam2]', name: 'Camera 2 — connection status', lastvalue: '0 (offline)' },
    ],
  },
  {
    eventid: '2138044',
    triggerid: '34701',
    description: 'Linux: Interface vmbr0v35: Ethernet reduziu velocidade de operação',
    host: 'SRV-PVE120',
    severity: 1,
    time: new Date('2026-04-26T09:32:11'),
    acknowledged: false,
    suppressed: false,
    comments:
      'Esta conexão Ethernet transitou abaixo da sua velocidade máxima conhecida. Pode ser sinal de problemas de autonegociação. Reconheça para fechar o problema manualmente.',
    expression:
      'change(/SRV-PVE120/net.if.speed[vmbr0v35])<0 and last(/SRV-PVE120/net.if.speed[vmbr0v35])>0',
    tags: [
      { tag: 'component', value: 'network' },
      { tag: 'scope', value: 'notice' },
    ],
    groups: ['Infraestrutura', 'Infraestrutura/Proxmox'],
    items: [
      { key: 'net.if.speed[vmbr0v35]', name: 'Interface vmbr0v35 — Speed', lastvalue: '100 Mbps' },
    ],
  },
  {
    eventid: '2138001',
    triggerid: '34700',
    description: 'Linux: sistema de arquivos /var com menos de 10% de espaço livre',
    host: 'SRV-BACKUP',
    severity: 0,
    time: new Date('2026-04-26T08:14:02'),
    acknowledged: false,
    suppressed: false,
    comments:
      'O sistema verifica continuamente o percentual de espaço livre. Abaixo de 10%, o risco de falha em operações de escrita é elevado e pode corromper logs ativos.',
    expression: 'last(/SRV-BACKUP/vfs.fs.size[/var,pfree])<10',
    tags: [
      { tag: 'class', value: 'storage' },
      { tag: 'scope', value: 'notice' },
      { tag: 'target', value: 'linux' },
    ],
    groups: ['Infraestrutura', 'Infraestrutura/Linux'],
    items: [
      {
        key: 'vfs.fs.size[/var,pfree]',
        name: 'Free disk space on /var (percentage)',
        lastvalue: '7.3 %',
      },
    ],
  },
];

export const SimplePanel: React.FC<Props> = ({ data, width, height, options }) => {
  const styles = useStyles2(getStyles);

  const problems = useMemo(() => {
    const real = mapDataFrameToProblems(data);
    return real.length > 0 ? real : MOCK_PROBLEMS;
  }, [data]);

  return (
    <div className={styles.container} style={{ width, height, fontSize: `${options.fontSize ?? 100}%` }}>
      <ProblemsList problems={problems} options={options} />
    </div>
  );
};
