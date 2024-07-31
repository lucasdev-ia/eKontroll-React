import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { listarEmpresas } from '../services/api';
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

    // Always show the first page
    if (totalPages > 1) {
      pageNumbers.push(1);
    }

    let startPage = Math.max(2, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages - 1, startPage + maxVisiblePages - 1);

    if (endPage === totalPages - 1) {
      startPage = Math.max(2, totalPages - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    // Always show the last page if it's not already included
    if (totalPages > 1 && !pageNumbers.includes(totalPages)) {
      pageNumbers.push(totalPages);
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

        <div className="flex justify-center mt-4 space-x-2">
          <button
            onClick={handleFirstPage}
            className="px-4 py-2 border rounded bg-gray-200"
            disabled={currentPage === 1}
          >
            <LuArrowLeftToLine />
          </button>
          <button
            onClick={handlePreviousPage}
            className="px-4 py-2 border rounded bg-gray-200"
            disabled={currentPage === 1}
          >
            <HiOutlineArrowSmallLeft />
          </button>
          {getPageNumbers().map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`px-4 py-2 border rounded ${currentPage === page ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            >
              {page}
            </button>
          ))}
          <button
            onClick={handleNextPage}
            className="px-4 py-2 border rounded bg-gray-200"
            disabled={currentPage === totalPages}
          >
            <HiOutlineArrowSmallRight />
          </button>
          <button
            onClick={handleLastPage}
            className="px-4 py-2 border rounded bg-gray-200"
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
