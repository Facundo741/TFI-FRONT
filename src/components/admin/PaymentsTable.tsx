import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Chip,
} from "@mui/material";

export interface Payment {
  id_pago: number;
  id_pedido: number;
  usuario_nombre: string;
  usuario_apellido: string;
  total: number;
  metodo_pago: string;
  estado_pago: "pendiente" | "pagado" | "cancelado";
  fecha_pago: string;
}

interface PaymentsTableProps {
  payments: Payment[];
}

const PaymentsTable: React.FC<PaymentsTableProps> = ({ payments }) => {
  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case "pagado":
        return "success";
      case "pendiente":
        return "warning";
      case "cancelado":
        return "error";
      default:
        return "default";
    }
  };

  return (
    <TableContainer component={Paper} sx={{ mt: 2 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID Pago</TableCell>
            <TableCell>ID Pedido</TableCell>
            <TableCell>Cliente</TableCell>
            <TableCell>Total</TableCell>
            <TableCell>Método</TableCell>
            <TableCell>Estado</TableCell>
            <TableCell>Fecha</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {payments.map((p) => (
            <TableRow key={p.id_pago}>
              <TableCell>{p.id_pago}</TableCell>
              <TableCell>{p.id_pedido}</TableCell>
              <TableCell>{`${p.usuario_nombre} ${p.usuario_apellido}`}</TableCell>
              <TableCell>${p.total ? Number(p.total).toFixed(2) : "0.00"}</TableCell>
              <TableCell>{p.metodo_pago}</TableCell>
              <TableCell>
                <Chip 
                  label={p.estado_pago || "desconocido"} 
                  color={getEstadoColor(p.estado_pago || "")} 
                />
              </TableCell>
              <TableCell>
                <Typography variant="body2">
                  {p.fecha_pago ? new Date(p.fecha_pago).toLocaleString() : "Sin fecha"}
                </Typography>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default PaymentsTable;
