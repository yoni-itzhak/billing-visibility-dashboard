interface StatsSectionProps {
  totalCredits: number;
}

export default function StatsSection({ totalCredits }: StatsSectionProps) {
  return (
    <div className="bg-gray-50 p-5 rounded-lg mb-8">
      <h2 className="text-2xl font-semibold text-gray-900">
        Credits Consumed: <span className="text-primary-600">{totalCredits.toLocaleString()}</span>
      </h2>
    </div>
  );
}

