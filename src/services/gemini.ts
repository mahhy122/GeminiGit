// src/services/gemini.ts
import { GoogleGenerativeAI } from '@google/generative-ai';
import 'server-only';
// .env.localからAPIキーを読み込み
const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

if(!apiKey){
  throw new Error("APIキーが設定されていません。.env.localを確認してください");
}

// Gemini 1.5 Flashモデルを初期化
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

export const sendMessageToGemini = async (prompt: string) =>{
  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Gemini API Error:', error);
    throw error;
  }
};