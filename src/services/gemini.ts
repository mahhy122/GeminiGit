// src/services/gemini.ts
import { GoogleGenerativeAI } from '@google/generative-ai';

// .env.localからAPIキーを読み込み
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

if(!apiKey){
  throw new Error("APIキーが設定されていません。.env.localを確認してください");
}

// Gemini 1.5 Flashモデルを初期化
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' });

// ユーザーのプロンプトをGeminiに送信し，回答を取得
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

// 会話の内容からブランチの目印となるタグを自動生成
export const generateCommitMessage = async (content: string) => {
  const prompt =`
以下の会話内容を、1行（20文字以内）で要約してください。
その際、会話の性質に合わせて、先頭に以下のいずれかの独自タグをつけてください。

【GeG専用タグ一覧】
- [Code]  : プログラミングのコード作成や実装に関する話題
- [Debug] : エラー解決や原因究明に関する話題
- [Learn] : 概念の解説、言語の文法、新しい知識の学習に関する話題
- [Idea]  : アイデア出し、構成案の作成、ブレインストーミング
- [Ask]   : 上記に当てはまらない、その他の一般的な質問や会話

出力例: [Debug] process変数のエラー解決
会話内容:
${content}
  `;

  try {
    const result = await model.generateContent(prompt);
    return result.response.text().trim();
  } catch (error) {
    console.error('要約の生成に失敗しました', error);
    return '[System] 要約エラー';
  }
};