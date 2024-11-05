import React from 'react';
import { useParams, useLocation, Link } from 'react-router-dom'

import OrgChartComponent from '../components/OrganoGrama';
interface Client {
  id: string;
  nome: string;
  // Adicione outros campos necessários
}
const orgChartData = {
  id: "1",
  name: "John Doe",
  title: "CEO",
  children: [
    {
      id: "2",
      name: "Jane Smith",
      title: "CTO",
      children: [
        { id: "4", name: "Bob Johnson", title: "Lead Developer" },
        { id: "5", name: "Alice Brown", title: "UX Designer" }
      ]
    },
    {
      id: "3",
      name: "Mike Wilson",
      title: "CFO",
      children: [
        { id: "6", name: "Sarah Davis", title: "Financial Analyst" }
      ]
    }
  ]
};


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
      <Link to="/Sublimite">Voltar para a lista</Link>
      
      <OrgChartComponent data={orgChartData} />
    </div>
  )
}

export default BoxPage;