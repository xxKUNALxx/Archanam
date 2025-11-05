// Web Scraping Implementation for panchang.click (Updated Version)

// Simple cache to avoid repeated scraping for the same day
let cachedData = null;
let cacheDate = null;

// Multiple CORS proxies for fallback
const CORS_PROXIES = [
  'https://api.allorigins.win/get?url=',
  'https://corsproxy.io/?',
  'https://cors-anywhere.herokuapp.com/',
  'https://api.codetabs.com/v1/proxy?quest='
];

const scrapePanchangData = async () => {
  const targetUrl = 'https://panchang.click/todays-panchang';

  for (let i = 0; i < CORS_PROXIES.length; i++) {
    try {
      const proxy = CORS_PROXIES[i];
      let proxyUrl;

      // Format proxy URL correctly
      if (proxy.includes('allorigins.win') || proxy.includes('codetabs.com')) {
        proxyUrl = proxy + encodeURIComponent(targetUrl);
      } else {
        proxyUrl = proxy + targetUrl;
      }

      const response = await fetch(proxyUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });

      if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);

      let htmlContent;

      // Handle JSON-wrapped vs plain HTML responses
      if (proxy.includes('allorigins.win') || proxy.includes('codetabs.com')) {
        const data = await response.json();
        htmlContent = data.contents || data.body || data;
      } else {
        htmlContent = await response.text();
      }

      if (!htmlContent || htmlContent.length < 100)
        throw new Error('Empty or invalid response');

      // Parse the HTML content
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlContent, 'text/html');

      // Extract panchang information
      const panchangInfo = extractPanchangInfo(doc);

      console.log('✅ Extracted Panchang Info:', panchangInfo);

      return {
        success: true,
        output: panchangInfo,
        source: 'panchang.click',
        scraped_at: new Date().toISOString(),
        proxy_used: proxy
      };

    } catch (error) {
      console.warn(`Proxy failed (${CORS_PROXIES[i]}): ${error.message}`);

      // Try next proxy
      if (i === CORS_PROXIES.length - 1)
        throw new Error(`All proxies failed. Last error: ${error.message}`);
    }
  }
};

// --- NEW, IMPROVED EXTRACTOR ---
const extractPanchangInfo = (doc) => {
  try {
    const bodyText = doc.body ? doc.body.textContent.replace(/\s+/g, ' ').trim() : '';
    return parsePanchangText(bodyText);
  } catch (error) {
    console.error('❌ Extraction failed:', error);
    return 'Unable to extract Panchang information.';
  }
};

// --- FIXED PARSER (Handles newlines, variable spacing) ---
const parsePanchangText = (text) => {
  try {
    const data = {};

    // Helper to safely extract a value after a label
    const getValue = (label) => {
      const regex = new RegExp(label + "\\s*([\\w\\s\\[\\]:°\\+\\-\\.]+?)(?=\\b(?:Tithi|Nakshatra|Maasa|Vaar|Yoga|Karana|Sun|Moon|Rashi|Sunrise|Sunset|Rahukaal|$))", "i");
      const match = text.match(regex);
      return match ? match[1].trim().replace(/\s+/g, ' ') : null;
    };

    // Basic info
    data.date = (text.match(/Date\s*:\s*([\d-]+)/) || [])[1] || '';
    data.time = (text.match(/Time\s*:\s*([\d:]+)/) || [])[1] || '';
    data.timezone = (text.match(/TimeZone\s*:\s*([\+\-]?\d{1,2}\.?\d{0,2})/) || [])[1] || '';

    // Panchang fields
    data.tithi = getValue('Tithi');
    data.nakshatra = getValue('Nakshatra');
    data.maasa = getValue('Maasa');
    data.vaar = getValue('Vaar');
    data.yoga = getValue('Yoga');
    data.karana = getValue('Karana');
    data.sun = getValue('Sun');
    data.moon = getValue('Moon');
    data.rashi = getValue('Rashi');
    data.sunrise = getValue('Sunrise');
    data.sunset = getValue('Sunset');

    if (data.moon) {
  const moonMatch = data.moon.match(/^\s*[\w\s]+\d{1,2}°/);
  if (moonMatch) data.moon = moonMatch[0].trim();
}

    // Rahukaal time range
    const rahuStart = (text.match(/Rahukaal Start\s*([\d:]+)/) || [])[1];
    const rahuEnd = (text.match(/Rahukaal End\s*([\d:]+)/) || [])[1];
    if (rahuStart && rahuEnd) data.rahukaal = `${rahuStart} - ${rahuEnd}`;

    console.log('✅ Parsed Panchang Data:', data);
    return data;

  } catch (error) {
    console.error('❌ Parsing failed:', error);
    return { error: 'Failed to parse Panchang data' };
  }
};

// --- Fallback data if scraping fails ---
const getFallbackPanchangData = () => {
  const today = new Date();
  return {
    success: true,
    output: {
      date: today.toLocaleDateString('en-GB').replace(/\//g, '-'),
      time: today.toLocaleTimeString('en-GB'),
      timezone: '+05.30',
      tithi: 'Shukla Poornima [upto 18:51:59]',
      nakshatra: 'Ashwini [upto 09:42:04]',
      maasa: 'Kartika',
      vaar: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][today.getDay()],
      yoga: 'Siddhi [upto 11:37:29]',
      karana: 'Visthi [upto 08:46:44]',
      rashi: 'Mesha',
      sunrise: '06:07:49',
      sunset: '17:19:20',
      rahukaal: '11:43:34 - 13:07:30',
      sun: '08s 25°',
      moon: '02s 10°'
    },
    source: 'fallback-data',
    scraped_at: new Date().toISOString(),
    note: 'Using fallback data due to scraping failure'
  };
};

// --- Main entry function with caching ---
export const getTithiData = async (date = new Date(), forceRefresh = false) => {
  try {
    const today = new Date().toDateString();

    // Serve from cache
    if (!forceRefresh && cachedData && cacheDate === today) {
      console.log('🗃️ Returning cached Panchang data');
      return cachedData;
    }

    // Fetch fresh data
    const result = await scrapePanchangData();

    // Cache result
    cachedData = result;
    cacheDate = today;

    return result;

  } catch (error) {
    console.warn('⚠️ Panchang scraping failed:', error.message);

    // Use fallback if scraping fails
    const fallback = getFallbackPanchangData();

    if (!forceRefresh) {
      cachedData = fallback;
      cacheDate = new Date().toDateString();
    }

    return fallback;
  }
};

// Export alias
export const getPanchangData = getTithiData;
