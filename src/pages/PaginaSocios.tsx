import React from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import ReactFlow, { Background, Controls } from 'reactflow';
import 'reactflow/dist/style.css';

function limitarPalavras(texto: string, numPalavras: number): string {
  const palavras = texto.split(' ');
  return palavras.length <= numPalavras ? texto : palavras.slice(0, numPalavras).join(' ') + '...';
}

const BoxPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const client = location.state?.client;

  if (!client) {
    return <div>Cliente não encontrado</div>;
  }

  const socios = client.socios.filter((socio: string) => socio.trim() !== '');

  const nodes = [
    { id: '1', data: { label: limitarPalavras(client.nome, 4) }, position: { x: 300, y: 0 } },
    ...socios.map((socio, index) => ({
      id: `socio-${index + 2}`,
      data: { label: limitarPalavras(socio, 4) },
      position: { x: 100 + index * 200, y: 100 },
    })),
  ];

  const edges = socios.map((_, index) => ({
    id: `e1-socio-${index + 2}`,
    source: '1',
    target: `socio-${index + 2}`,
    animated: true,
  }));

  return (
    <div>
      <h1>Detalhes do Sócio: {client.nome}</h1>
      <p>ID: {id}</p>
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