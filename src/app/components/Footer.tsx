import React from 'react';
import { Box, Container, Grid, Typography, IconButton, Link, Avatar } from '@mui/material';
import { Facebook, Instagram, Twitter, YouTube } from '@mui/icons-material';
import Image from 'next/image';
import logo from '../../../public/centroespirita.jpeg'; // Ajuste o caminho conforme necessário

const socialLinks = [
  { icon: <Facebook />, url: 'https://www.facebook.com/alunosdobem' },
  { icon: <Instagram />, url: 'https://www.instagram.com/alunos_do_bem_ceab?igsh=MXB1MzRqbW1mNGVvZQ==' },
 
  { icon: <YouTube />, url: 'https://www.youtube.com/@AlunosdoBem' },
];

export const Footer = () => {
  return (
    <Box sx={{
      width: '100%',
     backgroundColor:"#00356E",
      color: '#FFC77D',
      py: 2,
      boxShadow:  "0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)",
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    }}>
      <Container maxWidth="lg" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Box sx={{ my: 2, display: 'flex', alignItems: 'center' }}>
            <Avatar>
            <Image src={logo} alt="Gajok Logo" height={50} width={50} />
            </Avatar>
          
          <Typography variant="h5" color="#FFFFFF"  gutterBottom sx={{ ml: 2,fontSize:"1.5rem" }}>
            Centro Espírita Alunos do Bem
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center'}}>
          {socialLinks.map(({ icon, url }, index) => (
            <IconButton key={index} color="inherit" component={Link} href={url} target="_blank" rel="noopener noreferrer" sx={{ mx: 1 }}>
              {icon}
            </IconButton>
          ))}
        </Box>
        <Typography variant="subtitle1" color="#D4D2D0" align="center">
            R. Moreira César, 2258 - Pio X, Caxias do Sul - RS,{' '}
           
            (54) 3221-5443
        </Typography>
        <Typography variant="subtitle1" color="#D4D2D0" align="center">
          {`© ${new Date().getFullYear()} Desenvolvido por Mauricio Dall Onder`}
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
