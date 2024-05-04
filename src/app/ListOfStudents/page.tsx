'use client'
import {
    GridColDef,
    GridRowsProp,
    GridToolbar,
} from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { Associado, HistoricoEstudoField } from "../interfaces/interfaces";
import axios from "axios";
import { Box, Button } from "@mui/material";
import CustomPagination from "../components/TableCustomPagination";
import { StyledDataGrid } from "@/utils/styles";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation"
import { useCeabContext } from "@/context/context";
import {PreviousStudiesModal} from "../components/Modais/ PreviousStudiesModal";
export default function ListOfStudents() {
    const { usuariosData } = useCeabContext();

    const [selectedWorkers, setSelectedWorkers] = useState<HistoricoEstudoField[]>([]);
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



    const handleOpenModal = (HistoricoEstudoField: HistoricoEstudoField[] | undefined) => {
        setSelectedWorkers(HistoricoEstudoField || []);  // Garantir que seja um array
        setModalOpen(true);
    };


    const columns: GridColDef[] = [

        { field: "col1", headerName: "Nome", width: 300 },
        { field: "col2", headerName: "Telefone", width: 150 },
        { field: "col3", headerName: "Email", width: 200 },
        { field: "col4", headerName: "Turma de Estudo", width: 150 },
        { field: "col5", headerName: "Facilitador", width: 200 },
        { field: "col6", headerName: "Dia", width: 100 },
        { field: "col7", headerName: "Turno", width: 100 },
        { field: "col8", headerName: "Horário", width: 150 },
        { field: "col9", headerName: "Sala", width: 100 },
        { field: "col10", headerName: "Tipo de Mediunidade", width: 300 },
        {
            field: "details",
            headerName: "Estudos Anteriores",
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

    const filtroEstudantes=usuariosData.filter(item=>item.GrupoEstudoInfoField.livro!=="Não está estudando atualmente")

    const rows: GridRowsProp = filtroEstudantes.map(usuario => ({
        id: usuario.id,
        col1: usuario.nome,
        col2: usuario.endereco.telefone,
        col3: usuario.endereco.email,
        col4: usuario.GrupoEstudoInfoField?.livro,
        col5: usuario.GrupoEstudoInfoField?.facilitador,
        col6: usuario.GrupoEstudoInfoField?.dia,
        col7: usuario.GrupoEstudoInfoField?.turno,
        col8: usuario.GrupoEstudoInfoField?.horario,
        col9: usuario.GrupoEstudoInfoField?.sala,
        col10: usuario.associacao?.TipoMediunidade,
        details: usuario.HistoricoEstudoField, 
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
            <PreviousStudiesModal
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
