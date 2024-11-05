import React from 'react'
import { useParams, useLocation, Link } from 'react-router-dom'

interface Client {
  id: string;
  nome: string;
  // Adicione outros campos necessários
}

const BoxPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const client = location.state?.client as Client;

  if (!client) {
    return <div>Cliente não encontrado</div>;
  }

  return (
    <div>
      <h1>Detalhes do Sócio: {client.nome}</h1>
      <p>ID: {id}</p>
      {/* Adicione mais detalhes do cliente aqui */}
      <Link to="/socios">Voltar para a lista</Link>
    </div>
  )
}

export default BoxPage;