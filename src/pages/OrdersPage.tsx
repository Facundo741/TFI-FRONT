import React, { useEffect, useState } from "react";
import { Box, Typography, Paper, Table, TableHead, TableRow, TableCell, TableBody, CircularProgress, Chip } from "@mui/material";
import API from "../api/api";
import { useAuth } from "../context/AuthContext";

interface PedidoDetalle {
  id_producto: number;
  producto_nombre: string;
  cantidad: number;
  precio_unitario: number;
  subtotal_linea: number;
}

interface Pedido {
  id_pedido: number;
  fecha_creacion: string;
  total: number;
  estado: "Pendiente" | "Enviado" | "Entregado" | "Cancelado";
  detalles: PedidoDetalle[];
}

const OrdersPage: React.FC = () => {
  const { user, token } = useAuth();
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchPedidos = async () => {
      setLoading(true);
      try {
        const res = await API.get(`/order/usuario/${user.id_usuario}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPedidos(res.data);
      } catch (err) {
        console.error("Error fetching pedidos:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPedidos();
  }, [user, token]);

  const getStatusColor = (status: Pedido["estado"]) => {
    switch (status) {
      case "Pendiente": return "warning";
      case "Enviado": return "info";
      case "Entregado": return "success";
      case "Cancelado": return "error";
      default: return "default";
    }
  };

  return (
    <Box sx={{ p: 3, minHeight: "calc(100vh - 64px - 64px)" }}>
      <Typography variant="h4" fontWeight="bold" sx={{ mb: 3 }}>
        Mis Pedidos
      </Typography>

      {loading ? (
        <CircularProgress />
      ) : pedidos.length === 0 ? (
        <Typography>No tienes pedidos realizados.</Typography>
      ) : (
        <Paper sx={{ width: "100%", overflowX: "auto" }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID Pedido</TableCell>
                <TableCell>Fecha</TableCell>
                <TableCell>Total</TableCell>
                <TableCell>Estado</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pedidos.map((pedido) => (
                <TableRow key={pedido.id_pedido}>
                  <TableCell>{pedido.id_pedido}</TableCell>
                  <TableCell>{new Date(pedido.fecha_creacion).toLocaleDateString()}</TableCell>
                  <TableCell>${pedido.total}</TableCell>
                  <TableCell>
                    <Chip label={pedido.estado} color={getStatusColor(pedido.estado)} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      )}
    </Box>
  );
};

export default OrdersPage;
