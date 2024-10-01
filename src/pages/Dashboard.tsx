import React, { useEffect, useState } from "react";
import {
  listarEmpresas,
  processData,
  consultaAniversario,
  consultaEventos,
  consultaAniversarioSocio,
} from "../services/api.tsx";
import Card from "../components/Card.tsx";
import Card2 from "../components/Card2.tsx";
import DefaultLayout from "../layout/DefautLayout.tsx";
import ChartEvento379e380 from "../components/ChartEvento379e380.tsx";
import {
  CakeIcon,
  UserGroupIcon,
  UserPlusIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  ListBulletIcon,
  UserCircleIcon,
} from "@heroicons/react/24/solid";
import LucroChart from "../components/LucroChart.tsx";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Dashboard: React.FC = () => {
  const [data, setData] = useState<any[]>([]);
  const [birthdayData, setBirthdayData] = useState<any[]>([]);
  const [socioAniversario, setSocioAniversario] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dataconv, setDataconv] = useState<any[]>([]);
  const [eventos, setEventos] = useState<any[]>([]);
  const [contador, setContador] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state && location.state.clientId) {
      const clientId = location.state.clientId;
      // Aqui recebe o ID selecionado na rota /clientes
    }
  }, [location.state]);

  const incrementarContador = () => {
    if (contador + 3 < eventos.length) {
      setContador(contador + 1);
    }
  };

  const diminuirContador = () => {
    if (contador > 0) {
      setContador(contador - 1);
    }
  };

  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();
  const monthNames = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ];
  const currentMonthName = monthNames[currentMonth - 1];
  const filteredData = data.filter((item: any) => {
    if (!item.data_cadastro) {
      return false;
    }
    const [day, month, year] = item.data_cadastro.split("/").map(Number);
    return month === currentMonth && year === currentYear;
  });
  const lastClients = filteredData.map((client) => client.razao_social);

  useEffect(() => {
    const fetchBirthdayData = async () => {
      try {
        const data = await consultaAniversario();
        setBirthdayData(data);
      } catch (error) {
        console.error("Erro ao buscar dados da API", error);
      }
    };
    fetchBirthdayData();
  }, []);

  useEffect(() => {
    const fetchSocioAniversario = async () => {
      try {
        const data = await consultaAniversarioSocio();
        setSocioAniversario(data);
      } catch (error) {
        console.error("Erro ao buscar dados da API", error);
      }
    };
    fetchSocioAniversario();
  }, []);

  const parseValue = (value: any) => {
    if (
      value === "sem informações" ||
      value === undefined ||
      value === Infinity ||
      Number.isNaN(parseFloat(value))
    ) {
      return -Infinity;
    }
    return parseFloat(value);
  }
  
  useEffect(() => {
    const fetchEventos = async () => {
      try {
        const data = await consultaEventos();
        const organizedData = data.sort((a, b) => {
          const maxA = Math.max(parseValue(a.valor379), parseValue(a.valor380));
          const maxB = Math.max(parseValue(b.valor379), parseValue(b.valor380));
          return maxB - maxA;
        });
        setEventos(organizedData);
      } catch (error) {
        console.error("Erro ao buscar dados da API", error);
      }
    };
    fetchEventos();
  }, []);

  const logo = (imagem: number) => {
    switch (imagem) {
      case 1:
        return (
          <UserGroupIcon className="size-20 stroke-black text-azullogo dark:stroke-white dark:text-boxdark" />
        );
      case 2:
        return (
          <CakeIcon className="size-19 stroke-black text-laranjalogo dark:stroke-white dark:text-boxdark" />
        );
      case 3:
        return (
          <UserCircleIcon className="size-19 stroke-black text-verdecalendario dark:stroke-white dark:text-boxdark" />
        );
      case 4:
        return (
          <UserPlusIcon className="text- size-19 stroke-black dark:stroke-white dark:text-boxdark" />
        );
      default:
        return null;
    }
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
    const processDataAsync = async () => {
      const dataconv = await processData(data);
      setDataconv(dataconv);
    };
    processDataAsync();
  }, [data]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-white dark:bg-corFiltros">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent" />
      </div>
    );
  }

  const filtro = data.filter(
    (item: any) => item.status_empresa === "A" && item.data_cadastro != null,
  );

  return (
    <DefaultLayout>
      <div className="grid grid-cols-2 gap-4 font-sans md:grid-cols-1 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
        <Card
          value={filtro.length}
          title="Total de clientes"
          Cardimg={logo(1)}
          dataCadastro=""
          online={true}
        />
        <Card
          value={`${birthdayData.length} ${
            birthdayData.length === 1 ? "Empresa" : "Empresas"
          }`}
          dataCadastro=""
          title={`${
            birthdayData.length === 1
              ? "Completa aniversário hoje"
              : "Completam aniversário hoje"
          }`}
          Cardimg={logo(2)}
          online={false}
        />
        <Card
          value={`${socioAniversario.length} ${
            socioAniversario.length === 1 ? "Socio" : "Socios"
          }`}
          title={`${
            socioAniversario.length === 1
              ? "Completa aniversário hoje"
              : "Completam aniversário hoje"
          }`}
          Cardimg={logo(3)}
          dataCadastro=""
          online={false}
        />
        <Card
          value={`Novos Clientes: ${lastClients.length}`}
          title={`No mês de ${currentMonthName} recebemos ${lastClients.length} clientes`}
          Cardimg={logo(4)}
          dataCadastro=""
          online={false}
        />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 font-sans md:mt-6 md:grid-cols-1 md:gap-6 xl:grid-cols-3 2xl:mt-7.5 2xl:gap-7.5">
        <div className="col-span-2 rounded-sm border border-stroke bg-white px-9 py-1 font-sans shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="max-w-200 bg-gray-100 flex items-center justify-between rounded-md p-1 font-sans">
            <Card2 title="" informacao="EVENTO 379 E 380" />
            <div className="mt-3 flex justify-end">
              <button
                className="mr-2 flex items-center rounded-lg bg-laranjalogo px-3 py-2 font-sans text-white shadow transition hover:bg-laranjahover"
                onClick={diminuirContador}
              >
                <ArrowLeftIcon className="mr-1 h-5 w-5" />
              </button>
              <button
                className="mr-2 flex items-center rounded-lg bg-laranjalogo px-3 py-2 font-sans text-white shadow transition hover:bg-laranjahover"
                onClick={incrementarContador}
              >
                <ArrowRightIcon className="mr-1 h-5 w-5" />
              </button>
              <Link to="/clientes">
                <button
                  className="mr-2 flex items-center rounded-lg bg-laranjalogo px-3 py-2 text-white shadow transition hover:bg-laranjahover"
                  onClick={() => navigate("/clientes")}
                >
                  <ListBulletIcon className="mr-1 h-5 w-5" />
                </button>
              </Link>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-center font-sans font-bold">
            <div className="mr-2 h-5 w-5 rounded-full bg-laranjalogo"></div>
            <h1 className="mr-20">EVENTO 379</h1>
            <div className="mr-2 h-5 w-5 rounded-full bg-azullogo"></div>
            <h2>EVENTO 380</h2>
          </div>

          <div className="grid grid-cols-3 place-items-end font-sans text-black-2 dark:text-white">
            {eventos.slice(contador, contador + 3).map((evento, index) => (
              <ChartEvento379e380
                key={index}
                valor1={evento.valor379}
                valor2={evento.valor380}
                empresa={evento.nome}
                sobrou379={evento.sobra379}
                sobrou380={evento.sobra380}
              />
            ))}
          </div>
        </div>
        <div className="rounded-sm border border-stroke bg-white px-10 py-1 font-sans shadow-default dark:border-strokedark dark:bg-boxdark">
          <Card2
            title="Mostrando a distribuição atual da base de clientes da office"
            informacao="Resumo de Clientes Ativos/Inativo"
          />
          <div className="mt-10 text-black-2 dark:text-white">
            <LucroChart />
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default Dashboard;
