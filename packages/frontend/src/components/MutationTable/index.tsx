import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
} from '@mui/material';

const MutationTable = ({ mutations }: any) => {
  return (
    <Paper>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Source File</TableCell>
            <TableCell>Mutated Class</TableCell>
            <TableCell>Mutated Method</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Description</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {mutations.map((mutation: any, index: number) => (
            <TableRow key={index}>
              <TableCell>{mutation.querySelector('sourceFile').textContent}</TableCell>
              <TableCell>{mutation.querySelector('mutatedClass').textContent}</TableCell>
              <TableCell>{mutation.querySelector('mutatedMethod').textContent}</TableCell>
              <TableCell>{mutation.getAttribute('status')}</TableCell>
              <TableCell>{mutation.querySelector('description').textContent}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
};

export default MutationTable;
