import { useEffect, useState } from 'react';

export function PanchangWidget() {
  const [panchangData, setPanchangData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const refresh = async (forceRefresh = false) => {
    setLoading(true);
    setError('');
    setPanchangData(null);

    try {
      // Import the panchang service
      const { getTithiData } = await import('../services/panchang.js');

      // Get today's tithi data with force refresh option
      const today = new Date();
      const data = await getTithiData(today, forceRefresh);

      if (data.error) {
        setError(data.message.includes('rate limit') ?
          'API दर सीमा पार हो गई। कृपया कुछ मिनट बाद पुनः प्रयास करें।' :
          data.message);
      } else {
        setPanchangData(data);
      }
    } catch (e) {
      console.error('Error fetching panchang:', e);
      setError('पंचांग डेटा लोड करने में समस्या हुई। कृपया पुनः प्रयास करें।');
    } finally {
      setLoading(false);
    }
  };

  // Format tithi data for display
  const formatPanchangForDisplay = (data) => {
    if (!data || !data.success) return null;

    return {
      title: `आज का पंचांग (${new Date().toLocaleDateString('hi-IN')})`,
      output: data.output,
      source: data.source || 'panchang.click',
      scraped_at: data.scraped_at,
      note: 'panchang.click से प्राप्त पंचांग डेटा।'
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
          onClick={() => refresh(true)}
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

          {/* Formatted Tithi Display */}
          <div className="border border-gray-200 rounded-lg p-4">
            <h5 className="font-bold text-[#1B5E20] mb-3 text-base">
              तिथि विवरण
            </h5>
            <div className="space-y-3">
              {/* Structured Panchang Content */}
              {typeof displayData.output === 'object' && !displayData.output.error ? (
                <div className="space-y-4">
                  {/* Date and Time Info */}
                  {(displayData.output.date || displayData.output.time) && (
                    <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                      <div className="font-bold text-[#1B5E20] mb-2">दिनांक और समय</div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                        {displayData.output.date && (
                          <div><span className="font-semibold">दिनांक:</span> {displayData.output.date}</div>
                        )}
                        {displayData.output.time && (
                          <div><span className="font-semibold">समय:</span> {displayData.output.time}</div>
                        )}
                        {displayData.output.timezone && (
                          <div><span className="font-semibold">टाइमज़ोन:</span> {displayData.output.timezone}</div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Main Panchang Elements */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {displayData.output.tithi && (
                      <div className="bg-gray-50 rounded-lg p-4 border">
                        <div className="font-bold text-[#1B5E20] mb-2">तिथि</div>
                        <div className="font-devanagari text-sm">{displayData.output.tithi}</div>
                      </div>
                    )}
                    {displayData.output.nakshatra && (
                      <div className="bg-gray-50 rounded-lg p-4 border">
                        <div className="font-bold text-[#1B5E20] mb-2">नक्षत्र</div>
                        <div className="font-devanagari text-sm">{displayData.output.nakshatra}</div>
                      </div>
                    )}
                    {displayData.output.yoga && (
                      <div className="bg-gray-50 rounded-lg p-4 border">
                        <div className="font-bold text-[#1B5E20] mb-2">योग</div>
                        <div className="font-devanagari text-sm">{displayData.output.yoga}</div>
                      </div>
                    )}
                    {displayData.output.karana && (
                      <div className="bg-gray-50 rounded-lg p-4 border">
                        <div className="font-bold text-[#1B5E20] mb-2">करण</div>
                        <div className="font-devanagari text-sm">{displayData.output.karana}</div>
                      </div>
                    )}
                  </div>

                  {/* Additional Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {displayData.output.maasa && (
                      <div className="bg-gray-50 rounded-lg p-4 border">
                        <div className="font-bold text-[#1B5E20] mb-2">मास</div>
                        <div className="font-devanagari text-sm">{displayData.output.maasa}</div>
                      </div>
                    )}
                    {displayData.output.vaar && (
                      <div className="bg-gray-50 rounded-lg p-4 border">
                        <div className="font-bold text-[#1B5E20] mb-2">वार</div>
                        <div className="font-devanagari text-sm">{displayData.output.vaar}</div>
                      </div>
                    )}
                    {displayData.output.rashi && (
                      <div className="bg-gray-50 rounded-lg p-4 border">
                        <div className="font-bold text-[#1B5E20] mb-2">राशि</div>
                        <div className="font-devanagari text-sm">{displayData.output.rashi}</div>
                      </div>
                    )}
                  </div>

                  {/* Sun and Moon Times */}
                  {(displayData.output.sunrise || displayData.output.sunset || displayData.output.rahukaal) && (
                    <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                      <div className="font-bold text-[#1B5E20] mb-3">सूर्य और चंद्र समय</div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                        {displayData.output.sunrise && (
                          <div><span className="font-semibold">सूर्योदय:</span> {displayData.output.sunrise}</div>
                        )}
                        {displayData.output.sunset && (
                          <div><span className="font-semibold">सूर्यास्त:</span> {displayData.output.sunset}</div>
                        )}
                        {displayData.output.rahukaal && (
                          <div><span className="font-semibold">राहुकाल:</span> {displayData.output.rahukaal}</div>
                        )}
                      </div>
                    </div>
                  )}


                </div>
              ) : (
                <div className="bg-gray-50 rounded-lg p-4 border">
                  <div className="font-bold text-[#1B5E20] mb-3">आज का पंचांग विवरण</div>
                  <div className="font-devanagari text-sm leading-relaxed whitespace-pre-wrap text-gray-800">
                    {typeof displayData.output === 'string' ? displayData.output : JSON.stringify(displayData.output, null, 2)}
                  </div>
                </div>
              )}
            </div>
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