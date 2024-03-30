import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Typography } from "@mui/material";
import { useState } from "react";

export default function MainDialog() {
    
    const [open, setOpen] = useState<boolean>(true);

    return(
        <>
            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle></DialogTitle>
                <DialogContent>
                    <Grid container>
                        <Grid item md={12}>
                            <Typography variant="h4">O que são mutantes?</Typography>
                            <img src="./transferir.png" width="100%" alt="" />
                            <Typography variant="body1">
                                Mutantes são variações no código que podem ser utilizadas 
                                para validar testes unitários. Como o código é modificado
                                o teste criado para o código original deverá falhar!
                            </Typography>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Dismiss</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}