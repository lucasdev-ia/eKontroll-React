import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { listarEmpresas  } from '../services/api';
import DefaultLayout from '../layout/DefautLayout';

const ClientList: React.FC = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [clientsPerPage, setClientsPerPage] = useState(25);
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

  const handleClick = (clientId: number) => {
    navigate('/', { state: { clientId } });
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleClientsPerPageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setClientsPerPage(parseInt(event.target.value));
    setCurrentPage(1);
  };

  const indexOfLastClient = currentPage * clientsPerPage;
  const indexOfFirstClient = indexOfLastClient - clientsPerPage;
  const currentClients = data.slice(indexOfFirstClient, indexOfLastClient);

  return (
    <DefaultLayout>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Lista de Clientes</h1>
        
        <div className="mb-4">
          <label htmlFor="clientsPerPage" className="mr-2">Clientes por página:</label>
          <select
            id="clientsPerPage"
            value={clientsPerPage}
            onChange={handleClientsPerPageChange}
            className="border rounded p-1"
          >
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
        </div>

        <ul>
          {currentClients.map((cliente) => (
            <li key={cliente.codi_emp}>
              <a
                href="#"
                onClick={() => handleClick(cliente.codi_emp)}
                className="text-blue-500 hover:underline"
              >
                {cliente.razao_social}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex justify-center mt-4">
          {Array.from({ length: Math.ceil(data.length / clientsPerPage) }, (_, index) => (
            <button
              key={index}
              onClick={() => handlePageChange(index + 1)}
              className={`px-4 py-2 mx-1 border rounded ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
    </DefaultLayout>
  );
};

export default ClientList;
