import React, { useEffect, useState } from "react";
import api from "../services/api.jsx";
// import Chart from "../components/Chart.jsx";
import "../css/Dashboard.css";
import Card from "../components/Card.js";
import Card2 from "../components/Card2.js";
import DefaultLayout from "../layout/DefautLayout.js";
/*IMAGENS*/
import ImgCliente from "../images/cliente.png";
import logopadrao from "../images/logo_padrao.png";
import ImgFidelidade from "../images/fidelidade.png";
import BolinhaPiscando from "../components/GreenCircle.tsx";
import ImgImposto from "../images/imposto.png";
// import * as XLSX from "xlsx";
import ComboChart from "../components/ComboChart.tsx";
import RadialChart from "../components/Graphpizza.tsx";
import LucroChart from "../components/graficoLucro.tsx";
import EventCalendar from "../components/Calendar.tsx";
import CalendarComponent from "../components/Calendar.tsx";




const Dashboard: React.FC = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dataconv, setDataconv] = useState([]);
  const [earliestDate, setEarliestDate] = useState(null);
  const [closestToAnniversary, setClosestToAnniversary] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.post("/listar_empresas", {
          api_key:
            "p2zazIRGQ9mwizXKkmVRBasVVW234DLdKkIpu53Rw8eh6zFpBOLolUWBCZmz",
          api_key_empresa:
            "yQuZX1A45FYa7gohZvmlHHDsUPvjLnGCTxuXMdae4W8T5x05hgWEvQgtUmxf",
        });
        setData(response.data.dados.data);
        // const dateStrings = response.data.dados.data.map(item => item.data_cadastro);
        // setDataconv(dateStrings)

        // const earliest = findEarliestDate(dateStrings);
        // const closest = findClosestToAnniversary(dateStrings);

        // setEarliestDate(format(earliest, 'dd/MM/yyyy'));
        // setClosestToAnniversary(format(closest, 'dd/MM/yyyy'));
      } catch (error) {
        console.error("Erro ao buscar dados da API", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  let resultados = data.filter(
    (item: any) => item.status_empresa === "A" && item.data_cadastro != null,
  );

  // resultados.forEach((item: any) => {
  //   const convertToDate = parse(item.data_cadastro, "dd/MM/yyyy", new Date());
  
  //   const findEarliestDate = (dateStrings) => {
  //     const dates = dateStrings.map(convertToDate);
  //     dates.sort(compareAsc);
  //     return dates[0];
  //   };

  //   const earliest = findEarliestDate(convertToDate)
  // });

  //  const findClosestToAnniversary = (dateStrings) => {
  //    const now = new Date();
  //    const dates = dateStrings.map(convertToDate);
  //    let closestDate = null;
  //    let minDifference = Infinity;

  //    dates.forEach((date) => {
  //      let nextAnniversary = new Date(
  //        now.getFullYear(),
  //        date.getMonth(),
  //        date.getDate(),
  //      );
  //      if (nextAnniversary < now) {
  //        nextAnniversary.setFullYear(nextAnniversary.getFullYear() + 1);
  //      }
  //      const difference = differenceInDays(nextAnniversary, now);
  //      if (difference < minDifference) {
  //        minDifference = difference;
  //        closestDate = date;
  //      }
  //    });

  //    return closestDate;
  //  };

  console.log(resultados)

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
        
        <Card value={resultados.length} title="Total de clientes" Cardimg = {ImgCliente} dataCadastro="" online={true} />
        <Card
          value={"START INDUSTRIA E COMER"}
          dataCadastro={" - FALTAM " + " DIAS"}
          title="Ano de parceria"
          Cardimg = {ImgFidelidade}
          online={false}
        />
        
        <Card value={"TOTAL: " + "100.000.000,00"} title="Impostos Arrecadados" Cardimg = {ImgImposto} dataCadastro="" online={false} />
        <Card value="Teste:" title="Teste" Cardimg = {logopadrao} dataCadastro="" online={false} />
    </div>
      

    <div className="mt-4 grid grid-cols-1 gap-3 md:mt-6 md:grid-cols-1 md:gap-6 xl:grid-cols-2 2xl:mt-7.5 2xl:gap-7.5">
      <div className="rounded-sm border border-stroke bg-white px-9 py-1 shadow-default dark:border-strokedark dark:bg-boxdark">  
        <Card2  title="" informacao="EVENTO 379 E 380" />
          <div className="flex items-center justify-center mt-4 font-bold">
            <div className="w-5 h-5 bg-bluechart rounded-full mr-2"></div>
              <h1 className="mr-20">EVENTO 379</h1>
                <div className="w-5 h-5 bg-verdelimao rounded-full mr-2"></div>
              <h2>EVENTO 380</h2>
          </div>

          <div  className="grid grid-cols-3 text-black-2 dark:text-white">
            
              <RadialChart/><RadialChart/><RadialChart/>
              
              
            
          </div>
      </div>
          <div className="rounded-sm border border-stroke bg-white px-10 py-1 shadow-default dark:border-strokedark dark:bg-boxdark">  

            <Card2
              informacao="Relação de horas trabalhadas"
              title="Funcionários que mais trabalharam nos ultimos 5 meses"
            />
            <div className="">

              <ComboChart/>

            </div>
          
          </div>
        
          <div className="rounded-sm border border-stroke bg-white px-30   py-3 shadow-default dark:border-strokedark dark:bg-boxdark">  
            <Card2  title="Relação de cadastros de Categorias de Contas a Receber" informacao="Contas a Receber"/>  
            <LucroChart></LucroChart>
          
          </div>
          <div>
              <div className="bg-white dark:bg-boxdark px-8 py-1">
                  <Card2  title="Próximas empresas a completar 1 ano de parceria." informacao="Tempo de parceria"/> 
              </div>
              <div className="text-black-2 dark:text-white bg-white px-30   py-3 shadow-default dark:border-strokedark dark:bg-boxdark ">
                
                  <CalendarComponent/>
              </div>
              </div>
          </div>
      
      
    </DefaultLayout>
  );
};

export default Dashboard;
