import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { listarEmpresas } from '../services/api';

const ClientList: React.FC = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await listarEmpresas();
        setData(data);
        setLoading(false);
      } catch (error) {
        console.error("Erro ao buscar dados da API", error);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent" />
      </div>
    );
  }

  const groupClientsByInitial = (clients: any[]) => {
    return clients.reduce((acc, client) => {
      const initial = client.razao_social.charAt(0).toUpperCase();
      if (!isNaN(parseInt(initial))) {
        if (!acc['#']) {
          acc['#'] = [];
        }
        acc['#'].push(client);
      } else {
        if (!acc[initial]) {
          acc[initial] = [];
        }
        acc[initial].push(client);
      }
      return acc;
    }, {} as Record<string, any[]>);
  };

  const groupedClients = groupClientsByInitial(data.sort((a, b) => a.razao_social.localeCompare(b.razao_social)));

  const handleClick = (clientId: number) => {
    console.log('Navigating with clientId:', clientId);
    navigate('/', { state: { clientId } }); // Navegue para a rota desejada com clientId
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Lista de Clientes</h1>
      <div>
        {Object.keys(groupedClients).sort().filter(initial => initial !== '#').map((initial) => (
          <div key={initial}>
            <h2 className="text-xl font-semibold mt-4">{initial}</h2>
            <hr className="mb-2" />
            <ul>
              {groupedClients[initial].map((cliente) => (
                <li key={cliente.codi_emp}>
                  <a
                    href="#"
                    onClick={() => handleClick(cliente.codi_emp)} // Passe codi_emp como clientId
                    className="text-blue-500 hover:underline"
                  >
                    {cliente.razao_social}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
        {groupedClients['#'] && (
          <div>
            <h2 className="text-xl font-semibold mt-4">#</h2>
            <hr className="mb-2" />
            <ul>
              {groupedClients['#'].map((cliente) => (
                <li key={cliente.codi_emp}>
                  <a
                    href="#"
                    onClick={() => handleClick(cliente.codi_emp)} // Passe codi_emp como clientId
                    className="text-blue-500 hover:underline"
                  >
                    {cliente.razao_social}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientList;
