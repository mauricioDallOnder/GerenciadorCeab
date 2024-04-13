import { BoxStyleCadastro, SubtituloDaPagina, TituloDaPagina } from "@/utils/styles"
import { Box,Typography } from "@mui/material"
import Image from 'next/image'
import ceab from '../../../public/ceab.gif'
export const FormHeader=({titulo}:{titulo:string})=>{
    return(
        
            <Box sx={{ display: "table", width: "100%" }}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  margin: "0 -38px",

                }}
              >
                <Image
                  src={ceab}
                  alt=""
                  width={130}
                  height={130}
                />
                <Typography sx={TituloDaPagina}>
                  {titulo}
                </Typography>
                <Typography sx={SubtituloDaPagina}>
                  Centro Espírita Alunos do Bem
                </Typography>
              </Box>
            </Box>
        
    )
}

//Cadastro de Associados