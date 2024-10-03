import React, { useEffect, useState } from 'react';
import DefaultLayout from '../layout/DefautLayout';
import {
  HiOutlineArrowSmallLeft,
  HiOutlineArrowSmallRight,
} from 'react-icons/hi2';
import { LuArrowRightToLine, LuArrowLeftToLine } from 'react-icons/lu';

const parseValue = (value) => {
  if (
    value === null ||
    value === undefined ||
    value === Infinity ||
    value === -Infinity ||
    Number.isNaN(parseFloat(value))
  ) {
    return 0; // inexistente ou invalido
  }
  return parseFloat(value);
};

const SubLimite: React.FC = () => {
  const [data, setData] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const [sortField, setSortField] = useState<String | null>(null);
  const [sortDirection, setSortDirection] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://192.168.25.83:3000/eventos');
        const result = await response.json();
        result.sort((a, b) => b.faturamento - a.faturamento);
        setData(result);
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  function formatarParaBRL(valor: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(valor);
  }

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(data.length / itemsPerPage);
  

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleFirstPage = () => {
    setCurrentPage(1);
  };

  const handleLastPage = () => {
    setCurrentPage(totalPages);
  };

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  const handleItemsPerPageChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setItemsPerPage(parseInt(event.target.value, 10));
    setCurrentPage(1);
  };

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

const handleSort = (field: string) => {
  let newSortDirection: string | null = 'ASC';

  if (sortField === field) {
    if (sortDirection === 'ASC') {
      newSortDirection = 'DESC';
    } else if (sortDirection === 'DESC') {
      newSortDirection = null; // Reset da ordenação
    }
  }

  setSortField(field);
  setSortDirection(newSortDirection);

  const sortedData = [...data].sort((a, b) => {
    const valueA = parseValue(a[field]);
    const valueB = parseValue(b[field]);

    // Coloca valores Infinity ou -Infinity no final
    if (valueA === Infinity || valueA === -Infinity) return 1;
    if (valueB === Infinity || valueB === -Infinity) return -1;

    if (newSortDirection === 'ASC') {
      return valueA - valueB;
    } else if (newSortDirection === 'DESC') {
      return valueB - valueA;
    }

    return 0;
  });

  setData(sortedData);
};

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-white dark:bg-corFiltros">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <DefaultLayout>
      <div className="h-full w-full p-4 text-black dark:text-white">
        <h2 className="mb-4 text-xl font-bold">Sub limite do simples</h2>
        {data.length > 0 ? (
          <div className="container mx-auto p-0">
            <table className="border-gray-300 min-w-full table-auto border-collapse border">
              <thead>
                <tr className="bg-gray-200">
                  <th
                    className="cursor-pointer border px-4 py-2"
                    onClick={() => handleSort('nome')}
                  >
                    Nome
                  </th>
                  <th
                    className="cursor-pointer border px-4 py-2"
                    onClick={() => handleSort('faturamento')}
                  >
                    Faturamento
                  </th>
                  <th className="border px-4 py-2">Limite</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((client, index) => {
                  const porcentagem = (client.faturamento / 3600000) * 100;
                  const porcentagemFinal = Math.round(porcentagem);
                  return ( 
                    <tr key={client.id || index} className="hover:bg-gray-100">
                      <td className="border px-4 py-2">{client.nome}</td>
                      <td className="border px-4 py-2">
                        {formatarParaBRL(parseValue(client.faturamento))}
                      </td>
                      <td className="border px-4 py-2">
                        {parseValue(porcentagemFinal)}%
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div className="mt-4 flex items-center justify-between">
              <div className="flex flex-1 justify-center space-x-2">
                <button
                  onClick={handleFirstPage}
                  className="bg-gray-200 dark:bg-gray-800 dark:border-gray-600 rounded border px-4 py-2"
                  disabled={currentPage === 1}
                >
                  <LuArrowLeftToLine className="inline-block" />
                </button>
                <button
                  onClick={handlePreviousPage}
                  className="bg-gray-200 dark:bg-gray-800 dark:border-gray-600 rounded border px-4 py-2"
                  disabled={currentPage === 1}
                >
                  <HiOutlineArrowSmallLeft className="inline-block" />
                </button>
                {getPageNumbers().map((pageNumber) => (
                  <button
                    key={pageNumber}
                    onClick={() => handlePageChange(pageNumber)}
                    className={`rounded border px-4 py-2 ${
                      currentPage === pageNumber
                        ? 'bg-azullogo text-white'
                        : 'bg-gray-200 dark:bg-gray-800 dark:border-gray-600'
                    }`}
                  >
                    {pageNumber}
                  </button>
                ))}
                <button
                  onClick={handleNextPage}
                  className="bg-gray-200 dark:bg-gray-800 dark:border-gray-600 rounded border px-4 py-2"
                  disabled={currentPage === totalPages}
                >
                  <HiOutlineArrowSmallRight className="inline-block" />
                </button>
                <button
                  onClick={handleLastPage}
                  className="bg-gray-200 dark:bg-gray-800 dark:border-gray-600 rounded border px-4 py-2"
                  disabled={currentPage === totalPages}
                >
                  <LuArrowRightToLine className="inline-block" />
                </button>
              </div>
              <select
                id="itemsPerPage"
                value={itemsPerPage}
                onChange={handleItemsPerPageChange}
                className="rounded border-borderFiltros p-1 dark:bg-corFiltros dark:text-white"
              >
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
            </div>
          </div>
        ) : (
          <p>Nenhum dado disponível</p>
        )}
      </div>
    </DefaultLayout>
  );
};

export default SubLimite;
