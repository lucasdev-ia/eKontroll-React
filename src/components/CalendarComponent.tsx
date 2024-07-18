import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import listPlugin from '@fullcalendar/list';
import '../css/Calendar.css'; // Importar arquivo CSS customizado
import { consultaCalendario } from '../services/api';



interface CalendarProps {}

const CalendarComponent: React.FC<CalendarProps> = () => {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    const fetchDataAsync = async () => {
      try {
        const data = await consultaCalendario();
        setData(data);
      } catch (error) {
        console.error("Erro ao buscar dados da API", error);
      }
      
    };
    fetchDataAsync();
  }, []);


  const handleEventMount = (arg: { event: any; el: HTMLElement }) => {
    const eventElement = arg.el;

    // Exemplo: ajustar posição ou estilo do evento
    eventElement.style.position = 'relative';
    eventElement.style.left = '0px'; // Ajuste de posição horizontal
    eventElement.style.top = '0px';
  };

  return (
    <FullCalendar
      plugins={[dayGridPlugin, listPlugin]}
      themeSystem="standard"
      height="auto"
      locale="pt-br"
      initialView="dayGridMonth"
      headerToolbar={{
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,listWeek',
      }}
      buttonText={{
        today: 'Hoje',
        month: 'Mês',
        week: 'Semana',
        day: 'Dia',
        list: 'Lista',
        
      }}
      events={data}
      eventDidMount={handleEventMount}
      listDayFormat={{ month: 'long', day: 'numeric' }} // Formato para exibir dia e mês na lista
      allDayText="" // Altera o texto "all-day" para "Dia Inteiro"
    />
  );
};

export default CalendarComponent;
