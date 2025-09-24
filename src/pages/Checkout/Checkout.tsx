import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  Button,
  Divider,
  FormControl,
  InputLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Paper,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import API from "../../api/api";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";

type CartDetail = {
  id_producto: number;
  producto_nombre: string;
  cantidad: number;
  precio_unitario: number;
  subtotal_linea: number;
  imagen_url?: string;
};

type Cart = {
  id_pedido: number;
  id_usuario: number;
  subtotal: number;
  costo_envio: number;
  total: number;
  detalles: CartDetail[];
};

const formatMoney = (v: number) =>
  Number(v ?? 0).toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const Checkout: React.FC = () => {
  const { user, token, loading: authLoading } = useAuth();
  const { setCartCount } = useCart();
  const navigate = useNavigate();

  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);

  const [nombre, setNombre] = useState("");
  const [direccion, setDireccion] = useState("");
  const [ciudad, setCiudad] = useState("");
  const [codigoPostal, setCodigoPostal] = useState("");
  const [telefono, setTelefono] = useState("");

  const [metodoEntrega, setMetodoEntrega] = useState<"domicilio" | "retiro">("domicilio");
  const [metodoPago, setMetodoPago] = useState<"mercadopago" | "transferencia" | "tarjeta" | "efectivo">("mercadopago");

  const fetchCart = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await API.get(`/order/usuario/${user.id}/carrito`);
      if (res.data) {
        setCart(res.data);
        setNombre(res.data.nombre_completo ?? `${(user as any)?.nombre ?? ""} ${(user as any)?.apellido ?? ""}`.trim());
        setDireccion(res.data.direccion_entrega ?? "");
        setCiudad(res.data.ciudad_entrega ?? "");
        setCodigoPostal(res.data.codigo_postal_entrega ?? "");
        setTelefono(res.data.telefono_contacto ?? "");
        const totalCantidad = res.data.detalles?.reduce((acc: number, d: any) => acc + d.cantidad, 0);
        setCartCount(totalCantidad || 0);
      } else {
        setCart(null);
        setCartCount(0);
      }
    } catch (err) {
      console.error("Error fetching cart:", err);
      setCart(null);
      setCartCount(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading) {
      if (!user || !token) {
        navigate("/login");
        return;
      }
      fetchCart();
    }
  }, [user, token, authLoading]);

  const subtotal = cart?.detalles?.reduce((acc, d) => acc + (Number(d.subtotal_linea) || 0), 0) ?? 0;
  const shippingCost = metodoEntrega === "domicilio" ? Math.max(subtotal * 0.1, 500) : 0;
  const total = subtotal + shippingCost;

  const handleFinish = () => {
    if (!user) return;
    if (!nombre) {
      alert("Ingrese el nombre completo");
      return;
    }
    if (metodoEntrega === "domicilio" && (!direccion || !ciudad || !codigoPostal || !telefono)) {
      alert("Complete los datos de envío (dirección, ciudad, código postal y teléfono).");
      return;
    }

    const envioFinal = metodoEntrega === "domicilio" ? shippingCost : 0;
    const totalFinal = subtotal + envioFinal;

    navigate("/checkout/pago", {
      state: {
        metodoPago,
        metodoEntrega,            // <-- agregado
        subtotal: Number(subtotal.toFixed(2)),
        envio: Number(envioFinal.toFixed(2)),
        total: Number(totalFinal.toFixed(2)),
        nombre,
        direccion,
        ciudad,
        codigoPostal,
        telefono,
        cartItems: cart?.detalles?.map(d => ({
          producto_nombre: d.producto_nombre,
          cantidad: d.cantidad,
          precio_unitario: Number(d.precio_unitario ?? 0),
        })) || [],
      },
    });
  };


  const handleCancel = () => {
    setCart(null);
    setCartCount(0);
    navigate("/products");
  };

  if (authLoading || loading) {
    return (
      <Box display="flex" justifyContent="center" mt={6}>
        <CircularProgress />
      </Box>
    );
  }

  if (!cart || !cart.detalles || cart.detalles.length === 0) {
    return (
      <Box p={3}>
        <Typography variant="h5">No hay productos en el carrito</Typography>
        <Typography sx={{ mt: 1 }}>Agrega productos al carrito antes de finalizar la compra.</Typography>
        <Button variant="contained" sx={{ mt: 2 }} onClick={() => navigate("/products")}>Seguir Comprando</Button>
      </Box>
    );
  }

  return (
    <Box display="flex" gap={3} flexWrap="wrap">
      {/* Datos de envío */}
      <Paper sx={{ flex: 1, p: 3, minWidth: 320 }}>
        <Typography variant="h6" gutterBottom>Datos de Envío</Typography>
        <TextField fullWidth label="Nombre completo" margin="normal" value={nombre} onChange={(e) => setNombre(e.target.value)} />
        <TextField fullWidth label="Dirección" margin="normal" value={direccion} onChange={(e) => setDireccion(e.target.value)} />
        <TextField fullWidth label="Ciudad" margin="normal" value={ciudad} onChange={(e) => setCiudad(e.target.value)} />
        <TextField fullWidth label="Código Postal" margin="normal" value={codigoPostal} onChange={(e) => setCodigoPostal(e.target.value)} />
        <TextField fullWidth label="Teléfono" margin="normal" value={telefono} onChange={(e) => setTelefono(e.target.value)} />
      </Paper>

      {/* Método de entrega y pago */}
      <Paper sx={{ flex: 1, p: 3, minWidth: 320 }}>
        <Typography variant="h6" gutterBottom>Método de Entrega</Typography>
        <FormControl fullWidth margin="normal">
          <InputLabel id="shipping-label">Seleccione envío</InputLabel>
          <Select
            labelId="shipping-label"
            value={metodoEntrega}
            onChange={(e) => setMetodoEntrega(e.target.value as any)}
          >
            <MenuItem value="domicilio">Envío a domicilio - ${formatMoney(shippingCost)}</MenuItem>
            <MenuItem value="retiro">Retiro en local - $0</MenuItem>
          </Select>
        </FormControl>

        <Divider sx={{ my: 2 }} />

        <Typography variant="h6" gutterBottom>Método de Pago</Typography>
        <RadioGroup value={metodoPago} onChange={(e) => setMetodoPago(e.target.value as any)}>
          <FormControlLabel value="mercadopago" control={<Radio />} label="Mercado Pago" />
          <FormControlLabel value="transferencia" control={<Radio />} label="Transferencia" />
          <FormControlLabel value="tarjeta" control={<Radio />} label="Tarjeta" />
          <FormControlLabel value="efectivo" control={<Radio />} label="Efectivo" />
        </RadioGroup>
      </Paper>

      {/* Resumen del pedido */}
      <Paper sx={{ width: "100%", p: 3 }}>
        <Typography variant="h6" gutterBottom>Resumen del Pedido</Typography>

        <List>
          {cart.detalles.map((d) => (
            <ListItem key={d.id_producto} divider disableGutters>
              <ListItemText
                primary={`${d.cantidad} x ${d.producto_nombre}`}
                secondary={`$${formatMoney(Number(d.precio_unitario ?? 0))} — Subtotal: $${formatMoney(Number(d.subtotal_linea ?? 0))}`}
              />
              <Typography sx={{ ml: 2 }}>${formatMoney(Number(d.subtotal_linea ?? 0))}</Typography>
            </ListItem>
          ))}
        </List>

        <Divider sx={{ my: 2 }} />

        <Box display="flex" justifyContent="space-between" mb={1}>
          <Typography>Subtotal:</Typography>
          <Typography>${formatMoney(subtotal)}</Typography>
        </Box>

        <Box display="flex" justifyContent="space-between" mb={1}>
          <Typography>Envío:</Typography>
          <Typography>${formatMoney(shippingCost)}</Typography>
        </Box>

        <Box display="flex" justifyContent="space-between" fontWeight="bold" mb={2}>
          <Typography>Total:</Typography>
          <Typography>${formatMoney(total)}</Typography>
        </Box>

        <Button fullWidth variant="contained" color="primary" onClick={handleFinish}>
          Continuar al pago
        </Button>

        <Button fullWidth variant="outlined" color="error" sx={{ mt: 1 }} onClick={handleCancel}>
          Cancelar Compra
        </Button>
      </Paper>
    </Box>
  );
};

export default Checkout;
