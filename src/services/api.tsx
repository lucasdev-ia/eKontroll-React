import { addYears, intervalToDuration, parse } from "date-fns";
import axios, { AxiosResponse, AxiosError } from 'axios';

const metodo = "listar_empresas";
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
const consultaCalendario = async () => {
  const url = `http://192.168.25.83:3000/calendario`;
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    console.log(data)
    return data;
  } catch (error) {
    console.error('Erro ao consultar', error);
    return null;
  }
}
const consultaCalendarioSocio = async () => {
  const url = `http://192.168.25.83:3000/calendario/socios`;
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    console.log(data)
    return data;
  } catch (error) {
    console.error('Erro ao consultar', error);
    return null;
  }
}


const consultaAniversario = async () => {
  const url = `http://192.168.25.83:3000/calendario/aniversario-hoje`;
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    console.log(data)
    return data;
  } catch (error) {
    console.error('Erro ao consultar', error);
    return null;
  }
}
const consultaAniversarioSocio = async () => {
  const url = `http://192.168.25.83:3000/calendario/aniversario-socios`;
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    console.log(data)
    return data;
  } catch (error) {
    console.error('Erro ao consultar', error);
    return null;
  }
}
const consultaEventos = async () => {
  const url = `http://192.168.25.83:3000/eventos`;
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    console.log(data)
    return data;
  } catch (error) { 
    console.error('Erro ao consultar', error);
    return null;
  }   
}
const sociosAtualizados = async () => {
  const url = `http://192.168.25.83:3000/calendario/socios-atualizados`;
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    console.log(data)
    return data;
  } catch (error) {
    console.error('Erro ao consultar', error);
    return null;
  }
}
const consultaEventosPorData = async (mes) => {
  const url = `http://192.168.25.83:3000/eventos/consulta?mes=${mes}`; 
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    console.log(data)
    return data;
  } catch (error) {
    console.error('Erro ao consultar', error);
    return null;
  }   
}
consultaEventos();
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

    const empresasSublimiteDash = async () => { 
      try {
        const response = await fetch('http://192.168.25.83:3000/eventos');
        const result = await response.json();

        const ListaDeSocios = await sociosAtualizados();

        function juntarListas(lista1, lista2) {
          const resultado: any = [];
          for (const objeto1 of lista1) {
            for (const objeto2 of lista2) {
              if (objeto1.cnpj == objeto2.cnpj) {
                const EmpresaCompleta = {
                  ...objeto1,
                  ...objeto2,
                };
                resultado.push(EmpresaCompleta);
                break;
              }
            }
          }
          return resultado;
        }

        const EmpresasCompletas: any[] = juntarListas(result, ListaDeSocios);
        const resultadoParcial = EmpresasCompletas;

        for (let item of resultadoParcial) {
          item.socios = Object.keys(item)
            .filter((key) => key.startsWith('socio_') && item[key])
            .map((key) => item[key])
            .filter((socio) => socio.trim() !== '');
            item.faturamentoCompartilhado = parseFloat(item.faturamento)

        }

        for (let item1 of resultadoParcial) {
          for (let item2 of resultadoParcial) {
            if (item2.cnpj != item1.cnpj) {
              function comparaListas(lista1, lista2) {
                return lista1.some((item) => lista2.includes(item));
              }

              let comp = comparaListas(item1.socios, item2.socios);
              if (comp == true) {

                item1.faturamentoCompartilhado =
                  item1.faturamentoCompartilhado + parseFloat(item2.faturamento);
                  console.log(

                    // `A empresa ${item1.nome} tem os sócios ${item1.socios}com o faturamento de ${item1.faturamento} | a empresea ${item2.nome} tem os sócios ${item2.socios} e o faturamento de ${item2.faturamento} entao o faturamento total é: ${item1.faturamentoCompartilhado}`,

                    // `A empresa ${item1.nome} tem os sócios ${item1.socios}com o faturamento de ${item1.faturamento} | a empresea ${item2.nome} tem os sócios ${item2.socios} e o faturamento de ${item2.faturamento} entao o faturamento total é: ${item1.faturamentoCompartilhado}`,

                  )
              }
              else {item1.faturamentoCompartilhado = item1.faturamentoCompartilhado + 0 }
            } else {
            }
          }
        }

        const filteredResult = resultadoParcial

          .filter((item) => item.regime === 'SIMPLES NACIONAL')
          .sort((a, b) => b.faturamento - a.faturamento);

          return filteredResult
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      } 
    };

   
 
export { empresasSublimiteDash, listarEmpresas, processData, consultaCalendario, consultaAniversario, consultaEventos, consultaEventosPorData, consultaCalendarioSocio, consultaAniversarioSocio, sociosAtualizados };