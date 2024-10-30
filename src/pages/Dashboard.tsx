import React, { useEffect, useState } from 'react';
import {
  listarEmpresas,
  processData,
  consultaAniversario,
  consultaEventos,
  consultaAniversarioSocio,
} from '../services/api.tsx';
import Card from '../components/Card.tsx';
import Card2 from '../components/Card2.tsx';
import DefaultLayout from '../layout/DefautLayout.tsx';
import ChartFaturamento from '../components/ChartFaturamento.tsx';
import {
  CakeIcon,
  UserGroupIcon,
  UserPlusIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  ListBulletIcon,
  UserCircleIcon,
} from '@heroicons/react/24/solid';
import LucroChart from '../components/LucroChart.tsx';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Modal from '../components/ModalDiv.tsx';
const Dashboard: React.FC = () => {
  const [data, setData] = useState<any[]>([]);
  const [birthdayData, setBirthdayData] = useState<any[]>([]);
  const [socioAniversario, setSocioAniversario] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dataconv, setDataconv] = useState<any[]>([]);
  const [eventos, setEventos] = useState<any[]>([]);
  const [originalData, setOriginalData] = useState<any[]>([]);
  const [contador, setContador] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
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
    'Janeiro',
    'Fevereiro',
    'Março',
    'Abril',
    'Maio',
    'Junho',
    'Julho',
    'Agosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro',
  ];
  const currentMonthName = monthNames[currentMonth - 1];
  const filteredData = data.filter((item: any) => {
    if (!item.data_cadastro) {
      return false;
    }
    const [day, month, year] = item.data_cadastro.split('/').map(Number);
    return month === currentMonth && year === currentYear;
  });
  const lastClients = filteredData.map((client) => client.razao_social);
  const formattedText = lastClients.join('\n');
  useEffect(() => {
    const fetchBirthdayData = async () => {
      try {
        const data = await consultaAniversario();
        setBirthdayData(data);
      } catch (error) {
        console.error('Erro ao buscar dados da API', error);
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
        console.error('Erro ao buscar dados da API', error);
      }
    };
    fetchSocioAniversario();
  }, []);

  const parseValue = (value: any) => {
    if (
      value === 'sem informações' ||
      value === undefined ||
      value === Infinity ||
      value === -Infinity ||
      Number.isNaN(parseFloat(value))
    ) {
      return 0;
    }
    return parseFloat(value);
  };
  useEffect(() => {
    const fetchEventos = async () => {
      try {
        const response = await fetch('http://192.168.25.83:3000/eventos');
        const result = await response.json();

        // Mantém todos os dados originais
        setOriginalData(result);

        // Filtra e ordena apenas para data
        const filteredResult = result
          .filter((item) => item.regime === 'SIMPLES NACIONAL')
          .sort((a, b) => b.faturamento - a.faturamento);

        setEventos(filteredResult);
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEventos();
  }, []);

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

  const logo = (imagem: number) => {
    switch (imagem) {
      case 1:
        return (
          <UserGroupIcon className="size-20 stroke-black text-azullogo dark:stroke-white dark:text-boxdark" />
        );
      case 2:
        return (
          <CakeIcon
            className="size-19 cursor-pointer stroke-black text-laranjalogo dark:stroke-white dark:text-boxdark"
            onClick={() => navigate('/Calendario')}
          />
        );
      case 3:
        return (
          <UserCircleIcon
            className="size-19 cursor-pointer stroke-black text-verdecalendario dark:stroke-white dark:text-boxdark"
            onClick={() => navigate('/calendarioSocios')}
          />
        );
      case 4:
        return (
          <div>
            <UserPlusIcon
              className="text- size-19 stroke-black dark:stroke-white dark:text-boxdark"
              onClick={openModal}
            />
            <Modal isOpen={isModalOpen} onClose={closeModal}>
              <h2>Novos Clientes</h2>
              <p style={{ whiteSpace: 'pre-line' }}>{formattedText}</p>
            </Modal>
          </div>
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
        console.error('Erro ao buscar dados da API', error);
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
    (item: any) => item.status_empresa === 'A' && item.data_cadastro != null,
  );

  function limitarPalavras(texto: string, numPalavras: number): string {
    const palavras = texto.split(' ');
    if (palavras.length <= numPalavras) {
      return texto;
    } else {
      return palavras.slice(0, numPalavras).join(' ');
    }
  }

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
            birthdayData.length === 1 ? 'Empresa' : 'Empresas'
          }`}
          dataCadastro=""
          title={`${
            birthdayData.length === 1
              ? 'Completa aniversário hoje'
              : 'Completam aniversário hoje'
          }`}
          Cardimg={logo(2)}
          online={false}
        />
        <Card
          value={`${socioAniversario.length} ${
            socioAniversario.length === 1 ? 'Socio' : 'Socios'
          }`}
          title={`${
            socioAniversario.length === 1
              ? 'Completa aniversário hoje'
              : 'Completam aniversário hoje'
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
            <Card2 title="" informacao="Sublimite do simples" />
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
              <Link to="/SubLimite">
                <button
                  className="mr-2 flex items-center rounded-lg bg-laranjalogo px-3 py-2 text-white shadow transition hover:bg-laranjahover"
                  onClick={() => navigate('/SubLimite')}
                >
                  <ListBulletIcon className="mr-1 h-5 w-5" />
                </button>
              </Link>
            </div>
          </div>
          <div className="mt-12 flex items-center justify-center font-sans font-bold"></div>
          <div className="grid grid-cols-3 place-items-end font-sans text-black-2 dark:text-white">
            {eventos.slice(contador, contador + 3).map((evento, index) => (
              <ChartFaturamento
                key={index}
                faturamento={evento.faturamento}
                empresa={limitarPalavras(evento.nome, 4)}
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
