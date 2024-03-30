import { ChangeCircleSharp, DoneAll, NewReleases } from "@mui/icons-material";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import { green, pink, red } from "@mui/material/colors";
import React, { useEffect, useState } from "react";

const MutationTableComponent = ({ xmlContent }: any) => {
  const [mutations, setMutations] = useState<any[]>([]);

  useEffect(() => {
    if (xmlContent) {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlContent, "text/xml");
      const mutationNodes = xmlDoc.querySelectorAll("mutation");
      console.log("Number of mutation nodes:", mutationNodes.length); // Log the number of mutation nodes
      setMutations(Array.from(mutationNodes));
    }
  }, [xmlContent]);
  // Calculate the count of killed mutants and total mutants
  const killedMutants = mutations.filter(
    (mutation) => mutation.getAttribute("status") === "KILLED"
  );
  const totalMutants = mutations.length;

  return (
    <React.Fragment>
      <Box
        sx={{
          backgroundColor: "navy",
          color: "white",
        }}
      >
        <Box
          p={3}
          mb={3}
          sx={{
            minHeight: "20vh",
          }}
        >
          <Typography variant="h3">
            {" "}
            {killedMutants.length} de {totalMutants} Mutantes mortos{" "}
          </Typography>
          <Typography>
            Você está vendo um sumário da execução da última suíte de testes
            submetida.
          </Typography>
        </Box>
      </Box>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Arquivo</TableCell>
            {/* <TableCell>Classe mutante</TableCell> */}
            <TableCell>Método mutante</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Descrição</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {mutations.map((mutation, index) => (
            <TableRow key={index}>
              <TableCell>
                <Tooltip
                  title={mutation.querySelector("mutatedClass").textContent}
                >
                  {mutation.querySelector("sourceFile").textContent}
                </Tooltip>
              </TableCell>
              {/* <TableCell>
                {mutation.querySelector("mutatedClass").textContent}
              </TableCell> */}
              <TableCell align="center">
                <Box
                  sx={{
                    padding: "12px 24px",
                    borderRadius: "12px",
                    border: "solid red",
                  }}
                >
                  {mutation.querySelector("mutatedMethod").textContent}
                </Box>
              </TableCell>
              <TableCell align="center">
                {/* {mutation.getAttribute("status")} */}
                {mutation.getAttribute("status") === "KILLED" ? (
                  <DoneAll sx={{ color: green[500] }} />
                ) : (
                  <NewReleases sx={{ color: red[800] }} />
                )}
                {/* {mutation.getAttribute("status") === "KILLED" ? (
                  <img
                    src="https://www.svgrepo.com/show/65845/dead.svg"
                    alt="killed"
                    width="28px"
                  />
                ) : (
                  <img
                    src="https://static.thenounproject.com/png/4520794-200.png"
                    alt=""
                    width="28px"
                  />
                )} */}
              </TableCell>
              <TableCell
                sx={{
                  color: pink[400],
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                }}
              >
                <ChangeCircleSharp />
                {mutation.querySelector("description").textContent}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </React.Fragment>
  );
};

export default MutationTableComponent;
