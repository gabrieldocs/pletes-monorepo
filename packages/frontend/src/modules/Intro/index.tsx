import { Box, Grid, Typography } from "@mui/material"
import React from "react"

export default function Intro() {
    return(
        <React.Fragment>
            <Grid container>
                <Grid item md={3} sx={{
                    backgroundColor: "purple",
                    height: "100vh"
                }}>
                    <Box p={2}>
                        <Typography variant="h4">Plataforma</Typography>
                    </Box>
                </Grid>
                <Grid item md={6}sx={{
                        border: "solid purple",
                        height: "100vh"
                    }}>
                    <Box p={2}>
                        <Typography variant="h4">Desafio</Typography>
                        <Typography>A expressão Lorem ipsum em design gráfico e editoração é um texto padrão em latim utilizado na produção gráfica para preencher os espaços de texto em ...</Typography>
                    </Box>
                </Grid>
                <Grid item md={3}>
                    <Box p={2}>
                        <Typography variant="h4">Sugestões</Typography>
                    </Box>
                </Grid>
            </Grid>
        </React.Fragment>
    )
}