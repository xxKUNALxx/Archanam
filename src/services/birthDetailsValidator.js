// Birth details validation service for Kundali analysis
// Provides validation functions and bilingual error messages

// Bilingual error messages
const errorMessages = {
  name: {
    required: { hi: 'नाम आवश्यक है', en: 'Name is required' },
    invalid: { hi: 'वैध नाम दर्ज करें (केवल अक्षर, स्पेस, हाइफन)', en: 'Enter a valid name (letters, spaces, hyphens only)' },
    tooShort: { hi: 'नाम कम से कम 2 अक्षर का होना चाहिए', en: 'Name must be at least 2 characters' },
    tooLong: { hi: 'नाम 50 अक्षरों से अधिक नहीं हो सकता', en: 'Name cannot exceed 50 characters' }
  },
  dateOfBirth: {
    required: { hi: 'जन्म तिथि आवश्यक है', en: 'Date of birth is required' },
    future: { hi: 'भविष्य की तारीख नहीं हो सकती', en: 'Date cannot be in future' },
    invalid: { hi: 'वैध तारीख दर्ज करें', en: 'Enter a valid date' },
    tooOld: { hi: 'जन्म तिथि 1900 के बाद की होनी चाहिए', en: 'Birth date must be after 1900' }
  },
  birthTime: {
    required: { hi: 'जन्म समय आवश्यक है', en: 'Birth time is required' },
    invalid: { hi: 'वैध समय दर्ज करें', en: 'Enter a valid time' },
    hoursRequired: { hi: 'घंटा चुनें (1-12)', en: 'Select hour (1-12)' },
    minutesRequired: { hi: 'मिनट चुनें (0-59)', en: 'Select minutes (0-59)' },
    periodRequired: { hi: 'AM/PM चुनें', en: 'Select AM/PM' }
  },
  birthPlace: {
    required: { hi: 'जन्म स्थान आवश्यक है', en: 'Birth place is required' },
    invalid: { hi: 'वैध स्थान नाम दर्ज करें', en: 'Enter a valid place name' },
    tooShort: { hi: 'स्थान का नाम कम से कम 2 अक्षर का होना चाहिए', en: 'Place name must be at least 2 characters' },
    tooLong: { hi: 'स्थान का नाम 100 अक्षरों से अधिक नहीं हो सकता', en: 'Place name cannot exceed 100 characters' }
  }
};

// Validation functions
export function validateName(name, language = 'en') {
  if (!name || !name.trim()) {
    return { isValid: false, error: errorMessages.name.required[language] };
  }
  
  const trimmedName = name.trim();
  
  if (trimmedName.length < 2) {
    return { isValid: false, error: errorMessages.name.tooShort[language] };
  }
  
  if (trimmedName.length > 50) {
    return { isValid: false, error: errorMessages.name.tooLong[language] };
  }
  
  // Allow letters (including Hindi/Devanagari), spaces, hyphens, and apostrophes
  const nameRegex = /^[a-zA-Z\u0900-\u097F\s\-']+$/;
  if (!nameRegex.test(trimmedName)) {
    return { isValid: false, error: errorMessages.name.invalid[language] };
  }
  
  return { isValid: true, error: null };
}

export function validateDateOfBirth(dateString, language = 'en') {
  if (!dateString) {
    return { isValid: false, error: errorMessages.dateOfBirth.required[language] };
  }
  
  const date = new Date(dateString);
  
  // Check if date is valid
  if (isNaN(date.getTime())) {
    return { isValid: false, error: errorMessages.dateOfBirth.invalid[language] };
  }
  
  const now = new Date();
  const minDate = new Date('1900-01-01');
  
  // Check if date is in future
  if (date > now) {
    return { isValid: false, error: errorMessages.dateOfBirth.future[language] };
  }
  
  // Check if date is too old (before 1900)
  if (date < minDate) {
    return { isValid: false, error: errorMessages.dateOfBirth.tooOld[language] };
  }
  
  return { isValid: true, error: null };
}

export function validateBirthTime(birthTime, language = 'en') {
  if (!birthTime || typeof birthTime !== 'object') {
    return { isValid: false, error: errorMessages.birthTime.required[language] };
  }
  
  const { hours, minutes, period } = birthTime;
  
  // Validate hours (1-12)
  if (!hours || hours < 1 || hours > 12) {
    return { isValid: false, error: errorMessages.birthTime.hoursRequired[language] };
  }
  
  // Validate minutes (0-59)
  if (minutes === undefined || minutes === null || minutes < 0 || minutes > 59) {
    return { isValid: false, error: errorMessages.birthTime.minutesRequired[language] };
  }
  
  // Validate period (AM/PM)
  if (!period || (period !== 'AM' && period !== 'PM')) {
    return { isValid: false, error: errorMessages.birthTime.periodRequired[language] };
  }
  
  return { isValid: true, error: null };
}

export function validateBirthPlace(place, language = 'en') {
  if (!place || !place.trim()) {
    return { isValid: false, error: errorMessages.birthPlace.required[language] };
  }
  
  const trimmedPlace = place.trim();
  
  if (trimmedPlace.length < 2) {
    return { isValid: false, error: errorMessages.birthPlace.tooShort[language] };
  }
  
  if (trimmedPlace.length > 100) {
    return { isValid: false, error: errorMessages.birthPlace.tooLong[language] };
  }
  
  // Allow letters, numbers, spaces, commas, hyphens, and common place name characters
  const placeRegex = /^[a-zA-Z0-9\u0900-\u097F\s\-,.'()]+$/;
  if (!placeRegex.test(trimmedPlace)) {
    return { isValid: false, error: errorMessages.birthPlace.invalid[language] };
  }
  
  return { isValid: true, error: null };
}

// Comprehensive birth details validation
export function validateBirthDetails(birthDetails, language = 'en') {
  const errors = {};
  let isValid = true;
  
  // Validate name
  const nameValidation = validateName(birthDetails.name, language);
  if (!nameValidation.isValid) {
    errors.name = nameValidation.error;
    isValid = false;
  }
  
  // Validate date of birth
  const dateValidation = validateDateOfBirth(birthDetails.dateOfBirth, language);
  if (!dateValidation.isValid) {
    errors.dateOfBirth = dateValidation.error;
    isValid = false;
  }
  
  // Validate birth time
  const timeValidation = validateBirthTime(birthDetails.birthTime, language);
  if (!timeValidation.isValid) {
    errors.birthTime = timeValidation.error;
    isValid = false;
  }
  
  // Validate birth place
  const placeValidation = validateBirthPlace(birthDetails.birthPlace, language);
  if (!placeValidation.isValid) {
    errors.birthPlace = placeValidation.error;
    isValid = false;
  }
  
  return { isValid, errors };
}

// Time conversion utilities
export function convertTo24Hour(birthTime) {
  const { hours, minutes, period } = birthTime;
  
  let hour24 = parseInt(hours);
  
  if (period === 'AM') {
    if (hour24 === 12) {
      hour24 = 0; // 12 AM = 00:00
    }
  } else { // PM
    if (hour24 !== 12) {
      hour24 += 12; // Add 12 for PM (except 12 PM)
    }
  }
  
  return `${hour24.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

export function convertTo12Hour(time24) {
  const [hours, minutes] = time24.split(':').map(Number);
  
  let hour12 = hours;
  let period = 'AM';
  
  if (hours === 0) {
    hour12 = 12; // 00:00 = 12 AM
  } else if (hours === 12) {
    period = 'PM'; // 12:00 = 12 PM
  } else if (hours > 12) {
    hour12 = hours - 12;
    period = 'PM';
  }
  
  return {
    hours: hour12,
    minutes: minutes,
    period: period
  };
}

// Format birth details for display
export function formatBirthDetailsForDisplay(birthDetails, language = 'en') {
  const formatted = {
    name: birthDetails.name,
    dateOfBirth: new Date(birthDetails.dateOfBirth).toLocaleDateString(
      language === 'hi' ? 'hi-IN' : 'en-IN'
    ),
    birthTime: `${birthDetails.birthTime.hours}:${birthDetails.birthTime.minutes.toString().padStart(2, '0')} ${birthDetails.birthTime.period}`,
    birthPlace: birthDetails.birthPlace
  };
  
  return formatted;
}

// Get error message for a specific field
export function getErrorMessage(field, errorType, language = 'en') {
  return errorMessages[field]?.[errorType]?.[language] || 'Invalid input';
}

// Check if birth details are complete
export function isBirthDetailsComplete(birthDetails) {
  return !!(
    birthDetails.name &&
    birthDetails.dateOfBirth &&
    birthDetails.birthTime &&
    birthDetails.birthTime.hours &&
    birthDetails.birthTime.minutes !== undefined &&
    birthDetails.birthTime.period &&
    birthDetails.birthPlace
  );
}

// Common Indian cities for birth place suggestions
export const commonIndianCities = [
  'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune', 'Ahmedabad',
  'Surat', 'Jaipur', 'Lucknow', 'Kanpur', 'Nagpur', 'Indore', 'Thane', 'Bhopal',
  'Visakhapatnam', 'Pimpri-Chinchwad', 'Patna', 'Vadodara', 'Ghaziabad', 'Ludhiana',
  'Agra', 'Nashik', 'Faridabad', 'Meerut', 'Rajkot', 'Kalyan-Dombivali', 'Vasai-Virar',
  'Varanasi', 'Srinagar', 'Aurangabad', 'Dhanbad', 'Amritsar', 'Navi Mumbai', 'Allahabad',
  'Ranchi', 'Howrah', 'Coimbatore', 'Jabalpur', 'Gwalior', 'Vijayawada', 'Jodhpur',
  'Madurai', 'Raipur', 'Kota', 'Guwahati', 'Chandigarh', 'Solapur', 'Hubli-Dharwad',
  'Bareilly', 'Moradabad', 'Mysore', 'Gurgaon', 'Aligarh', 'Jalandhar', 'Tiruchirappalli',
  'Bhubaneswar', 'Salem', 'Mira-Bhayandar', 'Warangal', 'Guntur', 'Bhiwandi', 'Saharanpur',
  'Gorakhpur', 'Bikaner', 'Amravati', 'Noida', 'Jamshedpur', 'Bhilai', 'Cuttack', 'Firozabad'
];