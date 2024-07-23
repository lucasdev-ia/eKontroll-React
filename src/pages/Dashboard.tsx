import React, { useEffect, useState } from "react";
import { consultaCnpj, listarEmpresas, processData, consultaAniversario } from "../services/api.jsx";
import Card from "../components/Card.js";
import Card2 from "../components/Card2.js";
import DefaultLayout from "../layout/DefautLayout.js";
import ChartEvento379e380 from "../components/ChartEvento379e380.tsx";
import {
  CakeIcon,
  CheckIcon,
  CircleStackIcon,
  UserGroupIcon,
  UserPlusIcon,
} 
from "@heroicons/react/24/solid";
import ComboChart from "../components/ComboChart.tsx";
import LucroChart from "../components/LucroChart.tsx";
import CalendarComponent from "../components/CalendarComponent.tsx";

const Dashboard: React.FC = () => {
  const [data, setData] = useState<any[]>([]);
  const [BirhtdayData, setBirthday] = useState<any>();
  const [loading, setLoading] = useState(true);
  const [dataconv, setDataconv] = useState<any[]>([]);
  const filtro = data.filter(
    (item: any) => item.status_empresa === "A" );

  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();
  const monthNames = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ];
  const currentMonthName = monthNames[currentMonth - 1];
const filteredData = data.filter((item: any) => {
  if (!item.data_cadastro) { // nao tinha nada definido manha toda fazendo isso aaaaa
    return false; // Se data_cadastro for null ou undefined, exclua o item
  } 
  const [day, month, year] = item.data_cadastro.split('/').map(Number);
  return month === currentMonth && year === currentYear;
});
const lastClients = filteredData
  .map(client => client.razao_social);

  useEffect(() => {
    const BirthdayData = async () => {
      try {
        const data = await consultaAniversario();
        console.log(data)
        setBirthday(data);
      } catch (error) {
        console.error("Erro ao buscar dados da API", error);
      }
    };
    BirthdayData();
  }, []);
  

  /*IMAGENS*/
  const logo = (imagem) => {
    if (imagem == 1)
      return (
        <UserGroupIcon className="text-azullogo size-20 stroke-black dark:stroke-white dark:text-boxdark" />
      );
    if (imagem == 2)
      return (
        <CakeIcon className="text-laranjalogo size-19 stroke-black dark:stroke-white dark:text-boxdark" />
      );
    if (imagem == 3)
      return (
        <CircleStackIcon className="text-amarelo size-19 stroke-black dark:stroke-white dark:text-boxdark" />
      );
    if (imagem == 4) 
      return (
        <UserPlusIcon className="text-vermelhalogo size-19 stroke-black dark:stroke-white dark:text-boxdark" />
      );
  };

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
    consultaCnpj('43241060000109').then(data => {});
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
  return (
    <DefaultLayout>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-1 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
        <Card
          value={filtro.length} // para ver o total é so colocar data
          title="Total de clientes"
          Cardimg={logo(1)}
          dataCadastro=""
          online={true}
        />
        <Card
          value={BirhtdayData.title}
          dataCadastro=""
          title="Ano de parceria"
          Cardimg={logo(2)}
          online={false}
        />
        <Card
          value={"TOTAL: " + "100.000.00"}
          title="Impostos Arrecadados"
          Cardimg={logo(3)}
          dataCadastro=""
          online={false}
        />
        <Card
          value={`Novos Clientes: ${lastClients.length}`}
          title={`No mês de ${currentMonthName} recebemos ${lastClients.length} clientes`}
          Cardimg={logo(4)}
          dataCadastro=""
          online={true}
        />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 md:mt-6 md:grid-cols-1 md:gap-6 xl:grid-cols-2 2xl:mt-7.5 2xl:gap-7.5">
        <div className="rounded-sm border border-stroke bg-white px-9 py-1 shadow-default dark:border-strokedark dark:bg-boxdark">
          <Card2 title="" informacao="EVENTO 379 E 380" />
          <div className="mt-4 flex items-center justify-center font-bold">
            <div className="bg-laranjalogo mr-2 h-5 w-5 rounded-full"></div>
            <h1 className="mr-20">EVENTO 379</h1>
            <div className="bg-azullogo mr-2 h-5 w-5 rounded-full"></div>
            <h2>EVENTO 380</h2>
          </div>

          <div className="grid grid-cols-3 text-black-2 dark:text-white">
            <ChartEvento379e380 />
            <ChartEvento379e380 />
            <ChartEvento379e380 />
          </div>
        </div>
        <div className="rounded-sm border border-stroke bg-white px-10 py-1 shadow-default dark:border-strokedark dark:bg-boxdark">
        <Card2
            title="Mostrando a distribuição atual da base de clientes da office"
            informacao="Resumo de Clientes Ativos/Inativo" />
          <div className="grid grid-cols-1 px-24 text-black-2 dark:text-white">
            <LucroChart />
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 md:mt-6 md:grid-cols-1 md:gap-6 xl:grid-cols-1 2xl:mt-7.5 2xl:gap-7.5">
        <div>
          <div className="bg-white px-8 py-1 dark:bg-boxdark">
            <Card2
              title="Próximas empresas a completar 1 ano de parceria."
              informacao="Tempo de parceria"
            />
          </div>
          <div className="bg-white px-10 py-3 text-black-2 shadow-default dark:border-strokedark dark:bg-boxdark dark:text-white">
            <CalendarComponent />
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default Dashboard;