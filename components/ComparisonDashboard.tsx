import React from 'react';

const ArrowUpIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
  </svg>
);

const ArrowDownIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
  </svg>
);

interface ComparisonMetricProps {
  current: number;
  previous: number;
  unit: string;
}

const ComparisonMetric: React.FC<ComparisonMetricProps> = ({ current, previous, unit }) => {
  const diff = current - previous;

  if (Math.abs(diff) < 0.01) {
    return null;
  }

  const isPositive = diff > 0;
  const color = isPositive ? 'text-green-400' : 'text-red-400';
  const Icon = isPositive ? ArrowUpIcon : ArrowDownIcon;

  return (
    <div className={`flex items-center text-lg font-semibold ${color} gap-1`}>
      <Icon />
      <span>{isPositive ? '+' : ''}{diff.toFixed(1)} {unit}</span>
    </div>
  );
};

interface ComparisonDashboardProps {
  todayHours: number;
  yesterdayHours: number;
  thisWeekHours: number;
  lastWeekHours: number;
  thisMonthHours: number;
  lastMonthHours: number;
}

const ComparisonCard: React.FC<{title: string, current: number, previous: number, unit: string, period: string}> = ({ title, current, previous, period, unit }) => (
    <div className="flex-1 flex items-center justify-between">
        <div>
            <p className="text-sm text-gray-400">{title}</p>
            <p className="text-4xl font-bold text-white mt-1">
                {current.toFixed(1)}
                <span className="text-xl font-medium text-gray-300 ml-2">{unit}</span>
            </p>
            <p className="text-xs text-gray-500 mt-1">vs. {previous.toFixed(1)} {unit} {period}</p>
        </div>
        <div className="pl-4">
            <ComparisonMetric current={current} previous={previous} unit={unit} />
        </div>
    </div>
);

const ComparisonDashboard: React.FC<ComparisonDashboardProps> = ({
  todayHours,
  yesterdayHours,
  thisWeekHours,
  lastWeekHours,
  thisMonthHours,
  lastMonthHours,
}) => {
  return (
    <div className="border-b border-white/10 pb-6">
        <div className="flex flex-col sm:flex-row gap-8 sm:gap-6 justify-around">
            <ComparisonCard title="Today" current={todayHours} previous={yesterdayHours} period="yesterday" unit="hrs" />
            <ComparisonCard title="This Week" current={thisWeekHours} previous={lastWeekHours} period="last week" unit="hrs" />
            <ComparisonCard title="This Month" current={thisMonthHours} previous={lastMonthHours} period="last month" unit="hrs" />
        </div>
    </div>
  );
};

export default ComparisonDashboard;