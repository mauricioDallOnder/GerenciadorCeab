import React, { createContext, useContext, useState, useEffect } from "react"
import { Associado, TrabahadorInfoField } from "../app/interfaces/interfaces";
import axios from "axios";
type Props = {
  children: React.ReactNode
}
type Context = {
    usuariosData:Associado[]
}


const CeabContext = createContext<Context | null>(null)

export const XContextProvider = ({ children }: Props) => {
  const [usuariosData, setUsuarios] = useState<Associado[]>([]);

  useEffect(() => {
    // Carregar a lista de usuários para o Autocomplete
    axios.get('/api/getAssociadosDataFirebase') // Substitua por sua URL de API real para buscar usuários
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
    <CeabContext.Provider value={{usuariosData }}>
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