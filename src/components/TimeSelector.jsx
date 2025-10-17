import React from 'react';
import { Clock } from 'lucide-react';

const TimeSelector = ({ value, onChange, error, language = 'en' }) => {
  // Generate hour options (1-12)
  const hourOptions = Array.from({ length: 12 }, (_, i) => i + 1);
  
  // Generate minute options (0-59 in 5-minute intervals)
  const minuteOptions = Array.from({ length: 12 }, (_, i) => i * 5);

  const handleHourChange = (hours) => {
    onChange({
      ...value,
      hours: parseInt(hours)
    });
  };

  const handleMinuteChange = (minutes) => {
    onChange({
      ...value,
      minutes: parseInt(minutes)
    });
  };

  const handlePeriodChange = (period) => {
    onChange({
      ...value,
      period: period
    });
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        <Clock className="w-4 h-4 inline mr-2" />
        {language === 'hi' ? 'जन्म समय' : 'Birth Time'} *
      </label>
      
      <div className="flex space-x-2">
        {/* Hours Dropdown */}
        <div className="flex-1">
          <select
            value={value?.hours || ''}
            onChange={(e) => handleHourChange(e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#FFB300] focus:border-transparent ${
              error ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">
              {language === 'hi' ? 'घंटा' : 'Hour'}
            </option>
            {hourOptions.map(hour => (
              <option key={hour} value={hour}>
                {hour.toString().padStart(2, '0')}
              </option>
            ))}
          </select>
        </div>

        {/* Colon Separator */}
        <div className="flex items-center text-2xl font-bold text-gray-500">
          :
        </div>

        {/* Minutes Dropdown */}
        <div className="flex-1">
          <select
            value={value?.minutes !== undefined ? value.minutes : ''}
            onChange={(e) => handleMinuteChange(e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#FFB300] focus:border-transparent ${
              error ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">
              {language === 'hi' ? 'मिनट' : 'Min'}
            </option>
            {minuteOptions.map(minute => (
              <option key={minute} value={minute}>
                {minute.toString().padStart(2, '0')}
              </option>
            ))}
          </select>
        </div>

        {/* AM/PM Toggle */}
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button
            type="button"
            onClick={() => handlePeriodChange('AM')}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
              value?.period === 'AM'
                ? 'bg-[#FFB300] text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            AM
          </button>
          <button
            type="button"
            onClick={() => handlePeriodChange('PM')}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
              value?.period === 'PM'
                ? 'bg-[#FFB300] text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            PM
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <p className="text-red-500 text-sm mt-1 flex items-center">
          <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
          {error}
        </p>
      )}

      {/* Helper Text */}
      {!error && (
        <p className="text-gray-500 text-xs mt-1">
          {language === 'hi' 
            ? 'कृपया सटीक जन्म समय दर्ज करें (12-घंटे प्रारूप में)'
            : 'Please enter exact birth time (in 12-hour format)'
          }
        </p>
      )}
    </div>
  );
};

export default TimeSelector;