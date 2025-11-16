import { ConsumptionPeriod } from '../types';
import { orgIdSuggestions } from '../data/mockData';
import Dropdown from './Dropdown';

interface ControlsProps {
  orgId: string;
  period: ConsumptionPeriod;
  onOrgIdChange: (value: string) => void;
  onPeriodChange: (value: ConsumptionPeriod) => void;
}

export default function Controls({
  orgId,
  period,
  onOrgIdChange,
  onPeriodChange,
}: ControlsProps) {
  return (
    <div className="flex flex-wrap gap-5 mb-8 items-end">
      <div className="flex flex-col gap-2">
        <label htmlFor="orgId" className="text-sm font-medium text-gray-600">
          Organization ID
        </label>
        <Dropdown
          id="orgId"
          value={orgId}
          suggestions={orgIdSuggestions}
          placeholder="Search org ID..."
          onChange={onOrgIdChange}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="consumptionPeriod" className="text-sm font-medium text-gray-600">
          Consumption Period
        </label>
        <select
          id="consumptionPeriod"
          value={period}
          onChange={(e) => {
            const value = e.target.value as ConsumptionPeriod;
            if (value === 'custom') {
              alert('Custom date range selection will be implemented in the full version.');
              return;
            }
            onPeriodChange(value);
          }}
          className="px-3 py-2.5 border border-gray-300 rounded-md text-sm min-w-[200px] bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        >
          <option value="24h">Last 24 Hours</option>
          <option value="7d">Last 7 Days</option>
          <option value="30d">Last 30 Days</option>
          <option value="90d">Last 90 Days</option>
          <option value="custom">Custom</option>
        </select>
      </div>
    </div>
  );
}

