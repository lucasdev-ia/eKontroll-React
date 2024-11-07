import React, { useEffect, useState } from 'react';
import DefaultLayout from '../layout/DefautLayout'; // Verifique se o caminho está correto
import CalendarComponent2 from '../components/calendarComponent2';

const Calendar: React.FC = () => {
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000); // Ajuste o tempo conforme necessário
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-white dark:bg-corFiltros">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent" />
      </div>
    );
  }
  return (
    <DefaultLayout>
      <div className="container mx-auto px-4 -mt-12">
        <h1 className="text-3xl font-sans mb-6 mt-6 text-center text-white">Calendário</h1>

        <div className="bg-white px-10 py-3 text-black-2 shadow-default dark:border-strokedark dark:bg-boxdark dark:text-white font-sans">
          <CalendarComponent2 />
        </div>
      </div>
    </DefaultLayout>
  );
};

export default Calendar;
