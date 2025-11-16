import { ConsumptionPeriod, ConsumptionData, FileDetailsByDate, MeterType } from '../types';
import { mockFileDetails } from '../data/mockData';

export function generateMockData(period: ConsumptionPeriod): ConsumptionData {
  const data = {
    '24h': { days: 1, startDate: new Date('2025-11-01') },
    '7d': { days: 7, startDate: new Date('2025-10-26') },
    '30d': { days: 30, startDate: new Date('2025-10-03') },
    '90d': { days: 90, startDate: new Date('2025-08-13') },
    'custom': { days: 90, startDate: new Date('2025-08-13') }
  };

  const config = data[period] || data['90d'];
  const dates: string[] = [];
  const datasets = [
    { label: 'Unstructured Data Processed', data: [] as number[], backgroundColor: '#ff9500' },
    { label: 'Batch Data Pipeline', data: [] as number[], backgroundColor: '#5ac8fa' }
  ];

  // Generate dates
  for (let i = 0; i < config.days; i++) {
    const date = new Date(config.startDate);
    date.setDate(date.getDate() + i);
    dates.push(date.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' }));
  }

  // Build file details and compute dataset values from file details
  const fileDetails: FileDetailsByDate = {};
  
  dates.forEach((date) => {
    // Use fixed file details if available
    if (mockFileDetails[date]) {
      fileDetails[date] = mockFileDetails[date];
    } else {
      fileDetails[date] = {};
    }

    // Compute totals for bars based on files
    const unstructuredFiles = (fileDetails[date]['Unstructured Data Processed'] || []);
    const pipelineFiles = (fileDetails[date]['Batch Data Pipeline'] || []);

    const unstructuredTotal = unstructuredFiles.reduce((sum, f) => {
      const sizeMb = parseFloat(f.size) || 0;
      return sum + (sizeMb * 60); // 60 credits per 1 MB
    }, 0);

    const pipelineTotal = pipelineFiles.length * (2000 / 1000000); // 0.002 credits per update

    datasets[0].data.push(unstructuredTotal);
    datasets[1].data.push(pipelineTotal);
  });

  return { dates, datasets, fileDetails };
}

export function getPeriodDateRange(period: ConsumptionPeriod) {
  const today = new Date('2025-11-01'); // Using Nov 1 as reference
  let startDate = new Date(today);
  
  switch(period) {
    case '24h':
      startDate.setDate(today.getDate() - 1);
      break;
    case '7d':
      startDate.setDate(today.getDate() - 7);
      break;
    case '30d':
      startDate.setDate(today.getDate() - 30);
      break;
    case '90d':
      startDate.setDate(today.getDate() - 90);
      break;
    default:
      startDate.setDate(today.getDate() - 90);
  }
  
  return { start: startDate, end: today };
}

export function isDateInPeriod(dateValue: string, period: ConsumptionPeriod): boolean {
  const { start, end } = getPeriodDateRange(period);
  // Parse dateValue string (format: 'MM/DD/YYYY')
  const dateParts = dateValue.split('/');
  const alertDate = new Date(parseInt(dateParts[2]), parseInt(dateParts[0]) - 1, parseInt(dateParts[1]));
  // Set time to start of day for accurate comparison
  alertDate.setHours(0, 0, 0, 0);
  start.setHours(0, 0, 0, 0);
  end.setHours(23, 59, 59, 999);
  return alertDate >= start && alertDate <= end;
}

export function generateProcessingId(counter: number): string {
  const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = (counter + Math.random() * 16) % 16;
    const v = c === 'x' ? Math.floor(r) : (Math.floor(r) & 0x3 | 0x8);
    return v.toString(16);
  });
  return uuid;
}

export function parseTimeForGrouping(timeStr: string) {
  const match = timeStr.match(/(\w+)\s+(\d+)\s+(\d+):(\d+)/);
  if (match) {
    const month = match[1];
    const day = parseInt(match[2]);
    const hour = parseInt(match[3]);
    const minute = parseInt(match[4]);
    return {
      dateKey: `${month} ${day}`,
      minutes: hour * 60 + minute,
      fullTime: timeStr
    };
  }
  return { dateKey: '', minutes: 0, fullTime: timeStr };
}

