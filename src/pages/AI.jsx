import React, { useEffect, useMemo, useRef, useState } from 'react';
import { generateText, chatStream } from '../services/gemini';

export function AiPujaSuggestion() {
  const [question, setQuestion] = useState('मुझे कौन सी पूजा करनी चाहिए?');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const onAsk = async () => {
    setLoading(true); setError(''); setAnswer('');
    try {
      const prompt = `भूमिका: आप एक अनुभवी वैदिक आचार्य-सहायक हैं।
नियम:
- उत्तर केवल हिंदी में दें, बिना इमोजी के।
- अगर प्रश्न स्पष्ट है तो 1-3 उपयुक्त पूजाएँ सुझाएँ; अन्यथा पहले 2 संक्षिप्त प्रश्न पूछें।
- हर पूजा के साथ: क्यों, कब/किस मुहूर्त/दिन, आवश्यक संकेत/शर्तें (संक्षेप में)।
- निष्पक्ष, श्रद्धापूर्ण और व्यावहारिक रहें।
सूची उदाहरण (परिस्थिति पर निर्भर): गृह प्रवेश, श्री सत्यनारायण, नवग्रह शांति, महामृत्युंजय, लक्ष्मी-कुबेर, संतान गोपाल, मंगल दोष निवारण, कालसर्प दोष, नामकरण, जनेऊ आदि।

उपयोगकर्ता का प्रश्न:
${question}

उत्तर प्रारूप:
- शीर्षक: सुझाई गई पूजा(एँ)
- विवरण: 2-4 वाक्यों में कारण और लाभ
- कब करें: दिन/तिथि/मुहूर्त (यदि लागू)
- आवश्यकताएँ: 2-4 बिंदु`;
      const text = await generateText({ prompt });
      setAnswer(text);
    } catch (e) {
      const msg = (e?.message || '').includes('Missing VITE_GEMINI_API_KEY') ? 'API कुंजी अनुपलब्ध है। .env में VITE_GEMINI_API_KEY सेट करें और सर्वर रीस्टार्ट करें।' : (e?.message || 'त्रुटि हुई');
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 rounded-2xl shadow-lg bg-white border border-gray-200">
      <h3 className="text-2xl font-bold text-[#1B5E20] mb-3 font-serif">AI पूजा सुझाव</h3>
      <div className="flex gap-2 mb-3">
        <input value={question} onChange={(e)=>setQuestion(e.target.value)} className="flex-1 border rounded-lg px-3 py-2" placeholder="अपना प्रश्न लिखें" />
        <button onClick={onAsk} disabled={loading} className="bg-[#FFB300] text-white px-4 py-2 rounded-lg hover:bg-[#FFC107]">पूछें</button>
      </div>
      {loading && <div className="text-sm text-gray-500">सोच रहा है…</div>}
      {error && <div className="text-sm text-red-600">{error}</div>}
      {answer && <pre className="whitespace-pre-wrap text-[#424242] font-devanagari leading-7">{answer}</pre>}
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
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { role: 'model', parts: [{ text: 'नमस्ते! लिखें: “मुझे कौन सी पूजा करनी चाहिए?”' }]}
  ]);

  const send = async () => {
    const question = input.trim();
    if (!question) return;
    setMessages(prev => [...prev, { role: 'user', parts: [{ text: question }] }]);
    setInput('');
    const system = `भूमिका: संक्षिप्त हिंदी आचार्य-सहायक चैटबॉट।
नियम: बिना इमोजी; स्पष्ट होने पर 1-3 पूजाएँ सुझाएँ, अन्यथा अधिकतम 2 प्रश्न पूछें; कारण, कब करें, 2-3 आवश्यकताएँ।`;
    try {
      // Build a valid chat history that starts with a user message
      let chatHistory = messages.filter(m => m.role === 'user' || m.role === 'model');
      if (chatHistory.length && chatHistory[0].role !== 'user') {
        chatHistory = chatHistory.slice(1);
      }
      const chat = await chatStream({ system, messages: chatHistory, generationConfig: { temperature: 0.5, maxOutputTokens: 512 } });
      const res = await chat.sendMessage(question);
      const text = await res.response.text();
      setMessages(prev => [...prev, { role: 'model', parts: [{ text }] }]);
    } catch (e) {
      const msg = (e?.message || '').includes('Missing VITE_GEMINI_API_KEY')
        ? 'API कुंजी अनुपलब्ध है। .env में VITE_GEMINI_API_KEY सेट करें और सर्वर रीस्टार्ट करें।'
        : (e?.message || 'क्षमा करें, अभी उत्तर नहीं दे सका।');
      setMessages(prev => [...prev, { role: 'model', parts: [{ text: msg }] }]);
    }
  };

  return (
    <div>
      <button onClick={()=>setOpen(!open)} className="fixed bottom-6 right-6 z-50 bg-[#FFB300] text-white px-4 py-3 rounded-full shadow-xl hover:bg-[#FFC107]">
        AI पूजा सुझाव
      </button>
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-80 bg-white border border-gray-200 rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-[#1B5E20] text-white px-4 py-2 font-semibold">AI Puja Suggestion</div>
          <div className="h-72 overflow-y-auto p-3 space-y-3">
            {messages.map((m, idx)=> (
              <div key={idx} className={m.role === 'user' ? 'text-right' : 'text-left'}>
                <div className={`inline-block px-3 py-2 rounded-lg ${m.role==='user' ? 'bg-[#FFECB3]' : 'bg-[#F5F5F5]'}`}>
                  {m.parts?.[0]?.text}
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2 p-2 border-t">
            <input value={input} onChange={e=>setInput(e.target.value)} className="flex-1 border rounded-lg px-3 py-2" placeholder="अपना प्रश्न लिखें" />
            <button onClick={send} className="bg-[#FFB300] text-white px-3 py-2 rounded-lg hover:bg-[#FFC107]">भेजें</button>
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


