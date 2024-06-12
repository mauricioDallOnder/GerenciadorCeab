'use client'
import {
    GridColDef,
    GridRowsProp,
    GridToolbar
} from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { Associado, TrabahadorInfoField } from "../interfaces/interfaces";

import { Box, Button} from "@mui/material";
import CustomPagination from "../components/TableCustomPagination";
import {StyledDataGrid } from "@/utils/styles";
import WorkerDetailsModal from "../components/Modais/WorkerDetailsModal";
import { useSession} from "next-auth/react";
import { useRouter } from "next/navigation"
import { useCeabContext } from "@/context/context";
import { CreateVolunteerAgreement, Volunteer } from "../../utils/TermoPDF";
import { CreateCarnes, IISocio } from "@/utils/Carnes";
import { formatDate } from "@/utils/ultils";
export default function ListOfUsers() {
    const { usuariosData } = useCeabContext();
   
    const [selectedWorkers, setSelectedWorkers] = useState<TrabahadorInfoField[]>([]);
    const [modalOpen, setModalOpen] = useState(false);
    const PAGE_SIZE = 15;
    const [paginationModel, setPaginationModel] = useState({
        pageSize: PAGE_SIZE,
        page: 0,
    });

   const router = useRouter();
    const { status } = useSession({
        required: true, // Indica que a sessão é necessária
        onUnauthenticated() {
            // Redireciona para o login se não autenticado
            router.push('/Login');
        }
    });

   

    const handleOpenModal = (trabahadorInfoField: TrabahadorInfoField[] | undefined) => {
        setSelectedWorkers(trabahadorInfoField || []);  // Garantir que seja um array
        setModalOpen(true);
    };


    const columns: GridColDef[] = [
        { field: "col1", headerName: "Nº do Associado", width: 130 },
        { field: "col2", headerName: "Nome", width: 300 },
        { field: "col3", headerName: "Nascimento", width: 150 },
        { field: "col4", headerName: "CPF", width: 150 },
        { field: "col5", headerName: "RG", width: 150 },
        { field: "col6", headerName: "Endereço", width: 300 },
        { field: "col7", headerName: "Nº", width: 100 },
        { field: "col8", headerName: "Bairro", width: 150 },
        { field: "col9", headerName: "Telefone", width: 150 },
        { field: "col10", headerName: "Email", width: 200 },
        { field: "col11", headerName: "Tipo de Mediunidade", width: 300 },
        { field: "col12", headerName: "Data de Entrada na casa", width: 200 },
        { field: "col13", headerName: "Tipo de Vínculo", width: 250 },
        { field: "col14", headerName: "Tipo de Sócio", width: 250 },

        {
            field: "details",
            headerName: "Consultar Dias de Trabalho",
            width: 200,
            sortable: false,
            renderCell: (params) => (
                <Button
                    variant="contained"
                    onClick={() => handleOpenModal(params.row.details)}
                >
                    Ver Detalhes
                </Button>
            ),
        },
        {
            field: "Termo",
            headerName: "Termo de Voluntariado",
            width: 200,
            renderCell: (params) => {
              const data: Volunteer = {
                  campoNome: params.row.col2,
                  campoRG: params.row.col5,
                  campoCPF: params.row.col4,
                  campoRua: params.row.col6,
                  campoNumero: params.row.col7,
                  campoBairro: params.row.col8,
              };
          
              return (
                <Button
                  variant="contained"
                  color='secondary'
                  onClick={() => CreateVolunteerAgreement(data)}
                >
                  Gerar Termo
                </Button>
              );
            },
          },
          {
            field: "Carne",
            headerName: "Carnê de Contribuição",
            width: 200,
            renderCell: (params) => {
                
              const data: IISocio = {
                campoNome: params.row.col2,
                numbS: params.row.col1,
              };
          
              return (
                <Button
                  variant="contained"
                  color='warning'
                  onClick={() => CreateCarnes(data)}
                >
                  Gerar Carnê
                </Button>
              );
            },
          },          
    ];

    const rows: GridRowsProp = usuariosData.map(usuario => ({
        id: usuario.id,
        col1: usuario.numeroRegistroAssociado,
        col2: usuario.nome,
        col3: usuario.nascimento,
        col4: usuario.cpf,
        col5: usuario.rg,
        col6: usuario.endereco.logradouro,
        col7: usuario.endereco.numero,
        col8: usuario.endereco.complemento,
        col9: usuario.endereco.telefone,
        col10: usuario.endereco.email,
        col11: usuario.associacao?.TipoMediunidade,
        col12: formatDate(usuario.associacao?.dataEntrada),
        col13: usuario.associacao?.tipo,
        col14:usuario.associacao?.Tiposocio,
        details: usuario.trabahadorInfoField,
    }));

   

    return (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}>

            <Box
                style={{ marginTop: "30px", height: "auto", width: "97%" }}
            >
                <StyledDataGrid
                    checkboxSelection
                    paginationModel={paginationModel}
                    onPaginationModelChange={setPaginationModel}
                    pageSizeOptions={[PAGE_SIZE]}
                    slots={{
                        pagination: CustomPagination,
                        toolbar: GridToolbar,
                    }}
                    slotProps={{
                        toolbar: {
                            showQuickFilter: true,
                        },
                    }}
                    
                    rows={rows}
                    columns={columns}
                />
            </Box>
            <WorkerDetailsModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                details={selectedWorkers}
            />
           
        </Box>
    );






}


