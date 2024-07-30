import { addYears, intervalToDuration, parse } from "date-fns";
import axios, { AxiosResponse, AxiosError } from 'axios';

const metodo =  "listar_empresas";
const url = `https://app.e-kontroll.com.br/api/v1/metodo/${metodo}`;


const listarEmpresas = async () => {
  try {
    return fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        api_key: "p2zazIRGQ9mwizXKkmVRBasVVW234DLdKkIpu53Rw8eh6zFpBOLolUWBCZmz",
        api_key_empresa:
          "yQuZX1A45FYa7gohZvmlHHDsUPvjLnGCTxuXMdae4W8T5x05hgWEvQgtUmxf",
      }),
    })
      .then((response) => response.json())
      .then((data) => data.dados.data);
  } catch (error) {
    console.error("Erro ao buscar dados da API", error);
    throw error; // rethrow the error so it can be caught by the caller
  }
};
const consultaCnpj = async (cnpj: string): Promise<any> => {
  const url = `https://api.cnpja.com/office/${cnpj}?simples=true`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "ece5e0ba-a0c9-4396-988d-190e2c64af11-5fe1699e-4777-4fc2-ba23-31a8a3ebcfae"
      },
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erro ao consultar o CNPJ:', error);
    return null;
  }
}

// const consultaCalendario = async () => {
//   const url = `http://192.168.25.83:3000/calendario`;
//   try {
//     const response = await fetch(url, {
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json",
//       },  
//     });
//     const data = await response.json();
//     console.log(data)
//     return data;
//   } catch (error) {
//     console.error('Erro ao consultar', error);
//     return null;
//   }
// }

// const consultaAniversario = async () => {
//   const url = `http://192.168.25.83:3000/calendario/proximo-aniversario`;
//   try {
//     const response = await fetch(url, {
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json",
//       },  
//     });
//     const data = await response.json();
//     console.log(data)
//     return data;
//   } catch (error) {
//     console.error('Erro ao consultar', error);
//     return null;
//   }
// }
// consultaAniversario();

const processData = async (data) => {
  interface ObjetoData {
    status_empresa: string;
    data_cadastro: string;
    razao_social: string;
    regime_tributario: string;
  }

  const dataFilter: ObjetoData[] = data.filter(
    (item: any) => item.status_empresa === "A" && item.data_cadastro != null,
  );

  const date: [string, string, string][] = dataFilter.map((item) => [
    item.data_cadastro,
    item.razao_social,
    item.regime_tributario,
  ]);

  const parsedDates = await Promise.all(
    date.map(async (item) => {
      const parsedDate = await parse(item[0], "dd/MM/yyyy", new Date());
      const razao_social = item[1];
      const regime_tributario = item[2];

      const dataAtual = new Date();
      const dateFuture = addYears(dataAtual, 1);
      const dataCadastroCliente = parsedDate;

      const interval = { start: dataCadastroCliente, end: dateFuture };
      const duration = intervalToDuration(interval);

      return {
        data: parsedDate,
        razao: razao_social,
        regime: regime_tributario,
        tempoDeParceria: duration.years,
        tempoDeParceriaMes: duration.months,
        tempoDeParceriaDias: duration.days,
      };
    }),
  );
  parsedDates.sort((a, b) => a.data.getTime() - b.data.getTime());
  return parsedDates;
};
export { listarEmpresas, processData, consultaCnpj}; //consultaCalendario };