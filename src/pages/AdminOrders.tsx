import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  IconButton,
  Menu,
} from "@mui/material";
import { MoreVert } from "@mui/icons-material";
import API from "../api/api";
import { useAuth } from "../context/AuthContext";
import type { Pedido } from "../types/Order";

const OrdersPage: React.FC = () => {
  const { token } = useAuth();
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPedido, setSelectedPedido] = useState<Pedido | null>(null);
  const [statusModalPedido, setStatusModalPedido] = useState<Pedido | null>(null);
  const [newStatus, setNewStatus] = useState("");

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [menuPedido, setMenuPedido] = useState<Pedido | null>(null);

  const [confirmDelete, setConfirmDelete] = useState<Pedido | null>(null);

  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        const res = await API.get("/order", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPedidos(res.data);
      } catch (err) {
        console.error("Error al cargar pedidos:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPedidos();
  }, [token]);

  const formatMoney = (value: number | string) => Number(value).toFixed(2);

  const handleOpenDialog = (pedido: Pedido) => {
    setSelectedPedido(pedido);
    setNewStatus(pedido.estado);
  };

  const handleCloseDialog = () => {
    setSelectedPedido(null);
    setNewStatus("");
  };

  const handleOpenStatusModal = (pedido: Pedido) => {
    setStatusModalPedido(pedido);
    setNewStatus(pedido.estado);
  };

  const handleCloseStatusModal = () => {
    setStatusModalPedido(null);
    setNewStatus("");
  };

  const handleStatusUpdate = async (pedido: Pedido) => {
    const id = pedido.id_pedido;
    try {
        await API.patch(
        `/order/${id}/estado`,
        { estado: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
        );
      setPedidos((prev) =>
        prev.map((p) => (p.id_pedido === id ? { ...p, estado: newStatus } : p))
      );
    } catch (err) {
      console.error("Error al actualizar estado:", err);
    }
  };

  const handleDelete = async (pedido: Pedido) => {
    try {
      const id = pedido.id_pedido;
      await API.delete(`/order/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPedidos((prev) => prev.filter((p) => p.id_pedido !== id));
      setConfirmDelete(null);
    } catch (err) {
      console.error("Error al eliminar pedido:", err);
    }
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, pedido: Pedido) => {
    setAnchorEl(event.currentTarget);
    setMenuPedido(pedido);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuPedido(null);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Gestión de Pedidos
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID Cliente</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Fecha</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pedidos.map((pedido) => (
              <TableRow key={pedido.id_pedido}>
                <TableCell>{pedido.id_pedido}</TableCell>
                <TableCell>{pedido.nombre_completo}</TableCell>
                <TableCell>
                  {new Date(pedido.fecha_creacion).toLocaleDateString("es-AR")}
                </TableCell>
                <TableCell>{pedido.estado}</TableCell>
                <TableCell>${formatMoney(pedido.total)}</TableCell>
                <TableCell>
                  <IconButton onClick={(e) => handleMenuOpen(e, pedido)}>
                    <MoreVert />
                  </IconButton>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl) && menuPedido?.id_pedido === pedido.id_pedido}
                    onClose={handleMenuClose}
                  >
                    <MenuItem
                      onClick={() => {
                        handleOpenDialog(pedido);
                        handleMenuClose();
                      }}
                    >
                      Ver Detalle
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        handleOpenStatusModal(pedido);
                        handleMenuClose();
                      }}
                    >
                      Cambiar Estado
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        setConfirmDelete(pedido);
                        handleMenuClose();
                      }}
                      sx={{ color: "red" }}
                    >
                      Eliminar
                    </MenuItem>
                  </Menu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={!!selectedPedido} onClose={handleCloseDialog} fullWidth maxWidth="md">
        <DialogTitle>Detalles del Pedido #{selectedPedido?.id_pedido}</DialogTitle>
        <DialogContent>
          {selectedPedido && (
            <>
              <Typography variant="subtitle1">ID Usuario: {selectedPedido.id_usuario}</Typography>
              <Typography variant="subtitle1">Nombre: {selectedPedido.nombre_completo}</Typography>
              {selectedPedido.usuario && (
                <Typography variant="subtitle1">Email: {selectedPedido.usuario.email}</Typography>
              )}
              <Typography variant="subtitle1">
                Fecha: {new Date(selectedPedido.fecha_creacion).toLocaleDateString("es-AR")}
              </Typography>
              <Typography variant="subtitle1">Método de pago: {selectedPedido.metodo_pago}</Typography>
              <Typography variant="subtitle1">Subtotal: ${formatMoney(selectedPedido.subtotal)}</Typography>
              <Typography variant="subtitle1">Costo envío: ${formatMoney(selectedPedido.costo_envio)}</Typography>
              <Typography variant="subtitle1">Total: ${formatMoney(selectedPedido.total)}</Typography>
              <Typography variant="subtitle1">Estado: {selectedPedido.estado}</Typography>
              {selectedPedido.detalles && selectedPedido.detalles.length > 0 && (
                <Box mt={2}>
                  <Typography variant="h6">Productos:</Typography>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Producto</TableCell>
                        <TableCell>Cantidad</TableCell>
                        <TableCell>Precio Unitario</TableCell>
                        <TableCell>Subtotal</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {selectedPedido.detalles.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>{item.producto_nombre}</TableCell>
                          <TableCell>{item.cantidad}</TableCell>
                          <TableCell>${formatMoney(item.precio_unitario)}</TableCell>
                          <TableCell>${formatMoney(item.subtotal_linea)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Box>
              )}
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cerrar</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={!!statusModalPedido} onClose={handleCloseStatusModal} fullWidth>
        <DialogTitle>Cambiar Estado del Pedido #{statusModalPedido?.id_pedido}</DialogTitle>
        <DialogContent>
          {statusModalPedido && (
            <FormControl fullWidth margin="normal">
              <InputLabel>Estado</InputLabel>
              <Select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
              >
                <MenuItem value="pendiente">Pendiente</MenuItem>
                <MenuItem value="confirmado">Confirmado</MenuItem>
                <MenuItem value="preparando">Preparando</MenuItem>
                <MenuItem value="enviado">Enviado</MenuItem>
                <MenuItem value="entregado">Entregado</MenuItem>
                <MenuItem value="cancelado">Cancelado</MenuItem>
              </Select>
            </FormControl>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseStatusModal}>Cancelar</Button>
          <Button
            variant="contained"
            onClick={async () => {
              if (!statusModalPedido) return;
              await handleStatusUpdate(statusModalPedido);
              handleCloseStatusModal();
            }}
          >
            Guardar
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
      >
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Estás seguro que deseas eliminar el pedido #{confirmDelete?.id_pedido}?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDelete(null)}>Cancelar</Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => confirmDelete && handleDelete(confirmDelete)}
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default OrdersPage;
