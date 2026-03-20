// src/utils/tree.ts
import { MessageNode } from '../types/chat'

// 現在のノードIDから親をたどって，時系列の会話列を作成する関数
export const getConversationPath = (
  leafId: string | null,
  nodes: Record<string, MessageNode>
): MessageNode[] => {
  const path:MessageNode[] = [];
  let currentId = leafId;

  while (currentId && nodes[currentId]) {
    path.unshift(nodes[currentId]);  // 配列の先頭に追加して絶頂く
    currentId = nodes[currentId].parentId;
  }
  return path;  // [古い発言,....,新しい発言]
};