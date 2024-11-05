import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import OrgChartComponent from '../components/OrganoGrama';
import { sociosAtualizados } from '../services/api';
import { BoldIcon } from '@heroicons/react/24/solid';

interface Cliente {
  id: string;
  nome: string;
  cnpj: string;
  socios: string[];
  // Adicione outros campos necessários
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
}

const BoxPage: React.FC = () => {
  const [listaDeSocios, setListaDeSocios] = useState<ObjetoComSocios[]>([]);
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const client = location.state?.client as Cliente;

  const processarObjeto = useCallback((objeto: ObjetoComSocios): ObjetoComSocios => {
    let socios: string[] = [];
    for (let chave in objeto) {
      if (chave.startsWith("socio_") && typeof objeto[chave] === 'string') {
        socios.push(objeto[chave] as string);
      }
    }
    objeto.listacomsocios = socios;
    return objeto;
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const todosOsSocios = await sociosAtualizados();
      setListaDeSocios(todosOsSocios.map(processarObjeto));
    };
    fetchData();
  }, [processarObjeto]);

  const criarOrgChartData = useCallback((cliente: Cliente): OrgChartNode => {
    const orgChartData: OrgChartNode = {
      id: '1',
      name: cliente.nome,
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
        const empresasAdicionadas = new Set<string>(); // Set para controlar empresas já adicionadas

        listaDeSocios.forEach((socioCompleto) => {
          if (socioCompleto.listacomsocios?.includes(socio) && socioCompleto.cnpj !== cliente.cnpj) {
            const nomeDaEmpresa = `${socioCompleto.nome} ${socioCompleto.cnpj}`;
            
            // Verifica se a empresa já foi adicionada
            if (!empresasAdicionadas.has(nomeDaEmpresa)) {
              const EmpresaDoSocio: OrgChartNode = {
                id: `empresa_${cont}`,
                name: nomeDaEmpresa,
                title: 'Empresa',
                children: [],
              };
              cont++;
              socioNode.children?.push(EmpresaDoSocio);
              
              // Adiciona a empresa ao Set de empresas já adicionadas
              empresasAdicionadas.add(nomeDaEmpresa);
            }
          }
        });
      }
    });

    return orgChartData;
  }, [listaDeSocios]);

  const orgChartData = client ? criarOrgChartData(client) : null;

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