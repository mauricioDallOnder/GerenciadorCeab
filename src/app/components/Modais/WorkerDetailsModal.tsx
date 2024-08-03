import React from 'react';
import { Modal, Box, Typography, Button, Divider } from '@mui/material';
import { WorkerDetailsModalProps } from '../../interfaces/interfaces';

const WorkerDetailsModal: React.FC<WorkerDetailsModalProps> = ({ open, onClose, details }) => {
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
                 bgcolor: 'background.paper',
                 boxShadow: 24,
                 p: 4,
                 maxWidth: 500,
                 width: '100%',
                 border: '2px solid #000',
                 borderRadius: '16px',
                 maxHeight: '80vh',
                 overflowY: 'auto',
            }}>
                <Typography id="worker-modal-title" variant="h6" component="h2" color="primary">
                    Dia de Trabalho:
                </Typography>
                <Box sx={{ mt: 2 }}>
                    {details.map((worker) => (
                        <React.Fragment key={worker.id}>
                            <Box sx={{ mb: 2, p: 2, bgcolor: 'grey.100', borderRadius: '8px' }}>
                                <Typography variant="body1" color="textPrimary"><strong>Dia de Trabalho:</strong> {worker.diaTrabalha}</Typography>
                                <Typography variant="body1" color="textPrimary"><strong>Turno:</strong> {worker.turnoDeTrabalho}</Typography>
                            </Box>
                            <Divider sx={{ my: 2, bgcolor: 'secondary.main' }} />
                        </React.Fragment>
                    ))}
                </Box>
                <Button color='error' variant='contained' onClick={onClose} sx={{
                    position: 'fixed',
                    top: 10,
                    right: '20%',
                    transform: 'translateX(50%)',
                    '&:hover': { bgcolor: 'secondary.dark' },
                }}>
                    Fechar
                </Button>
            </Box>
        </Modal>
    );
};

export default WorkerDetailsModal;
