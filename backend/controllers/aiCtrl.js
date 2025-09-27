// require('dotenv').config();
// const { GEMINI_API_KEY } = process.env;

// const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${GEMINI_API_KEY}`;
// const API_URL_JSON = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${GEMINI_API_KEY}`;


// // --- Helper function for making Gemini API calls ---
// async function callGeminiApi(systemPrompt, userQuery, isJson = false) {
//   try {
//     const payload = {
//       contents: [{ parts: [{ text: userQuery }] }],
//       systemInstruction: { parts: [{ text: systemPrompt }] },
//     };

//     if (isJson) {
//       payload.generationConfig = {
//         responseMimeType: "application/json",
//         responseSchema: {
//           type: "OBJECT",
//           properties: {
//             title: { type: "STRING" },
//             days: {
//               type: "ARRAY",
//               items: {
//                 type: "OBJECT",
//                 properties: {
//                   day: { type: "NUMBER" },
//                   activities: {
//                     type: "ARRAY",
//                     items: { type: "STRING" },
//                   },
//                 },
//               },
//             },
//           },
//           propertyOrdering: ["title", "days"],
//         },
//       };
//     }

//     const response = await fetch(isJson ? API_URL_JSON : API_URL, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(payload),
//     });

//     const result = await response.json();
//     const candidate = result.candidates?.[0];
//     if (!candidate || !candidate.content?.parts?.[0]?.text) {
//       console.error("Gemini API response error:", result);
//       throw new Error("Invalid response from Gemini API");
//     }
//     return candidate.content.parts[0].text;
//   } catch (error) {
//     console.error("Failed to call Gemini API:", error);
//     throw new Error("Failed to generate response from AI");
//   }
// }

// // --- Controller functions ---
// exports.planItinerary = async (req, res) => {
//   const { interests, duration, location } = req.body;
//   const systemPrompt = `You are an expert itinerary planner for tourism in Jharkhand, India.
//   Your task is to create a detailed, day-by-day travel plan for a tourist.
//   The user will provide their interests, desired duration, and location.
//   Be creative and provide a well-structured, personalized plan.
//   The output MUST be a JSON object with a 'title' string and a 'days' array.
//   Each object in the 'days' array must have a 'day' number and an 'activities' array of strings.
//   Example JSON format: { "title": "Your Plan", "days": [{ "day": 1, "activities": ["Activity 1", "Activity 2"] }] }.`;

//   const userQuery = `Create a travel plan for ${duration} days in ${location} with these interests: ${interests.join(", ")}.`;

//   try {
//     const jsonResponse = await callGeminiApi(systemPrompt, userQuery, true);
//     res.json(JSON.parse(jsonResponse));
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// exports.getChatResponse = async (req, res) => {
//   const { message, language } = req.body;
//   const systemPrompt = `You are a friendly and helpful multilingual chatbot for Jharkhand Tourism.
//   Your goal is to assist tourists with their questions about Jharkhand's tourist sites, culture, food, and travel.
//   Respond in a friendly and conversational tone in the requested language.
//   If the language is 'hi', respond in Hindi.
//   If the language is 'en', respond in English.
//   If you don't know the answer, politely say that you can't help with that specific question.`;

//   const userQuery = `Language: ${language}. User message: ${message}`;

//   try {
//     const textResponse = await callGeminiApi(systemPrompt, userQuery);
//     res.json({ response: textResponse });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

require('dotenv').config();
const { GEMINI_API_KEY } = process.env;

const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${GEMINI_API_KEY}`;
const API_URL_JSON = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${GEMINI_API_KEY}`;


// --- Helper function for making Gemini API calls ---
async function callGeminiApi(systemPrompt, userQuery, isJson = false) {
  try {
    const payload = {
      contents: [{ parts: [{ text: userQuery }] }],
      systemInstruction: { parts: [{ text: systemPrompt }] },
    };

    if (isJson) {
      payload.generationConfig = {
        responseMimeType: "application/json",
        responseSchema: {
          type: "OBJECT",
          properties: {
            title: { type: "STRING" },
            days: {
              type: "ARRAY",
              items: {
                type: "OBJECT",
                properties: {
                  day: { type: "NUMBER" },
                  activities: {
                    type: "ARRAY",
                    items: { type: "STRING" },
                  },
                },
              },
            },
          },
          propertyOrdering: ["title", "days"],
        },
      };
    }

    const response = await fetch(isJson ? API_URL_JSON : API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const result = await response.json();
    const candidate = result.candidates?.[0];
    if (!candidate || !candidate.content?.parts?.[0]?.text) {
      console.error("Gemini API response error:", result);
      throw new Error("Invalid response from Gemini API");
    }
    return candidate.content.parts[0].text;
  } catch (error) {
    console.error("Failed to call Gemini API:", error);
    throw new Error("Failed to generate response from AI");
  }
}

// --- Controller functions ---
// Note: Changed from 'exports.planItinerary = ...' to 'const planItinerary = ...' 
// to allow the combined module.exports at the end.
const planItinerary = async (req, res) => {
  const { interests, duration, location } = req.body;
  const systemPrompt = `You are an expert itinerary planner for tourism in Jharkhand, India.
  Your task is to create a detailed, day-by-day travel plan for a tourist.
  The user will provide their interests, desired duration, and location.
  Be creative and provide a well-structured, personalized plan.
  The output MUST be a JSON object with a 'title' string and a 'days' array.
  Each object in the 'days' array must have a 'day' number and an 'activities' array of strings.
  Example JSON format: { "title": "Your Plan", "days": [{ "day": 1, "activities": ["Activity 1", "Activity 2"] }] }.`;

  const userQuery = `Create a travel plan for ${duration} days in ${location} with these interests: ${interests.join(", ")}.`;

  try {
    const jsonResponse = await callGeminiApi(systemPrompt, userQuery, true);
    res.json(JSON.parse(jsonResponse));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Note: Changed from 'exports.getChatResponse = ...' to 'const getChatResponse = ...' 
// to allow the combined module.exports at the end.
const getChatResponse = async (req, res) => {
  const { message, language } = req.body;
  const systemPrompt = `You are a friendly and helpful multilingual chatbot for Jharkhand Tourism.
  Your goal is to assist tourists with their questions about Jharkhand's tourist sites, culture, food, and travel.
  Respond in a friendly and conversational tone in the requested language.
  If the language is 'hi', respond in Hindi.
  If the language is 'en', respond in English.
  If you don't know the answer, politely say that you can't help with that specific question.`;

  const userQuery = `Language: ${language}. User message: ${message}`;

  try {
    const textResponse = await callGeminiApi(systemPrompt, userQuery);
    res.json({ response: textResponse });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// At the end of the file, change the exports
module.exports = {
  planItinerary,
  getChatResponse,
  callGeminiApi // Export the helper function
};
