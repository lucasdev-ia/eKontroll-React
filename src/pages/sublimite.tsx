import React, { useEffect, useState } from 'react';
import DefaultLayout from '../layout/DefautLayout';
import {
  HiOutlineArrowSmallLeft,
  HiOutlineArrowSmallRight,
} from 'react-icons/hi2';
import { LuArrowRightToLine, LuArrowLeftToLine } from 'react-icons/lu';
import { IoArrowUpOutline, IoArrowDown } from 'react-icons/io5';
import { CgArrowsVAlt } from 'react-icons/cg';

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
  const [data, setData] = useState<any[]>([]);
  const [originalData, setOriginalData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<string | null>(null);
  const [filterSeverity, setFilterSeverity] = useState<string | null>(null);
  const [filterActive, setFilterActive] = useState(false);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://192.168.25.83:3000/eventos');
        const result = await response.json();
        result.sort((a, b) => b.faturamento - a.faturamento);
        setData(result);
        setOriginalData(result);
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatarParaBRL = (valor: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(valor);
  };

  const handleSort = (field: string) => {
    const newSortDirection =
      sortField === field && sortDirection === 'ASC' ? 'DESC' : 'ASC';

    setSortField(field);
    setSortDirection(newSortDirection);

    const sortedData = [...data].sort((a, b) => {
      const valueA = a[field];
      const valueB = b[field];

      const numA = parseValue(valueA);
      const numB = parseValue(valueB);

      if (Number.isNaN(numA) || numA === Infinity || numA === -Infinity)
        return 1;
      if (Number.isNaN(numB) || numB === Infinity || numB === -Infinity)
        return -1;

      if (typeof valueA === 'string' && typeof valueB === 'string') {
        return newSortDirection === 'ASC'
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      } else {
        return newSortDirection === 'ASC' ? numA - numB : numB - numA;
      }
    });

    setData(sortedData);
  };

  const handleSeverityFilter = (severity: string) => {
    if (filterSeverity === severity) {
      setFilterSeverity(null);
      setData(originalData);
    } else {
      setFilterSeverity(severity);
      setData(
        originalData.filter((cliente) => {
          const porcentagem = (cliente.faturamento / 3600000) * 100;
          if (severity === 'Alto') return porcentagem > 80;
          if (severity === 'Medio')
            return porcentagem > 50 && porcentagem <= 80;
          if (severity === 'Baixo')
            return porcentagem > 20 && porcentagem <= 50;
          return false;
        }),
      );
    }
  };

  const getBackgroundColor = (value) => {
    const numericValue = parseValue(value);
    if (numericValue > 80) {
      return 'bg-redempresas dark:bg-vermelhoescuro bg-opacity-20'; // Vermelho
    } else if (numericValue > 50) {
      return 'bg-yellowempresas dark:bg-amareloescuro bg-opacity-200'; // Amarelo
    } else if (numericValue > 20) {
      return 'bg-greenempresas bg-opacity-20  dark:bg-verdeescuro '; // Verde
    }
    return ''; // Cor padrão
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-white dark:bg-corFiltros">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent" />
      </div>
    );
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

  const handleResetFilter = () => {
    setFilterSeverity(null);
    setFilterActive(false);
    setData(originalData);
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

  return (
    <DefaultLayout>
      <div className="h-full w-full p-4 text-black dark:text-white">
        <h2 className="mb-4 text-xl font-bold">Sub limite do simples</h2>
        {data.length > 0 ? (
          <div className="container mx-auto p-0">
            <div className="mb-2 flex justify-end">
            <span
                className="inline-block cursor-pointer rounded-full bg-black px-2 py-1 mr-1 text-sm font-semibold text-white dark:bg-blackseveridade font-sans"
                onClick={handleResetFilter}
              >
                Status:
              </span>
              <span
                className={`inline-block cursor-pointer rounded-full bg-red-700 px-3 py-1 mr-1 text-sm font-semibold text-white ${filterSeverity === 'Alto' ? 'bg-opacity-100' : 'bg-opacity-60'} font-sans hover:bg-red-800`}
                onClick={() => handleSeverityFilter('Alto')}
              >
                Alto
              </span>
              <span
                className={`inline-block cursor-pointer rounded-full bg-yellow-500 px-3 py-1 mr-1 text-sm font-semibold text-white ${filterSeverity === "Medio" ? "bg-opacity-100" : "bg-opacity-60"} hover:bg-yellow-800 font-sans`}
                onClick={() => handleSeverityFilter("Medio")}
              >
                Medio
              </span>
              <span
                className={`inline-block cursor-pointer rounded-full bg-green-600 px-3 py-1 text-sm mr-1 font-semibold text-white ${filterSeverity === "Baixo" ? "bg-opacity-100" : "bg-opacity-60"} hover:bg-green-900 font-sans`}
                onClick={() => handleSeverityFilter("Baixo")}
              >
                Baixo
              </span>
            </div>
            <table className="border-gray-300 min-w-full table-auto border-collapse border">
              <thead>
                <tr className="bg-gray-200">
                  <th
                    className="cursor-pointer border px-4 py-2"
                    onClick={() => handleSort('nome')}
                  >
                    Nome
                    {sortField === 'nome' &&
                      (sortDirection === 'ASC' ? (
                        <IoArrowUpOutline className="ml-2 inline-block" />
                      ) : sortDirection === 'DESC' ? (
                        <IoArrowDown className="ml-2 inline-block" />
                      ) : (
                        <CgArrowsVAlt className="ml-2 inline-block" />
                      ))}
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
                      <td
                        className={`border px-4 py-2 ${getBackgroundColor(porcentagemFinal)}`}
                      >
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
