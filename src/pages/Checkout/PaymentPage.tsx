import React, { useState, useEffect } from "react";
import { Box, Typography, Button, TextField } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import API from "../../api/api"; 

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
  const { user } = useAuth(); 
  const state = location.state as PaymentState;

  const [mpEmail, setMpEmail] = useState("");
  const [transferName, setTransferName] = useState("");
  const [transferCuenta, setTransferCuenta] = useState("");
  const [transferReferencia, setTransferReferencia] = useState("");
  const [cardNumber, setCardNumber] = useState(randomNumberString(16));
  const [cardCCV, setCardCCV] = useState(randomNumberString(3));
  const [cardExp, setCardExp] = useState(`${randomNumberString(2)}/${randomNumberString(2)}`);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (state?.metodoPago === "transferencia") {
      setTransferCuenta(randomNumberString(14));
      setTransferReferencia(randomNumberString(6));
    }
  }, [state?.metodoPago]);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  if (!state) return <Typography>No se encontró información del pedido</Typography>;
  if (!user) return null; 

  const envioFinal = state.metodoEntrega === "retiro" ? 0 : state.envio;
  const totalFinal = state.subtotal + envioFinal;

  const handleConfirm = async () => {
    setLoading(true);
    try {
      const pedidoData = {
          metodo_pago: state.metodoPago,
          metodo_entrega: state.metodoEntrega,
          direccion_entrega: state.direccion,
          ciudad_entrega: state.ciudad,
          codigo_postal_entrega: state.codigoPostal,
          telefono_contacto: state.telefono,
          nombre_completo: state.nombre,
          productos: state.cartItems.map(item => ({
            id_producto: item.id_producto,
            cantidad: item.cantidad,
          })),
      };

      const res = await API.post(`/order/usuario/${user.id_usuario}/carrito/confirmar`, pedidoData);


      const confirmationState: PaymentState & { id_pedido: number } = {
        ...state,
        envio: envioFinal,
        total: totalFinal,
        id_pedido: res.data.id_pedido,
        email: mpEmail || state.email,
      };

      clearCart();
      navigate("/checkout/confirmacion", { state: confirmationState });
    } catch (err) {
      console.error("Error al crear el pedido:", err);
      alert("No se pudo procesar tu pedido. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
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

      <Button
        fullWidth
        variant="contained"
        sx={{ mt: 2 }}
        onClick={handleConfirm}
        disabled={loading}
      >
        {loading ? "Procesando..." : "Confirmar Pedido"}
      </Button>

      <Button fullWidth variant="outlined" sx={{ mt: 1 }} onClick={() => navigate("/checkout")}>
        Volver
      </Button>
    </Box>
  );
};

export default PaymentPage;
