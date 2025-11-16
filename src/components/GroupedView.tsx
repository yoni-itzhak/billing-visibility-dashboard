import { useState } from 'react';
import { MeterType, FileDetailsByDate } from '../types';

interface GroupedViewProps {
  filesByMeter: { [key in MeterType]?: any[] };
}

const meterTypes: MeterType[] = ['Unstructured Data Processed', 'Batch Data Pipeline'];
const meterColors: Record<MeterType, string> = {
  'Unstructured Data Processed': '#ff9500',
  'Batch Data Pipeline': '#5ac8fa',
};

export default function GroupedView({ filesByMeter }: GroupedViewProps) {
  const [expandedSections, setExpandedSections] = useState<Set<MeterType>>(new Set());

  const toggleSection = (meterType: MeterType) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(meterType)) {
      newExpanded.delete(meterType);
    } else {
      newExpanded.add(meterType);
    }
    setExpandedSections(newExpanded);
  };

  return (
    <div className="space-y-4">
      {meterTypes.map(meterType => {
        let files = filesByMeter[meterType] || [];
        
        // Batch Data Pipeline and Unstructured Data Processed show the same files
        if (meterType === 'Batch Data Pipeline' && filesByMeter['Unstructured Data Processed']) {
          files = filesByMeter['Unstructured Data Processed'];
        }

        if (files.length === 0) return null;

        // Calculate credits
        let totalCredits = 0;
        files.forEach((file: any) => {
          if (meterType === 'Unstructured Data Processed') {
            const sizeMB = parseFloat(file.size) || 0;
            totalCredits += sizeMB * 60;
          } else if (meterType === 'Batch Data Pipeline') {
            totalCredits += 2000 / 1000000;
          }
        });

        const creditsDisplay = totalCredits >= 1
          ? Math.round(totalCredits).toLocaleString()
          : totalCredits.toFixed(4);

        const isExpanded = expandedSections.has(meterType);
        const timeHeader = meterType === 'Unstructured Data Processed' ? 'Indexing Time' : 'Update Time';
        const showCreditsColumn = meterType === 'Unstructured Data Processed';

        const connectorTypes = ['Google Drive', 'Web Crawler', 'SharePoint'];
        const connectorNames: Record<string, string> = {
          'Google Drive': 'ACME Drive',
          'Web Crawler': 'ACME Website',
          'SharePoint': 'ACME Sharepoint'
        };

        return (
          <div key={meterType} className="mb-4">
            <div
              onClick={() => toggleSection(meterType)}
              className="flex items-center gap-2.5 p-3 bg-gray-200 rounded-md cursor-pointer hover:bg-gray-300 transition-colors select-none"
            >
              <div
                className="w-5 h-5 rounded"
                style={{ backgroundColor: meterColors[meterType] }}
              />
              <span className="font-semibold text-gray-900">
                {meterType} ({creditsDisplay} credits)
              </span>
              <span className={`ml-auto transition-transform ${isExpanded ? 'rotate-90' : ''}`}>
                ▶
              </span>
            </div>
            <div
              className={`overflow-hidden transition-all duration-500 ${
                isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
              }`}
            >
              <div className="pt-4">
                <div className="grid gap-3">
                  <div
                    className={`grid gap-4 p-3 bg-gray-200 rounded-lg font-semibold text-sm text-gray-700 ${
                      showCreditsColumn
                        ? 'grid-cols-[2fr_1fr_1.5fr_1fr_1fr_1.2fr_1.2fr_1fr]'
                        : 'grid-cols-[2fr_1fr_1.5fr_1fr_1fr_1.2fr_1.2fr]'
                    }`}
                  >
                    <div>File Name</div>
                    <div>File Type</div>
                    <div>{timeHeader}</div>
                    <div>Update Reason</div>
                    <div>Size (MB)</div>
                    <div>Connector Type</div>
                    <div>Connector Name</div>
                    {showCreditsColumn && <div>Credits Consumed</div>}
                  </div>
                  {files.map((file: any, index: number) => {
                    let fileCredits = 0;
                    if (meterType === 'Unstructured Data Processed') {
                      const sizeMB = parseFloat(file.size) || 0;
                      fileCredits = sizeMB * 60;
                    } else if (meterType === 'Batch Data Pipeline') {
                      fileCredits = 2000 / 1000000;
                    }

                    const fileCreditsDisplay = fileCredits >= 1
                      ? Math.round(fileCredits).toLocaleString()
                      : fileCredits.toFixed(4);

                    const fileNameHash = file.fileName.split('').reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0);
                    const connectorType = file.connectorType || connectorTypes[fileNameHash % connectorTypes.length];
                    const connectorName = file.connectorName || connectorNames[connectorType];

                    const reasonClasses = {
                      'Added': 'bg-green-100 text-green-800',
                      'Updated': 'bg-yellow-100 text-yellow-800',
                      'Deleted': 'bg-red-100 text-red-800',
                    };

                    return (
                      <div
                        key={`${file.fileName}-${index}`}
                        className={`grid gap-4 p-4 bg-gray-50 rounded-lg border-l-4 border-primary-500 hover:bg-gray-100 ${
                          showCreditsColumn
                            ? 'grid-cols-[2fr_1fr_1.5fr_1fr_1fr_1.2fr_1.2fr_1fr]'
                            : 'grid-cols-[2fr_1fr_1.5fr_1fr_1fr_1.2fr_1.2fr]'
                        }`}
                      >
                        <div className="font-medium text-gray-900">{file.fileName}</div>
                        <div className="text-gray-600 text-sm">{file.fileType}</div>
                        <div className="text-gray-600 text-sm">{file.updateTime}</div>
                        <div>
                          <span className={`px-3 py-1 rounded-xl text-xs font-semibold ${reasonClasses[file.reason as keyof typeof reasonClasses]}`}>
                            {file.reason}
                          </span>
                        </div>
                        <div className="text-gray-600 text-sm font-medium">{file.size} MB</div>
                        <div>{connectorType}</div>
                        <div>{connectorName}</div>
                        {showCreditsColumn && (
                          <div className="text-gray-600 text-sm font-medium">{fileCreditsDisplay}</div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

