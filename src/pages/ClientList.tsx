import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { consultaEventos } from '../services/api';
import DefaultLayout from '../layout/DefautLayout';
import { HiOutlineArrowSmallLeft, HiOutlineArrowSmallRight } from 'react-icons/hi2';
import { LuArrowRightToLine, LuArrowLeftToLine } from 'react-icons/lu';

const ClientList: React.FC = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [clientsPerPage, setClientsPerPage] = useState(25);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await consultaEventos();
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
      <div className="flex h-screen items-center justify-center bg-white-900 dark:bg-gray-900">
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
    setClientsPerPage(parseInt(event.target.value, 10));
    setCurrentPage(1);
  };

  const indexOfLastClient = currentPage * clientsPerPage;
  const indexOfFirstClient = indexOfLastClient - clientsPerPage;
  const currentClients = data.slice(indexOfFirstClient, indexOfLastClient);

  const totalPages = Math.ceil(data.length / clientsPerPage);

  const getPageNumbers = () => {
    const pageNumbers: number[] = [];
    const maxVisiblePages = 5;
    const halfMaxVisible = Math.floor(maxVisiblePages / 2);

    let startPage = Math.max(1, currentPage - halfMaxVisible);
    let endPage = Math.min(totalPages, currentPage + halfMaxVisible);

    if (currentPage <= halfMaxVisible) {
      endPage = Math.min(totalPages, maxVisiblePages);
    } else if (currentPage + halfMaxVisible >= totalPages) {
      startPage = Math.max(1, totalPages - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return pageNumbers;
  };

  const handleFirstPage = () => {
    setCurrentPage(1);
  };

  const handleLastPage = () => {
    setCurrentPage(totalPages);
  };

  const handlePreviousPage = () => {
    setCurrentPage(prevPage => Math.max(prevPage - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prevPage => Math.min(prevPage + 1, totalPages));
  };

  return (
    <DefaultLayout>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white-900">Lista de Clientes</h1>

        <div className="mb-4">
          <label htmlFor="clientsPerPage" className="mr-2 text-gray-900 dark:text-white-900">Clientes por página:</label>
          <select
            id="clientsPerPage"
            value={clientsPerPage}
            onChange={handleClientsPerPageChange}
            className="border rounded p-1 text-gray-900 dark:bg-gray-800 dark:text-white-900 dark:border-gray-600"
          >
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border dark:bg-[#1e2a38] dark:border-gray-700">
            <thead>
              <tr>
                <th className="py-2 px-4 border text-gray-900 dark:text-white-900">Nome</th>
                <th className="py-2 px-4 border text-gray-900 dark:text-900">Evento 379</th>
                <th className="py-2 px-4 border text-gray-900 dark:text-900">Evento 380</th>
                <th className="py-2 px-4 border text-gray-900 dark:text-900">Sobra / Falta 379</th>
                <th className="py-2 px-4 border text-gray-900 dark:text-900">Sobra / Falta 380</th>
              </tr>
            </thead>
            <tbody>
              {currentClients.map((cliente) => (
                <tr 
                  key={cliente.codi_emp}
                  className="hover:bg-gray-100 dark:hover:bg-gray-700"                 
                >
                  <td className="py-2 px-4 border text-gray-900 dark:text-white-900">{cliente.nome}</td>
                  <td className={`py-2 px-4 border text-gray-900 dark:text-white ${cliente.valor379 > 80 ? 'bg-redempresas' : cliente.valor379 > 50 ? 'bg-yellow-400' :''}`}> 
                    {cliente.valor379 === null ? '0 %' : `${cliente.valor379} %`}
                  </td>
                  <td className={`py-2 px-4 border text-gray-900 dark:text-white ${cliente.valor380 > 80 ? 'bg-redempresas' : cliente.valor380 > 50 ? 'bg-yellow-400' :''}`}> 
                    {cliente.valor380 === null ? '0 %' : `${cliente.valor380} %`}
                  </td>
                  <td className="py-2 px-4 border text-gray-900 dark:text-white">
                    {cliente.sobra379 !== null
                      ? cliente.sobra379 < 0
                        ? `Faltam R$ ${Math.abs(cliente.sobra379)}`
                        : `Sobrou R$ ${cliente.sobra379}`
                      : 'Sobrou R$ 0,00'}
                  </td>
                  <td className="py-2 px-4 border text-gray-900 dark:text-white">
                    {cliente.sobra380 !== null
                      ? cliente.sobra380 < 0  
                        ? `Faltam R$ ${Math.abs(cliente.sobra380)}`
                        : `Sobrou R$ ${cliente.sobra380}`
                      : 'Sobrou R$ 0,00'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-center mt-4 space-x-2">
          <button
            onClick={handleFirstPage}
            className="px-4 py-2 border rounded bg-gray-200 dark:bg-gray-800 dark:border-gray-600 text-gray-900 dark:text-white"
            disabled={currentPage === 1}
          >
            <LuArrowLeftToLine />
          </button>
          <button
            onClick={handlePreviousPage}
            className="px-4 py-2 border rounded bg-gray-200 dark:bg-gray-800 dark:border-gray-600 text-gray-900 dark:text-white"
            disabled={currentPage === 1}
          >
            <HiOutlineArrowSmallLeft />
          </button>
          {getPageNumbers().map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`px-4 py-2 border rounded ${currentPage === page ? 'bg-blue-600 text-white dark:bg-blue-700 dark:text-gray-300' : 'bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white'}`}
            >
              {page}
            </button>
          ))}
          <button
            onClick={handleNextPage}
            className="px-4 py-2 border rounded bg-gray-200 dark:bg-gray-800 dark:border-gray-600 text-gray-900 dark:text-white"
            disabled={currentPage === totalPages}
          >
            <HiOutlineArrowSmallRight />
          </button>
          <button
            onClick={handleLastPage}
            className="px-4 py-2 border rounded bg-gray-200 dark:bg-gray-800 dark:border-gray-600 text-gray-900 dark:text-white"
            disabled={currentPage === totalPages}
          >
            <LuArrowRightToLine />
          </button>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default ClientList;
