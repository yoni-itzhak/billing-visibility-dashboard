import { Alert, FileDetailsByDate, ConnectorType } from '../types';

export const customerSuggestions = [
  'Acme Corporation',
  'TechStart Inc',
  'Global Solutions Ltd',
  'DataWorks Co',
  'Cloud Services LLC',
  'Enterprise Systems',
  'Digital Innovations',
  'Smart Analytics Corp'
];

export const orgIdSuggestions = [
  '00D4J0000001wpEUAQ',
  '00D4J0000002wpEUAQ',
  '00D4J0000003wpEUAQ',
  '00D4J0000004wpEUAQ',
  '00D4J0000005wpEUAQ',
  '00D4J0000006wpEUAQ',
  '00D4J0000007wpEUAQ',
  '00D4J0000008wpEUAQ'
];

export const allAlerts: Alert[] = [
  { id: 1, description: 'Consumption Spike', date: 'October 31', dateValue: '10/31/2025', severity: 'High', mitigated: false },
  { id: 2, description: 'Monthly summary.pdf was updated 4 times in one day', date: 'November 1', dateValue: '11/1/2025', severity: 'Medium', mitigated: false },
  { id: 4, description: 'Batch processing delay', date: 'October 25', dateValue: '10/25/2025', severity: 'Medium', mitigated: true }
];

const connectorTypes: ConnectorType[] = ['Google Drive', 'Web Crawler', 'SharePoint'];
const connectorNames: Record<ConnectorType, string> = {
  'Google Drive': 'ACME Drive',
  'Web Crawler': 'ACME Website',
  'SharePoint': 'ACME Sharepoint'
};

function getConnectorForFile(fileName: string): { type: ConnectorType; name: string } {
  const fileNameHash = fileName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const type = connectorTypes[fileNameHash % connectorTypes.length];
  return { type, name: connectorNames[type] };
}

export const mockFileDetails: FileDetailsByDate = {
  '9/5/2025': {
    'Batch Data Pipeline': [
      { fileName: 'User manual.pdf', fileType: 'PDF', updateTime: 'September 5 10:00', reason: 'Added', size: '24.5', credits: '0', ...getConnectorForFile('User manual.pdf') },
      { fileName: 'Product catalog.html', fileType: 'HTML', updateTime: 'September 5 10:15', reason: 'Added', size: '18.2', credits: '0', ...getConnectorForFile('Product catalog.html') },
      { fileName: 'Customer data.png', fileType: 'PNG', updateTime: 'September 5 10:30', reason: 'Added', size: '32.8', credits: '0', ...getConnectorForFile('Customer data.png') }
    ],
    'Unstructured Data Processed': [
      { fileName: 'User manual.pdf', fileType: 'PDF', updateTime: 'September 5 13:33', reason: 'Added', size: '24.5', credits: '1,470', ...getConnectorForFile('User manual.pdf') },
      { fileName: 'Product catalog.html', fileType: 'HTML', updateTime: 'September 5 14:15', reason: 'Added', size: '18.2', credits: '1,092', ...getConnectorForFile('Product catalog.html') },
      { fileName: 'Customer data.png', fileType: 'PNG', updateTime: 'September 5 15:42', reason: 'Updated', size: '32.8', credits: '1,968', ...getConnectorForFile('Customer data.png') }
    ]
  },
  '9/8/2025': {
    'Batch Data Pipeline': [
      { fileName: 'Invoice batch.pdf', fileType: 'PDF', updateTime: 'September 8 08:00', reason: 'Added', size: '28.7', credits: '0' },
      { fileName: 'Transaction log.html', fileType: 'HTML', updateTime: 'September 8 08:15', reason: 'Added', size: '35.4', credits: '0' },
      { fileName: 'Financial report.pdf', fileType: 'PDF', updateTime: 'September 8 08:30', reason: 'Added', size: '22.1', credits: '0' }
    ],
    'Unstructured Data Processed': [
      { fileName: 'Invoice batch.pdf', fileType: 'PDF', updateTime: 'September 8 09:15', reason: 'Added', size: '28.7', credits: '1,722' },
      { fileName: 'Transaction log.html', fileType: 'HTML', updateTime: 'September 8 10:30', reason: 'Added', size: '35.4', credits: '2,124' },
      { fileName: 'Financial report.pdf', fileType: 'PDF', updateTime: 'September 8 11:45', reason: 'Updated', size: '22.1', credits: '1,326' }
    ]
  },
  '10/3/2025': {
    'Batch Data Pipeline': [
      { fileName: 'Processed document.pdf', fileType: 'PDF', updateTime: 'October 3 09:00', reason: 'Added', size: '22.4', credits: '0' },
      { fileName: 'Document set.html', fileType: 'HTML', updateTime: 'October 3 09:15', reason: 'Added', size: '18.0', credits: '0' },
      { fileName: 'Content files.png', fileType: 'PNG', updateTime: 'October 3 09:30', reason: 'Added', size: '15.0', credits: '0' },
      { fileName: 'Text documents.docx', fileType: 'Word', updateTime: 'October 3 09:45', reason: 'Added', size: '12.0', credits: '0' }
    ],
    'Unstructured Data Processed': [
      { fileName: 'Processed document.pdf', fileType: 'PDF', updateTime: 'October 3 11:15', reason: 'Added', size: '22.4', credits: '1,344' },
      { fileName: 'Document set.html', fileType: 'HTML', updateTime: 'October 3 12:00', reason: 'Updated', size: '18.0', credits: '1,080' },
      { fileName: 'Content files.png', fileType: 'PNG', updateTime: 'October 3 12:30', reason: 'Added', size: '15.0', credits: '900' },
      { fileName: 'Text documents.docx', fileType: 'Word', updateTime: 'October 3 13:00', reason: 'Deleted', size: '12.0', credits: '720' }
    ]
  },
  '10/18/2025': {
    'Batch Data Pipeline': [
      { fileName: 'Pipeline data.png', fileType: 'PNG', updateTime: 'October 18 08:00', reason: 'Added', size: '15.6', credits: '0' },
      { fileName: 'Batch output.pdf', fileType: 'PDF', updateTime: 'October 18 08:15', reason: 'Added', size: '12.0', credits: '0' },
      { fileName: 'Processed files.html', fileType: 'HTML', updateTime: 'October 18 08:30', reason: 'Added', size: '10.0', credits: '0' }
    ],
    'Unstructured Data Processed': [
      { fileName: 'Pipeline data.png', fileType: 'PNG', updateTime: 'October 18 10:00', reason: 'Added', size: '15.6', credits: '936' },
      { fileName: 'Batch output.pdf', fileType: 'PDF', updateTime: 'October 18 10:30', reason: 'Updated', size: '12.0', credits: '720' },
      { fileName: 'Processed files.html', fileType: 'HTML', updateTime: 'October 18 11:00', reason: 'Added', size: '10.0', credits: '600' }
    ]
  },
  '10/28/2025': {
    'Batch Data Pipeline': [
      { fileName: 'Pipeline export.png', fileType: 'PNG', updateTime: 'October 28 08:00', reason: 'Added', size: '22.4', credits: '0' },
      { fileName: 'Batch output.pdf', fileType: 'PDF', updateTime: 'October 28 08:15', reason: 'Added', size: '18.0', credits: '0' },
      { fileName: 'Processed data.html', fileType: 'HTML', updateTime: 'October 28 08:30', reason: 'Added', size: '15.0', credits: '0' }
    ],
    'Unstructured Data Processed': [
      { fileName: 'Pipeline export.png', fileType: 'PNG', updateTime: 'October 28 09:30', reason: 'Added', size: '22.4', credits: '1,344' },
      { fileName: 'Batch output.pdf', fileType: 'PDF', updateTime: 'October 28 10:00', reason: 'Updated', size: '18.0', credits: '1,080' },
      { fileName: 'Processed data.html', fileType: 'HTML', updateTime: 'October 28 10:30', reason: 'Added', size: '15.0', credits: '900' }
    ]
  },
  '11/1/2025': {
    'Batch Data Pipeline': [
      { fileName: 'November start.pdf', fileType: 'PDF', updateTime: 'November 1 07:00', reason: 'Added', size: '25.3', credits: '0' },
      { fileName: 'New month data.html', fileType: 'HTML', updateTime: 'November 1 07:15', reason: 'Added', size: '19.6', credits: '0' },
      { fileName: 'Content files.png', fileType: 'PNG', updateTime: 'November 1 07:30', reason: 'Added', size: '15.0', credits: '0' },
      { fileName: 'Monthly summary.pdf', fileType: 'PDF', updateTime: 'November 1 08:00', reason: 'Added', size: '20.0', credits: '0' },
      { fileName: 'Monthly report.docx', fileType: 'Word', updateTime: 'November 1 08:15', reason: 'Added', size: '18.5', credits: '0' },
      { fileName: 'Data export.pdf', fileType: 'PDF', updateTime: 'November 1 08:30', reason: 'Added', size: '22.8', credits: '0' }
    ],
    'Unstructured Data Processed': [
      { fileName: 'November start.pdf', fileType: 'PDF', updateTime: 'November 1 08:30', reason: 'Added', size: '25.3', credits: '1,518' },
      { fileName: 'New month data.html', fileType: 'HTML', updateTime: 'November 1 10:00', reason: 'Added', size: '19.6', credits: '1,176' },
      { fileName: 'Content files.png', fileType: 'PNG', updateTime: 'November 1 10:30', reason: 'Updated', size: '15.0', credits: '900' },
      { fileName: 'Monthly summary.pdf', fileType: 'PDF', updateTime: 'November 1 11:00', reason: 'Updated', size: '20.0', credits: '1,200' },
      { fileName: 'Monthly summary.pdf', fileType: 'PDF', updateTime: 'November 1 13:30', reason: 'Updated', size: '20.0', credits: '1,200' },
      { fileName: 'Monthly summary.pdf', fileType: 'PDF', updateTime: 'November 1 15:45', reason: 'Updated', size: '20.0', credits: '1,200' },
      { fileName: 'Monthly summary.pdf', fileType: 'PDF', updateTime: 'November 1 17:20', reason: 'Updated', size: '20.0', credits: '1,200' },
      { fileName: 'Monthly report.docx', fileType: 'Word', updateTime: 'November 1 12:00', reason: 'Added', size: '18.5', credits: '1,110' },
      { fileName: 'Data export.pdf', fileType: 'PDF', updateTime: 'November 1 13:15', reason: 'Updated', size: '22.8', credits: '1,368' }
    ]
  },
  '10/26/2025': {
    'Batch Data Pipeline': [
      { fileName: 'Archive pipeline.pdf', fileType: 'PDF', updateTime: 'October 26 08:00', reason: 'Added', size: '14.8', credits: '0' },
      { fileName: 'Backup batch.html', fileType: 'HTML', updateTime: 'October 26 08:15', reason: 'Added', size: '13.5', credits: '0' }
    ],
    'Unstructured Data Processed': [
      { fileName: 'Archive pipeline.pdf', fileType: 'PDF', updateTime: 'October 26 09:00', reason: 'Added', size: '14.8', credits: '888' },
      { fileName: 'Backup batch.html', fileType: 'HTML', updateTime: 'October 26 10:30', reason: 'Updated', size: '13.5', credits: '810' }
    ]
  },
  '10/27/2025': {
    'Batch Data Pipeline': [
      { fileName: 'Monday pipeline.pdf', fileType: 'PDF', updateTime: 'October 27 07:00', reason: 'Added', size: '15.3', credits: '0' },
      { fileName: 'Weekly batch.html', fileType: 'HTML', updateTime: 'October 27 07:15', reason: 'Added', size: '14.1', credits: '0' },
      { fileName: 'Processed weekly.png', fileType: 'PNG', updateTime: 'October 27 07:30', reason: 'Added', size: '17.9', credits: '0' }
    ],
    'Unstructured Data Processed': [
      { fileName: 'Monday pipeline.pdf', fileType: 'PDF', updateTime: 'October 27 08:15', reason: 'Added', size: '15.3', credits: '918' },
      { fileName: 'Weekly batch.html', fileType: 'HTML', updateTime: 'October 27 09:30', reason: 'Updated', size: '14.1', credits: '846' },
      { fileName: 'Processed weekly.png', fileType: 'PNG', updateTime: 'October 27 10:45', reason: 'Added', size: '17.9', credits: '1,074' }
    ]
  },
  '10/29/2025': {
    'Batch Data Pipeline': [
      { fileName: 'Midweek pipeline.pdf', fileType: 'PDF', updateTime: 'October 29 07:00', reason: 'Added', size: '16.5', credits: '0' },
      { fileName: 'Updated batch.html', fileType: 'HTML', updateTime: 'October 29 07:15', reason: 'Added', size: '13.8', credits: '0' }
    ],
    'Unstructured Data Processed': [
      { fileName: 'Midweek pipeline.pdf', fileType: 'PDF', updateTime: 'October 29 08:45', reason: 'Added', size: '16.5', credits: '990' },
      { fileName: 'Updated batch.html', fileType: 'HTML', updateTime: 'October 29 10:00', reason: 'Updated', size: '13.8', credits: '828' }
    ]
  },
  '10/30/2025': {
    'Batch Data Pipeline': [
      { fileName: 'Month end pipeline.pdf', fileType: 'PDF', updateTime: 'October 30 07:00', reason: 'Added', size: '18.2', credits: '0' },
      { fileName: 'Final batch.html', fileType: 'HTML', updateTime: 'October 30 07:15', reason: 'Added', size: '16.4', credits: '0' },
      { fileName: 'Monthly processed.png', fileType: 'PNG', updateTime: 'October 30 07:30', reason: 'Added', size: '19.8', credits: '0' }
    ],
    'Unstructured Data Processed': [
      { fileName: 'Month end pipeline.pdf', fileType: 'PDF', updateTime: 'October 30 09:00', reason: 'Added', size: '18.2', credits: '1,092' },
      { fileName: 'Final batch.html', fileType: 'HTML', updateTime: 'October 30 10:30', reason: 'Updated', size: '16.4', credits: '984' },
      { fileName: 'Monthly processed.png', fileType: 'PNG', updateTime: 'October 30 11:45', reason: 'Added', size: '19.8', credits: '1,188' }
    ]
  },
  '10/31/2025': {
    'Batch Data Pipeline': [
      { fileName: 'Halloween batch.pdf', fileType: 'PDF', updateTime: 'October 31 07:00', reason: 'Added', size: '45.5', credits: '0', ...getConnectorForFile('Halloween batch.pdf') },
      { fileName: 'End month data.html', fileType: 'HTML', updateTime: 'October 31 07:15', reason: 'Added', size: '38.4', credits: '0', ...getConnectorForFile('End month data.html') },
      { fileName: 'Final images.png', fileType: 'PNG', updateTime: 'October 31 07:30', reason: 'Added', size: '42.1', credits: '0', ...getConnectorForFile('Final images.png') },
      { fileName: 'Closing documents.docx', fileType: 'Word', updateTime: 'October 31 07:45', reason: 'Added', size: '35.3', credits: '0', ...getConnectorForFile('Closing documents.docx') },
      { fileName: 'Spike file 1.pdf', fileType: 'PDF', updateTime: 'October 31 08:00', reason: 'Added', size: '50.0', credits: '0', ...getConnectorForFile('Spike file 1.pdf') },
      { fileName: 'Spike file 2.html', fileType: 'HTML', updateTime: 'October 31 08:15', reason: 'Added', size: '48.2', credits: '0', ...getConnectorForFile('Spike file 2.html') },
      { fileName: 'Spike file 3.png', fileType: 'PNG', updateTime: 'October 31 08:30', reason: 'Added', size: '55.5', credits: '0', ...getConnectorForFile('Spike file 3.png') },
      { fileName: 'Spike file 4.docx', fileType: 'Word', updateTime: 'October 31 08:45', reason: 'Added', size: '52.8', credits: '0', ...getConnectorForFile('Spike file 4.docx') }
    ],
    'Unstructured Data Processed': [
      { fileName: 'Halloween batch.pdf', fileType: 'PDF', updateTime: 'October 31 08:30', reason: 'Added', size: '45.5', credits: '2,730', ...getConnectorForFile('Halloween batch.pdf') },
      { fileName: 'End month data.html', fileType: 'HTML', updateTime: 'October 31 10:00', reason: 'Added', size: '38.4', credits: '2,304', ...getConnectorForFile('End month data.html') },
      { fileName: 'Final images.png', fileType: 'PNG', updateTime: 'October 31 11:30', reason: 'Updated', size: '42.1', credits: '2,526', ...getConnectorForFile('Final images.png') },
      { fileName: 'Closing documents.docx', fileType: 'Word', updateTime: 'October 31 13:00', reason: 'Added', size: '35.3', credits: '2,118', ...getConnectorForFile('Closing documents.docx') },
      { fileName: 'Spike file 1.pdf', fileType: 'PDF', updateTime: 'October 31 14:00', reason: 'Added', size: '50.0', credits: '3,000', ...getConnectorForFile('Spike file 1.pdf') },
      { fileName: 'Spike file 2.html', fileType: 'HTML', updateTime: 'October 31 15:00', reason: 'Added', size: '48.2', credits: '2,892', ...getConnectorForFile('Spike file 2.html') },
      { fileName: 'Spike file 3.png', fileType: 'PNG', updateTime: 'October 31 16:00', reason: 'Updated', size: '55.5', credits: '3,330', ...getConnectorForFile('Spike file 3.png') },
      { fileName: 'Spike file 4.docx', fileType: 'Word', updateTime: 'October 31 17:00', reason: 'Added', size: '52.8', credits: '3,168', ...getConnectorForFile('Spike file 4.docx') }
    ]
  },
  '9/6/2025': {
    'Batch Data Pipeline': [
      { fileName: 'Follow up pipeline.pdf', fileType: 'PDF', updateTime: 'September 6 08:00', reason: 'Added', size: '13.4', credits: '0' },
      { fileName: 'Additional batch.html', fileType: 'HTML', updateTime: 'September 6 08:15', reason: 'Added', size: '12.1', credits: '0' }
    ],
    'Unstructured Data Processed': [
      { fileName: 'Follow up pipeline.pdf', fileType: 'PDF', updateTime: 'September 6 09:15', reason: 'Added', size: '13.4', credits: '804' },
      { fileName: 'Additional batch.html', fileType: 'HTML', updateTime: 'September 6 10:45', reason: 'Updated', size: '12.1', credits: '726' }
    ]
  },
  '9/7/2025': {
    'Batch Data Pipeline': [
      { fileName: 'Weekend pipeline.pdf', fileType: 'PDF', updateTime: 'September 7 08:00', reason: 'Added', size: '14.7', credits: '0' },
      { fileName: 'Weekend batch.html', fileType: 'HTML', updateTime: 'September 7 08:15', reason: 'Added', size: '13.2', credits: '0' }
    ],
    'Unstructured Data Processed': [
      { fileName: 'Weekend pipeline.pdf', fileType: 'PDF', updateTime: 'September 7 10:00', reason: 'Added', size: '14.7', credits: '882' },
      { fileName: 'Weekend batch.html', fileType: 'HTML', updateTime: 'September 7 11:30', reason: 'Updated', size: '13.2', credits: '792' }
    ]
  },
  '9/9/2025': {
    'Batch Data Pipeline': [
      { fileName: 'Tuesday pipeline.pdf', fileType: 'PDF', updateTime: 'September 9 07:00', reason: 'Added', size: '15.8', credits: '0' },
      { fileName: 'Daily batch.html', fileType: 'HTML', updateTime: 'September 9 07:15', reason: 'Added', size: '14.3', credits: '0' }
    ],
    'Unstructured Data Processed': [
      { fileName: 'Tuesday pipeline.pdf', fileType: 'PDF', updateTime: 'September 9 08:45', reason: 'Added', size: '15.8', credits: '948' },
      { fileName: 'Daily batch.html', fileType: 'HTML', updateTime: 'September 9 10:15', reason: 'Updated', size: '14.3', credits: '858' }
    ]
  },
  '9/10/2025': {
    'Unstructured Data Processed': [
      { fileName: 'Wednesday files.pdf', fileType: 'PDF', updateTime: 'September 10 09:00', reason: 'Added', size: '28.6', credits: '3,400' },
      { fileName: 'Midweek data.html', fileType: 'HTML', updateTime: 'September 10 10:30', reason: 'Updated', size: '23.2', credits: '2,800' },
      { fileName: 'Midweek images.png', fileType: 'PNG', updateTime: 'September 10 12:00', reason: 'Added', size: '19.7', credits: '2,400' },
      { fileName: 'Midweek report.docx', fileType: 'Word', updateTime: 'September 10 13:30', reason: 'Updated', size: '16.9', credits: '2,000' }
    ],
    'Batch Data Pipeline': [
      { fileName: 'Wednesday pipeline.pdf', fileType: 'PDF', updateTime: 'September 10 11:00', reason: 'Added', size: '16.4', credits: '1,600' },
      { fileName: 'Midweek batch.html', fileType: 'HTML', updateTime: 'September 10 12:45', reason: 'Updated', size: '15.1', credits: '1,500' }
    ]
  }
};

