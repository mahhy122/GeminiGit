// src/hooks/useGeminiChat.ts
import { useChatStore } from '../store/chatStore';
import { sendMessageToGemini, generateCommitMessage } from '../services/gemini';

export const useGeminiChat = () => {
  const { tree, addMessage, updateComment } = useChatStore();

  const handleSend = async (content: string) => {
    // ユーザーの発言をツリーに追加
    const currentId = tree.currentLeafId;
    const userNodeId = addMessage('user', content, currentId);

    // ユーザーの発言からコミットメッセージ（要約）を非同期で生成して保存
    generateCommitMessage(content).then((summary) => {
      updateComment(userNodeId, summary);
    });

    try {
      // Geminiにメッセージを送信（今は直前のテキストのみ）
      const aiResponseText = await sendMessageToGemini(content);

      // AIの回答をツリーに追加
      const aiNodeId = addMessage('model', aiResponseText, userNodeId);
      
      // AIの回答の要約も生成して保存（区別するためプレフィックスをbot:に）
      generateCommitMessage(aiResponseText).then((summary) => {
        updateComment(aiNodeId, `bot: ${summary}`);
      });

    } catch (error) {
      console.error('Geminiの通信に失敗しました', error);
    }
  };

  return { handleSend };
};