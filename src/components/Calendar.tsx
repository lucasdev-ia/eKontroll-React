import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import listPlugin from '@fullcalendar/list';
import '../css/Calendar.css'; // Importar arquivo CSS customizado

interface CalendarProps {}

const CalendarComponent: React.FC<CalendarProps> = () => {
  const handleEventMount = (arg: { event: any; el: HTMLElement }) => {
    const eventElement = arg.el;
    // Exemplo: ajustar posição ou estilo do evento
    eventElement.style.position = 'relative';
    eventElement.style.left = '5px'; // Ajuste de posição horizontal
    eventElement.style.top = '8px';
  };

  return (
    <FullCalendar
      plugins={[dayGridPlugin, listPlugin]}
      themeSystem="standard"
      height={350}
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
      events={[
        {
          title: 'EMPRESA DE TESTE',
          date: '2024-07-10',
          color: 'orange',
        },
        {
          title: 'EMPRESA BELTRANO',
          date: '2024-07-15',
          
          color: 'orange',
        },
        {
          title: 'EMPRESA FULANO DE TAL',
          date: '2024-07-08',
          
          color: 'orange',
        },
      ]}
      eventDidMount={handleEventMount}
    />
  );
};

export default CalendarComponent;
