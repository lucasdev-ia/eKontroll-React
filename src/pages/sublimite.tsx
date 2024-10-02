import React, { useEffect, useState } from 'react';
import DefaultLayout from "../layout/DefautLayout";


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

const Pagination = ({data}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 25
}

const SubLimite: React.FC = () => {
  const [data, setData] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setitem] = useState(25);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://192.168.25.83:3000/eventos');
        const result = await response.json();
        result.sort((a, b) => {
          return b.faturamento - a.faturamento;
        });
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
        <h2 className="mb-4 text-xl font-bold">Lista de Clientes</h2>
        {data.length > 0 ? (
          <div className="container mx-auto p-0">
            <table className="border-gray-300 min-w-full table-auto border-collapse border">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border px-4 py-2">Nome</th>
                  <th className="border px-4 py-2">Faturamento</th>
                  <th className="border px-4 py-2">Limite</th>
                </tr>
              </thead>
              <tbody>
                {data.map((client, index) => {
                  const porcentagem = (client.faturamento / 3600000) * 100;
                  const porcentagemFinal = Math.round(porcentagem);
                  return (
                    <tr key={index} className="hover:bg-gray-100">
                      <td className="border px-4 py-2">{client.nome}</td>
                      <td className="border px-4 py-2">
                      {formatarParaBRL(parseValue(client.faturamento))}
                      </td>
                      <td className="border px-4 py-2">{parseValue(porcentagemFinal)}%</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : ( 
          <p>Nenhum dado disponível</p>
        )}
      </div>
    </DefaultLayout>
  );
};

export default SubLimite;
