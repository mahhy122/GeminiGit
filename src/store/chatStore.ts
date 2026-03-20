// src/store/chatStore.ts
import { create } from 'zustand'
import { v4 as uuidv4 } from 'uuid';
import { MessageNode, ConversationTree, Role } from '../types/chat';

interface ChatState {
  tree: ConversationTree;
  // メッセージを追加する（Gitの commit に相当）
  addMessage: (
    role: Role, 
    content: string, 
    parentId: string | null
  ) => string;
  // 過去のノードに戻る，またはブランチを切り替える関数
  setCurrentLeaf: (
    id: string 
  ) => void;
  // ノードのコメントを更新する関数
  updateComment: (
    id: string,
    comment: string
  ) => void;
}

export const useChatStore = create<ChatState>((set) => ( ({
  // 初期状態は空のツリー
  tree: {
    nodes: {},
    currentLeafId: null,
  },
  // 新しい発言をツリーに追加しそれを現在の最新ノードとして記録する
  // currentLeafId: 現在の最新ノード
  addMessage: (role, content, parentId) => {
    const id = uuidv4();  // ランダムでユニークなIDを生成
    // 新しいノードを作成
    const newNode: MessageNode = {
      id,
      parentId,
      role,
      content,
      timestamp: Date.now(),
    };
    set((state) =>({
      tree: {
        // 既存のノード一覧を展開し，最後に新しいノードを追加
        nodes: { ...state.tree.nodes, [id]: newNode },
        currentLeafId: id,  // 新しいノードを現在の末端としてセット
      },
    }));
    return id;  // 作成したしたIDを返す(AIの解答をこの子ノードとしてつなげるため)
  },
  // 指定した過去のノードのIDに飛び，そこを現在地とする
  // ここから別の質問を投げればブランチが誕生
  setCurrentLeaf: (id) => {
    set((state) => ({
      // treeの中身はそのままに，現在地(Head)だけを書き換える
      tree: { ...state.tree, currentLeafId: id },
    }));
  },
  updateComment: (id, comment) => {
    set((state) => ({
      tree: {
        ...state.tree,
        nodes: {
          ...state.tree.nodes,
          // 指定されたIDのノードだけを展開し，commentプロパティを上書き
          [id]: { ...state.tree.nodes[id], comment },
        },
      },
    }));
  },
})));
