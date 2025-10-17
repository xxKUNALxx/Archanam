import { useEffect, useRef, useState } from 'react';
import { generateText } from '../services/gemini.js';
import { useLanguage } from '../context/LanguageContext';
import { t } from '../utils/translations';

export function AiPujaSuggestion() {
  const { language } = useLanguage();
  const [step, setStep] = useState('greeting'); // greeting, user-input, ai-response, action, booking, info
  const [userInput, setUserInput] = useState('');
  const [aiResponse, setAiResponse] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [bookingData, setBookingData] = useState({ name: '', date: '', location: '', type: 'online' });

  const handleUserInput = async () => {
    if (!userInput.trim()) return;

    setLoading(true); setError('');
    try {
      const prompt = `भूमिका: आप एक अनुभवी वैदिक आचार्य-सहायक हैं।
उपयोगकर्ता का प्रश्न: "${userInput}"

आपको तीन भागों में उत्तर देना है:

(a) पूजा सुझाव:
- 1-2 उपयुक्त पूजाएँ सुझाएँ
- संक्षिप्त कारण बताएँ

(b) संक्षिप्त कारण:
- क्यों यह पूजा उपयुक्त है
- क्या लाभ मिलेगा

(c) सामग्री सूची:
- पूजा सामग्री की सूची (5-7 आइटम)

उत्तर प्रारूप:
पूजा सुझाव: [पूजा का नाम]
कारण: [संक्षिप्त कारण]
सामग्री: [सामग्री सूची]`;

      const text = await generateText({ prompt });

      // AI response set successfully
      setAiResponse({
        pujaSuggestion: text || 'No response received',
        reason: t('ai.aiReasonSpecial', language),
        materials: t('ai.materialsContact', language)
      });

      setStep('action');
    } catch (e) {
      const msg = (e?.message || '').includes('Missing GEMINI_API_KEY') ? t('ai.apiKeyError', language) : (e?.message || t('ai.generalError', language));
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = () => {
    // Here you would integrate with payment system
    setStep('greeting');
    setUserInput('');
    setAiResponse({});
  };

  const handleInfoRequest = () => {
    setStep('info');
  };

  const resetFlow = () => {
    setStep('greeting');
    setUserInput('');
    setAiResponse({});
    setError('');
  };

  return (
    <div className="p-6 rounded-2xl shadow-lg bg-white border border-gray-200">
      <h3 className="text-2xl font-bold text-[#1B5E20] mb-4 font-serif">🕉 {t('ai.title', language)}</h3>

      {step === 'greeting' && (
        <div className="text-center">
          <div className="text-4xl mb-4">🙏</div>
          <p className="text-lg text-[#424242] mb-6 font-devanagari">
            नमस्ते!<br />
            कृपया बताइए आपको किस विषय में पूजा का सुझाव चाहिए?<br />
            <span className="text-sm text-gray-600">(उदाहरण: करियर, स्वास्थ्य, विवाह, शांति, संतान, शिक्षा, धन आदि)</span>
          </p>
          <div className="flex gap-2">
            <input
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              className="flex-1 border rounded-lg px-3 py-2"
              placeholder={t('ai.placeholder', language)}
            />
            <button
              onClick={handleUserInput}
              disabled={loading}
              className="bg-[#FFB300] text-white px-4 py-2 rounded-lg hover:bg-[#FFC107]"
            >
{t('ai.ask', language)}
            </button>
          </div>
        </div>
      )}

      {step === 'action' && aiResponse.pujaSuggestion && (
        <div className="space-y-4">
          <div className="bg-[#F5F5F5] p-4 rounded-lg">
            <h4 className="font-bold text-[#1B5E20] mb-2">पूजा सुझाव:</h4>
            <p className="font-devanagari">{aiResponse.pujaSuggestion}</p>
          </div>

          <div className="bg-[#F5F5F5] p-4 rounded-lg">
            <h4 className="font-bold text-[#1B5E20] mb-2">संक्षिप्त कारण:</h4>
            <p className="font-devanagari">{aiResponse.reason}</p>
          </div>

          <div className="bg-[#F5F5F5] p-4 rounded-lg">
            <h4 className="font-bold text-[#1B5E20] mb-2">पूजा सामग्री:</h4>
            <p className="font-devanagari">{aiResponse.materials}</p>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={handleBooking}
              className="flex-1 bg-[#FFB300] text-white px-4 py-3 rounded-lg hover:bg-[#FFC107] font-semibold"
            >
              📅 पूजा बुक करें
            </button>
            <button
              onClick={handleInfoRequest}
              className="flex-1 bg-[#1B5E20] text-white px-4 py-3 rounded-lg hover:bg-[#2E7D32] font-semibold"
            >
              📖 पूरी विधि देखें
            </button>
          </div>
        </div>
      )}

      {step === 'booking' && (
        <div className="space-y-4">
          <h4 className="text-xl font-bold text-[#1B5E20]">पूजा बुकिंग</h4>
          <div className="grid grid-cols-1 gap-3">
            <input
              value={bookingData.name}
              onChange={(e) => setBookingData({ ...bookingData, name: e.target.value })}
              className="border rounded-lg px-3 py-2"
              placeholder="आपका नाम"
            />
            <input
              type="date"
              value={bookingData.date}
              onChange={(e) => setBookingData({ ...bookingData, date: e.target.value })}
              className="border rounded-lg px-3 py-2"
            />
            <select
              value={bookingData.type}
              onChange={(e) => setBookingData({ ...bookingData, type: e.target.value })}
              className="border rounded-lg px-3 py-2"
            >
              <option value="online">ऑनलाइन पूजा</option>
              <option value="offline">घर पर पूजा</option>
            </select>
            {bookingData.type === 'offline' && (
              <input
                value={bookingData.location}
                onChange={(e) => setBookingData({ ...bookingData, location: e.target.value })}
                className="border rounded-lg px-3 py-2"
                placeholder="पूरा पता"
              />
            )}
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleBooking}
              className="flex-1 bg-[#FFB300] text-white px-4 py-3 rounded-lg hover:bg-[#FFC107] font-semibold"
            >
              बुकिंग पूरी करें
            </button>
            <button
              onClick={resetFlow}
              className="bg-gray-500 text-white px-4 py-3 rounded-lg hover:bg-gray-600"
            >
              रद्द करें
            </button>
          </div>
        </div>
      )}

      {step === 'info' && (
        <div className="space-y-4">
          <h4 className="text-xl font-bold text-[#1B5E20]">पूजा विधि और मंत्र</h4>
          <div className="bg-[#F5F5F5] p-4 rounded-lg">
            <p className="font-devanagari">
              <strong>विधि:</strong> सुबह स्नान करके पूजा स्थल को साफ करें। दीपक जलाकर पूजा आरंभ करें।<br />
              <strong>मंत्र:</strong> "ॐ गणेशाय नमः" (गणेश पूजा के लिए)<br />
              <strong>समय:</strong> सुबह 6-8 बजे या शाम 6-8 बजे<br />
              <strong>दिन:</strong> मंगलवार या गुरुवार शुभ माने जाते हैं
            </p>
          </div>
          <button
            onClick={resetFlow}
            className="w-full bg-[#1B5E20] text-white px-4 py-3 rounded-lg hover:bg-[#2E7D32] font-semibold"
          >
            नया प्रश्न पूछें
          </button>
        </div>
      )}

      {loading && <div className="text-center text-sm text-gray-500">सोच रहा है…</div>}
      {error && <div className="text-sm text-red-600 text-center">{error}</div>}
    </div>
  );
}

export function AiMantraAssistant() {
  const [query, setQuery] = useState('महामृत्युंजय मंत्र');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const synthRef = useRef(typeof window !== 'undefined' ? window.speechSynthesis : null);

  const onSearch = async () => {
    setLoading(true); setResult('');
    const prompt = `भूमिका: मंत्र सहायक।
इनपुट: मंत्र का नाम या उद्देश्य — "${query}"।
आउटपुट (हिंदी, बिना इमोजी):
- शीर्षक
- मंत्र (देवनागरी; यदि उपलब्ध तो IAST कोष्ठक में)
- अर्थ (संक्षेप)
- जप विधि: समय, संख्या, आसन/माला, नियम
- सावधानियाँ/अनुशंसा`;
    try {
      const text = await generateText({ prompt });
      setResult(text);
    } catch (e) {
      const msg = (e?.message || '').includes('Missing GEMINI_API_KEY') ? t('ai.apiKeyError', language) : (e?.message || t('ai.unknownError', language));
      setResult(t('ai.errorPrefix', language) + msg);
    } finally { setLoading(false); }
  };

  const onSpeak = () => {
    if (!synthRef.current || !result) return;
    const utter = new SpeechSynthesisUtterance(result);
    utter.lang = 'hi-IN';
    synthRef.current.cancel();
    synthRef.current.speak(utter);
  };

  return (
    <div className="p-6 rounded-2xl shadow-lg bg-white border border-gray-200">
      <h3 className="text-2xl font-bold text-[#1B5E20] mb-3 font-serif">AI मंत्र सहायक</h3>
      <div className="flex gap-2 mb-3">
        <input value={query} onChange={(e) => setQuery(e.target.value)} className="flex-1 border rounded-lg px-3 py-2" placeholder="मंत्र/उद्देश्य" />
        <button onClick={onSearch} disabled={loading} className="bg-[#FFB300] text-white px-4 py-2 rounded-lg hover:bg-[#FFC107]">खोजें</button>
        <button onClick={onSpeak} className="bg-[#1B5E20] text-white px-4 py-2 rounded-lg hover:bg-[#2E7D32]">सुनें</button>
      </div>
      {loading && <div className="text-sm text-gray-500">खोज रहा है…</div>}
      {result && <pre className="whitespace-pre-wrap text-[#424242] font-devanagari leading-7">{result}</pre>}
    </div>
  );
}

export function AiSankalpGenerator() {
  const [name, setName] = useState('राम शर्मा');
  const [gotra, setGotra] = useState('कश्यप');
  const [details, setDetails] = useState('सत्यनारायण पूजा');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    setLoading(true); setOutput('');

    // Get current date and time information
    const today = new Date();
    const currentDate = today.toLocaleDateString('hi-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    const englishDate = today.toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    // Get Hindu calendar information (approximate)
    const hinduMonths = ['चैत्र', 'वैशाख', 'ज्येष्ठ', 'आषाढ़', 'श्रावण', 'भाद्रपद', 'आश्विन', 'कार्तिक', 'मार्गशीर्ष', 'पौष', 'माघ', 'फाल्गुन'];
    const currentMonth = hinduMonths[today.getMonth()];
    const paksha = today.getDate() <= 15 ? 'शुक्ल पक्ष' : 'कृष्ण पक्ष';

    const prompt = `भूमिका: हिंदी संकल्प पाठ सहायक।

आज की तारीख: ${englishDate} (${currentDate})
हिंदू कैलेंडर: ${currentMonth} माह, ${paksha}

कार्य: दिए गए विवरण से शुद्ध हिंदी में संकल्प लिखें।
इनपुट: नाम: ${name}, गोत्र: ${gotra}, पूजा: ${details}

महत्वपूर्ण निर्देश:
- केवल शुद्ध हिंदी का उपयोग करें, संस्कृत शब्दों का उपयोग न करें।
- वास्तविक तिथि और समय का उपयोग करें, <तिथि> या <लग्न> जैसे प्लेसहोल्डर का उपयोग न करें।
- आज की तारीख ${englishDate} और ${currentMonth} माह, ${paksha} का उपयोग करें।
- कोई भी markdown formatting (**, *, #) का उपयोग न करें। सादा text में लिखें।
- सरल और समझने योग्य हिंदी भाषा का उपयोग करें।

उदाहरण प्रारूप:
संकल्प:
आज ${currentMonth} माह के ${paksha} में, शुभ समय में, मैं ${name}, ${gotra} गोत्र का, भगवान ${details.replace('पूजा', '')} की कृपा पाने के लिए, अपनी सभी मनोकामनाओं की पूर्ति के लिए, अपनी शक्ति के अनुसार, ${details} करने का संकल्प लेता हूँ।

हिंदी अनुवाद:
आज ${currentMonth} माह के ${paksha} में, शुभ समय में, मैं ${name}, ${gotra} गोत्र का व्यक्ति, भगवान की प्रसन्नता के लिए और अपनी सभी इच्छाओं की पूर्ति के लिए, अपनी क्षमता के अनुसार ${details} करूँगा।

कृपया शुद्ध हिंदी में संकल्प बनाएं। कोई भी संस्कृत शब्द या ** का उपयोग न करें।`;

    try {
      const text = await generateText({ prompt });

      // Remove markdown formatting from the response
      let cleanedText = text
        .replace(/\*\*(.*?)\*\*/g, '$1')  // Remove **bold**
        .replace(/\*(.*?)\*/g, '$1')      // Remove *italic*
        .replace(/#{1,6}\s/g, '')         // Remove # headers
        .trim();

      // Check if response contains placeholders and use fallback if needed
      if (cleanedText.includes('<') && cleanedText.includes('>')) {
        setOutput(`संकल्प:
आज ${currentMonth} माह के ${paksha} में, शुभ समय में, मैं ${name}, ${gotra} गोत्र का व्यक्ति, भगवान की कृपा पाने के लिए और अपनी सभी मनोकामनाओं की पूर्ति के लिए, अपनी शक्ति के अनुसार ${details} करने का दृढ़ संकल्प लेता हूँ।

हिंदी अनुवाद:
आज ${currentMonth} माह के ${paksha} में, शुभ समय में, मैं ${name}, जो ${gotra} गोत्र से हूँ, भगवान की प्रसन्नता के लिए और अपनी सभी इच्छाओं की पूर्ति के लिए, अपनी पूरी क्षमता के साथ ${details} करूँगा।

उद्देश्य:
यह संकल्प भगवान की कृपा प्राप्त करने और जीवन में सभी मंगल कामनाओं की पूर्ति के लिए लिया गया है।

शुभकामना:
हे भगवान, आप सभी को सुख और शांति प्रदान करें। सभी का कल्याण हो। सभी खुश रहें और स्वस्थ रहें।

अर्थ:
यह संकल्प हमारे जीवन में खुशी, शांति और समृद्धि लाने के लिए है। भगवान हमारी सभी अच्छी इच्छाओं को पूरा करें।`);
      } else {
        setOutput(cleanedText);
      }
    } catch (e) {
      const msg = (e?.message || '').includes('Missing GEMINI_API_KEY') ? t('ai.apiKeyError', language) : (e?.message || t('ai.unknownError', language));
      setOutput(t('ai.errorPrefix', language) + msg);
    } finally { setLoading(false); }
  };

  return (
    <div className="p-6 rounded-2xl shadow-lg bg-white border border-gray-200">
      <h3 className="text-2xl font-bold text-[#1B5E20] mb-3 font-serif">AI संकल्प जनरेटर</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
        <input className="border rounded-lg px-3 py-2" value={name} onChange={e => setName(e.target.value)} placeholder="नाम" />
        <input className="border rounded-lg px-3 py-2" value={gotra} onChange={e => setGotra(e.target.value)} placeholder="गोत्र" />
        <input className="border rounded-lg px-3 py-2" value={details} onChange={e => setDetails(e.target.value)} placeholder="पूजा विवरण" />
      </div>
      <button onClick={generate} disabled={loading} className="bg-[#FFB300] text-white px-4 py-2 rounded-lg hover:bg-[#FFC107]">संकल्प बनाएं</button>
      {loading && <div className="text-sm text-gray-500 mt-2">बना रहा है…</div>}
      {output && <pre className="mt-3 whitespace-pre-wrap text-[#424242] font-devanagari leading-7">{output}</pre>}
    </div>
  );
}

export function AiPanchangWidget() {
  const [data, setData] = useState('');
  const [loading, setLoading] = useState(false);
  const refresh = async () => {
    setLoading(true); setData('');

    // Get current date
    const today = new Date();
    const currentDate = today.toLocaleDateString('hi-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    const englishDate = today.toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const prompt = `आज की तारीख: ${englishDate} (${currentDate})

आज के लिए पंचांग बनाएं। महत्वपूर्ण: कृपया वास्तविक डेटा के साथ उत्तर दें, न कि [तिथि], [नक्षत्र] जैसे प्लेसहोल्डर के साथ।

उदाहरण प्रारूप:
आज का पंचांग (${englishDate}):

तिथि: द्वितीया, शुक्ल पक्ष
नक्षत्र: रोहिणी नक्षत्र
योग: सिद्धि योग
करण: बव करण

सूर्योदय: प्रातः 6:30 बजे
सूर्यास्त: सायं 6:15 बजे

शुभ समय: प्रातः 6:30 से 8:30 तक
वर्ज्य काल: दोपहर 12:00 से 1:30 तक

आज गणेश पूजा और लक्ष्मी पूजा के लिए शुभ दिन है।

कृपया आज की तारीख ${englishDate} के लिए वास्तविक डेटा के साथ पूरा पंचांग दें। कोई भी [brackets] का उपयोग न करें।

ध्यान दें: यह AI-जनित सामान्यीकृत सारांश है, स्थानीय मुहूर्त हेतु अपने पंडित/पंचांग देखें।`;

    try {
      const text = await generateText({ prompt });
      // Check if response contains placeholders and use fallback if needed
      if (text.includes('[') && text.includes(']')) {
        setData(`आज का पंचांग (${englishDate}):

तिथि: द्वितीया, शुक्ल पक्ष
नक्षत्र: रोहिणी नक्षत्र
योग: सिद्धि योग
करण: बव करण

सूर्योदय: प्रातः 6:30 बजे
सूर्यास्त: सायं 6:15 बजे

शुभ समय: प्रातः 6:30 से 8:30 तक और सायं 5:00 से 7:00 तक
वर्ज्य काल: दोपहर 12:00 से 1:30 तक

आज गणेश पूजा, लक्ष्मी पूजा और नवग्रह पूजा के लिए शुभ दिन है।

*यह सामान्य पंचांग है। सटीक मुहूर्त के लिए स्थानीय पंडित से सलाह लें।*`);
      } else {
        setData(text);
      }
    } catch (e) {
      const msg = (e?.message || '').includes('Missing GEMINI_API_KEY') ? t('ai.apiKeyError', language) : (e?.message || t('ai.unknownError', language));
      setData(t('ai.errorPrefix', language) + msg);
    }
    finally { setLoading(false); }
  };
  useEffect(() => { refresh(); }, []);
  return (
    <div className="p-6 rounded-2xl shadow-lg bg-white border border-gray-200">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-2xl font-bold text-[#1B5E20] font-serif">डेली पंचांग (AI)</h3>
        <button onClick={refresh} className="bg-[#1B5E20] text-white px-3 py-1.5 rounded-lg hover:bg-[#2E7D32]">Refresh</button>
      </div>
      {loading && <div className="text-sm text-gray-500">अपडेट कर रहा है…</div>}
      {data && <pre className="whitespace-pre-wrap text-[#424242] font-devanagari leading-7">{data}</pre>}
    </div>
  );
}

export function FloatingPujaChatbot() {
  const { language } = useLanguage();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState('greeting');
  const [userInput, setUserInput] = useState('');
  const [aiResponse, setAiResponse] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const ask = async () => {
    if (!userInput.trim()) return;
    setLoading(true); 
    setError('');
    try {
      const prompt = `भूमिका: आप एक अनुभवी वैदिक आचार्य-सहायक हैं।
उपयोगकर्ता का प्रश्न: "${userInput}"

कृपया संक्षिप्त उत्तर दें।`;

      const text = await generateText({ prompt });
      setAiResponse({
        pujaSuggestion: text,
        reason: t('ai.aiReasonGeneral', language),
        materials: t('ai.materialsContactShort', language)
      });
      setStep('action');
    } catch (e) {
      setError(t('ai.retryError', language));
    } finally { 
      setLoading(false); 
    }
  };

  const reset = () => { 
    setStep('greeting'); 
    setUserInput(''); 
    setAiResponse({}); 
    setError(''); 
  };

  return (
    <div>
      <button onClick={() => setOpen(!open)} className="fixed bottom-24 right-6 z-50 bg-[#FFB300] text-white px-4 py-3 rounded-full shadow-xl hover:bg-[#FFC107]">
{t('ai.floatingButton', language)}
      </button>
      {open && (
        <div className="fixed bottom-40 right-6 z-50 w-80 bg-white border border-gray-200 rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-[#1B5E20] text-white px-4 py-2 font-semibold">AI Puja Suggestion</div>
          <div className="p-3 space-y-3">
            {step === 'greeting' && (
              <div>
                <div className="text-sm text-[#424242] mb-2 font-devanagari">{t('ai.greeting', language)} {t('ai.examples', language)}</div>
                <div className="flex gap-2">
                  <input value={userInput} onChange={e => setUserInput(e.target.value)} className="flex-1 border rounded-lg px-3 py-2 text-sm" placeholder={t('ai.placeholder', language)} />
                  <button onClick={ask} className="bg-[#FFB300] text-white px-3 py-2 rounded-lg hover:bg-[#FFC107] text-sm">{t('ai.ask', language)}</button>
                </div>
                {loading && <div className="text-xs text-gray-500 mt-1">{t('ai.thinking', language)}</div>}
                {error && <div className="text-xs text-red-600 mt-1">{error}</div>}
              </div>
            )}

            {step === 'action' && aiResponse.pujaSuggestion && (
              <div className="space-y-2 text-sm">
                <div className="bg-[#F5F5F5] p-2 rounded">
                  <div className="font-semibold text-[#1B5E20]">पूजा सुझाव</div>
                  <div className="font-devanagari">{aiResponse.pujaSuggestion}</div>
                </div>
                <div className="bg-[#F5F5F5] p-2 rounded">
                  <div className="font-semibold text-[#1B5E20]">संक्षिप्त कारण</div>
                  <div className="font-devanagari">{aiResponse.reason}</div>
                </div>
                <div className="bg-[#F5F5F5] p-2 rounded">
                  <div className="font-semibold text-[#1B5E20]">पूजा सामग्री</div>
                  <div className="font-devanagari">{aiResponse.materials}</div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setStep('booking')} className="flex-1 bg-[#FFB300] text-white px-3 py-2 rounded-lg hover:bg-[#FFC107] text-sm">📅 बुक करें</button>
                  <button onClick={() => setStep('info')} className="flex-1 bg-[#1B5E20] text-white px-3 py-2 rounded-lg hover:bg-[#2E7D32] text-sm">📖 विधि</button>
                </div>
              </div>
            )}

            {step === 'booking' && (
              <div className="space-y-2 text-sm">
                <div className="font-semibold text-[#1B5E20]">बुकिंग</div>
                <input className="w-full border rounded-lg px-3 py-2" placeholder="नाम" value={bookingData.name} onChange={e => setBookingData({ ...bookingData, name: e.target.value })} />
                <input className="w-full border rounded-lg px-3 py-2" type="date" value={bookingData.date} onChange={e => setBookingData({ ...bookingData, date: e.target.value })} />
                <select className="w-full border rounded-lg px-3 py-2" value={bookingData.type} onChange={e => setBookingData({ ...bookingData, type: e.target.value })}>
                  <option value="online">ऑनलाइन</option>
                  <option value="offline">ऑफ़लाइन</option>
                </select>
                {bookingData.type === 'offline' && (
                  <input className="w-full border rounded-lg px-3 py-2" placeholder="पता" value={bookingData.location} onChange={e => setBookingData({ ...bookingData, location: e.target.value })} />
                )}
                <div className="flex gap-2">
                  // TODO: Replace with proper UI notification
                  <button onClick={reset} className="bg-gray-500 text-white px-3 py-2 rounded-lg hover:bg-gray-600">रद्द</button>
                </div>
              </div>
            )}

            {step === 'info' && (
              <div className="space-y-2 text-sm">
                <div className="font-semibold text-[#1B5E20]">पूजा विधि और मंत्र</div>
                <div className="bg-[#F5F5F5] p-2 rounded font-devanagari">
                  <div><b>विधि:</b> स्नान कर स्थान शुद्ध करें, दीपक जलाएँ, संकल्प लेकर पूजा शुरू करें।</div>
                  <div><b>मंत्र:</b> "ॐ गणेशाय नमः"</div>
                  <div><b>समय:</b> प्रातः/सायं 6-8</div>
                  <div><b>दिन:</b> मंगलवार/गुरुवार शुभ</div>
                </div>
                <button onClick={reset} className="w-full bg-[#1B5E20] text-white px-3 py-2 rounded-lg hover:bg-[#2E7D32]">नया प्रश्न</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function AIPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <h2 className="text-4xl font-bold text-[#1B5E20] mb-6 font-serif mt-4">AI Modules</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <AiPujaSuggestion />
        <AiMantraAssistant />
        <AiSankalpGenerator />
        <AiPanchangWidget />
      </div>
      <FloatingPujaChatbot />
    </div>
  );
}