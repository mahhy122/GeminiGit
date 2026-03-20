// src/App.tsx
import { ChatPanel } from './components/ChatPanel';
import './App.css'; // ※初期設定のCSSが残っていても一旦大丈夫です

function App() {
  return (
    <div style={{ display: 'flex', width: '100vw', height: '100vh', margin: 0 }}>
      {/* 左側にツリー表示（次回実装予定のエリア） */}
      <div style={{ flex: 1, borderRight: '1px solid #ccc', backgroundColor: '#f0f0f0' }}>
        <h3 style={{ padding: '20px', margin: 0 }}>🌲 会話ツリー (準備中)</h3>
        <p style={{ padding: '0 20px', color: '#666' }}>
          ここにReact Flowを使って、ブランチの分岐を描画します。
        </p>
      </div>
      
      {/* 右側にチャット画面 */}
      <div style={{ flex: 2 }}>
        <ChatPanel />
      </div>
    </div>
  );
}

export default App;