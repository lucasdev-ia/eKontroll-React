import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { consultaEventos } from '../services/api';
import DefaultLayout from '../layout/DefautLayout';
import { HiOutlineArrowSmallLeft, HiOutlineArrowSmallRight } from 'react-icons/hi2';
import { LuArrowRightToLine, LuArrowLeftToLine } from 'react-icons/lu';

// Função utilitária para tratar valores inválidos
const parseValue = (value) => {
  if (value === null || value === undefined || value === Infinity || value === -Infinity || Number.isNaN(parseFloat(value))) {
    return 0; // Tratar como valor inexistente ou inválido
  }
  return parseFloat(value);
};

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
      <div className="flex h-screen items-center justify-center bg-white dark:bg-gray-">
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
  const organizedData = data.sort((a, b) => {
    // Calcular o máximo entre valor379 e valor380 para cada item
    const maxA = (a.valor379 !== undefined || a.valor380 !== undefined)
      ? Math.max(parseValue(a.valor379), parseValue(a.valor380))
      : -Infinity;
    const maxB = (b.valor379 !== undefined || b.valor380 !== undefined)
      ? Math.max(parseValue(b.valor379), parseValue(b.valor380))
      : -Infinity;

    // Tratar casos específicos de Infinity e NaN
    if (maxA === -Infinity && maxB !== -Infinity) return 1;
    if (maxB === -Infinity && maxA !== -Infinity) return -1;

    // Tratar casos específicos de Infinity
    if (maxA === Infinity) return 1;
    if (maxB === Infinity) return -1;

    // Ordem decrescente
    return maxB - maxA;
  });

  const currentClients = organizedData.slice(indexOfFirstClient, indexOfLastClient);
 
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

  // Função para determinar a classe de fundo
  const getBackgroundColor = (value) => {
    const numericValue = parseValue(value);
    if (numericValue === Infinity || numericValue === -Infinity) {
      return ''; // Sem cor especial
    } else if (numericValue > 80) {
      return 'bg-redempresas dark:bg-vermelhoescuro bg-opacity-60 dark:text-black'; // Vermelho
    } else if (numericValue > 50) {
      return 'bg-yellowempresas dark:bg-amareloescuro bg-opacity-60  dark:text-black'; // Amarelo
    }
    else if (numericValue > 20) {
      return 'bg-greenempresas bg-opacity-60  dark:bg-verdeescuro dark:text-black'
    }
    return ''; // Cor padrão
  };

  return (
    <DefaultLayout>
      <div className="container mx-auto p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-black dark:text-white">Lista de Clientes</h1>
            <div className="flex items-center space-x-2 ml-2">
              <label htmlFor="clientsPerPage" className="text-black dark:text-white"></label>
              <select
                id="clientsPerPage"
                value={clientsPerPage}
                onChange={handleClientsPerPageChange}
                className="border rounded p-1 dark:bg-gray-800"
              >
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex justify-end mb-4">
        <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
            <span className="inline-block px-3 py-1 text-white dark:bg-blackseveridade bg-black rounded-full text-sm font-semibold">Severidade:</span>
          </div>
          <div className="flex items-center space-x-2">
              <span className="inline-block px-3 py-1 text-white bg-red-700 rounded-full text-sm font-semibold">Alto</span>
            </div>
          <div className="flex items-center space-x-2">
            <span className="inline-block px-3 py-1 text-white bg-yellow-500 rounded-full text-sm font-semibold">Medio</span>
            </div>
          <div className="flex items-center space-x-2">
            <span className="inline-block px-3 py-1 text-white bg-green-600 rounded-full text-sm font-semibold">Baixo</span>
          </div>
        </div>
      </div>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white text-black dark:text-white border dark:bg-[#1e2a38] dark:border-gray-700">
            <thead>
              <tr>
                <th className="py-2 px-4 border text-black-900 dark:text-white">Nome</th>
                <th className="py-2 px-4 border text-black-900 dark:text-900">Sobra / Falta 379</th>
                <th className="py-2 px-4 border text-black-900 dark:text-900">Evento 379 </th>
                <th className="py-2 px-4 border text-black-900 dark:text-900">Sobra / Falta 380</th>
                <th className="py-2 px-4 border text-black-900 dark:text-900">Evento 380</th>
              </tr>
            </thead>
            <tbody>
              {currentClients.map((cliente) => (
                <tr 
                  key={cliente.codi_emp}
                  className="hover:bg-gray-100 dark:hover:bg-black-700"                 
                >
                  <td className="py-2 px-4 border text-black-900 dark:text-white">{cliente.nome}</td>
                  <td className="py-2 px-4 border text-black-900 dark:text-white">
                    {parseValue(cliente.sobra379) === 0
                      ? 'Sem informações'
                      : parseValue(cliente.sobra379) < 0
                        ? `Passou R$ ${Math.abs(parseValue(cliente.sobra379))}`
                        : `Faltam R$ ${parseValue(cliente.sobra379)}`}
                  </td>
                  <td className={`py-2 px-4 border text-black-900 dark:text-white ${getBackgroundColor(cliente.valor379)}`}>
                    {isNaN(parseValue(cliente.valor379)) || parseValue(cliente.valor379) === Infinity || parseValue(cliente.valor379) === -Infinity ? '0 %' : `${parseValue(cliente.valor379)} %`}
                  </td>
                  <td className="py-2 px-4 border text-black-900 dark:text-white">
                    {parseValue(cliente.sobra380) === 0
                      ? 'Sem informações'
                      : parseValue(cliente.sobra380) < 0
                        ? `Passou R$ ${Math.abs(parseValue(cliente.sobra380))}`
                        : `Faltam R$ ${parseValue(cliente.sobra380)}`}
                  </td>
                  <td className={`py-2 px-4 border text-black-900 dark:text-white ${getBackgroundColor(cliente.valor380)}`}>
                    {isNaN(parseValue(cliente.valor380)) || parseValue(cliente.valor380) === Infinity || parseValue(cliente.valor380) === -Infinity ? '0 %' : `${parseValue(cliente.valor380)} %`}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-center mt-4 space-x-2">
          <button
            onClick={handleFirstPage}
            className="px-4 py-2 border rounded bg-gray-200 dark:bg-gray-800 dark:border-gray-600"
            disabled={currentPage === 1}
          >
            <LuArrowLeftToLine className="inline-block text-gray-700 dark:text-white" />
          </button>
          <button
            onClick={handlePreviousPage}
            className="px-4 py-2 border rounded bg-gray-200 dark:bg-gray-800 dark:border-gray-600"
            disabled={currentPage === 1}
          >
            <HiOutlineArrowSmallLeft className="inline-block text-gray-700 dark:text-white" />
          </button>
          {getPageNumbers().map((pageNumber) => (
            <button
              key={pageNumber}
              onClick={() => handlePageChange(pageNumber)}
              className={`px-4 py-2 border rounded ${currentPage === pageNumber ? 'bg-azullogo dark:bg-azullogo text-white' : 'bg-gray-200 dark:bg-gray-800 dark:border-gray-600'}`}
            >
              {pageNumber}
            </button>
          ))}
          <button
            onClick={handleNextPage}
            className="px-4 py-2 border rounded bg-gray-200 dark:bg-gray-800 dark:border-gray-600"
            disabled={currentPage === totalPages}
          >
            <HiOutlineArrowSmallRight className="inline-block text-gray-700 dark:text-white" />
          </button>
          <button
            onClick={handleLastPage}
            className="px-4 py-2 border rounded bg-gray-200 dark:bg-gray-800 dark:border-gray-600"
            disabled={currentPage === totalPages}
          >
            <LuArrowRightToLine className="inline-block text-gray-700 dark:text-white" />
          </button>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default ClientList;
