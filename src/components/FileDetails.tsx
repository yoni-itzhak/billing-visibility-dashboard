import { useState, useMemo } from 'react';
import { ConsumptionPeriod, FileDetailsByDate, MeterType, FlatTableRow, ActionType, ConnectorType, UpdateReason, FileDetail } from '../types';
import { generateProcessingId, parseTimeForGrouping } from '../utils/dataGenerator';
import FlatView from './FlatView';
import GroupedView from './GroupedView';

interface FileDetailsProps {
  fileDetails: FileDetailsByDate;
  selectedDate: string | null;
  period: ConsumptionPeriod;
  onShowPeriod: () => void;
}

export default function FileDetails({
  fileDetails,
  selectedDate,
  period,
  onShowPeriod,
}: FileDetailsProps) {
  const [view, setView] = useState<'flat' | 'grouped'>('flat');

  const filesByMeter = useMemo(() => {
    let result: { [key in MeterType]?: any[] } = {};
    let headerText = '';

    if (selectedDate === null) {
      // Aggregate all files from all dates in the period
      Object.keys(fileDetails).forEach(dateKey => {
        const dateFiles = fileDetails[dateKey];
        Object.keys(dateFiles).forEach(meterType => {
          const typedMeterType = meterType as MeterType;
          if (!result[typedMeterType]) {
            result[typedMeterType] = [];
          }
          result[typedMeterType] = result[typedMeterType]!.concat(dateFiles[typedMeterType] || []);
        });
      });
      const periodLabels: Record<ConsumptionPeriod, string> = {
        '24h': 'Last 24 hours',
        '7d': 'Last 7 days',
        '30d': 'Last 30 days',
        '90d': 'Last 90 days',
        'custom': 'Custom period',
      };
      headerText = `File Consumption Details - ${periodLabels[period] || period}`;
    } else {
      result = fileDetails[selectedDate] || {};
      headerText = `File Consumption Details - ${selectedDate}`;
    }

    return { filesByMeter: result, headerText };
  }, [fileDetails, selectedDate, period]);

  const flatTableData = useMemo(() => {
    const data: FlatTableRow[] = [];
    const unstructuredFiles = filesByMeter.filesByMeter['Unstructured Data Processed'] || [];
    const pipelineFiles = filesByMeter.filesByMeter['Batch Data Pipeline'] || [];

    // Generate File Processing IDs - files ingested together in the same flow share the same ID
    let ingestionIdCounter = 0;
    const ingestionBatches: Array<{ id: string; startTime: string; files: FileDetail[] }> = [];

    const sortedPipelineFiles = [...pipelineFiles].sort((a, b) => {
      const timeA = parseTimeForGrouping(a.updateTime);
      const timeB = parseTimeForGrouping(b.updateTime);
      if (timeA.dateKey !== timeB.dateKey) {
        return timeA.dateKey.localeCompare(timeB.dateKey);
      }
      return timeA.minutes - timeB.minutes;
    });

    sortedPipelineFiles.forEach((file) => {
      const fileTime = parseTimeForGrouping(file.updateTime);
      let assignedBatch: { id: string; startTime: string; files: FileDetail[] } | null = null;
      for (let batch of ingestionBatches) {
        const batchTime = parseTimeForGrouping(batch.startTime);
        if (batchTime.dateKey === fileTime.dateKey &&
            Math.abs(fileTime.minutes - batchTime.minutes) <= 30) {
          assignedBatch = batch;
          break;
        }
      }

      if (!assignedBatch) {
        assignedBatch = {
          id: generateProcessingId(ingestionIdCounter++),
          startTime: file.updateTime,
          files: []
        };
        ingestionBatches.push(assignedBatch);
      }

      assignedBatch.files.push(file);
    });

    const fileIngestionMap = new Map<string, { processingId: string; connectorType: ConnectorType; connectorName: string; reason: UpdateReason }>();
    const connectorTypes: ConnectorType[] = ['Google Drive', 'Web Crawler', 'SharePoint'];
    const connectorNames: Record<ConnectorType, string> = {
      'Google Drive': 'ACME Drive',
      'Web Crawler': 'ACME Website',
      'SharePoint': 'ACME Sharepoint'
    };

    ingestionBatches.forEach((batch) => {
      batch.files.forEach((file) => {
        const sizeMB = parseFloat(file.size) || 0;
        const fileNameHash = file.fileName.split('').reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0);
        const connectorType: ConnectorType = file.connectorType || connectorTypes[fileNameHash % connectorTypes.length];
        const connectorName = file.connectorName || connectorNames[connectorType];
        const processingId = batch.id;

        fileIngestionMap.set(file.fileName, {
          processingId,
          connectorType,
          connectorName,
          reason: file.reason
        });

        data.push({
          fileName: file.fileName,
          fileType: file.fileType,
          actionType: 'Ingestion' as ActionType,
          time: file.updateTime,
          size: sizeMB,
          reason: file.reason,
          connectorType,
          udmoName: connectorName,
          ingestionId: processingId,
          credits: null
        });
      });
    });

    const indexedFiles = new Set<string>();
    unstructuredFiles.forEach((file) => {
      const sizeMB = parseFloat(file.size) || 0;
      const credits = sizeMB * 60;
      const fileNameHash = file.fileName.split('').reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0);
      const connectorType: ConnectorType = file.connectorType || connectorTypes[fileNameHash % connectorTypes.length];
      const connectorName = file.connectorName || connectorNames[connectorType];

      let ingestionId: string;
      let reason: UpdateReason;
      if (fileIngestionMap.has(file.fileName)) {
        const ingestionInfo = fileIngestionMap.get(file.fileName)!;
        ingestionId = ingestionInfo.processingId;
        // Use the reason from ingestion to ensure consistency
        reason = ingestionInfo.reason;
      } else {
        ingestionId = generateProcessingId(ingestionIdCounter++);
        // If no ingestion event, use the reason from the indexing file
        reason = file.reason;
      }

      indexedFiles.add(file.fileName);

      data.push({
        fileName: file.fileName,
        fileType: file.fileType,
        actionType: 'Indexing' as ActionType,
        time: file.updateTime,
        size: sizeMB,
        reason,
        connectorType,
        udmoName: connectorName,
        ingestionId,
        credits
      });
    });

    fileIngestionMap.forEach((ingestionInfo, fileName) => {
      if (!indexedFiles.has(fileName)) {
        const ingestionRow = data.find(row =>
          row.fileName === fileName && row.actionType === 'Ingestion'
        );

        if (ingestionRow) {
          const sizeMB = ingestionRow.size;
          const credits = sizeMB * 60;
          const timeMatch = ingestionRow.time.match(/(\w+)\s+(\d+)\s+(\d+):(\d+)/);
          let indexingTimeStr = ingestionRow.time;

          if (timeMatch) {
            const [, month, day, hour] = timeMatch;
            const hourNum = parseInt(hour);
            const newHour = (hourNum + 1) % 24;
            const newHourStr = newHour.toString().padStart(2, '0');
            indexingTimeStr = `${month} ${day} ${newHourStr}:${timeMatch[4]}`;
          } else {
            indexingTimeStr = ingestionRow.time + ' +1h';
          }

          data.push({
            fileName,
            fileType: ingestionRow.fileType,
            actionType: 'Indexing' as ActionType,
            time: indexingTimeStr,
            size: sizeMB,
            reason: ingestionRow.reason,
            connectorType: ingestionRow.connectorType,
            udmoName: ingestionRow.udmoName,
            ingestionId: ingestionInfo.processingId,
            credits
          });
        }
      }
    });

    return data;
  }, [filesByMeter]);

  if (Object.keys(filesByMeter.filesByMeter).length === 0) {
    return null;
  }

  return (
    <div className="mt-10">
      <div className="flex items-center justify-between mb-5 pb-3 border-b-2 border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900">
          {filesByMeter.headerText}
        </h2>
        {selectedDate !== null && (
          <button
            onClick={onShowPeriod}
            className="px-3 py-1.5 border border-primary-500 bg-white text-primary-500 rounded text-sm hover:bg-primary-500 hover:text-white transition-colors"
          >
            Show Selected Period
          </button>
        )}
      </div>

      <div className="flex gap-2.5 mb-5 p-3 bg-gray-50 rounded-lg items-center">
        <label className="text-sm font-medium text-gray-600">View:</label>
        <div className="flex gap-2">
          <button
            onClick={() => setView('flat')}
            className={`px-4 py-2 border rounded-md text-sm transition-colors ${
              view === 'flat'
                ? 'bg-primary-500 text-white border-primary-500'
                : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
            }`}
          >
            Updated Files
          </button>
          <button
            onClick={() => setView('grouped')}
            className={`px-4 py-2 border rounded-md text-sm transition-colors ${
              view === 'grouped'
                ? 'bg-primary-500 text-white border-primary-500'
                : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
            }`}
          >
            Group by Meter
          </button>
        </div>
      </div>

      {view === 'flat' ? (
        <FlatView data={flatTableData} />
      ) : (
        <GroupedView filesByMeter={filesByMeter.filesByMeter} />
      )}
    </div>
  );
}

