// Web Scraping Implementation for panchang.click

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

  // Try each proxy in sequence
  for (let i = 0; i < CORS_PROXIES.length; i++) {
    try {
      const proxy = CORS_PROXIES[i];
      let proxyUrl;

      // Different proxies have different URL formats
      if (proxy.includes('allorigins.win')) {
        proxyUrl = proxy + encodeURIComponent(targetUrl);
      } else if (proxy.includes('codetabs.com')) {
        proxyUrl = proxy + encodeURIComponent(targetUrl);
      } else {
        proxyUrl = proxy + targetUrl;
      }



      const response = await fetch(proxyUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        },
        timeout: 10000 // 10 second timeout
      });

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
      }

      let htmlContent;

      // Handle different response formats from different proxies
      if (proxy.includes('allorigins.win') || proxy.includes('codetabs.com')) {
        const data = await response.json();
        htmlContent = data.contents || data.body || data;
      } else {
        htmlContent = await response.text();
      }

      if (!htmlContent || htmlContent.length < 100) {
        throw new Error('Empty or invalid response');
      }

      // Parse the HTML content
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlContent, 'text/html');

      // Extract panchang information from the website
      const panchangInfo = extractPanchangInfo(doc);

      console.log('Extracted panchang info:', panchangInfo);

      return {
        success: true,
        output: panchangInfo,
        source: 'panchang.click',
        scraped_at: new Date().toISOString(),
        proxy_used: proxy
      };

    } catch (error) {


      // If this is the last proxy, throw the error
      if (i === CORS_PROXIES.length - 1) {
        throw new Error(`All proxies failed. Last error: ${error.message}`);
      }

      // Otherwise, continue to next proxy
      continue;
    }
  }
};

const extractPanchangInfo = (doc) => {
  try {
    // Get the full text content
    const bodyText = doc.body ? doc.body.textContent : '';

    // Parse the structured panchang data
    const panchangData = parsePanchangText(bodyText);

    return panchangData;

  } catch (error) {

    return 'Unable to extract panchang information from the website.';
  }
};

const parsePanchangText = (text) => {
  try {
    // Extract specific panchang information using regex patterns
    const data = {};

    // Look for the complete panchang data line
    const panchangDataMatch = text.match(/Panchang for Date\s*:\s*(\d{2}-\d{2}-\d{4})\s*\|\|\s*Time\s*:\s*(\d{2}:\d{2}:\d{2})\s*\|\|\s*TimeZone\s*:\s*([\+\-]\d{2}\.\d{2})(.+?)(?=\n|$)/);

    if (panchangDataMatch) {
      console.log('Found complete panchang data:', panchangDataMatch[0]);

      data.date = panchangDataMatch[1];
      data.time = panchangDataMatch[2];
      data.timezone = panchangDataMatch[3];

      // Parse the remaining panchang details from the continuous string
      const remainingData = panchangDataMatch[4];
      console.log('Parsing remaining data:', remainingData);

      // Extract each field using specific patterns for the continuous format
      const tithiMatch = remainingData.match(/Tithi([^N]+?)Nakshatra/);
      if (tithiMatch) data.tithi = tithiMatch[1].trim();

      const nakshatraMatch = remainingData.match(/Nakshatra([^M]+?)Maasa/);
      if (nakshatraMatch) data.nakshatra = nakshatraMatch[1].trim();

      const maasaMatch = remainingData.match(/Maasa([^V]+?)Vaar/);
      if (maasaMatch) data.maasa = maasaMatch[1].trim();

      const vaarMatch = remainingData.match(/Vaar([^Y]+?)Yoga/);
      if (vaarMatch) data.vaar = vaarMatch[1].trim();

      const yogaMatch = remainingData.match(/Yoga([^K]+?)Karana/);
      if (yogaMatch) data.yoga = yogaMatch[1].trim();

      const karanaMatch = remainingData.match(/Karana([^S]+?)Sun/);
      if (karanaMatch) data.karana = karanaMatch[1].trim();

      const sunMatch = remainingData.match(/Sun([^M]+?)Moon/);
      if (sunMatch) data.sun = sunMatch[1].trim();

      const moonMatch = remainingData.match(/Moon([^R]+?)Rashi/);
      if (moonMatch) data.moon = moonMatch[1].trim();

      const rashiMatch = remainingData.match(/Rashi([^S]+?)Sunrise/);
      if (rashiMatch) data.rashi = rashiMatch[1].trim();

      const sunriseMatch = remainingData.match(/Sunrise([^S]+?)Sunset/);
      if (sunriseMatch) data.sunrise = sunriseMatch[1].trim();

      const sunsetMatch = remainingData.match(/Sunset([^R]+?)Rahukaal/);
      if (sunsetMatch) data.sunset = sunsetMatch[1].trim();

      const rahuStartMatch = remainingData.match(/Rahukaal Start([^R]+?)Rahukaal End/);
      const rahuEndMatch = remainingData.match(/Rahukaal End(.+?)$/);
      if (rahuStartMatch && rahuEndMatch) {
        data.rahukaal = `${rahuStartMatch[1].trim()} - ${rahuEndMatch[1].trim()}`;
      }
    } else {
      console.log('Complete panchang pattern not found, trying individual extraction');

      // Fallback: Extract Date and Time individually
      const dateMatch = text.match(/Panchang for Date\s*:\s*(\d{2}-\d{2}-\d{4})/);
      const timeMatch = text.match(/Time\s*:\s*(\d{2}:\d{2}:\d{2})/);
      const timezoneMatch = text.match(/TimeZone\s*:\s*([\+\-]\d{2}\.\d{2})/);

      if (dateMatch) data.date = dateMatch[1];
      if (timeMatch) data.time = timeMatch[1];
      if (timezoneMatch) data.timezone = timezoneMatch[1];

      // Try to extract individual fields from anywhere in the text
      const tithiMatch = text.match(/Tithi([^N]+?)Nakshatra/);
      if (tithiMatch) data.tithi = tithiMatch[1].trim();

      const nakshatraMatch = text.match(/Nakshatra([^M]+?)Maasa/);
      if (nakshatraMatch) data.nakshatra = nakshatraMatch[1].trim();

      const maasaMatch = text.match(/Maasa([^V]+?)Vaar/);
      if (maasaMatch) data.maasa = maasaMatch[1].trim();

      const vaarMatch = text.match(/Vaar([^Y]+?)Yoga/);
      if (vaarMatch) data.vaar = vaarMatch[1].trim();

      const yogaMatch = text.match(/Yoga([^K]+?)Karana/);
      if (yogaMatch) data.yoga = yogaMatch[1].trim();

      const karanaMatch = text.match(/Karana([^S]+?)Sun/);
      if (karanaMatch) data.karana = karanaMatch[1].trim();

      const sunMatch = text.match(/Sun([^M]+?)Moon/);
      if (sunMatch) data.sun = sunMatch[1].trim();

      const moonMatch = text.match(/Moon([^R]+?)Rashi/);
      if (moonMatch) data.moon = moonMatch[1].trim();

      const rashiMatch = text.match(/Rashi([^S]+?)Sunrise/);
      if (rashiMatch) data.rashi = rashiMatch[1].trim();

      const sunriseMatch = text.match(/Sunrise([^S]+?)Sunset/);
      if (sunriseMatch) data.sunrise = sunriseMatch[1].trim();

      const sunsetMatch = text.match(/Sunset([^R]+?)Rahukaal/);
      if (sunsetMatch) data.sunset = sunsetMatch[1].trim();

      const rahuStartMatch = text.match(/Rahukaal Start([^R]+?)Rahukaal End/);
      const rahuEndMatch = text.match(/Rahukaal End(.+?)$/);
      if (rahuStartMatch && rahuEndMatch) {
        data.rahukaal = `${rahuStartMatch[1].trim()} - ${rahuEndMatch[1].trim()}`;
      }
    }



    console.log('Parsed panchang data:', data);

    return data;

  } catch (error) {

    return { error: 'Failed to parse panchang data' };
  }
};

// Fallback static data for when scraping fails
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
    note: 'Using fallback data due to network issues'
  };
};

export const getTithiData = async (date = new Date(), forceRefresh = false) => {
  try {
    // Check if we have cached data for today (skip cache if forceRefresh is true)
    const today = new Date().toDateString();
    if (!forceRefresh && cachedData && cacheDate === today) {
      console.log('Returning cached panchang data');
      return cachedData;
    }

    if (forceRefresh) {

    }

    // Try to scrape fresh data
    const result = await scrapePanchangData();

    console.log('Fresh panchang data scraped:', result);

    // Cache the result for today
    cachedData = result;
    cacheDate = new Date().toDateString();

    return result;

  } catch (error) {


    // Return fallback data instead of error (always fresh when forced)
    const fallbackData = getFallbackPanchangData();

    // Cache the fallback data only if not force refreshing
    if (!forceRefresh) {
      cachedData = fallbackData;
      cacheDate = new Date().toDateString();
    }

    return fallbackData;
  }
};

// Main export
export const getPanchangData = getTithiData;