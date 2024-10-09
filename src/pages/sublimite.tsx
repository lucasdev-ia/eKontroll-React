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
  const [resetPage, setResetPage] = useState(true);

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
    let newSortDirection;

    if (sortField === field) {
      if (sortDirection === 'ASC') {
        newSortDirection = 'DESC';
      } else if (sortDirection === 'DESC') {
        newSortDirection = null;
      } else {
        newSortDirection = 'ASC';
      }
    } else {
      newSortDirection = 'ASC';
    }

    setSortField(field);
    setSortDirection(newSortDirection);

    let sortedData;

    if (newSortDirection === null) {
      sortedData = [...originalData];
    } else {
      sortedData = [...data].sort((a, b) => {
        const valueA = a[field] ? a[field].toString().toLowerCase().trim() : '';
        const valueB = b[field] ? b[field].toString().toLowerCase().trim() : '';
        return newSortDirection === 'ASC'
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      });
    }

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
          if (severity === 'Alto') return porcentagem > 100;
          if (severity === 'Medio')
            return porcentagem > 80 && porcentagem <= 99;
          if (severity === 'Baixo') return porcentagem > 5 && porcentagem <= 79;
          return false;
        }),
      );
    }
  };

  const getBackgroundColor = (value) => {
    const numericValue = parseValue(value);
    if (numericValue > 100) {
      return 'bg-redempresas dark:bg-vermelhoescuro bg-opacity-20'; // Vermelho
    } else if (numericValue > 80) {
      5;
      return 'bg-yellowempresas dark:bg-amareloescuro bg-opacity-200'; // Amarelo
    } else if (numericValue > 5) {
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
      <div
        className="container mx-auto p-0"
        style={{ marginTop: '0', paddingTop: '0' }}
      >
        <div
          className="flex items-center justify-between"
          style={{ margin: '0', padding: '0' }}
        >
          <div className="flex items-center">
            <h1 className="text-center font-sans text-2xl font-bold text-black dark:text-white">
              Sub limite do simples
            </h1>
          </div>
        </div>
        <div className="flex justify-end">
          <div className="mb-2 flex items-center space-x-2">
            <div className="mb-0 flex items-center space-x-2">
              <span
                className="inline-block cursor-pointer rounded-full bg-black px-2 py-1 font-sans text-sm font-semibold text-white dark:bg-blackseveridade"
                onClick={handleResetFilter}
              >
                Status:
              </span>
            </div>
            <div className="mb-0 flex items-center space-x-2">
              <span
                className={`inline-block cursor-pointer rounded-full bg-red-700 px-3 py-1 text-sm font-semibold text-white ${filterSeverity === 'Alto' ? 'bg-opacity-100' : 'bg-opacity-60'} font-sans hover:bg-red-800`}
                onClick={() => handleSeverityFilter('Alto')}
              >
                Alto
              </span>
            </div>
            <div className="mb-0 flex items-center space-x-2">
              <span
                className={`inline-block cursor-pointer rounded-full bg-yellow-500 px-3 py-1 text-sm font-semibold text-white ${filterSeverity === 'Medio' ? 'bg-opacity-100' : 'bg-opacity-60'} font-sans hover:bg-yellow-800`}
                onClick={() => handleSeverityFilter('Medio')}
              >
                Medio
              </span>
            </div>
            <div className="mb-0 flex items-center space-x-2">
              <span
                className={`inline-block cursor-pointer rounded-full bg-green-600 px-3 py-1 text-sm font-semibold text-white ${filterSeverity === 'Baixo' ? 'bg-opacity-100' : 'bg-opacity-60'} font-sans hover:bg-green-900`}
                onClick={() => handleSeverityFilter('Baixo')}
              >
                Baixo
              </span>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="dark:border-gray-700 min-w-full border bg-white text-black dark:bg-[#1e2a38] dark:text-white">
            <thead>
              <tr>
                <th
                  className="cursor-pointer border px-4 py-2 font-sans"
                  onClick={() => handleSort('nome')}
                >
                  Nome
                  {sortField === 'nome' &&
                    (sortDirection === 'ASC' ? (
                      <IoArrowUpOutline className="ml-2 inline-block" />
                    ) : sortDirection === 'DESC' ? (
                      <IoArrowDown className="ml-2 inline-block" />
                    ) : null)}
                  {sortField !== 'nome' && (
                    <CgArrowsVAlt className="ml-2 inline-block" />
                  )}
                </th>
                <th
                  className="cursor-pointer border px-4 py-2 font-sans"
                  onClick={() => handleSort('faturamento')}
                >
                  Faturamento
                  {sortField === 'faturamento' &&
                    (sortDirection === 'ASC' ? (
                      <IoArrowUpOutline className="ml-2 inline-block" />
                    ) : sortDirection === 'DESC' ? (
                      <IoArrowDown className="ml-2 inline-block" />
                    ) : null)}
                  {sortField !== 'faturamento' && (
                    <CgArrowsVAlt className="ml-2 inline-block" />
                  )}
                </th>
                <th
                  className="cursor-pointer border px-4 py-2 font-sans"
                  onClick={() => handleSort('limite')}
                >
                  Limite
                  {sortField === 'limite' &&
                    (sortDirection === 'ASC' ? (
                      <IoArrowUpOutline className="ml-2 inline-block" />
                    ) : sortDirection === 'DESC' ? (
                      <IoArrowDown className="ml-2 inline-block" />
                    ) : null)}
                  {sortField !== 'limite' && (
                    <CgArrowsVAlt className="ml-2 inline-block" />
                  )}
                </th>
              </tr>
            </thead>
            <tbody>
              {currentItems.length === 0 ? (
                <tr>
                  <td colSpan={3} className="border px-4 py-2 text-center">
                    Nenhum dado disponível
                  </td>
                </tr>
              ) : (
                currentItems.map((client, index) => {
                  const porcentagem = (client.faturamento / 3600000) * 100;
                  const porcentagemFinal = Math.round(porcentagem);
                  return (
                    <tr
                      key={client.id || index}
                      className="hover:bg-gray-100 dark:hover:bg-black-700"
                    >
                      <td className="text-black-900 w-1/3 truncate border px-4 py-2 font-sans dark:text-white">
                        {client.nome}
                      </td>
                      <td className="text-black-900 w-1/3 border px-4 py-2 font-sans dark:text-white">
                        {formatarParaBRL(parseValue(client.faturamento))}
                      </td>
                      <td
                        className={`text-black-900 w-1/3 border px-4 py-2 font-sans dark:text-white ${getBackgroundColor(porcentagemFinal)}`}
                      >
                        {parseValue(porcentagemFinal)}%
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        <div className="mt-2 flex items-center justify-between">
          <div className="flex flex-1 justify-center space-x-2">
            <button
              onClick={handleFirstPage}
              className="bg-gray-200 dark:bg-gray-800 dark:border-gray-600 rounded border px-4 py-2"
              disabled={currentPage === 1}
            >
              <LuArrowLeftToLine className="text-gray-700 inline-block dark:text-white" />
            </button>
            <button
              onClick={handlePreviousPage}
              className="bg-gray-200 dark:bg-gray-800 dark:border-gray-600 rounded border px-4 py-2"
              disabled={currentPage === 1}
            >
              <HiOutlineArrowSmallLeft className="text-gray-700 inline-block dark:text-white" />
            </button>
            {getPageNumbers().map((pageNumber) => (
              <button
                key={pageNumber}
                onClick={() => handlePageChange(pageNumber)}
                className={`rounded border px-4 py-2 ${currentPage === pageNumber ? 'bg-azullogo text-white dark:bg-azullogo' : 'bg-gray-200 dark:bg-gray-800 dark:border-gray-600'}`}
              >
                {pageNumber}
              </button>
            ))}
            <button
              onClick={handleNextPage}
              className="bg-gray-200 dark:bg-gray-800 dark:border-gray-600 rounded border px-4 py-2"
              disabled={currentPage === totalPages}
            >
              <HiOutlineArrowSmallRight className="text-gray-700 inline-block dark:text-white" />
            </button>
            <button
              onClick={handleLastPage}
              className="bg-gray-200 dark:bg-gray-800 dark:border-gray-600 rounded border px-4 py-2"
              disabled={currentPage === totalPages}
            >
              <LuArrowRightToLine className="text-gray-700 inline-block dark:text-white" />
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
    </DefaultLayout>
  );
};

export default SubLimite;
