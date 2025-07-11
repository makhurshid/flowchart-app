// src/FlowchartPage.jsx
import React, { useCallback, useState } from 'react';
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { useParams, useNavigate } from 'react-router-dom';
import FlowchartNode from '../FlowchartNode';

const nodeTypes = {
  flowNode: FlowchartNode,
};

const FlowchartPageContent = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [allLocked, setAllLocked] = useState(false);

  const addNode = () => {
    const id = `${nodes.length + 1}`;
    const newNode = {
      id,
      type: 'flowNode',
      position: { x: 150 + nodes.length * 20, y: 150 + nodes.length * 20 },
      draggable: !allLocked,
      data: {
        title: `Title here`,
        content: '',
        color: '#e5e7eb',
        pdfs: [],
        date: '',
        onChange: (nodeId, field, value) => {
          setNodes((nds) =>
            nds.map((n) =>
              n.id === nodeId ? { ...n, data: { ...n.data, [field]: value } } : n
            )
          );
        },
        onColorChange: (nodeId, color) => {
          setNodes((nds) =>
            nds.map((n) =>
              n.id === nodeId ? { ...n, data: { ...n.data, color } } : n
            )
          );
        },
        onPdfUpload: (nodeId, pdfs) => {
          setNodes((nds) =>
            nds.map((n) =>
              n.id === nodeId ? { ...n, data: { ...n.data, pdfs } } : n
            )
          );
        },
        onDelete: (nodeId) => {
          setNodes((nds) => nds.filter((n) => n.id !== nodeId));
          setEdges((eds) => eds.filter((e) => e.source !== nodeId && e.target !== nodeId));
        },
      },
    };
    setNodes((nds) => [...nds, newNode]);
  };

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    []
  );

  const toggleLockAll = () => {
    setAllLocked((prev) => {
      const newLockState = !prev;
      setNodes((nds) => nds.map((n) => ({ ...n, draggable: !newLockState })));
      return newLockState;
    });
  };

  return (
    <div className="h-screen w-full">
      <div className="p-4 bg-gray-100 border-b flex justify-between items-center">
        <div className="flex gap-4 items-center">
          <button
            onClick={() => navigate('/')}
            className="bg-gray-300 text-black px-3 py-1 rounded hover:bg-gray-400 text-sm"
          >
            🏠 Home
          </button>
          <h2 className="text-xl font-bold">Flowchart - Project {projectId}</h2>
        </div>
        <div className="flex gap-2">
          <button
            onClick={toggleLockAll}
            className={`${
              allLocked ? 'bg-red-600' : 'bg-green-600'
            } text-white px-4 py-2 rounded text-sm`}
          >
            {allLocked ? '🔓 Unlock All' : '🔒 Lock All Nodes'}
          </button>
          <button
            onClick={addNode}
            className="bg-blue-600 text-white px-4 py-2 rounded text-sm"
          >
            + Add Node
          </button>
        </div>
      </div>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
        panOnScroll
        minZoom={0.1}
        nodeTypes={nodeTypes}
      >
        <MiniMap />
        <Controls />
        <Background />
      </ReactFlow>
    </div>
  );
};

const FlowchartPage = () => (
  <ReactFlowProvider>
    <FlowchartPageContent />
  </ReactFlowProvider>
);

export default FlowchartPage;
