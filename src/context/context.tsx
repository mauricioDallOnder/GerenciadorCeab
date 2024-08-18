import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { Associado, TrabahadorInfoField } from "../app/interfaces/interfaces";
import { IIgruposDeEstudo } from "@/utils/ultils";

type Props = {
  children: React.ReactNode;
};

type Context = {
  usuariosData: Associado[];
  gruposEstudo: IIgruposDeEstudo[];
  gruposEstudoCarregado: boolean;
};

const CeabContext = createContext<Context | null>(null);

export const XContextProvider = ({ children }: Props) => {
  const [usuariosData, setUsuarios] = useState<Associado[]>([]);
  const [gruposEstudo, setGruposEstudo] = useState<IIgruposDeEstudo[]>([]);
  const [gruposEstudoCarregado, setGruposEstudoCarregado] = useState(false);

  // Configuração padrão do Axios para evitar cache
  axios.defaults.headers['Cache-Control'] = 'no-cache';
  axios.defaults.headers['Pragma'] = 'no-cache';
  axios.defaults.headers['Expires'] = '0';

  // Buscar grupos de Estudo
  useEffect(() => {
    const fetchGruposEstudo = async () => {
      try {
        const response = await axios.get(`/api/getTurmasEstudoFirebase?timestamp=${new Date().getTime()}`);
        if (response.data && Array.isArray(response.data)) {
          setGruposEstudo(response.data);
        } else {
          console.error('Dados de grupos de estudo inválidos:', response.data);
        }
        setGruposEstudoCarregado(true);
      } catch (error) {
        console.error('Erro ao buscar grupos de estudo:', error);
      }
    };
    console.log(gruposEstudo)
    fetchGruposEstudo();
  }, []);

  // Buscar usuários
  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const response = await axios.get('/api/getAssociadosDataFirebase');
        if (response.data) {
          // Verificar e transformar se necessário
          const usuarios = Array.isArray(response.data)
            ? response.data
            : Object.entries(response.data).map(([key, value]) => ({
                id: key,
                ...value as Associado,
              }));
          setUsuarios(usuarios);
        } else {
          console.error('Dados de usuários inválidos:', response.data);
        }
      } catch (error) {
        console.error('Erro ao buscar usuários:', error);
      }
    };

    fetchUsuarios();
  }, []);

  return (
    <CeabContext.Provider value={{ usuariosData, gruposEstudo, gruposEstudoCarregado }}>
      {children}
    </CeabContext.Provider>
  );
};

export const useCeabContext = () => {
  const context = useContext(CeabContext);

  if (!context) {
    throw new Error("XContext must be called from within the XContextProvider");
  }

  return context;
};
