'use client'
import {
    GridColDef,
    GridRowsProp,
    GridToolbar,
} from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { Associado, TrabahadorInfoField } from "../interfaces/interfaces";
import axios from "axios";
import { Box, Button} from "@mui/material";
import CustomPagination from "../components/TableCustomPagination";
import {StyledDataGrid } from "@/utils/styles";
import WorkerDetailsModal from "../components/WorkerDetailsModal";
import { useSession} from "next-auth/react";
import { useRouter } from "next/navigation"
import { useCeabContext } from "@/context/context";
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
        { field: "col5", headerName: "Endereço", width: 300 },
        { field: "col6", headerName: "Nº", width: 100 },
        { field: "col7", headerName: "Telefone", width: 150 },
        { field: "col8", headerName: "Email", width: 200 },
        { field: "col9", headerName: "Turma de Estudo", width: 150 },
        { field: "col10", headerName: "Facilitador", width: 200 },
        { field: "col11", headerName: "Dia", width: 100 },
        { field: "col12", headerName: "Turno", width: 100 },
        { field: "col13", headerName: "Horário", width: 150 },
        { field: "col14", headerName: "Sala", width: 100 },
        { field: "col15", headerName: "Tipo de Mediunidade", width: 300 },
        { field: "col16", headerName: "Data de Entrada", width: 200 },
        { field: "col17", headerName: "Tipo de Vínculo", width: 250 },
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
    ];

    const rows: GridRowsProp = usuariosData.map(usuario => ({
        id: usuario.id,
        col1: usuario.numeroRegistroAssociado,
        col2: usuario.nome,
        col3: usuario.nascimento,
        col4: usuario.cpf,
        col5: usuario.endereco.logradouro,
        col6: usuario.endereco.numero,
        col7: usuario.endereco.telefone,
        col8: usuario.endereco.email,
        col9: usuario.GrupoEstudoInfoField?.livro,
        col10: usuario.GrupoEstudoInfoField?.facilitador,
        col11: usuario.GrupoEstudoInfoField?.dia,
        col12: usuario.GrupoEstudoInfoField?.turno,
        col13: usuario.GrupoEstudoInfoField?.horario,
        col14: usuario.GrupoEstudoInfoField?.sala,
        col15: usuario.associacao?.TipoMediunidade,
        col16: usuario.associacao?.dataEntrada,
        col17: usuario.associacao?.tipo,
        details: usuario.trabahadorInfoField, // Certifique-se de que este campo está sendo preenchido corretamente
    }));




    return (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}>

            <Box
                style={{ marginTop: "100px", height: "auto", width: "90%" }}
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


/*

 { field: "col9", headerName: "Turma de Estudo", width: 300 },
        { field: "col10", headerName: "Dia de Estudo", width: 300 },
        { field: "col11", headerName: "Sala", width: 100 },
        { field: "col12", headerName: "Facilitador", width: 300 },

        col9: usuario.GrupoEstudoInfoField?.turmaEstudo,
        col10: usuario.GrupoEstudoInfoField?.diaEstuda,
        col11: usuario.GrupoEstudoInfoField?.numeroSala,
        col12: usuario.GrupoEstudoInfoField?.nomeFacilitador,
*/
