'use client'
import {
    GridColDef,
    GridRowsProp,
    GridToolbar,
} from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { Associado, TrabahadorInfoField } from "../interfaces/interfaces";
import axios from "axios";

import { Box, Button, Container } from "@mui/material";
import CustomPagination from "../components/TableCustomPagination";
import { BoxStyleCadastro, StyledDataGrid } from "@/utils/styles";
import { FormHeader } from "../components/FormHeader";
import WorkerDetailsModal from "../components/WorkerDetailsModal";


export default function ListOfUsers() {

    const [usuarios, setUsuarios] = useState<Associado[]>([]);
    const [selectedWorkers, setSelectedWorkers] = useState<TrabahadorInfoField[]>([]);
    const [modalOpen, setModalOpen] = useState(false);
    const PAGE_SIZE = 15;
    const [paginationModel, setPaginationModel] = useState({
        pageSize: PAGE_SIZE,
        page: 0,
    });

    useEffect(() => {
        // Carregar a lista de usuários para o Autocomplete
        axios.get('/api/getDataFromFirebase') // Substitua por sua URL de API real para buscar usuários
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

    const handleOpenModal = (trabahadorInfoField: TrabahadorInfoField[] | undefined) => {
        console.log(trabahadorInfoField); // Verifique os dados aqui
        setSelectedWorkers(usuarios[0].trabahadorInfoField || []);  // Garantir que seja um array
        setModalOpen(true);
    };

    const rows: GridRowsProp = usuarios.map(
        ({ id, numeroRegistroAssociado, nome, endereco, nascimento, cpf, trabahadorInfoField, associacao, GrupoEstudoInfoField }) => {
            return {
                id: id,
                col1: numeroRegistroAssociado,
                col2: nome,
                col3: nascimento,
                col4: cpf,
                col5: endereco.logradouro,
                col6: endereco.numero,
                col7: endereco.telefone,
                col8: endereco.email,
                col9: GrupoEstudoInfoField.turmaEstudo,
                col10: GrupoEstudoInfoField.diaEstuda,
                col11: GrupoEstudoInfoField.numeroSala,
                col12: GrupoEstudoInfoField.nomeFacilitador,
                col13: associacao.diaVinculo,
                col14: associacao.dataEntrada,
                col15: associacao.tipo,
            };
        }
    );


    const columns: GridColDef[] = [
        { field: "col1", headerName: "Nº do Associado", width: 130 },
        { field: "col2", headerName: "Nome", width: 250 },
        { field: "col3", headerName: "Nascimento", width: 150 },
        { field: "col4", headerName: "CPF", width: 150 },
        { field: "col5", headerName: "Endereço", width: 200 },
        { field: "col6", headerName: "nº", width: 150 },
        { field: "col7", headerName: "Telefone", width: 150 },
        { field: "col8", headerName: "Email", width: 150 },
        { field: "col9", headerName: "Turma de Estudo", width: 300 },
        { field: "col10", headerName: "Dia de Estudo", width: 300 },
        { field: "col11", headerName: "Sala", width: 100 },
        { field: "col12", headerName: "Facilitador", width: 300 },
        { field: "col13", headerName: "Dia(s) que Frequenta a casa", width: 300 },
        { field: "col14", headerName: "Data de entrada", width: 200 },
        { field: "col15", headerName: "Tipo de vinculo", width: 200 },
        {
            field: "details",
            headerName: "Consultar dias de trabalho",
            width: 200,
            sortable: false,
            renderCell: (params) => (
                <Button
                    variant="contained"
                    onClick={() => handleOpenModal(params.row.trabahadorInfoField)}
                >
                    Ver Detalhes
                </Button>
            ),
        },

    ]



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