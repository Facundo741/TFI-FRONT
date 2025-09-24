import React, { useEffect } from "react";
import { Box, Typography, Button, Paper, List, ListItem, ListItemText, Divider } from "@mui/material";
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";

interface CartItem {
  producto_nombre: string;
  cantidad: number;
  precio_unitario: number;
}

interface ConfirmationState {
  metodoPago: "mercadopago" | "transferencia" | "tarjeta" | "efectivo";
  metodoEntrega: "domicilio" | "retiro";
  total: number;
  envio: number;
  subtotal: number;
  nombre: string;
  direccion: string;
  ciudad: string;
  codigoPostal: string;
  telefono: string;
  cartItems: CartItem[];
  email?: string;
}

const ConfirmationPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const state = location.state as ConfirmationState;

  useEffect(() => {
    clearCart();
  }, []);

  if (!state) return <Typography>No se encontró información del pedido</Typography>;

  const formatMoney = (v: number) =>
    Number(v ?? 0).toLocaleString("es-AR", { minimumFractionDigits: 0 });

  const envioTexto =
    state.metodoEntrega === "domicilio"
      ? "Tu pedido será enviado a tu dirección en 2-3 días hábiles."
      : "Puedes retirar tu compra en un plazo de 2 horas hábiles presentado tu DNI.";

  return (
    <Box p={3} maxWidth={600} mx="auto" textAlign="center">
      <CheckCircleOutlineIcon sx={{ fontSize: 60, color: "green", mb: 2 }} />
      <Typography variant="h4" gutterBottom>¡COMPRA EXITOSA!</Typography>
      <Typography sx={{ mb: 2 }}>Tu pedido ha sido confirmado y está siendo procesado</Typography>

      <Box border="1px dashed #1976d2" borderRadius={1} p={1} mb={2}>
        <Typography>
          Número de pedido: <strong>#{Math.floor(Math.random() * 1000000)}</strong>
        </Typography>
      </Box>

      <Paper sx={{ textAlign: "left", p: 2, mb: 3, backgroundColor: "#f0f7ff" }}>
        <Typography fontWeight="bold" gutterBottom>Comprobante enviado</Typography>
        {state.metodoPago === "mercadopago" ? (
          <Typography sx={{ mb: 1 }}>
            Hemos enviado un email a <strong>{state.email ?? "correo@mercadopago.com"}</strong> con todos los detalles de tu compra.
          </Typography>
        ) : (
          <Typography sx={{ mb: 1 }}>
            Hemos enviado un email con todos los detalles de tu compra.
          </Typography>
        )}

        <Typography fontWeight="bold" gutterBottom>Estado del envío</Typography>
        <Typography sx={{ mb: 1 }}>
          {envioTexto}
        </Typography>
      </Paper>

      <Paper sx={{ textAlign: "left", p: 2, mb: 3 }}>
        <Typography fontWeight="bold" gutterBottom>Resumen de tu compra</Typography>
        <List>
          {state.cartItems.map((item, idx) => (
            <ListItem key={idx}>
              <ListItemText
                primary={`${item.cantidad} x ${item.producto_nombre}`}
                secondary={`$${formatMoney(item.cantidad * item.precio_unitario)}`}
              />
            </ListItem>
          ))}
          <ListItem>
            <ListItemText 
              primary={state.metodoEntrega === "domicilio" ? "Envío a domicilio" : "Retiro en local"} 
              secondary={`$${formatMoney(state.envio ?? 0)}`} 
            />
          </ListItem>
        </List>
        <Divider sx={{ my: 1 }} />
        <Box display="flex" justifyContent="space-between" fontWeight="bold">
          <Typography>TOTAL PAGADO:</Typography>
          <Typography>${formatMoney(state.total ?? 0)}</Typography>
        </Box>
      </Paper>

      <Button fullWidth variant="contained" sx={{ mb: 1 }} onClick={() => navigate("/order/details")}>
        VER DETALLES DEL PEDIDO
      </Button>
      <Button fullWidth variant="outlined" onClick={() => navigate("/products")}>
        SEGUIR COMPRANDO
      </Button>

      <Typography variant="body2" mt={2}>
        ¿No recibiste el email? Revisa tu carpeta de spam o <Button variant="text" onClick={() => alert("Solicitar reenvío")}>solicitar reenvío</Button>
      </Typography>
      <Typography variant="body2" mt={1}>
        ¿Necesitas ayuda? <Button variant="text" onClick={() => alert("Contactar soporte")}>Contactar a soporte</Button> 
      </Typography>
    </Box>
  );
};

export default ConfirmationPage;
