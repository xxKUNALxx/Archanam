// ✅ Minimal Gemini service wrapper with v1beta API (fixed 404 issue)
import { GoogleGenerativeAI } from "@google/generative-ai";

// Direct environment variable access with fallback
const apiKey = import.meta.env.VITE_GEMINI_API_KEY || 'AIzaSyAr5EQXzbHJGTerZL1A1C44pGSNaAwfdrI';
let client;

function getClient() {
  if (!client) {
    if (!apiKey) {
      throw new Error("❌ Missing GEMINI_API_KEY environment variable");
    }
    if (!apiKey.startsWith("AIza")) {
      throw new Error("❌ Invalid API key format. Should start with 'AIza'");
    }
    client = new GoogleGenerativeAI(apiKey);
  }
  return client;
}

// ✅ Core API call — fixed endpoint and model name format
async function callGeminiV1BetaAPI(model, prompt) {
  // Ensure proper prefix for the model name
  const modelName = model.startsWith("models/") ? model : `models/${model}`;
  const url = `https://generativelanguage.googleapis.com/v1beta/${modelName}:generateContent?key=${apiKey}`;

  const body = {
    contents: [
      {
        role: "user",
        parts: [{ text: prompt }],
      },
    ],
    generationConfig: { temperature: 0.6, maxOutputTokens: 1024 },
  };

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`HTTP ${res.status}: ${res.statusText} - ${errText}`);
    }

    const data = await res.json();

    const result = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!result) throw new Error("Invalid response format from Gemini API");
    return result;
  } catch (err) {
    throw err;
  }
}

// ✅ Fallback when API fails
function getFallbackResponse(prompt) {
  const responses = {
    करियर:
      "गणेश पूजा करें। कारण: विघ्न हरण और सफलता के लिए। सामग्री: गणेश मूर्ति, मोदक, दूर्वा, लाल फूल, धूप, दीप।",
    स्वास्थ्य:
      "महामृत्युंजय मंत्र जाप करें। कारण: स्वास्थ्य और दीर्घायु के लिए। सामग्री: रुद्राक्ष माला, गंगाजल, बेल पत्र, धूप, दीप।",
    विवाह:
      "गौरी गणेश पूजा करें। कारण: सुखी वैवाहिक जीवन के लिए। सामग्री: गौरी गणेश मूर्ति, हल्दी, कुमकुम, चावल, फूल।",
    शांति:
      "सत्यनारायण पूजा करें। कारण: मानसिक शांति और समृद्धि के लिए। सामग्री: कलश, पंचामृत, तुलसी, धूप, दीप।",
    पंचांग:
      `आज का पंचांग:

**तिथि:** द्वितीया, शुक्ल पक्ष
**नक्षत्र:** रोहिणी नक्षत्र
**योग:** सिद्धि योग
**करण:** बव करण

**सूर्योदय:** प्रातः 6:30 बजे
**सूर्यास्त:** सायं 6:15 बजे

**शुभ समय:** प्रातः 6:30 से 8:30 तक और सायं 5:00 से 7:00 तक
**वर्ज्य काल:** दोपहर 12:00 से 1:30 तक

आज गणेश पूजा, लक्ष्मी पूजा और नवग्रह पूजा के लिए शुभ दिन है।

*यह सामान्य पंचांग है। सटीक मुहूर्त के लिए स्थानीय पंडित से सलाह लें।*`
  };

  // Check for panchang-related keywords
  if (prompt.includes('पंचांग') || prompt.includes('तिथि') || prompt.includes('नक्षत्र')) {
    return responses.पंचांग;
  }

  for (const [k, v] of Object.entries(responses)) if (prompt.includes(k)) return v;
  return "गणेश पूजा करें। कारण: सभी कार्यों में सफलता के लिए गणेश जी की कृपा आवश्यक है। सामग्री: गणेश मूर्ति, मोदक, दूर्वा, लाल फूल, धूप, दीप।";
}

// ✅ Simple direct API call using ONLY gemini-2.5-flash-lite
export async function generateText({ prompt, model = "gemini-2.5-flash-lite" } = {}) {
  if (!apiKey) {
    const fallback = getFallbackResponse(prompt);
    return fallback;
  }

  try {
    const requestBody = {
      contents: [{
        role: "user",
        parts: [{ text: prompt }]
      }]
    };

    // Use ONLY gemini-2.5-flash-lite as requested
    const modelName = 'gemini-2.5-flash-lite';
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    if (response.ok) {
      const data = await response.json();

      const result = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (result) {
        return result;
      } else {
        throw new Error('No text found in response');
      }
    } else {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

  } catch (error) {

    // Try with a different model as fallback
    try {
      const fallbackUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-8b:generateContent?key=${apiKey}`;

      const fallbackResponse = await fetch(fallbackUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [{
            role: "user",
            parts: [{ text: prompt }]
          }]
        })
      });

      if (fallbackResponse.ok) {
        const fallbackData = await fallbackResponse.json();
        const fallbackResult = fallbackData?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (fallbackResult) {
          return fallbackResult;
        }
      }
    } catch (fallbackError) {
    }

    const fallback = getFallbackResponse(prompt);
    return fallback;
  }
}

// ✅ Test API connection
export async function testGeminiConnection() {
  try {
    const models = ["models/gemini-2.0-flash", "models/gemini-1.5-flash"];
    for (const m of models) {
      try {
        const res = await callGeminiV1BetaAPI(m, "Hello Gemini!");
        return { success: true, model: m, response: res.slice(0, 100) };
      } catch (err) {
      }
    }
    throw new Error("All test models failed");
  } catch (err) {
    return { success: false, error: err.message };
  }
}

// ✅ Optional — list models (manual Postman check recommended)
export async function listAvailableModels() {
  try {
    const url = "https://generativelanguage.googleapis.com/v1beta/models";
    const res = await fetch(url, {
      headers: { "X-Goog-Api-Key": apiKey },
    });
    const data = await res.json();
    return data;
  } catch (err) {
    return { success: false, error: err.message };
  }
}
// ✅ Chat stream function (for compatibility)
export async function chatStream({ system, messages = [], model = "gemini-2.0-flash", generationConfig } = {}) {
  try {
    const genAI = getClient();

    // Try different model names for free tier API
    const modelNames = [
      "gemini-2.0-flash",
      "gemini-1.5-flash",
      "gemini-1.5-flash-8b"
    ];

    let lastError;

    for (const modelName of modelNames) {
      try {
        const m = genAI.getGenerativeModel({
          model: modelName,
          systemInstruction: system,
          generationConfig: { temperature: 0.5, maxOutputTokens: 768, ...generationConfig }
        });
        return m.startChat({ history: messages });
      } catch (error) {
        lastError = error;

        // If it's a 404 error, try the next model
        if (error.message.includes('404') || error.message.includes('not found')) {
          continue;
        }

        // For other errors, throw immediately
        throw error;
      }
    }

    // If all models failed, throw the last error
    throw lastError;
  } catch (error) {
    throw error;
  }
}

// ✅ Generate JSON function (for compatibility)
export async function generateJSON({ schema, prompt, model = "gemini-2.0-flash" }) {
  try {
    const genAI = getClient();

    // Try different model names for free tier API
    const modelNames = [
      "gemini-2.0-flash",
      "gemini-1.5-flash",
      "gemini-1.5-flash-8b"
    ];

    let lastError;

    for (const modelName of modelNames) {
      try {
        const m = genAI.getGenerativeModel({ model: modelName });
        const res = await m.generateContent([
          { text: `${prompt}\nReturn strict JSON matching this schema: ${JSON.stringify(schema)}` },
        ]);
        const text = res.response.text();
        try {
          return JSON.parse(text);
        } catch (_) {
          return { error: "Invalid JSON from model", raw: text };
        }
      } catch (error) {
        lastError = error;

        // If it's a 404 error, try the next model
        if (error.message.includes('404') || error.message.includes('not found')) {
          continue;
        }

        // For other errors, throw immediately
        throw error;
      }
    }

    // If all models failed, throw the last error
    throw lastError;
  } catch (error) {
    throw error;
  }
}