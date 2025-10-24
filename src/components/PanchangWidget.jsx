import { useEffect, useState } from 'react';

export function PanchangWidget() {
  const [panchangData, setPanchangData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const refresh = async () => {
    setLoading(true); 
    setError('');
    setPanchangData(null);

    try {
      // Import the panchang service
      const { getPanchangData } = await import('../services/panchang.js');
      
      // Get today's panchang data
      const today = new Date();
      const data = await getPanchangData(today);
      
      setPanchangData(data);
    } catch (e) {
      console.error('Error fetching panchang:', e);
      setError('पंचांग डेटा लोड करने में समस्या हुई। कृपया पुनः प्रयास करें।');
    } finally { 
      setLoading(false); 
    }
  };

  // Format structured panchang data for display
  const formatPanchangForDisplay = (data) => {
    if (!data) return null;
    
    return {
      title: `आज का पंचांग (${data.date})`,
      basic: [
        `तिथि: ${data.tithi}`,
        `नक्षत्र: ${data.nakshatra}`,
        `योग: ${data.yoga}`,
        `करण: ${data.karana}`,
        `पक्ष: ${data.paksha}`,
        `वार: ${data.weekday}`
      ].filter(item => !item.includes('undefined')),
      timing: [
        `सूर्योदय: ${data.sunrise}`,
        `सूर्यास्त: ${data.sunset}`
      ].filter(item => !item.includes('undefined')),
      muhurat: data.muhurat ? [
        data.muhurat.abhijit && `अभिजीत मुहूर्त: ${data.muhurat.abhijit}`,
        data.muhurat.vijaya && `विजय मुहूर्त: ${data.muhurat.vijaya}`,
        data.muhurat.rahukaal && `राहुकाल: ${data.muhurat.rahukaal}`,
        data.muhurat.yamaganda && `यमगण्ड काल: ${data.muhurat.yamaganda}`
      ].filter(Boolean) : [],
      additional: [
        data.moonsign && `चंद्र राशि: ${data.moonsign}`,
        data.sunsign && `सूर्य राशि: ${data.sunsign}`,
        data.month?.amanta && `अमांत मास: ${data.month.amanta}`,
        data.month?.purnimanta && `पूर्णिमांत मास: ${data.month.purnimanta}`,
        data.samvat?.vikram && `विक्रम संवत: ${data.samvat.vikram}`,
        data.samvat?.shaka && `शक संवत: ${data.samvat.shaka}`
      ].filter(Boolean),
      festivals: data.festivals || [],
      note: data.note || 'सटीक पंचांग डेटा। स्थानीय समयानुसार थोड़ा अंतर हो सकता है।'
    };
  };

  const displayData = formatPanchangForDisplay(panchangData);
  
  useEffect(() => { refresh(); }, []);
  
  return (
    <div className="p-6 rounded-2xl shadow-lg bg-white border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-2xl font-bold text-[#1B5E20] font-serif">
          डेली पंचांग
        </h3>
        <button 
          onClick={refresh} 
          className="bg-[#1B5E20] text-white px-3 py-1.5 rounded-lg hover:bg-[#2E7D32] transition-colors"
        >
          Refresh
        </button>
      </div>
      
      {loading && (
        <div className="text-center py-8">
          <div className="text-sm text-gray-500 font-devanagari">अपडेट कर रहा है…</div>
        </div>
      )}
      
      {panchangData && displayData && (
        <div className="space-y-4">
          {/* Title Section */}
          <div className="text-center border-b border-gray-200 pb-3">
            <h4 className="font-bold text-lg font-devanagari text-[#1B5E20]">{displayData.title}</h4>
          </div>
          
          {/* Basic Panchang Info */}
          <div className="border border-gray-200 rounded-lg p-4">
            <h5 className="font-bold text-[#1B5E20] mb-3 text-base">
              पंचांग विवरण
            </h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {displayData.basic.map((item, index) => (
                <div key={index} className="font-devanagari text-sm p-3 bg-gray-50 rounded border">
                  {item}
                </div>
              ))}
            </div>
          </div>
          
          {/* Timing Section */}
          {displayData.timing.length > 0 && (
            <div className="border border-gray-200 rounded-lg p-4">
              <h5 className="font-bold text-[#1B5E20] mb-3 text-base">
                सूर्य समय
              </h5>
              <div className="space-y-2">
                {displayData.timing.map((item, index) => (
                  <div key={index} className="font-devanagari text-sm p-3 bg-gray-50 rounded border">
                    {item}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Muhurat Section */}
          {displayData.muhurat.length > 0 && (
            <div className="border border-gray-200 rounded-lg p-4">
              <h5 className="font-bold text-[#1B5E20] mb-3 text-base">
                मुहूर्त और काल
              </h5>
              <div className="space-y-2">
                {displayData.muhurat.map((item, index) => (
                  <div key={index} className="font-devanagari text-sm p-3 bg-gray-50 rounded border">
                    {item}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Additional Info Section */}
          {displayData.additional.length > 0 && (
            <div className="border border-gray-200 rounded-lg p-4">
              <h5 className="font-bold text-[#1B5E20] mb-3 text-base">
                अतिरिक्त जानकारी
              </h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {displayData.additional.map((item, index) => (
                  <div key={index} className="font-devanagari text-sm p-3 bg-gray-50 rounded border">
                    {item}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Festivals Section */}
          {displayData.festivals.length > 0 && (
            <div className="border border-gray-200 rounded-lg p-4">
              <h5 className="font-bold text-[#1B5E20] mb-3 text-base">
                त्योहार और विशेष
              </h5>
              <div className="space-y-2">
                {displayData.festivals.map((item, index) => (
                  <div key={index} className="font-devanagari text-sm p-3 bg-gray-50 rounded border">
                    {item}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Note Section */}
          <div className="border border-gray-300 rounded-lg p-3 bg-gray-50">
            <p className="font-devanagari text-xs text-gray-600 text-center italic">
              {displayData.note}
            </p>
          </div>
        </div>
      )}
      
      {error && (
        <div className="border border-red-200 rounded-lg p-4 bg-red-50">
          <p className="font-devanagari text-sm text-red-600 text-center">
            {error}
          </p>
        </div>
      )}
    </div>
  );
}