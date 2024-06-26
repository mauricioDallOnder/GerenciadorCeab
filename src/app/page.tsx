'use client'
import { Container, Grid, Card, CardMedia, Typography } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import Footer from "./components/Footer";
import { useCeabContext } from "@/context/context";

export default function Home() {
  const { gruposEstudo, gruposEstudoCarregado } = useCeabContext();
  //console.log(gruposEstudo, gruposEstudoCarregado)
  return (
    <main style={{width:"100%"}}>
     
     <Container>
            <Grid container spacing={12} style={{marginTop: "15%"}}>
            <Grid item xs={12} sm={6} md={3}>
                <Link href="/FormRegistration"> {/* Adiciona o link para o Card */}
                 
                <Card sx={{
                  textAlign: 'center',
                  backgroundColor: '#f7f7f7', // Cor de fundo suave
                  boxShadow: 3, // Sombra sutil
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  '&:hover': {
                   
                    cursor: 'pointer'
                  }
                }}>
                      <CardMedia 
                        component="img"
                        height="fit-content"
                        width='fit-content'
                        image='https://firebasestorage.googleapis.com/v0/b/chat-dos-otarios.appspot.com/o/ceab%2Fresume.png?alt=media&token=6edbaf5e-7e2b-40a0-a3e2-9811e3631a75'
                        alt=""
                      />
                      <Typography color='#FFFF' mt={3}  variant="h5">Cadastro</Typography>
                     
                    </Card>
                 
                </Link>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Link href="/FormUpdate"> {/* Adiciona o link para o Card */}
                 
                <Card sx={{
                  textAlign: 'center',
                  backgroundColor: '#f7f7f7', // Cor de fundo suave
                  boxShadow: 3, // Sombra sutil
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  '&:hover': {
                  
                    cursor: 'pointer'
                  }
                }}>
                      <CardMedia 
                        component="img"
                        height="fit-content"
                        width='fit-content'
                        image='https://firebasestorage.googleapis.com/v0/b/chat-dos-otarios.appspot.com/o/ceab%2Fupdate.png?alt=media&token=bc1e2318-041e-4154-8f27-8d0a9faa80ae'
                        alt=""
                      />
                      <Typography color='#FFFF' mt={3}  variant="h5">Atualização Cadastral</Typography>
                      <Typography color='#FFFF' mt={27}  variant="h5"></Typography>
                    </Card>
                 
                </Link>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Link href="/ListOfUsers"> {/* Adiciona o link para o Card */}
                 
                <Card sx={{
                  textAlign: 'center',
                  backgroundColor: '#f7f7f7', // Cor de fundo suave
                  boxShadow: 3, // Sombra sutil
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  '&:hover': {
                   
                    cursor: 'pointer'
                  }
                }}>
                      <CardMedia 
                        component="img"
                        height="fit-content"
                        width='fit-content'
                        image='https://firebasestorage.googleapis.com/v0/b/chat-dos-otarios.appspot.com/o/ceab%2Fchecklist.png?alt=media&token=95d85403-ac4e-49a2-a546-cd7615c6ff50'
                        alt=""
                      />
                      <Typography color='#FFFF' mt={3}  variant="h5">Lista de associados</Typography>
                      <Typography color='#FFFF' mt={27}  variant="h5"></Typography>
                    </Card>
                
                </Link>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Link href="/Reports">
                  
                <Card sx={{
                  textAlign: 'center',
                  backgroundColor: '#f7f7f7', // Cor de fundo suave
                  boxShadow: 3, // Sombra sutil
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  '&:hover': {
                   
                    cursor: 'pointer'
                  }
                }}>
                      <CardMedia 
                        component="img"
                        height="fit-content"
                        width='fit-content'
                        image='https://firebasestorage.googleapis.com/v0/b/chat-dos-otarios.appspot.com/o/ceab%2Fclock.png?alt=media&token=061a08d4-b13c-41bb-952b-a1a53b0f9ca3'
                        alt=""
                      />
                      <Typography color='#FFFF' mt={3}  variant="h5">Relatórios</Typography>
                      <Typography color='#FFFF' mt={27}  variant="h5"></Typography>
                    </Card>
                  
                </Link>
              </Grid>

             
            </Grid>
           
          </Container>
          <Footer/>
    </main>
  );
}
