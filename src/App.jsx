import React from 'react';
import Box from '@mui/material/Box';
import { Card, CardActionArea, CardActions, CardContent, Stack, TextField, Button, Typography } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';


function App() {
  return (
    <>
      <Box sx={{ p: 0, m: 0, display: 'flex', justifyContent: 'center' }}>
        {/* HEADER */}

        <Stack spacing={2}>
          {/* CONTAINER */}
          <Box
            sx={{
              width: '100%',
              height: '100vh',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Card
              sx={{
                height: '55vh',
                width: '500px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
                backgroundColor:'#F8F8F8',
                p: 5,
                borderRadius:'9px'
              }}
            >
              <CardContent sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', width: '100%' }}>
                <Typography
                  variant="h6"
                  sx={{
                    marginBottom: 2,
                    fontWeight: 'bold',
                    color: '#1976d2',
                    textAlign: 'center',
                    textTransform: 'uppercase',
                    letterSpacing: 2,
                    fontFamily: '"Playfair Display", serif;',
                  }}
                >
                  Dando os Primeiros Passos na Educação
                </Typography>

                <Stack spacing={2}>
                  <TextField required id="filled-required" label="Nome:" variant="filled" />
                  <TextField required id="filled-required" label="Sobrenome:" variant="filled" />
                  <TextField required id="filled-required" label="Data Nascimento:" variant="filled" />
                  <TextField required id="filled-required" label="CPF:" variant="filled" />
                  <TextField disabled id="filled-required" variant="filled" defaultValue="ATIVO" />
                </Stack>
              </CardContent>

              {/* Botão de Cadastrar  */}
              <CardActions sx={{ justifyContent: 'center', marginTop: 2 }}>
                <CardActionArea>
                  <Button variant="contained" endIcon={<SendIcon />}>
                    Cadastrar Aluno
                  </Button>
                </CardActionArea>
              </CardActions>
            </Card>
          </Box>
        </Stack>
      </Box>
    </>
  );
}

export default App;
