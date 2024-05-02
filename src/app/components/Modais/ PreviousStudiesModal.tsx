import React from 'react';
import { Modal, Box, Typography, Button, Divider } from '@mui/material';
import { HistoricoEstudoModalProps } from '../../interfaces/interfaces';

const  PreviousStudiesModal: React.FC<HistoricoEstudoModalProps> = ({ open, onClose, details }) => {
    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="worker-modal-title"
            aria-describedby="worker-modal-description"
        >
            <Box sx={{
                position: 'absolute', 
                top: '50%', 
                left: '50%', 
                transform: 'translate(-50%, -50%)',
                bgcolor: 'background.paper', // Ajuste para garantir cor de fundo adequada
                boxShadow: 24, 
                p: 4, 
                maxWidth: 500, 
                width: '100%', 
                border: '2px solid #000', // Borda sutil para o modal
                borderRadius: '16px' // Cantos arredondados
            }}>
                <Typography id="worker-modal-title" variant="h6" component="h2" color="primary">
                    Estudos Anteriores
                </Typography>
                <Box sx={{ mt: 2 }}>
                    {details.map((worker, index) => (
                        <>
                        <Box key={index} sx={{ mb: 2, p: 2, bgcolor: 'grey.100', borderRadius: '8px' }}> 
                            <Typography variant="body1" color="textPrimary"><strong>Livro Estudado:</strong> {worker.livro}</Typography>
                            <Typography variant="body1" color="textPrimary"><strong>Período de estudo:</strong> {worker.ano}</Typography>
                            <Typography variant="body1" color="textPrimary"><strong>Cursos realizados:</strong> {worker.observacoes}</Typography>
                            
                          
                        </Box>
                        <Divider sx={{ my: 2, bgcolor: 'secondary.main' }} />
                        </>
                    ))}
                </Box>
                <Button color='error' variant='contained' onClick={onClose} sx={{ mt: 2,'&:hover': { bgcolor: 'secondary.dark' } }}>
                    Fechar
                </Button>
            </Box>
        </Modal>
    );
};

export default  PreviousStudiesModal;
