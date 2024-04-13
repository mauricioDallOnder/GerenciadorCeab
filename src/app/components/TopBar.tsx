import { AppBar, Toolbar, Button, Box,makeStyles } from '@mui/material';
import React from 'react';
import Link from 'next/link';

function MyAppBar() {
  const toolbarStyles = {
    display: 'flex',
    justifyContent: 'space-between',
  };
  
  const linkStyles = {
    textDecoration: 'none',
    color:"white",
    margin: '0 16px',
    fontWeight: "700",
    fontFamily:'Roboto',
  };
  return (
    <AppBar position="fixed"  style={{ top: 0, height: '64px', zIndex: 1,background: "#202932"}}>
    <Toolbar sx={toolbarStyles}>
    <Link style={linkStyles} href="/FormRegistration">
        Formulário de Cadastro
      </Link>
      <Link style={linkStyles} href="/FormUpdate">
       Atualização Cadastral
      </Link>
      
      <Link style={linkStyles} href="/ListOfUsers">
        Lista de Usuários
      </Link>
      <Link style={linkStyles} href="/Reports">
       Relatórios
      </Link>
     
    </Toolbar>
  </AppBar>
  );
}

export default MyAppBar;