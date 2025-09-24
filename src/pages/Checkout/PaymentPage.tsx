import React, { useState, useEffect } from "react";
import { Box, Typography, Button, TextField } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";

interface CartItem {
  producto_nombre: string;
  cantidad: number;
  precio_unitario: number;
}

interface PaymentState {
  metodoPago: "mercadopago" | "transferencia" | "tarjeta" | "efectivo";
  total: number;
  envio: number;
  subtotal: number;
  nombre: string;
  direccion: string;
  ciudad: string;
  codigoPostal: string;
  telefono: string;
  cartItems: CartItem[];
  metodoEntrega: "domicilio" | "retiro";
  email?: string;
}

const randomNumberString = (length: number) =>
  Math.floor(Math.random() * Math.pow(10, length))
    .toString()
    .padStart(length, "0");

const PaymentPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const state = location.state as PaymentState;

  const [mpEmail, setMpEmail] = useState("");
  const [transferName, setTransferName] = useState("");
  const [transferCuenta, setTransferCuenta] = useState("");
  const [transferReferencia, setTransferReferencia] = useState("");
  const [cardNumber, setCardNumber] = useState(randomNumberString(16));
  const [cardCCV, setCardCCV] = useState(randomNumberString(3));
  const [cardExp, setCardExp] = useState(`${randomNumberString(2)}/${randomNumberString(2)}`);

  useEffect(() => {
    if (state.metodoPago === "transferencia") {
      setTransferCuenta(randomNumberString(14));
      setTransferReferencia(randomNumberString(6));
    }
  }, [state.metodoPago]);

  if (!state) return <Typography>No se encontró información del pedido</Typography>;

  const envioFinal = state.metodoEntrega === "retiro" ? 0 : state.envio;
  const totalFinal = state.subtotal + envioFinal;

  const handleConfirm = () => {
    const confirmationState: PaymentState = {
      ...state,
      envio: envioFinal,
      total: totalFinal,
      email: mpEmail || state.email,
    };

    clearCart(); 

    navigate("/checkout/confirmacion", { state: confirmationState });
  };

  return (
    <Box p={3} maxWidth={600} mx="auto">
      <Typography variant="h5" gutterBottom>Pago - {state.metodoPago}</Typography>

      <Typography mb={1}>
        Subtotal: ${state.subtotal.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </Typography>
      <Typography mb={1}>
        Envío: ${envioFinal.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </Typography>
      <Typography mb={2} fontWeight="bold">
        Total a pagar: ${totalFinal.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </Typography>

      {state.metodoPago === "mercadopago" && (
        <TextField
          fullWidth
          label="Correo asociado a Mercado Pago"
          margin="normal"
          value={mpEmail}
          onChange={(e) => setMpEmail(e.target.value)}
        />
      )}

      {state.metodoPago === "tarjeta" && (
        <>
          <TextField fullWidth label="Número de tarjeta" margin="normal" value={cardNumber} />
          <TextField fullWidth label="CCV" margin="normal" value={cardCCV} />
          <TextField fullWidth label="Expiración" margin="normal" value={cardExp} />
        </>
      )}

      {state.metodoPago === "transferencia" && (
        <>
          <TextField
            fullWidth
            label="Nombre del titular"
            margin="normal"
            value={transferName}
            onChange={(e) => setTransferName(e.target.value)}
          />
          <TextField
            fullWidth
            label="Número de cuenta"
            margin="normal"
            value={transferCuenta}
            InputProps={{ readOnly: true }}
          />
          <TextField
            fullWidth
            label="Referencia"
            margin="normal"
            value={transferReferencia}
            InputProps={{ readOnly: true }}
          />
        </>
      )}

      <Button fullWidth variant="contained" sx={{ mt: 2 }} onClick={handleConfirm}>
        Confirmar Pedido
      </Button>
      <Button fullWidth variant="outlined" sx={{ mt: 1 }} onClick={() => navigate("/checkout")}>
        Volver
      </Button>
    </Box>
  );
};

export default PaymentPage;
