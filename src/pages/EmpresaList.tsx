import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { listarEmpresas } from '../services/api';

const EmpresaList: React.FC = () => { // Corrigido para EmpresaList
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
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

  // Aqui você pode adicionar o código para renderizar a lista de empresas

  return (
    <div>
      {/* Renderize a lista de empresas aqui */}
      {data.map((empresa, index) => (
        <div key={index}>
          {/* Renderize os detalhes da empresa */}
          {empresa.nome}
        </div>
      ))}
    </div>
  );
};

export default EmpresaList;