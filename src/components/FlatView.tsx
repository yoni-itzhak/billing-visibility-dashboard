import { useState, useMemo } from 'react';
import { FlatTableRow, ConnectorType } from '../types';
import MultiSelect from './MultiSelect';

interface FlatViewProps {
  data: FlatTableRow[];
}

type SortColumn = keyof FlatTableRow | null;
type SortDirection = 'asc' | 'desc';

export default function FlatView({ data }: FlatViewProps) {
  const [sortColumn, setSortColumn] = useState<SortColumn>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [filters, setFilters] = useState({
    fileName: '',
    fileType: '',
    actionType: '',
    connectorType: [] as string[],
    connectorName: [] as string[],
    ingestionId: '',
  });

  const connectorTypes: ConnectorType[] = ['Google Drive', 'Web Crawler', 'SharePoint'];
  const connectorNames = useMemo(() => {
    const names = new Set<string>();
    data.forEach(row => {
      if (row.udmoName) names.add(row.udmoName);
    });
    return Array.from(names).sort();
  }, [data]);

  const ingestionIds = useMemo(() => {
    const ids = new Set<string>();
    data.forEach(row => {
      if (row.ingestionId) ids.add(row.ingestionId);
    });
    return Array.from(ids).sort();
  }, [data]);

  const filteredAndSortedData = useMemo(() => {
    let filtered = data.filter(row => {
      return (
        (!filters.fileName || row.fileName.toLowerCase().includes(filters.fileName.toLowerCase())) &&
        (!filters.fileType || row.fileType === filters.fileType) &&
        (!filters.actionType || row.actionType === filters.actionType) &&
        (!filters.ingestionId || row.ingestionId === filters.ingestionId) &&
        (filters.connectorType.length === 0 || filters.connectorType.includes(row.connectorType)) &&
        (filters.connectorName.length === 0 || filters.connectorName.includes(row.udmoName))
      );
    });

    if (sortColumn) {
      filtered.sort((a, b) => {
        const aVal = a[sortColumn];
        const bVal = b[sortColumn];
        let comparison = 0;

        if (aVal === null || aVal === undefined) return 1;
        if (bVal === null || bVal === undefined) return -1;

        if (typeof aVal === 'string' && typeof bVal === 'string') {
          comparison = aVal.toLowerCase().localeCompare(bVal.toLowerCase());
        } else if (typeof aVal === 'number' && typeof bVal === 'number') {
          comparison = aVal - bVal;
        }

        return sortDirection === 'asc' ? comparison : -comparison;
      });
    }

    // Group by ingestion ID
    const grouped: { [key: string]: FlatTableRow[] } = {};
    filtered.forEach(row => {
      const id = row.ingestionId || 'no-id';
      if (!grouped[id]) grouped[id] = [];
      grouped[id].push(row);
    });

    // Sort groups
    const sortedGroupIds = Object.keys(grouped).sort((a, b) => {
      if (sortColumn === 'ingestionId') {
        return sortDirection === 'asc' ? a.localeCompare(b) : b.localeCompare(a);
      }
      return 0;
    });

    // Flatten back with grouping
    const result: FlatTableRow[] = [];
    sortedGroupIds.forEach(groupId => {
      const group = grouped[groupId];
      group.sort((a, b) => {
        if (a.fileName === b.fileName && a.actionType !== b.actionType) {
          if (a.actionType === 'Ingestion' && b.actionType === 'Indexing') return -1;
          if (a.actionType === 'Indexing' && b.actionType === 'Ingestion') return 1;
        }
        return 0;
      });
      result.push(...group);
    });

    return { data: result, grouped };
  }, [data, filters, sortColumn, sortDirection]);

  const handleSort = (column: SortColumn) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const clearFilters = () => {
    setFilters({
      fileName: '',
      fileType: '',
      actionType: '',
      connectorType: [],
      connectorName: [],
      ingestionId: '',
    });
  };

  const getSortIndicator = (column: SortColumn) => {
    if (sortColumn !== column) return ' ↕';
    return sortDirection === 'asc' ? ' ↑' : ' ↓';
  };

  return (
    <div>
      <div className="flex flex-wrap gap-4 mb-5 p-4 bg-gray-50 rounded-lg items-end">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">File Name</label>
          <input
            type="text"
            value={filters.fileName}
            onChange={(e) => setFilters({ ...filters, fileName: e.target.value })}
            placeholder="Search file name..."
            className="px-3 py-2 border border-gray-300 rounded-md text-sm min-w-[180px] focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">File Type</label>
          <select
            value={filters.fileType}
            onChange={(e) => setFilters({ ...filters, fileType: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm min-w-[180px] bg-white focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">All Types</option>
            <option value="PDF">PDF</option>
            <option value="HTML">HTML</option>
            <option value="PNG">PNG</option>
            <option value="Word">Word</option>
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Action Type</label>
          <select
            value={filters.actionType}
            onChange={(e) => setFilters({ ...filters, actionType: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm min-w-[180px] bg-white focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">All Actions</option>
            <option value="Ingestion">Ingestion</option>
            <option value="Indexing">Indexing</option>
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Connector Type</label>
          <MultiSelect
            options={connectorTypes}
            selected={filters.connectorType}
            onChange={(selected) => setFilters({ ...filters, connectorType: selected })}
            placeholder="All Types"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Connector Name</label>
          <MultiSelect
            options={connectorNames}
            selected={filters.connectorName}
            onChange={(selected) => setFilters({ ...filters, connectorName: selected })}
            placeholder="All Names"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">File Processing ID</label>
          <select
            value={filters.ingestionId}
            onChange={(e) => setFilters({ ...filters, ingestionId: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm min-w-[180px] bg-white focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">All IDs</option>
            {ingestionIds.map(id => (
              <option key={id} value={id}>{id}</option>
            ))}
          </select>
        </div>

        <button
          onClick={clearFilters}
          className="px-4 py-2 border border-gray-300 bg-white rounded-md text-sm text-gray-600 hover:bg-gray-50 whitespace-nowrap"
        >
          Clear Filters
        </button>
      </div>

      <div className="overflow-x-auto overflow-y-auto max-h-[600px] border border-gray-200 rounded-lg">
        <table className="w-full border-collapse bg-white">
          <thead className="bg-gray-200 sticky top-0 z-10">
            <tr>
              {(['fileName', 'fileType', 'actionType', 'time', 'size', 'reason', 'connectorType', 'udmoName', 'ingestionId', 'credits'] as const).map(column => (
                <th
                  key={column}
                  onClick={() => handleSort(column)}
                  className="px-4 py-3.5 text-left text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-300 select-none"
                >
                  {column === 'fileName' ? 'File Name' :
                   column === 'fileType' ? 'File Type' :
                   column === 'actionType' ? 'Action Type' :
                   column === 'time' ? 'Time' :
                   column === 'size' ? 'Size (MB)' :
                   column === 'reason' ? 'Update Reason' :
                   column === 'connectorType' ? 'Connector Type' :
                   column === 'udmoName' ? 'UDMO Name' :
                   column === 'ingestionId' ? 'File Processing ID' :
                   'Credits Consumed'}
                  <span className="opacity-50 text-xs">{getSortIndicator(column)}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredAndSortedData.data.length === 0 ? (
              <tr>
                <td colSpan={10} className="px-4 py-10 text-center text-gray-500">
                  No files match the filters.
                </td>
              </tr>
            ) : (
              filteredAndSortedData.data.map((row, index) => {
                const creditsDisplay = row.credits !== null && row.credits !== undefined
                  ? (row.credits >= 1
                      ? Math.round(row.credits).toLocaleString()
                      : row.credits.toFixed(2))
                  : '';

                const isEven = index % 2 === 0;
                const bgColor = row.actionType === 'Ingestion'
                  ? (isEven ? '#f9f9f9' : '#ffffff')
                  : (isEven ? '#f5f5f5' : '#fafafa');

                const reasonClasses = {
                  'Added': 'bg-green-100 text-green-800',
                  'Updated': 'bg-yellow-100 text-yellow-800',
                  'Deleted': 'bg-red-100 text-red-800',
                };

                return (
                  <tr key={`${row.fileName}-${row.actionType}-${index}`} style={{ backgroundColor: bgColor }} className="hover:bg-gray-100">
                    <td className="px-4 py-3.5 text-sm">{row.fileName}</td>
                    <td className="px-4 py-3.5 text-sm">{row.fileType}</td>
                    <td className="px-4 py-3.5 text-sm">
                      <span className={`px-2.5 py-1 rounded-xl text-xs font-semibold uppercase ${
                        row.actionType === 'Ingestion' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'
                      }`}>
                        {row.actionType}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-sm">{row.time}</td>
                    <td className="px-4 py-3.5 text-sm">{row.size.toFixed(2)}</td>
                    <td className="px-4 py-3.5 text-sm">
                      <span className={`px-2.5 py-1 rounded-xl text-xs font-semibold ${reasonClasses[row.reason]}`}>
                        {row.reason}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-sm">{row.connectorType || ''}</td>
                    <td className="px-4 py-3.5 text-sm">{row.udmoName || ''}</td>
                    <td className="px-4 py-3.5 text-sm font-semibold">{row.ingestionId || ''}</td>
                    <td className="px-4 py-3.5 text-sm">{creditsDisplay}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

