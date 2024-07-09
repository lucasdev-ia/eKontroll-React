import React, { useEffect, useState } from "react";
import { listarEmpresas, processData } from "../services/api.jsx";
import Card from "../components/Card.js";
import DefaultLayout from "../layout/DefautLayout.js";

const Dashboard: React.FC = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dataconv, setDataconv] = useState<any[]>([]);
  const filtro = data.filter(
    (item: any) => item.status_empresa === "A" && item.data_cadastro != null,
  );

  useEffect(() => {
    const fetchDataAsync = async () => {
      try {
        const data = await listarEmpresas();
        setData(data);
        setLoading(false);
      } catch (error) {
        console.error("Erro ao buscar dados da API", error);
      }
    };
    fetchDataAsync();
  }, []);

  useEffect(() => {
    const processDataAsync = async () => {
      const dataconv = await processData(data);
      setDataconv(dataconv);
    };
    processDataAsync();
  }, [data]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent" />
      </div>
    );
  }
  
  console.log(dataconv)
  return (
    <DefaultLayout>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
        <Card
          value={": "}
          dataCadastro={" - FALTAM " + " DIAS"}
          title="Próximo cliente a completar ano de parceria"
        />
        <Card value="ORLANDO" title="Cliente mais antigo" dataCadastro="" />
        <Card
          value={"TOTAL: " + filtro.length}
          title="Clientes ativos"
          dataCadastro=""
        />
        <Card
          value={"TOTAL: " + dataconv.length}
          title="Clientes ativos com parceria ativa"
          dataCadastro=""
        />
      </div>
    </DefaultLayout>
  );
};

export default Dashboard;
