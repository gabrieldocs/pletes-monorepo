import React, { useEffect, useRef, useState } from "react"
import Editor from '@monaco-editor/react';
import { Box, Button, Grid, Typography } from "@mui/material";
import axios, { AxiosResponse } from "axios";
import Appbar from "../Appbar";
import { DirectionsRun, PlayArrow, Refresh } from "@mui/icons-material";
import { toast } from "react-toastify";
import { indigo } from "@mui/material/colors";

export default function MainEditor() {

    const [startDate, setStartDate] = useState<string>("Inicialização em: " + new Date().toLocaleDateString());
    const [completitions, setCompletitions] = useState<any | {}>({});

    const monacoRef = useRef(null);

    useEffect(() => {
        setStartDate("Inicialização em: " + new Date().toLocaleDateString())
    }, [])

    const getTestSnippet = async (text: string) => {
        toast.info('Starting task...', {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
        });
        await axios.post("http://localhost:5500/completitions/generate", {
            input: text
        })
            .then((res: AxiosResponse<any>) => {
                setCompletitions(res.data)
            })
            .catch((err) => {
                console.log(err)
            })
            .finally(() => {
                toast('Task finished!', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
            })
    }

    return (
        <React.Fragment>
            <Appbar />
            <Grid container spacing={2}>
                <Grid
                    item
                    md={12}>
                    <Box style={{
                        width: "auto",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "12px 24px"
                    }}>
                        <Typography variant="h5">Editor</Typography>
                        <Typography variant="body1">{startDate}</Typography>
                        <Box sx={{ display: "flex", gap: "6px" }}>
                            <Button startIcon={<Refresh />} variant="contained" disableElevation>
                                Refresh
                            </Button>
                            <Button startIcon={<PlayArrow />} variant="contained" disableElevation>
                                Run test case
                            </Button>
                            <Button
                                variant="contained"
                                disableElevation
                                startIcon={<DirectionsRun />}
                                onClick={() => {
                                    var text = JSON.stringify(window.getSelection()!.toString())
                                    console.log(text)
                                    getTestSnippet(text)
                                }}>
                                Generate test case
                            </Button>
                        </Box>
                    </Box>
                </Grid>
                <Grid item md={2} sx={{
                    borderTop: "solid thin #ccc",
                }}>
                    <Box>
                        {/* <FileExplorer /> */}
                    </Box>
                </Grid>
                <Grid item md={4} sx={{
                    border: "solid thin #ccc",
                }}>
                    <Box p={2}>
                        <Typography variant="h5">This is a explanation on the issue</Typography>
                        <Typography variant="body1">This is a fine, descriptive text about this issue</Typography>
                    </Box>
                </Grid>
                <Grid item md={6} sx={{
                    bgcolor: indigo['A400'],
                    border: "solid thin #ccc",
                    paddingLeft: "0px",
                    paddingTop: "0px"
                }}>

                    <Editor
                        height="75vh"
                        theme="vs-dark"
                        defaultLanguage="java"
                        defaultValue={
                            `
package com.santos;

import javax.swing.*;
import java.awt.Dimension;

public class Calculator {
    public Calculator() {}

    public float somar(float a, float b) {
        return a + b;
    }

    public void mountWindow() {
        JFrame frame = new JFrame();
        frame.setSize(new Dimension(500, 400));
        frame.setVisible(true);
    }
}
                    `
                        }
                        onChange={(e) => {
                            console.log(e)
                        }}
                    />
                </Grid>
                {/* <Grid item md={4}>
                    <Box sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-start",
                        justifyContent: "flex-start"
                    }}>
                        <Box mb={3} p={2}>
                            <Typography variant="h5">Sugestões:</Typography>
                        </Box>

                        {
                            completitions
                            && completitions.text
                            && <Editor
                                height="50%"
                                theme="oceanic-next"
                                defaultLanguage="java"
                                defaultValue={completitions.text.choices[0].message.content}
                            />
                        }
                    </Box>

                    <Box
                        sx={{
                            backgroundColor: "black",
                            padding: "12px 24px",
                            height: "100%",
                            color: "white"
                        }}>

                    </Box>
                </Grid> */}
            </Grid>
        </React.Fragment>
    )
}