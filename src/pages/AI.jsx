import React, { useEffect, useMemo, useRef, useState } from 'react';
import { generateText, chatStream } from '../services/gemini';

export function AiPujaSuggestion() {
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
      
      // Parse the response to extract different parts
      const lines = text.split('\n');
      let pujaSuggestion = '';
      let reason = '';
      let materials = '';
      
      lines.forEach(line => {
        if (line.includes('पूजा सुझाव:') || line.includes('सुझाव:')) {
          pujaSuggestion = line.replace(/पूजा सुझाव:|सुझाव:/, '').trim();
        } else if (line.includes('कारण:')) {
          reason = line.replace('कारण:', '').trim();
        } else if (line.includes('सामग्री:')) {
          materials = line.replace('सामग्री:', '').trim();
        }
      });
      
      setAiResponse({
        pujaSuggestion: pujaSuggestion || text,
        reason: reason || 'पारंपरिक वैदिक विधि से शुभ फल प्राप्त होते हैं।',
        materials: materials || 'पूजा की सामग्री पंडितजी द्वारा उपलब्ध कराई जाएगी।'
      });
      
      setStep('action');
    } catch (e) {
      const msg = (e?.message || '').includes('Missing VITE_GEMINI_API_KEY') ? 'API कुंजी अनुपलब्ध है। .env में VITE_GEMINI_API_KEY सेट करें।' : (e?.message || 'त्रुटि हुई');
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = () => {
    // Here you would integrate with payment system
    alert('बुकिंग सफल! हमारी टीम जल्द ही संपर्क करेगी।');
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
      <h3 className="text-2xl font-bold text-[#1B5E20] mb-4 font-serif">🕉 AI पूजा सुझाव</h3>
      
      {step === 'greeting' && (
        <div className="text-center">
          <div className="text-4xl mb-4">🙏</div>
          <p className="text-lg text-[#424242] mb-6 font-devanagari">
            नमस्ते!<br/>
            कृपया बताइए आपको किस विषय में पूजा का सुझाव चाहिए?<br/>
            <span className="text-sm text-gray-600">(उदाहरण: करियर, स्वास्थ्य, विवाह, शांति, संतान, शिक्षा, धन आदि)</span>
          </p>
          <div className="flex gap-2">
            <input 
              value={userInput} 
              onChange={(e) => setUserInput(e.target.value)} 
              className="flex-1 border rounded-lg px-3 py-2" 
              placeholder="अपना प्रश्न लिखें..." 
            />
            <button 
              onClick={handleUserInput} 
              disabled={loading} 
              className="bg-[#FFB300] text-white px-4 py-2 rounded-lg hover:bg-[#FFC107]"
            >
              पूछें
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
              onChange={(e) => setBookingData({...bookingData, name: e.target.value})}
              className="border rounded-lg px-3 py-2" 
              placeholder="आपका नाम" 
            />
            <input 
              type="date"
              value={bookingData.date}
              onChange={(e) => setBookingData({...bookingData, date: e.target.value})}
              className="border rounded-lg px-3 py-2" 
            />
            <select 
              value={bookingData.type}
              onChange={(e) => setBookingData({...bookingData, type: e.target.value})}
              className="border rounded-lg px-3 py-2"
            >
              <option value="online">ऑनलाइन पूजा</option>
              <option value="offline">घर पर पूजा</option>
            </select>
            {bookingData.type === 'offline' && (
              <input 
                value={bookingData.location}
                onChange={(e) => setBookingData({...bookingData, location: e.target.value})}
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
              <strong>विधि:</strong> सुबह स्नान करके पूजा स्थल को साफ करें। दीपक जलाकर पूजा आरंभ करें।<br/>
              <strong>मंत्र:</strong> "ॐ गणेशाय नमः" (गणेश पूजा के लिए)<br/>
              <strong>समय:</strong> सुबह 6-8 बजे या शाम 6-8 बजे<br/>
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
      const msg = (e?.message || '').includes('Missing VITE_GEMINI_API_KEY') ? 'API कुंजी अनुपलब्ध है। .env में VITE_GEMINI_API_KEY सेट करें।' : (e?.message || 'अज्ञात');
      setResult('त्रुटि: ' + msg);
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
        <input value={query} onChange={(e)=>setQuery(e.target.value)} className="flex-1 border rounded-lg px-3 py-2" placeholder="मंत्र/उद्देश्य" />
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
    const prompt = `भूमिका: वैदिक संकल्प पाठ सहायक।
कार्य: दिए गए विवरण से संक्षिप्त पर परंपरानुकूल संकल्प लिखें।
इनपुट: नाम: ${name}, गोत्र: ${gotra}, पूजा: ${details}
निर्देश:
- संस्कृत-हिंदी मिश्रित परंपरागत शैली; बिना इमोजी।
- स्थान सामान्य रखें, तिथि हेतु <तिथि> छोड़ें।
- 5-8 पंक्तियाँ, अंत में कल्याणकामना।`;
    try {
      const text = await generateText({ prompt: `${prompt}\n\nName: ${name}\nGotra: ${gotra}\nPuja: ${details}` });
      setOutput(text);
    } catch (e) {
      const msg = (e?.message || '').includes('Missing VITE_GEMINI_API_KEY') ? 'API कुंजी अनुपलब्ध है। .env में VITE_GEMINI_API_KEY सेट करें।' : (e?.message || 'अज्ञात');
      setOutput('त्रुटि: ' + msg);
    } finally { setLoading(false); }
  };

  return (
    <div className="p-6 rounded-2xl shadow-lg bg-white border border-gray-200">
      <h3 className="text-2xl font-bold text-[#1B5E20] mb-3 font-serif">AI संकल्प जनरेटर</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
        <input className="border rounded-lg px-3 py-2" value={name} onChange={e=>setName(e.target.value)} placeholder="नाम" />
        <input className="border rounded-lg px-3 py-2" value={gotra} onChange={e=>setGotra(e.target.value)} placeholder="गोत्र" />
        <input className="border rounded-lg px-3 py-2" value={details} onChange={e=>setDetails(e.target.value)} placeholder="पूजा विवरण" />
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
    const prompt = `दिन के पंचांग का संक्षेप (हिंदी, 6-8 पंक्तियाँ, बिना इमोजी):
- तिथि, पक्ष
- नक्षत्र, योग, करण
- सूर्योदय/सूर्यास्त (सामान्य)
- आज के सामान्य शुभ समय/वर्ज्य काल (सामान्य)
ध्यान दें: यह AI-जनित सामान्यीकृत सारांश है, स्थानीय मुहूर्त हेतु अपने पंडित/पंचांग देखें।`;
    try {
      const text = await generateText({ prompt });
      setData(text);
    } catch (e) { const msg=(e?.message||'').includes('Missing VITE_GEMINI_API_KEY')?'API कुंजी अनुपलब्ध है। .env में VITE_GEMINI_API_KEY सेट करें।':(e?.message||'अज्ञात'); setData('त्रुटि: '+msg); }
    finally { setLoading(false); }
  };
  useEffect(()=>{ refresh(); },[]);
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
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState('greeting');
  const [userInput, setUserInput] = useState('');
  const [aiResponse, setAiResponse] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [bookingData, setBookingData] = useState({ name: '', date: '', location: '', type: 'online' });

  const ask = async () => {
    if (!userInput.trim()) return;
    setLoading(true); setError('');
    try {
      const prompt = `भूमिका: अनुभवी वैदिक आचार्य-सहायक।\nप्रश्न: "${userInput}"\nतीन भागों में उत्तर दें: \nपूजा सुझाव: ...\nकारण: ...\nसामग्री: ...`;
      const text = await generateText({ prompt });
      const lines = text.split('\n');
      let pujaSuggestion = '', reason = '', materials = '';
      lines.forEach(line => {
        if (line.includes('पूजा सुझाव')) pujaSuggestion = line.split(':')[1]?.trim() || pujaSuggestion;
        if (line.startsWith('कारण')) reason = line.split(':')[1]?.trim() || reason;
        if (line.startsWith('सामग्री')) materials = line.split(':')[1]?.trim() || materials;
      });
      setAiResponse({
        pujaSuggestion: pujaSuggestion || text,
        reason: reason || 'शुभ फल हेतु अनुकूल।',
        materials: materials || 'मूल पूजा सामग्री आवश्यक।'
      });
      setStep('action');
    } catch (e) {
      const msg = (e?.message || '').includes('Missing VITE_GEMINI_API_KEY') ? 'API कुंजी अनुपलब्ध है।' : (e?.message || 'त्रुटि');
      setError(msg);
    } finally { setLoading(false); }
  };

  const reset = () => { setStep('greeting'); setUserInput(''); setAiResponse({}); setError(''); };

  return (
    <div>
      <button onClick={()=>setOpen(!open)} className="fixed bottom-24 right-6 z-50 bg-[#FFB300] text-white px-4 py-3 rounded-full shadow-xl hover:bg-[#FFC107]">
        AI पूजा सुझाव
      </button>
      {open && (
        <div className="fixed bottom-40 right-6 z-50 w-80 bg-white border border-gray-200 rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-[#1B5E20] text-white px-4 py-2 font-semibold">AI Puja Suggestion</div>
          <div className="p-3 space-y-3">
            {step === 'greeting' && (
              <div>
                <div className="text-sm text-[#424242] mb-2 font-devanagari">🙏 नमस्ते! किस विषय में पूजा सुझाव चाहिए? (करियर, स्वास्थ्य, विवाह…)</div>
                <div className="flex gap-2">
                  <input value={userInput} onChange={e=>setUserInput(e.target.value)} className="flex-1 border rounded-lg px-3 py-2 text-sm" placeholder="अपना प्रश्न लिखें" />
                  <button onClick={ask} className="bg-[#FFB300] text-white px-3 py-2 rounded-lg hover:bg-[#FFC107] text-sm">पूछें</button>
                </div>
                {loading && <div className="text-xs text-gray-500 mt-1">सोच रहा है…</div>}
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
                  <button onClick={()=>setStep('booking')} className="flex-1 bg-[#FFB300] text-white px-3 py-2 rounded-lg hover:bg-[#FFC107] text-sm">📅 बुक करें</button>
                  <button onClick={()=>setStep('info')} className="flex-1 bg-[#1B5E20] text-white px-3 py-2 rounded-lg hover:bg-[#2E7D32] text-sm">📖 विधि</button>
                </div>
              </div>
            )}

            {step === 'booking' && (
              <div className="space-y-2 text-sm">
                <div className="font-semibold text-[#1B5E20]">बुकिंग</div>
                <input className="w-full border rounded-lg px-3 py-2" placeholder="नाम" value={bookingData.name} onChange={e=>setBookingData({...bookingData, name: e.target.value})} />
                <input className="w-full border rounded-lg px-3 py-2" type="date" value={bookingData.date} onChange={e=>setBookingData({...bookingData, date: e.target.value})} />
                <select className="w-full border rounded-lg px-3 py-2" value={bookingData.type} onChange={e=>setBookingData({...bookingData, type: e.target.value})}>
                  <option value="online">ऑनलाइन</option>
                  <option value="offline">ऑफ़लाइन</option>
                </select>
                {bookingData.type==='offline' && (
                  <input className="w-full border rounded-lg px-3 py-2" placeholder="पता" value={bookingData.location} onChange={e=>setBookingData({...bookingData, location: e.target.value})} />
                )}
                <div className="flex gap-2">
                  <button onClick={()=>{ alert('बुकिंग सफल!'); reset(); setOpen(false); }} className="flex-1 bg-[#FFB300] text-white px-3 py-2 rounded-lg hover:bg-[#FFC107]">कन्फर्म</button>
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
      <h2 className="text-4xl font-bold text-[#1B5E20] mb-6 font-serif">AI Modules</h2>
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


