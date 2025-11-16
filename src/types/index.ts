export type ConsumptionPeriod = '24h' | '7d' | '30d' | '90d' | 'custom';

export type AlertSeverity = 'High' | 'Medium' | 'Low';

export type MeterType = 'Unstructured Data Processed' | 'Batch Data Pipeline';

export type ActionType = 'Ingestion' | 'Indexing';

export type UpdateReason = 'Added' | 'Updated' | 'Deleted';

export type ConnectorType = 'Google Drive' | 'Web Crawler' | 'SharePoint';

export interface Alert {
  id: number;
  description: string;
  date: string;
  dateValue: string;
  severity: AlertSeverity;
  mitigated: boolean;
}

export interface FileDetail {
  fileName: string;
  fileType: string;
  updateTime: string;
  reason: UpdateReason;
  size: string;
  credits: string;
  connectorType?: ConnectorType;
  connectorName?: string;
}

export interface FileDetailsByDate {
  [date: string]: {
    [meterType in MeterType]?: FileDetail[];
  };
}

export interface FlatTableRow {
  fileName: string;
  fileType: string;
  actionType: ActionType;
  time: string;
  size: number;
  reason: UpdateReason;
  connectorType: ConnectorType;
  udmoName: string;
  ingestionId: string;
  credits: number | null;
}

export interface ChartData {
  dates: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string;
  }[];
}

export interface ConsumptionData {
  dates: string[];
  datasets: ChartData['datasets'];
  fileDetails: FileDetailsByDate;
}

