import React from "react";
import { Box, Typography, Button, Divider, List, ListItem, ListItemText, Paper } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";

const CheckoutConfirm: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const state = location.state as {
    metodoPago: string;
    total: number;
    envio: number;
    nombre: string;
    direccion: string;
    ciudad: string;
    codigoPostal: string;
    telefono: string;
    cart?: { producto_nombre: string; cantidad: number; subtotal_linea: number }[];
    email?: string;
    id_pedido?: string;
  };

  if (!state) {
    return (
      <Box p={3}>
        <Typography variant="h6">No se encontró información del pedido</Typography>
        <Button variant="contained" sx={{ mt: 2 }} onClick={() => navigate("/products")}>
          Volver a productos
        </Button>
      </Box>
    );
  }

  return (
    <Box p={3} maxWidth={600} mx="auto" textAlign="center">
      <Box mb={3}>
        <Typography sx={{ fontSize: 60 }}>✅</Typography>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          ¡COMPRA EXITOSA!
        </Typography>
        <Typography mb={1}>Tu pedido ha sido confirmado y está siendo procesado</Typography>
        {state.id_pedido && (
          <Typography sx={{ border: "1px dashed #ccc", p: 1, display: "inline-block", mb: 2 }}>
            Número de pedido: <strong>{state.id_pedido}</strong>
          </Typography>
        )}
      </Box>

      <Paper sx={{ textAlign: "left", p: 2, mb: 3, backgroundColor: "#f5faff" }}>
        <Typography fontWeight="bold" gutterBottom>Comprobante enviado</Typography>
        <Typography>
          Hemos enviado un email a <strong>{state.email ?? "usuario@email.com"}</strong> con todos los detalles de tu compra.
        </Typography>

        <Typography fontWeight="bold" gutterBottom mt={2}>Estado del envío</Typography>
        <Typography>Tu pedido será empacado y enviado dentro de las próximas 24 horas.</Typography>

        <Typography fontWeight="bold" gutterBottom mt={2}>Tiempo de entrega estimado</Typography>
        <Typography>3-5 días hábiles para entrega a domicilio.</Typography>
      </Paper>

      <Paper sx={{ textAlign: "left", p: 2, mb: 3 }}>
        <Typography fontWeight="bold" gutterBottom>Resumen de tu compra</Typography>
        <List>
          {state.cart?.map((item, idx) => (
            <ListItem key={idx} disableGutters>
              <ListItemText
                primary={`${item.cantidad} x ${item.producto_nombre}`}
                secondary={`Subtotal: $${item.subtotal_linea}`}
              />
            </ListItem>
          ))}
          <Divider sx={{ my: 1 }} />
          <ListItem disableGutters>
            <ListItemText primary="Envío a domicilio" />
            <Typography>${state.envio}</Typography>
          </ListItem>
          <Divider sx={{ my: 1 }} />
          <ListItem disableGutters>
            <ListItemText primary="TOTAL PAGADO:" />
            <Typography fontWeight="bold">${state.total}</Typography>
          </ListItem>
        </List>
      </Paper>

      <Button fullWidth variant="contained" color="primary" sx={{ mb: 1 }} onClick={() => navigate("/order/details")}>
        VER DETALLES DEL PEDIDO
      </Button>
      <Button fullWidth variant="outlined" color="inherit" onClick={() => navigate("/products")}>
        SEGUIR COMPRANDO
      </Button>
    </Box>
  );
};

export default CheckoutConfirm;
