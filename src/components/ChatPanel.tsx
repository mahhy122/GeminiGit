// src/components/ChatPanel.tsx
import React, { useState } from 'react';
import { useChatStore }from '../store/chatStore';
import { useGeminiChat } from '../hooks/useGeminiChat';
import { getConversationPath } from '../utils/tree';
import { Send } from 'lucide-react';

export const ChatPanel = () => {
  const [input, setInput] = useState('');  // 入力欄のテキスト状態
  const { tree } = useChatStore();         // ツリー全体の状態
  const { handleSend } = useGeminiChat();  // 送信処理のフック

  // 現在選択されているブランチの会話を一番上から時系列の配列として取得
  const currentPath = getConversationPath(tree.currentLeafId, tree.nodes);

  // 送信ボタンが押されたとき，またはEnterキーが押されたときの処理
  const onSubmit = (e: React.FormEvent)  =>{
    e.preventDefault();  // 画面の不要なリロードを防ぐ
    if (!input.trim()) {
      // 空文字なら何もしない
      return;
    }
    handleSend(input);
    setInput('');  // 送信後に入力欄を空にする
  };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100%', backgroundColor: '#f9fafb'}}>

      {/* --- チャット履歴表示エリア --- */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
        {currentPath.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#888', marginTop: '50px' }}>
            最初のメッセージを送信して、新しいブランチを作成しましょう！
          </p>
        ) : (
          currentPath.map((msg) => (
            <div key={msg.id} style={{
              display: 'flex',
              flexDirection: 'column',
              // ユーザー発言は右寄せ、AI回答は左寄せにする
              alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start',
              marginBottom: '16px'
            }}>
              {/* 自動生成された要約タグの表示 */}
              {msg.comment && (
                <span style={{ fontSize: '0.8rem', color: '#666', marginBottom: '4px' }}>
                  {msg.comment}
                </span>
              )}
              
              {/* メッセージ本文の吹き出し */}
              <div style={{
                maxWidth: '70%',
                padding: '12px 16px',
                borderRadius: '12px',
                backgroundColor: msg.role === 'user' ? '#2563eb' : '#ffffff',
                color: msg.role === 'user' ? '#ffffff' : '#333333',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}>
                {msg.content}
              </div>
            </div>
          ))
        )}
      </div>

      {/* --- メッセージ入力エリア --- */}
      <div style={{ padding: '20px', backgroundColor: '#ffffff', borderTop: '1px solid #eee' }}>
        <form onSubmit={onSubmit} style={{ display: 'flex', gap: '10px' }}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="メッセージを入力... (新しいノードが追加されます)"
            style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #ccc', outline: 'none' }}
          />
          <button type="submit" style={{
            backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', padding: '0 20px', cursor: 'pointer'
          }}>
            <Send size={20} />
          </button>
        </form>
      </div>
    </div>
  )
}