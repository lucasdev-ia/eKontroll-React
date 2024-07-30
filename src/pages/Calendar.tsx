import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DefaultLayout from '../layout/DefautLayout'; // Verifique se o caminho está correto
import CalendarComponent from "../components/CalendarComponent";
import Card2 from '../components/Card2';

const Calendar: React.FC = () => {
  const [loading, setLoading] = useState(true);

  // Simulação de carregamento (substitua com sua lógica real)
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000); // Ajuste o tempo conforme necessário
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <DefaultLayout>
      <div className="mt-4 grid grid-cols-1 gap-3 md:mt-6 md:grid-cols-1 md:gap-6 xl:grid-cols-1 2xl:mt-7.5 2xl:gap-7.5">
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
    </DefaultLayout>
  );
};

export default Calendar;
