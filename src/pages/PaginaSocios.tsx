import React from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import ReactFlow, { Background, Controls } from 'reactflow';
import 'reactflow/dist/style.css';


const BoxPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const client = location.state?.client;
  
const nodes = [
  { id: '1', data: { label: client.nome }, position: { x: 300, y: 0 } },
  { id: '2', data: { label: 'MDA CONSTRUÇÕES\nFunção' }, position: { x: 100, y: 100 } },
  { id: '3', data: { label: '3' }, position: { x: 300, y: 100 } },
  { id: '4', data: { label: '4' }, position: { x: 500, y: 100 } },
  { id: '5', data: { label: '5' }, position: { x: 700, y: 100 } },
  { id: '6', data: { label: '6' }, position: { x: 300, y: 200 } },
  { id: '7', data: { label: '7' }, position: { x: 500, y: 200 } },
];

const edges = [
  { id: 'e1-2', source: '1', target: '2', animated: true },
  { id: 'e1-3', source: '1', target: '3', animated: true },
  { id: 'e1-4', source: '1', target: '4', animated: true },
  { id: 'e1-5', source: '1', target: '5', animated: true },
  { id: 'e2-6', source: '2', target: '6', animated: true },
  { id: 'e2-7', source: '7', target: '1', animated: true },
];

  if (!client) {
    return <div>Cliente não encontrado</div>;
  }

  return (
    <div>
      <h1>Detalhes do Sócio: {client.nome}</h1>
      <p>ID: {id}</p>
      <p>{client.socio_1}</p>
      {/* Adicione mais detalhes do cliente aqui */}
      <div style={{ width: '100%', height: '500px', marginTop: '20px' }}>
        <ReactFlow nodes={nodes} edges={edges}>
          <Background color="#aaa" gap={16} />
          <Controls />
        </ReactFlow>
      </div>
      <Link to="/SubLimite">Voltar para a lista</Link>
    </div>
  );
}

export default BoxPage;