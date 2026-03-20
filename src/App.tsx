// src/App.tsx
import { ChatPanel } from './components/ChatPanel';
import { TreePanel } from './components/TreePanel';
import './App.css';

function App() {
  return (
    <div style={{ display: 'flex', width: '100vw', height: '100vh', margin: 0 }}>
      {/* 左側にツリー表示エリア */}
      <div style={{ flex: 1, borderRight: '1px solid #ccc', backgroundColor: '#f9fafb' }}>
        <TreePanel />
      </div>
      
      {/* 右側にチャット画面 */}
      <div style={{ flex: 2 }}>
        <ChatPanel />
      </div>
    </div>
  );
}

export default App;