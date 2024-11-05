import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import OrgChartComponent from '../components/OrganoGrama';
import { consultaEventos, sociosAtualizados } from '../services/api';
import { BoldIcon } from '@heroicons/react/24/solid';

interface Cliente {
  id: string;
  nome: string;
  cnpj: string;
  socios: string[];
  faturamento: string;
}

interface OrgChartNode {
  id: string;
  name: string;
  title: string;
  children?: OrgChartNode[];
}

interface ObjetoComSocios {
  [key: string]: string | string[] | undefined;
  listacomsocios?: string[];
  nome?: string;
  cnpj?: string;
  faturamento?: string;
}

const processarObjeto = (objeto: ObjetoComSocios): ObjetoComSocios => {
  let socios: string[] = [];
  for (let chave in objeto) {
    if (chave.startsWith("socio_") && typeof objeto[chave] === 'string') {
      socios.push(objeto[chave] as string);
    }
  }
  objeto.listacomsocios = socios;
  return objeto;
};

const criarOrgChartData = (
  cliente: Cliente,
  listaDeSocios: ObjetoComSocios[],
  listaDeEmpresas: ObjetoComSocios[]
): OrgChartNode => {
  const orgChartData: OrgChartNode = {
    id: '1',
    name: cliente.nome +" Com faturamento de:"+ cliente.faturamento,
    title: 'Empresa',
    children: [],
  };

  cliente.socios.forEach((socio, index) => {
    if (socio) {
      const socioNode: OrgChartNode = {
        id: `socio_${index + 1}`,
        name: socio,
        title: 'Sócio',
        children: [],
      };
      orgChartData.children?.push(socioNode);

      let cont = 1;
      const empresasAdicionadas = new Set<string>();

      listaDeSocios.forEach((socioCompleto) => {
        if (socioCompleto.listacomsocios?.includes(socio) && socioCompleto.cnpj !== cliente.cnpj) {
          const faturamentos = listaDeEmpresas.filter(empresa => empresa.cnpj === socioCompleto.cnpj);
          const faturamento = faturamentos.length > 0 ? faturamentos[0].faturamento : 'N/A';
          const nomeDaEmpresa = `${socioCompleto.nome} com faturamento de : R$${faturamento},00`;
          
          if (!empresasAdicionadas.has(nomeDaEmpresa)) {
            const EmpresaDoSocio: OrgChartNode = {
              id: `empresa_${cont}`,
              name: nomeDaEmpresa,
              title: 'Empresa',
              children: [],
            };
            cont++;
            socioNode.children?.push(EmpresaDoSocio);
            empresasAdicionadas.add(nomeDaEmpresa);
          }
        }
      });
    }
  });

  return orgChartData;
};

const BoxPage: React.FC = () => {
  const [listaDeSocios, setListaDeSocios] = useState<ObjetoComSocios[]>([]);
  const [listaDeEmpresas, setListaDeEmpresas] = useState<ObjetoComSocios[]>([]);
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const client = location.state?.client as Cliente;

  useEffect(() => {
    const fetchData = async () => {
      const todosOsSocios = await sociosAtualizados();
      setListaDeSocios(todosOsSocios.map(processarObjeto));

      const EmpresaFaturamentos = await consultaEventos();
      setListaDeEmpresas(EmpresaFaturamentos);
    };
    fetchData();
  }, []);

  const orgChartData = useMemo(() => {
    if (client && listaDeSocios.length > 0 && listaDeEmpresas.length > 0) {
      return criarOrgChartData(client, listaDeSocios, listaDeEmpresas);
    }
    return null;
  }, [client, listaDeSocios, listaDeEmpresas]);

  if (!client) {
    return <div>Cliente não encontrado</div>;
  }

  return (
    <div>
      <h1>Detalhes do Sócio: {client.nome}</h1>
      <p>ID: {id}</p>
      <Link to="/Sublimite">Voltar para a lista</Link>
      {orgChartData && <OrgChartComponent data={orgChartData} />}
    </div>
  );
};

export default BoxPage;