import React from 'react';
import ReactFlow, { Background, Controls } from 'reactflow';
import 'reactflow/dist/style.css';

const nodes = [
  { id: '1', data: { label: 'Matheus Rodrigues Gress\nFunção' }, position: { x: 300, y: 0 } },
  { id: '2', data: { label: 'MDA CONSTRUÇÕES\nFunção' }, position: { x: 100, y: 100 } },
  { id: '3', data: { label: 'Nome\nFunção' }, position: { x: 300, y: 100 } },
  { id: '4', data: { label: 'Nome\nFunção' }, position: { x: 500, y: 100 } },
  { id: '5', data: { label: 'Nome\nFunção' }, position: { x: 700, y: 100 } },
  { id: '6', data: { label: 'Nome\nFunção' }, position: { x: 300, y: 200 } },
  { id: '7', data: { label: 'Nome\nFunção' }, position: { x: 500, y: 200 } },
];

const edges = [
  { id: 'e1-2', source: '1', target: '2', animated: true },
  { id: 'e1-3', source: '1', target: '3', animated: true },
  { id: 'e1-4', source: '1', target: '4', animated: true },
  { id: 'e1-5', source: '1', target: '5', animated: true },
  { id: 'e2-6', source: '2', target: '6', animated: true },
  { id: 'e2-7', source: '2', target: '7', animated: true },
];

const OrgChart: React.FC = () => {  return (
    <div style={{ width: '100%', height: '500px' }}>
      <ReactFlow nodes={nodes} edges={edges}>
        <Background color="#aaa" gap={16} />
        <Controls />
      </ReactFlow>
    </div>
  );
}

export default OrgChart;