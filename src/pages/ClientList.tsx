import React, { useEffect, useState } from "react";
import { consultaEventos, consultaEventosPorData } from "../services/api";
import DefaultLayout from "../layout/DefautLayout";
import {
  HiOutlineArrowSmallLeft,
  HiOutlineArrowSmallRight,
} from "react-icons/hi2";
import { IoArrowUpOutline, IoArrowDown, IoVolumeOff } from "react-icons/io5";
import { LuArrowRightToLine, LuArrowLeftToLine } from "react-icons/lu";
import { CgArrowsVAlt } from "react-icons/cg";
import { format, getYear, getMonth, subMonths } from "date-fns";

// funçao tratar valores inválidos
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
const hoje = new Date();
const anoAtual = getYear(hoje);
const dataPassada = subMonths(hoje, 1);
const nomeMesPassado = format(dataPassada, "MMMM");

const ClientList: React.FC = () => {
  const [data, setData] = useState<any[]>([]);
  const [originalData, setOriginalData] = useState<any[]>([]); // ordem original
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [clientsPerPage, setClientsPerPage] = useState(25);
  const [sortField, setSortField] = useState<string | null>("nome");
  const [sortDirection, setSortDirection] = useState(null);
  const [sortFieldNumber, setSortFieldNumber] = useState<string | null>(null);
  const [sortDirectionNumber, setSortDirectionNumber] = useState<string | null>(
    null,
  );

  const [filterSeverity, setFilterSeverity] = useState<string | null>(null);
  const [filterActive, setFilterActive] = useState(false);
  const [noDataMessage, setNoDataMessage] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await consultaEventos();

        if (Array.isArray(response)) {
          if (response.length === 0) {
            setData([]);
            setNoDataMessage('Sem informações');
          } else {
            const organizedData = response.sort((a, b) => {
              const maxA = a.valor380 !== undefined ? parseValue(a.valor380) : -Infinity;
              const maxB = b.valor380 !== undefined ? parseValue(b.valor380) : -Infinity;

              if (maxA === -Infinity && maxB !== -Infinity) return 1;
              if (maxB === -Infinity && maxA !== -Infinity) return -1;

              if (maxA === Infinity) return 1;
              if (maxB === Infinity) return -1;

              // Ordem decrescente
              return maxB - maxA;
            });

            setData(organizedData);
            setOriginalData(organizedData);
            setNoDataMessage(null);
          }
        } else {
          console.error('Erro inesperado', response);
          setData([]);
          setNoDataMessage('Sem informações para este mês / ano');
        }
      } catch (error) {
        console.error('Erro ao buscar dados da API', error);
        setData([]);
        setNoDataMessage('Sem informações');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

    const handleSortNumber = (field: string) => {
    let newSortDirection: string | null = "DESC";

    if (sortFieldNumber === field && sortDirectionNumber === "DESC") {
      newSortDirection = "ASC";
    } else if (sortFieldNumber === field && sortDirectionNumber === "ASC") {
      newSortDirection = null; // reset da ordenaçao
    }

    setSortFieldNumber(field);
    setSortDirectionNumber(newSortDirection);

    if (newSortDirection === null) {
      setData(originalData);
    } else {
      setData((prevData) => {
        return [...prevData].sort((a, b) => {
          const valueA = parseValue(a[field]);
          const valueB = parseValue(b[field]);

          if (valueA === Infinity) return 1;
          if (valueB === Infinity) return -1;
          if (valueA === -Infinity) return 1;
          if (valueB === -Infinity) return -1;

          return newSortDirection === "DESC"
            ? valueB - valueA
            : valueA - valueB;
        });
      });
    }
  };
  const handleSeverityFilter = (severity: string) => {
    if (filterSeverity === severity) {
      setFilterSeverity(null);
      setFilterActive(false);
      setData(originalData);
    } else {
      setFilterSeverity(severity);
      setFilterActive(true);

      const filterValidValues = (valor: number) => {
        return valor !== Infinity && valor !== -Infinity && !isNaN(valor);
      };

      if (severity === "Alto") {
        setData(
          originalData.filter(
            (cliente) =>
              filterValidValues(parseValue(cliente.valor380)) &&
              parseValue(cliente.valor380) > 80
          )
        );
      } else if (severity === "Medio") {
        setData(
          originalData.filter(
            (cliente) =>
              filterValidValues(parseValue(cliente.valor380)) &&
              parseValue(cliente.valor380) > 50 &&
              parseValue(cliente.valor380) <= 80
          )
        );
      } else if (severity === "Baixo") {
        setData(
          originalData.filter(
            (cliente) =>
              filterValidValues(parseValue(cliente.valor380)) &&
              parseValue(cliente.valor380) > 20 &&
              parseValue(cliente.valor380) <= 50
          )
        );
      }
    }
  };
  const handleSort = (field: string) => {
    let newSortDirection;

    if (sortField === field) {
      if (sortDirection === "ASC") {
        newSortDirection = "DESC";
      } else if (sortDirection === "DESC") {
        newSortDirection = null;
      } else {
        newSortDirection = "ASC";
      }
    } else {
      newSortDirection = "ASC";
    }

    setSortField(field);
    setSortDirection(newSortDirection);

    let sortedData;

    if (newSortDirection === null) {
      sortedData = [...originalData];
    } else {
      sortedData = [...data].sort((a, b) => {
        const valueA = a[field] ? a[field].toString().toLowerCase().trim() : "";
        const valueB = b[field] ? b[field].toString().toLowerCase().trim() : "";
        return newSortDirection === "ASC"
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      });
    }

    setData(sortedData);
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-white dark:bg-corFiltros">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent" />
      </div>
    );
  }

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleClientsPerPageChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setClientsPerPage(parseInt(event.target.value, 10));
    setCurrentPage(1); // Reinicia para a primeira página
  };
  
  const formatCurrency = (value) =>  {
    return value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
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
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  const handleResetFilter = () => {
    setFilterSeverity(null);
    setFilterActive(false);
    setData(originalData);
  };

  const getBackgroundColor = (value) => {
    const numericValue = parseValue(value);
    if (numericValue === Infinity || numericValue === -Infinity) {
      return ""; // Sem cor especial
    } else if (numericValue > 80) {
      return "bg-redempresas dark:bg-vermelhoescuro bg-opacity-20 dark:text-black"; // Vermelho
    } else if (numericValue > 50) {
      return "bg-yellowempresas dark:bg-amareloescuro bg-opacity-20  dark:text-black"; // Amarelo
    } else if (numericValue > 20) {
      return "bg-greenempresas bg-opacity-20  dark:bg-verdeescuro dark:text-black"; // verde
    }
    return ""; // Cor padrão
  };

  return (
<DefaultLayout>
  <div className="container mx-auto p-0" style={{ marginTop: '0', paddingTop: '0' }}>
    <div className="flex items-center justify-between" style={{ margin: '0', padding: '0' }}>
      <div className="flex items-center">
        <h1 className="text-2xl font-bold text-black dark:text-white text-center font-sans">
          Lista de Clientes
        </h1>
        <div className="ml-2 flex items-center space-x-2">
          <label
            htmlFor="clientsPerPage"
            className="text-black dark:text-white"
          ></label> 
        </div>
      </div>
    </div>
    <div className="flex justify-end">
      <div className="flex items-center space-x-2 mb-2">
        <div className="flex items-center space-x-2 mb-0">
          <span
            className="inline-block cursor-pointer rounded-full bg-black px-2 py-1 text-sm font-semibold text-white dark:bg-blackseveridade font-sans"
            onClick={handleResetFilter}
          >
            Severidade:
          </span>
        </div>
        <div className="flex items-center space-x-2 mb-0">
          <span
            className={`inline-block cursor-pointer rounded-full bg-red-700 px-3 py-1 text-sm font-semibold text-white ${filterSeverity === "Alto" ? "bg-opacity-100" : "bg-opacity-60"} hover:bg-red-800 font-sans`}
            onClick={() => handleSeverityFilter("Alto")}
          >
            Alto
          </span>
        </div>
        <div className="flex items-center space-x-2 mb-0">
          <span
            className={`inline-block cursor-pointer rounded-full bg-yellow-500 px-3 py-1 text-sm font-semibold text-white ${filterSeverity === "Medio" ? "bg-opacity-100" : "bg-opacity-60"} hover:bg-yellow-800 font-sans`}
            onClick={() => handleSeverityFilter("Medio")}
          >
            Medio
          </span>
        </div>
        <div className="flex items-center space-x-2 mb-0">
          <span
            className={`inline-block cursor-pointer rounded-full bg-green-600 px-3 py-1 text-sm font-semibold text-white ${filterSeverity === "Baixo" ? "bg-opacity-100" : "bg-opacity-60"} hover:bg-green-900 font-sans`}
            onClick={() => handleSeverityFilter("Baixo")}
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
              onClick={() => handleSort("nome")}
            >
              Nome{""}
              {sortField === "nome" &&
                (sortDirection === "ASC" ? (
                  <IoArrowUpOutline className="ml-2 inline-block" />
                ) : sortDirection === "DESC" ? (
                  <IoArrowDown className="ml-2 inline-block" />
                ) : (
                  <CgArrowsVAlt className="ml-2 inline-block" />
                ))}
            </th>
            <th
              className="cursor-pointer border px-4 py-2 font-sans"
              onClick={() => handleSortNumber("sobra380")}
            >
              Sobra / Falta 380
              {sortFieldNumber === "sobra380" &&
                sortDirectionNumber === "ASC" && (
                  <IoArrowUpOutline className="ml-2 inline-block" />
                )}
              {sortFieldNumber === "sobra380" &&
                sortDirectionNumber === "DESC" && (
                  <IoArrowDown className="ml-2 inline-block" />
                )}
              {(sortFieldNumber !== "sobra380" ||
                sortDirectionNumber === null) && (
                  <CgArrowsVAlt className="ml-2 inline-block" />
                )}
            </th>
            <th
              className="cursor-pointer border px-4 py-2 font-sans"
              onClick={() => handleSortNumber("valor380")}
            >
              Evento 380
              {sortFieldNumber === "valor380" &&
                sortDirectionNumber === "ASC" && (
                  <IoArrowUpOutline className="ml-2 inline-block" />
                )}
              {sortFieldNumber === "valor380" &&
                sortDirectionNumber === "DESC" && (
                  <IoArrowDown className="ml-2 inline-block" />
                )}
              {(sortFieldNumber !== "valor380" ||
                sortDirectionNumber === null) && (
                  <CgArrowsVAlt className="ml-2 inline-block" />
                )}
            </th>
          </tr>
        </thead>
        <tbody>
          {currentClients.length === 0 ? (
            <tr>
              <td colSpan={5} className="py-2 px-4 border text-center">
                {noDataMessage || 'Sem informações'}
              </td>
            </tr>
          ) : (
            currentClients.map((cliente) => (
              <tr
                key={cliente.codi_emp}
                className="hover:bg-gray-100 dark:hover:bg-black-700"
              >
                <td className="py-2 px-4 w-1/4 truncate border text-black-900 dark:text-white font-sans">{cliente.nome}</td>
                <td className="py-2 px-4 w-1/6 border text-black-900 dark:text-white font-sans">
                  {parseValue(cliente.sobra380) === 0
                    ? 'Sem informações'
                    : (
                      <div className="flex justify-between">
                        <span>R$</span>
                        <span className="text-right">
                        {formatCurrency(parseValue(cliente.sobra380))}
                        </span>
                      </div>
                    )}
                </td>
                <td className={`py-2 px-4 w-1/6 border text-black-900 dark:text-white font-sans ${getBackgroundColor(cliente.valor380)}`}>
                  {isNaN(parseValue(cliente.valor380)) || parseValue(cliente.valor380) === Infinity || parseValue(cliente.valor380) === -Infinity
                    ? '0 %'
                    : `${formatCurrency(parseValue(cliente.valor380))} %`}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
    <div className="flex justify-between items-center mt-2">
      <div className="flex flex-1 justify-center space-x-2">
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
      <select
        id="clientsPerPage"
        value={clientsPerPage}
        onChange={handleClientsPerPageChange}
        className="border-borderFiltros rounded p-1 dark:bg-corFiltros dark:text-white"
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

export default ClientList;