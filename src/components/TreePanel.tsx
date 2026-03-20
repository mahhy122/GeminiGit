// src/components/TreePanel.tsx
import React, { useMemo } from 'react';
import ReactFlow, { Background, Controls, Node, Edge, MarkerType } from 'reactflow';
import 'reactflow/dist/style.css'; // ReactFlowの必須スタイル
import { useChatStore } from '../store/chatStore';

export const TreePanel = () => {
  const { tree, setCurrentLeaf } = useChatStore();

  // tree.nodes のデータから、React Flow 用のノードとエッジ（線）を計算して生成する
  const { flowNodes, flowEdges } = useMemo(() => {
    const fNodes: Node[] = [];
    const fEdges: Edge[] = [];

    // ツリーの階層（深さ）を計算して配置位置を決めるための準備
    const depths: Record<string, number> = {};
    const depthCounts: Record<number, number> = {};

    // 各ノードの深さを計算
    Object.values(tree.nodes).forEach(node => {
      let depth = 0;
      let curr = node.parentId;
      while (curr && tree.nodes[curr]) {
        depth++;
        curr = tree.nodes[curr].parentId;
      }
      depths[node.id] = depth;
    });

    // 2. 描画用のノードとエッジを生成
    Object.values(tree.nodes).forEach(node => {
      const depth = depths[node.id];
      if (depthCounts[depth] === undefined) depthCounts[depth] = 0;
      const indexAtDepth = depthCounts[depth]++; // 同じ段の中で左から何番目か

      // 表示するテキスト（要約タグがあればそれ、なければ内容の一部）
      const labelText = node.comment ? node.comment : (node.content.substring(0, 15) + '...');
      const isCurrent = node.id === tree.currentLeafId; // 現在見ているブランチの先端かどうか

      // ノードの定義
      fNodes.push({
        id: node.id,
        position: { x: indexAtDepth * 250, y: depth * 100 }, // XとYの座標
        data: { label: `${node.role === 'user' ? '👤' : '🤖'} ${labelText}` },
        style: {
          background: isCurrent ? '#eff6ff' : 'white', // 現在地は青っぽくする
          border: isCurrent ? '2px solid #3b82f6' : '1px solid #d1d5db',
          borderRadius: '8px',
          padding: '10px',
          fontSize: '12px',
          width: 200,
        }
      });

      // エッジ（親から子への矢印）の定義
      if (node.parentId) {
        fEdges.push({
          id: `e-${node.parentId}-${node.id}`,
          source: node.parentId,
          target: node.id,
          markerEnd: { type: MarkerType.ArrowClosed },
        });
      }
    });

    return { flowNodes: fNodes, flowEdges: fEdges };
  }, [tree]);

  // ノードがクリックされたら、そこをHeadにする（Git checkoutに相当）
  const onNodeClick = (_: React.MouseEvent, node: Node) => {
    setCurrentLeaf(node.id);
  };

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <ReactFlow
        nodes={flowNodes}
        edges={flowEdges}
        onNodeClick={onNodeClick}
        fitView // 画面に収まるように自動ズーム
      >
        <Background color="#ccc" gap={16} />
        <Controls />
      </ReactFlow>
    </div>
  );
};