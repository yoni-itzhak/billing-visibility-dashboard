import { ConsumptionPeriod } from '../types';
import { allAlerts } from '../data/mockData';
import { isDateInPeriod } from '../utils/dataGenerator';
import { useState } from 'react';

interface AlertsSectionProps {
  period: ConsumptionPeriod;
}

export default function AlertsSection({ period }: AlertsSectionProps) {
  const [alerts, setAlerts] = useState(allAlerts);

  const activeAlerts = alerts.filter(alert => {
    if (alert.mitigated) return false;
    return isDateInPeriod(alert.dateValue, period);
  });

  const overallStatus = activeAlerts.length === 0
    ? 'none'
    : activeAlerts.some(a => a.severity === 'High')
    ? 'high'
    : activeAlerts.some(a => a.severity === 'Medium')
    ? 'medium'
    : 'low';

  const mitigateAlert = (alertId: number) => {
    setAlerts(alerts.map(alert =>
      alert.id === alertId ? { ...alert, mitigated: true } : alert
    ));
  };

  const statusDotColors = {
    none: 'bg-green-500',
    low: 'bg-blue-500',
    medium: 'bg-yellow-500',
    high: 'bg-red-500',
  };

  const severityClasses = {
    High: 'bg-red-100 text-red-800',
    Medium: 'bg-yellow-100 text-yellow-800',
    Low: 'bg-blue-100 text-blue-800',
  };

  return (
    <div className="mb-8 bg-gray-50 rounded-lg p-5 border border-gray-200">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2.5">
          Alerts
          <span className={`w-3 h-3 rounded-full transition-colors ${statusDotColors[overallStatus]}`} />
        </h2>
      </div>
      <table className="w-full border-collapse bg-white rounded-lg overflow-hidden">
        <thead className="bg-gray-200">
          <tr>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Description</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Severity</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Action</th>
          </tr>
        </thead>
        <tbody>
          {activeAlerts.length === 0 ? (
            <tr>
              <td colSpan={4} className="px-4 py-10 text-center text-gray-500 italic">
                No active alerts
              </td>
            </tr>
          ) : (
            activeAlerts.map(alert => (
              <tr key={alert.id} className="hover:bg-gray-50 border-b border-gray-100 last:border-b-0">
                <td className="px-4 py-3 text-sm">{alert.description}</td>
                <td className="px-4 py-3 text-sm">{alert.date}</td>
                <td className="px-4 py-3 text-sm">
                  <span className={`px-2.5 py-1 rounded-xl text-xs font-semibold uppercase inline-block ${severityClasses[alert.severity]}`}>
                    {alert.severity}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm">
                  <button
                    onClick={() => mitigateAlert(alert.id)}
                    className="px-3 py-1.5 border border-primary-500 bg-white text-primary-500 rounded text-xs hover:bg-primary-500 hover:text-white transition-colors"
                  >
                    Mitigate
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

