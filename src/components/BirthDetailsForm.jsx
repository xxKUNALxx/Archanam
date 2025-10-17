import React, { useState } from 'react';
import { User, Calendar, MapPin, Loader2, ArrowRight, ArrowLeft } from 'lucide-react';
import TimeSelector from './TimeSelector';
import { validateBirthDetails, commonIndianCities } from '../services/birthDetailsValidator';

const BirthDetailsForm = ({ 
  initialData = {}, 
  onSubmit, 
  loading = false, 
  errors = {}, 
  language = 'en',
  onBack 
}) => {
  const [formData, setFormData] = useState({
    name: initialData.name || '',
    dateOfBirth: initialData.dateOfBirth || '',
    birthTime: initialData.birthTime || { hours: '', minutes: '', period: '' },
    birthPlace: initialData.birthPlace || '',
    ...initialData
  });

  const [localErrors, setLocalErrors] = useState({});
  const [showCitySuggestions, setShowCitySuggestions] = useState(false);
  const [filteredCities, setFilteredCities] = useState([]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error when user starts typing
    if (localErrors[field] || errors[field]) {
      setLocalErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleBirthPlaceChange = (value) => {
    handleInputChange('birthPlace', value);
    
    // Filter cities based on input
    if (value.length > 0) {
      const filtered = commonIndianCities.filter(city =>
        city.toLowerCase().includes(value.toLowerCase())
      ).slice(0, 5); // Show max 5 suggestions
      
      setFilteredCities(filtered);
      setShowCitySuggestions(filtered.length > 0);
    } else {
      setShowCitySuggestions(false);
    }
  };

  const selectCity = (city) => {
    handleInputChange('birthPlace', city);
    setShowCitySuggestions(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form data
    const validation = validateBirthDetails(formData, language);
    
    if (!validation.isValid) {
      setLocalErrors(validation.errors);
      return;
    }

    // Clear local errors and submit
    setLocalErrors({});
    onSubmit(formData);
  };

  // Get current date for max date validation
  const today = new Date().toISOString().split('T')[0];

  // Combine local errors with prop errors
  const allErrors = { ...localErrors, ...errors };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-r from-[#FFB300] to-[#FFC107] rounded-full flex items-center justify-center mx-auto mb-4">
          <User className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          {language === 'hi' ? 'जन्म विवरण' : 'Birth Details'}
        </h2>
        <p className="text-gray-600">
          {language === 'hi' 
            ? 'कुंडली विश्लेषण के लिए सटीक जन्म जानकारी आवश्यक है'
            : 'Accurate birth information is required for Kundali analysis'
          }
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name Field */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            <User className="w-4 h-4 inline mr-2" />
            {language === 'hi' ? 'पूरा नाम' : 'Full Name'} *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#FFB300] focus:border-transparent ${
              allErrors.name ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder={language === 'hi' ? 'आपका पूरा नाम' : 'Your full name'}
          />
          {allErrors.name && (
            <p className="text-red-500 text-sm mt-1 flex items-center">
              <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
              {allErrors.name}
            </p>
          )}
        </div>

        {/* Date of Birth Field */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            <Calendar className="w-4 h-4 inline mr-2" />
            {language === 'hi' ? 'जन्म तिथि' : 'Date of Birth'} *
          </label>
          <input
            type="date"
            value={formData.dateOfBirth}
            onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
            max={today}
            min="1900-01-01"
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#FFB300] focus:border-transparent ${
              allErrors.dateOfBirth ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {allErrors.dateOfBirth && (
            <p className="text-red-500 text-sm mt-1 flex items-center">
              <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
              {allErrors.dateOfBirth}
            </p>
          )}
        </div>

        {/* Birth Time Field */}
        <TimeSelector
          value={formData.birthTime}
          onChange={(time) => handleInputChange('birthTime', time)}
          error={allErrors.birthTime}
          language={language}
        />

        {/* Birth Place Field */}
        <div className="relative">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            <MapPin className="w-4 h-4 inline mr-2" />
            {language === 'hi' ? 'जन्म स्थान' : 'Birth Place'} *
          </label>
          <input
            type="text"
            value={formData.birthPlace}
            onChange={(e) => handleBirthPlaceChange(e.target.value)}
            onFocus={() => {
              if (formData.birthPlace && filteredCities.length > 0) {
                setShowCitySuggestions(true);
              }
            }}
            onBlur={() => {
              // Delay hiding suggestions to allow clicking
              setTimeout(() => setShowCitySuggestions(false), 200);
            }}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#FFB300] focus:border-transparent ${
              allErrors.birthPlace ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder={language === 'hi' ? 'शहर, राज्य' : 'City, State'}
          />
          
          {/* City Suggestions */}
          {showCitySuggestions && filteredCities.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-40 overflow-y-auto">
              {filteredCities.map((city, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => selectCity(city)}
                  className="w-full px-4 py-2 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                >
                  <MapPin className="w-3 h-3 inline mr-2 text-gray-400" />
                  {city}
                </button>
              ))}
            </div>
          )}
          
          {allErrors.birthPlace && (
            <p className="text-red-500 text-sm mt-1 flex items-center">
              <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
              {allErrors.birthPlace}
            </p>
          )}
          
          {!allErrors.birthPlace && (
            <p className="text-gray-500 text-xs mt-1">
              {language === 'hi' 
                ? 'जन्म स्थान का सटीक नाम दर्ज करें (शहर, राज्य)'
                : 'Enter exact birth place (City, State)'
              }
            </p>
          )}
        </div>

        {/* Important Note */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h4 className="font-semibold text-yellow-800 mb-2">
            {language === 'hi' ? '⚠️ महत्वपूर्ण सूचना' : '⚠️ Important Note'}
          </h4>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>
              {language === 'hi' 
                ? '• सटीक जन्म समय कुंडली की शुद्धता के लिए अत्यंत महत्वपूर्ण है'
                : '• Exact birth time is crucial for accurate Kundali analysis'
              }
            </li>
            <li>
              {language === 'hi' 
                ? '• यदि सटीक समय पता नहीं है, तो अनुमानित समय दर्ज करें'
                : '• If exact time is unknown, enter approximate time'
              }
            </li>
            <li>
              {language === 'hi' 
                ? '• जन्म स्थान का सही नाम दर्ज करना आवश्यक है'
                : '• Correct birth place name is essential'
              }
            </li>
          </ul>
        </div>

        {/* Form Actions */}
        <div className="flex space-x-4 pt-6">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="flex-1 bg-gray-500 text-white py-3 rounded-lg font-semibold hover:bg-gray-600 transition-colors flex items-center justify-center"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              {language === 'hi' ? 'वापस' : 'Back'}
            </button>
          )}
          
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-gradient-to-r from-[#FFB300] to-[#FFC107] text-white py-3 rounded-lg font-semibold hover:from-[#FFC107] hover:to-[#FFD54F] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                {language === 'hi' ? 'प्रक्रिया जारी...' : 'Processing...'}
              </>
            ) : (
              <>
                {language === 'hi' ? 'भुगतान के लिए आगे बढ़ें' : 'Proceed to Payment'}
                <ArrowRight className="w-5 h-5 ml-2" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BirthDetailsForm;