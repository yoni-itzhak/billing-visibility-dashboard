import { useState, useMemo } from 'react';
import { ConsumptionPeriod } from '../types';
import { generateMockData } from '../utils/dataGenerator';
import Controls from './Controls';
import AlertsSection from './AlertsSection';
import StatsSection from './StatsSection';
import CreditsChart from './CreditsChart';
import FileDetails from './FileDetails';

export default function Dashboard() {
  const [orgId, setOrgId] = useState('00D4J0000001wpEUAQ');
  const [period, setPeriod] = useState<ConsumptionPeriod>('30d');
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const consumptionData = useMemo(() => generateMockData(period), [period]);

  const totalCredits = useMemo(() => {
    return consumptionData.datasets.reduce((total, dataset) => {
      return total + dataset.data.reduce((sum, val) => sum + val, 0);
    }, 0);
  }, [consumptionData]);

  const handleDateClick = (date: string) => {
    setSelectedDate(date);
  };

  const handleShowPeriod = () => {
    setSelectedDate(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-5 px-5">
      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-sm p-8">
        <h1 className="text-3xl font-semibold text-gray-900 mb-8">
          Credits Consumption Dashboard - ACME Corporation
        </h1>

        <Controls
          orgId={orgId}
          period={period}
          onOrgIdChange={setOrgId}
          onPeriodChange={setPeriod}
        />

        <AlertsSection period={period} />

        <StatsSection totalCredits={totalCredits} />

        <CreditsChart
          data={consumptionData}
          onDateClick={handleDateClick}
        />

        <FileDetails
          fileDetails={consumptionData.fileDetails}
          selectedDate={selectedDate}
          period={period}
          onShowPeriod={handleShowPeriod}
        />
      </div>
    </div>
  );
}

