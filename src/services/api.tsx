import axios from "axios";
import { addYears, intervalToDuration, parse } from "date-fns";

const apiEkontroll = axios.create({
  baseURL:
    "https://h-apigateway.conectagov.estaleiro.serpro.gov.br/oauth2/jwt-token", // Substitua pela URL da sua API
});

const listarEmpresas = async () => {
  try {
    const response = await apiEkontroll.post("/listar_empresas", {
      api_key: "p2zazIRGQ9mwizXKkmVRBasVVW234DLdKkIpu53Rw8eh6zFpBOLolUWBCZmz",
      api_key_empresa:
        "yQuZX1A45FYa7gohZvmlHHDsUPvjLnGCTxuXMdae4W8T5x05hgWEvQgtUmxf",
    });
    return response.data.dados.data;
  } catch (error) {
    console.error("Erro ao buscar dados da API", error);
  }
};

const apiCnpj = axios.create({
  baseURL: "https://www.receitaws.com.br/v1/cnpj",
})

const listarCnpjs = async (req, res) => {
  try {
    const response = await apiCnpj.get(`/${req.params.cnpj}`);
    return res.json(response.data);
  } catch (error) {
    console.error("Erro ao buscar dados do CNPJ", error);
    return res.status(404).json({ message: "CNPJ não encontrado" });
  }
}

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
export { listarEmpresas, processData };
