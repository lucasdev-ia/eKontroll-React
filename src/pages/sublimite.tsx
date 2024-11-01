import React, { useEffect, useState } from 'react';
import DefaultLayout from '../layout/DefautLayout';
import { sociosAtualizados } from '../services/api';
import {
  HiOutlineArrowSmallLeft,
  HiOutlineArrowSmallRight,
} from 'react-icons/hi2';
import { LuArrowRightToLine, LuArrowLeftToLine } from 'react-icons/lu';
import { IoArrowUpOutline, IoArrowDown } from 'react-icons/io5';
import { CgArrowsVAlt } from 'react-icons/cg';
import * as XLSX from 'xlsx';
import { RiFileExcel2Fill } from 'react-icons/ri';
import { MdPictureAsPdf } from 'react-icons/md';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

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
  const [search, setSearch] = useState<string>('');

  interface Pessoa {
    id: number;
    nome: string;
  }

  interface Idade {
    id: number;
    idade: number;
  }
  interface PessoaCompleta extends Pessoa, Idade {}
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://192.168.25.83:3000/eventos');
        const result = await response.json();

        const ListaDeSocios = await sociosAtualizados();

        function juntarListas(lista1, lista2) {
          const resultado: any = [];
          //percorre a lista principal
          for (const objeto1 of lista1) {
            //percorre a lista de socios
            for (const objeto2 of lista2) {
              // Comparação dos valores da propriedade 'cnpj'
              if (objeto1.cnpj == objeto2.cnpj) {
                // Criando um novo objeto combinando as informações
                const EmpresaCompleta = {
                  ...objeto1,
                  ...objeto2,
                };
                resultado.push(EmpresaCompleta);
                break;
              }
            }
          }
          return resultado;
        }

        const EmpresasCompletas: any[] = juntarListas(result, ListaDeSocios);
        const resultadoParcial = EmpresasCompletas;

        for (let item of resultadoParcial) {
          item.socios = Object.keys(item)
            .filter((key) => key.startsWith('socio_') && item[key])
            .map((key) => item[key])
            .filter((socio) => socio.trim() !== '');
            item.faturamentoCompartilhado = parseFloat(item.faturamento)

        }
        for (let item1 of resultadoParcial) {
          for (let item2 of resultadoParcial) {
            if (item2.cnpj != item1.cnpj) {
              function comparaListas(lista1, lista2) {
                return lista1.some((item) => lista2.includes(item));
              }

              let comp = comparaListas(item1.socios, item2.socios);
              if (comp == true) {

                item1.faturamentoCompartilhado =
                  item1.faturamentoCompartilhado + parseFloat(item2.faturamento);
                  console.log(
                    `A empresa ${item1.nome} tem os sócios ${item1.socios}com o faturamento de ${item1.faturamento} | a empresea ${item2.nome} tem os sócios ${item2.socios} e o faturamento de ${item2.faturamento} entao o faturamento total é: ${item1.faturamentoCompartilhado}`,
                  )
              }
              else {item1.faturamentoCompartilhado = item1.faturamentoCompartilhado + 0 }
            } else {
            }
          }
        }

        const filteredResult = resultadoParcial

          .filter((item) => item.regime === 'SIMPLES NACIONAL')
          .sort((a, b) => b.faturamento - a.faturamento);

        setOriginalData(filteredResult);
        setData(filteredResult);
        console.log(filteredResult);
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

  const exportToPDF = (data: any[], fileName: string) => {
    const doc = new jsPDF();

    const tableData = data.map((item) => {
      const porcentagem = (item.faturamento / 3600000) * 100;
      const porcentagemFinal = Math.round(porcentagem);
      const limiteCompartilhado =
        (item.faturamentoCompartilhado / 3600000) * 100;

      return [
        item.nome,
        formatarParaBRL(parseValue(item.faturamento)),
        `${porcentagemFinal} %`,
        formatarParaBRL(parseValue(item.faturamentoCompartilhado)),
        `${Math.round(limiteCompartilhado)} %`,
      ];
    });

    const tableHeaders = [
      'Nome',
      'Faturamento',
      'Limite',
      'Faturamento Compartilhado',
      'Limite Compartilhado',
    ];

    autoTable(doc, {
      head: [tableHeaders],
      body: tableData,
      styles: {
        fillColor: [255, 255, 255],
        textColor: [0, 0, 0],
        fontSize: 8,
      },
    });

    doc.save(`${fileName}.pdf`);
  };

  const exportToExcel = (data: any[], fileName: string) => {
    const filteredData = data.map((item) => {
      const porcentagem = (item.faturamento / 3600000) * 100;
      const porcentagemFinal = Math.round(porcentagem);
      const limiteCompartilhado =
        (item.faturamentoCompartilhado / 3600000) * 100;

      return {
        Nome: item.nome,
        Faturamento: formatarParaBRL(parseValue(item.faturamento)),
        Limite: `${porcentagemFinal} %`,
        'Faturamento Compartilhado': formatarParaBRL(
          parseValue(item.faturamentoCompartilhado),
        ),
        'Limite Compartilhado': `${Math.round(limiteCompartilhado)} %`,
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(filteredData);
    const colunmWidths = [
      { wch: 30 },
      { wch: 20 },
      { wch: 15 },
      { wch: 20 },
      { wch: 15 },
    ];
    worksheet['!cols'] = colunmWidths;
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const valor = event.target.value;
    setSearch(valor);

    if (valor === '') {
      setData(originalData);
    } else {
      setData(
        originalData.filter(
          (cliente) =>
            cliente.nome.toLowerCase().includes(valor.toLowerCase()) ||
            cliente.cnpj.toLowerCase().includes(valor.toLowerCase()),
        ),
      );
    }
  };

  const handleSort = (field: string) => {
    let newSortDirection;

    if (sortField === field) {
      if (sortDirection === 'ASC') {
        newSortDirection = 'DESC';
      } else if (sortDirection === 'DESC') {
        newSortDirection = null;
        setSortField(null);
      } else {
        newSortDirection = 'ASC';
      }
    } else {
      newSortDirection = 'ASC';
    }

    setSortField(newSortDirection ? field : null);
    setSortDirection(newSortDirection);

    let sortedData;

    if (newSortDirection === null) {
      sortedData = [...originalData];
    } else {
      sortedData = [...data].sort((a, b) => {
        let valueA, valueB;

        switch (field) {
          case 'nome':
            valueA = a[field] ? a[field].toString().toLowerCase().trim() : '';
            valueB = b[field] ? b[field].toString().toLowerCase().trim() : '';
            return newSortDirection === 'ASC'
              ? valueA.localeCompare(valueB)
              : valueB.localeCompare(valueA);
          case 'faturamento':
          case 'faturamentoCompartilhado':
            valueA = parseValue(a[field]);
            valueB = parseValue(b[field]);
            break;
          case 'limite':
            valueA = parseValue((a.faturamento / 3600000) * 100);
            valueB = parseValue((b.faturamento / 3600000) * 100);
            break;
          case 'limiteCompartilhado':
            valueA = parseValue((a.faturamentoCompartilhado / 3600000) * 100);
            valueB = parseValue((b.faturamentoCompartilhado / 3600000) * 100);
            break;
          default:
            return 0;
        }

        return newSortDirection === 'ASC' ? valueA - valueB : valueB - valueA;
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
          if (severity === 'Baixo') return porcentagem > 1 && porcentagem <= 79;
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
      return 'bg-yellowempresas dark:bg-amareloescuro bg-opacity-200'; // Amarelo
    } else if (numericValue > 1) {
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
          className="mb-4 flex items-center justify-between"
          style={{ margin: '0', padding: '0' }}
        >
          <h1 className="font-sans text-2xl font-bold text-black dark:text-white">
            Sublimite do simples
          </h1>
          <div className="flex space-x-2">
            <button
              onClick={() => exportToPDF(data, 'Lista_de_Clientes')}
              className="flex items-center justify-center rounded-lg bg-red-600 px-2 py-1 font-bold text-white hover:bg-red-700"
              title="Exportar para PDF"
            >
              <MdPictureAsPdf size={20} className="mr-2" />
              <span>PDF</span>
            </button>
            <button
              onClick={() => exportToExcel(data, 'Lista_de_Clientes')}
              className="flex items-center justify-center rounded-lg bg-green-600 px-2 py-1 font-bold text-white hover:bg-green-700"
              title="Exportar para Excel"
            >
              <RiFileExcel2Fill size={20} className="mr-2" />
              <span>EXCEL</span>
            </button>
          </div>
        </div>
        <div className="my-1 flex items-end justify-between">
          <div className="flex items-center space-x-2">
            <span
              className="inline-block cursor-pointer rounded-full bg-black px-2 py-1 font-sans text-sm font-semibold text-white dark:bg-blackseveridade"
              onClick={handleResetFilter}
            >
              Status:
            </span>
            <span
              className={`inline-block cursor-pointer rounded-full bg-red-700 px-3 py-1 text-sm font-semibold text-white ${filterSeverity === 'Alto' ? 'bg-opacity-100' : 'bg-opacity-60'} font-sans hover:bg-red-800`}
              onClick={() => handleSeverityFilter('Alto')}
            >
              Alto
            </span>
            <span
              className={`inline-block cursor-pointer rounded-full bg-yellow-500 px-3 py-1 text-sm font-semibold text-white ${filterSeverity === 'Medio' ? 'bg-opacity-100' : 'bg-opacity-60'} font-sans hover:bg-yellow-800`}
              onClick={() => handleSeverityFilter('Medio')}
            >
              Medio
            </span>
            <span
              className={`inline-block cursor-pointer rounded-full bg-green-600 px-3 py-1 text-sm font-semibold text-white ${filterSeverity === 'Baixo' ? 'bg-opacity-100' : 'bg-opacity-60'} font-sans hover:bg-green-900`}
              onClick={() => handleSeverityFilter('Baixo')}
            >
              Baixo
            </span>
          </div>
          <input
            type="text"
            value={search}
            onChange={handleSearchChange}
            placeholder="Pesquisar..."
            className="border-gray-300 h-10 w-80 rounded border p-2 px-2 shadow-sm transition duration-300 ease-in-out focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 dark:bg-[#1e2a38] dark:text-white dark:placeholder-white"
          />
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
                  {sortField === 'nome' ? (
                    sortDirection === 'ASC' ? (
                      <IoArrowUpOutline className="ml-2 inline-block" />
                    ) : (
                      <IoArrowDown className="ml-2 inline-block" />
                    )
                  ) : (
                    <CgArrowsVAlt className="ml-2 inline-block" />
                  )}
                </th>
                <th
                  className="cursor-pointer border px-4 py-2 font-sans"
                  onClick={() => handleSort('faturamento')}
                >
                  Faturamento
                  {sortField === 'faturamento' ? (
                    sortDirection === 'ASC' ? (
                      <IoArrowUpOutline className="ml-2 inline-block" />
                    ) : (
                      <IoArrowDown className="ml-2 inline-block" />
                    )
                  ) : (
                    <CgArrowsVAlt className="ml-2 inline-block" />
                  )}
                </th>
                <th
                  className="cursor-pointer border px-4 py-2 font-sans"
                  onClick={() => handleSort('limite')}
                >
                  Limite
                  {sortField === 'limite' ? (
                    sortDirection === 'ASC' ? (
                      <IoArrowUpOutline className="ml-2 inline-block" />
                    ) : (
                      <IoArrowDown className="ml-2 inline-block" />
                    )
                  ) : (
                    <CgArrowsVAlt className="ml-2 inline-block" />
                  )}
                </th>
                <th
                  className="cursor-pointer border px-4 py-2 font-sans"
                  onClick={() => handleSort('faturamentoCompartilhado')}
                >
                  Faturamento Compartilhado
                  {sortField === 'faturamentoCompartilhado' ? (
                    sortDirection === 'ASC' ? (
                      <IoArrowUpOutline className="ml-2 inline-block" />
                    ) : (
                      <IoArrowDown className="ml-2 inline-block" />
                    )
                  ) : (
                    <CgArrowsVAlt className="ml-2 inline-block" />
                  )}
                </th>
                <th
                  className="cursor-pointer border px-4 py-2 font-sans"
                  onClick={() => handleSort('limiteCompartilhado')}
                >
                  Limite Compartilhado
                  {sortField === 'limiteCompartilhado' ? (
                    sortDirection === 'ASC' ? (
                      <IoArrowUpOutline className="ml-2 inline-block" />
                    ) : (
                      <IoArrowDown className="ml-2 inline-block" />
                    )
                  ) : (
                    <CgArrowsVAlt className="ml-2 inline-block" />
                  )}
                </th>
              </tr>
            </thead>
            <tbody>
              {currentItems.length === 0 ? (
                <tr>
                  <td colSpan={5} className="border px-4 py-2 text-center">
                    Nenhum dado disponível
                  </td>
                </tr>
              ) : (
                currentItems.map((client, index) => {
                  const porcentagem = (client.faturamento / 3600000) * 100;
                  const porcentagemFinal = Math.round(porcentagem);
                  const limiteCompartilhado =
                    (client.faturamentoCompartilhado / 3600000) * 100;
                  const limiteCompartilhadoFinal =
                    Math.round(limiteCompartilhado);
                  return (
                    <tr
                      key={client.id || index}
                      className="hover:bg-gray-100 dark:hover:bg-black-700"
                    >
                      <td className="text-black-900 w-1/5 truncate border px-4 py-2 font-sans dark:text-white">
                        {client.nome}
                      </td>
                      <td className="text-black-900 w-1/5 border px-4 py-2 font-sans dark:text-white">
                        {formatarParaBRL(parseValue(client.faturamento))}
                      </td>
                      <td
                        className={`text-black-900 w-1/5 border px-4 py-2 font-sans dark:text-white ${getBackgroundColor(porcentagemFinal)}`}
                      >
                        {parseValue(porcentagemFinal)} %
                      </td>
                      <td className="text-black-900 w-1/5 border px-4 py-2 font-sans dark:text-white">
                        {formatarParaBRL(
                          parseValue(client.faturamentoCompartilhado),
                        )}
                      </td>
                      <td
                        className={`text-black-900 w-1/5 border px-4 py-2 font-sans dark:text-white ${getBackgroundColor(limiteCompartilhadoFinal)}`}
                      >
                        {parseValue(limiteCompartilhadoFinal)} %
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
