import {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
  } from "@google/generative-ai";
  
  const MODEL_NAME = "gemini-1.5-flash";
  const VITE_GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
  
  async function run(prompt) {
    const genAI = new GoogleGenerativeAI(VITE_GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });
  
    const generationConfig = {
        temperature: 1,
        topP: 0.95,
        topK: 40,
        maxOutputTokens: 8192,
        responseMimeType: "text/plain",  
    };
  
    console.log("Generation Config:", generationConfig);
  
    const safetySettings = [
        {
            category: HarmCategory.HARM_CATEGORY_HARASSMENT,
            threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
        },
        {
            category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
            threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
        },
    ];
  
    const chatSession = model.startChat({
        generationConfig,
        safetySettings,
        history: [],
    });
  
    try {
        const result = await chatSession.sendMessage(prompt);
        const response = result.response;
        console.log(response.text());
        return response.text();
    } catch (error) {
        console.error("Error generating response:", error);
        return "An error occurred while generating the response.";
    }
  }
  
  export default run;
  