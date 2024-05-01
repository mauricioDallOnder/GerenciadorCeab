'use client'
import React, { createContext, useContext, useState, useEffect } from "react"
import { Associado, TrabahadorInfoField } from "../app/interfaces/interfaces";
import axios from "axios";
import { IIgruposDeEstudo } from "@/utils/ultils";
type Props = {
  children: React.ReactNode
}
type Context = {
    usuariosData:Associado[]
    gruposEstudo:IIgruposDeEstudo[];
    gruposEstudoCarregado:boolean;
}


const CeabContext = createContext<Context | null>(null)

export const XContextProvider = ({ children }: Props) => {
  const [usuariosData, setUsuarios] = useState<Associado[]>([]);
const [gruposEstudo,setGruposEstudo]=useState<IIgruposDeEstudo[]>([]);
const [gruposEstudoCarregado, setGruposEstudoCarregado] = useState(false);
  
  //Buscar grupos de Estudo
  useEffect(() => {
    axios.get('/api/getTurmasEstudoFirebase')
        .then(response => {
            setGruposEstudo(response.data);
            setGruposEstudoCarregado(true);
        })
        .catch(error => console.error('Erro ao buscar grupos de estudo:', error));
}, []);


  
  
    // Buscar usuarios----------------------------------------------------------------
    useEffect(() => {
    axios.get('/api/getAssociadosDataFirebase') 
        .then(response => {
            // Verificar se a resposta não é um array e convertê-la em array
            if (!Array.isArray(response.data)) {
                const transformed = Object.entries(response.data).map(([key, value]) => ({
                    id: key,
                    ...value as Associado
                }));
                setUsuarios(transformed);
            } else {
                console.error('Resposta não é um array:', response.data);
            }
        })
        .catch(error => console.error('Erro ao buscar usuários:', error));
}, []);

  return (
    <CeabContext.Provider value={{usuariosData,gruposEstudo,gruposEstudoCarregado }}>
      {children}
    </CeabContext.Provider>
  )
}

export const useCeabContext = () => {
  const context = useContext(CeabContext)

  if (!context)
    throw new Error("XContext must be called from within the XContextProvider")

  return context
}