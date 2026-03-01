'use client';

import { useState } from 'react';
import { Calendar } from 'lucide-react';

interface DateRange {
  startDate: Date;
  endDate: Date;
}

interface DateRangePickerProps {
  onDateRangeChange: (range: DateRange) => void;
  initialRange?: DateRange;
}

export const DateRangePicker = ({
  onDateRangeChange,
  initialRange,
}: DateRangePickerProps) => {
  const [preset, setPreset] = useState<
    'today' | 'this-week' | 'this-month' | 'last-month' | 'this-year' | 'custom'
  >('this-month');

  const [customRange, setCustomRange] = useState<DateRange>(
    initialRange || {
      startDate: new Date(new Date().setMonth(new Date().getMonth() - 1)),
      endDate: new Date(),
    }
  );

  const handlePresetChange = (newPreset: typeof preset) => {
    setPreset(newPreset);
    const now = new Date();
    let startDate: Date;

    switch (newPreset) {
      case 'today':
        startDate = new Date(now);
        startDate.setHours(0, 0, 0, 0);
        break;
      case 'this-week':
        startDate = new Date(now);
        startDate.setDate(now.getDate() - now.getDay());
        startDate.setHours(0, 0, 0, 0);
        break;
      case 'this-month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'last-month':
        startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const monthEnd = new Date(now.getFullYear(), now.getMonth(), 0);
        onDateRangeChange({ startDate, endDate: monthEnd });
        return;
      case 'this-year':
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
      default:
        return;
    }

    onDateRangeChange({ startDate, endDate: now });
  };

  const handleCustomDateChange = (field: 'startDate' | 'endDate', value: string) => {
    const newRange = { ...customRange };
    newRange[field] = new Date(value);
    setCustomRange(newRange);

    if (newRange.startDate < newRange.endDate) {
      onDateRangeChange(newRange);
    }
  };

  return (
    <div className="space-y-4 rounded-lg border border-gray-200 bg-white p-4">
      <div className="flex flex-wrap gap-2">
        {(
          [
            { key: 'today', label: 'Today' },
            { key: 'this-week', label: 'This Week' },
            { key: 'this-month', label: 'This Month' },
            { key: 'last-month', label: 'Last Month' },
            { key: 'this-year', label: 'This Year' },
            { key: 'custom', label: 'Custom' },
          ] as const
        ).map((option) => (
          <button
            key={option.key}
            onClick={() => handlePresetChange(option.key)}
            className={`rounded px-3 py-1 text-sm font-medium transition-colors ${
              preset === option.key
                ? 'bg-blue-600 text-white'
                : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      {preset === 'custom' && (
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700">Start Date</label>
            <input
              type="date"
              value={customRange.startDate.toISOString().split('T')[0]}
              onChange={(e) => handleCustomDateChange('startDate', e.target.value)}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700">End Date</label>
            <input
              type="date"
              value={customRange.endDate.toISOString().split('T')[0]}
              onChange={(e) => handleCustomDateChange('endDate', e.target.value)}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            />
          </div>
        </div>
      )}
    </div>
  );
};
