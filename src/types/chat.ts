// src/types/chat.ts

// 発言者がユーザーかAIかを区別するための型
export type Role = 'user' | 'model';

// 会話の1単位を表すノード
export interface MessageNode {
  id: string;
  parentId: string | null; // 親ノードのID（nullの場合はルートノード）
  role: Role;              // 発言者の役割（ユーザーまたはモデル）
  content: string;         // 発言内容
  comment?: string;        // ノードに対するコメント（任意）
  timestamp: number;       // タイムスタンプ（UNIX時間）
}

//ツリー全体を管理する型
export interface ConversationTree {
  // すべてのノードをIDをキーとした辞書型で保存
  nodes: Record<string, MessageNode>;  // Idをキーとして全ノードを保存
  currentLeafId: string | null;        // 現在表示している一番下のノードID
}