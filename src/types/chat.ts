// src/types/chat.ts
export type Role = 'user' | 'model';

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
  nodes: Record<string, MessageNode>;  // Idをキーとして全ノードを保存
  currentLeafId: string | null;        // 現在表示している一番下のノードID
}