import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  IconButton,
  Button,
  Divider,
} from "@mui/material";
import { Add, Remove, Delete } from "@mui/icons-material";
import { useAuth } from "../context/AuthContext";
import { getCart, updateCartQuantity, removeFromCart } from "../hooks/cartService";
import API from "../api/api";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

const CartPage: React.FC = () => {
  const { user, token, loading: authLoading } = useAuth();
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [cartData, setCartData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { cartCount, setCartCount } = useCart();
  const navigate = useNavigate();

  const fetchCart = async () => {
    if (!user || !token) {
      setCartItems([]);
      setLoading(false);
      return;
    }
    try {
      const data = await getCart(user.id, token);
      setCartData(data);
      setCartItems(data?.detalles ?? []);
      
      const totalCantidad = data?.detalles?.reduce(
        (acc: number, item: any) => acc + item.cantidad,
        0
      );
      setCartCount(totalCantidad || 0);
    } catch (err) {
      console.error("Error cargando carrito:", err);
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading) fetchCart();
  }, [user, token, authLoading]);

  const handleIncrease = async (productId: number, currentQuantity: number) => {
    if (!user || !token) return;

    try {
      const nuevaCantidad = currentQuantity + 1;
      await updateCartQuantity(user.id, productId, nuevaCantidad, token);
      await API.patch(`/products/${productId}/reduce-stock`, { cantidad: 1 });
      setCartCount(prev => prev + 1);
      fetchCart();
    } catch (err) {
      console.error("Error aumentando cantidad:", err);
    }
  };

  const handleDecrease = async (productId: number, currentQuantity: number) => {
    if (!user || !token) return;

    try {
      const nuevaCantidad = currentQuantity - 1;

      if (nuevaCantidad >= 1) {
        await updateCartQuantity(user.id, productId, nuevaCantidad, token);
        await API.patch(`/products/${productId}/increase-stock`, { cantidad: 1 });
        setCartCount(prev => Math.max(prev - 1, 0));
      } else {
        await removeFromCart(user.id, productId, token);
        await API.patch(`/products/${productId}/increase-stock`, { cantidad: currentQuantity });
        setCartCount(prev => Math.max(prev - currentQuantity, 0));
      }

      fetchCart();
    } catch (err) {
      console.error("Error disminuyendo cantidad:", err);
    }
  };

  const handleRemove = async (productId: number, currentQuantity: number) => {
    if (!user || !token) return;

    try {
      await removeFromCart(user.id, productId, token);
      await API.patch(`/products/${productId}/increase-stock`, { cantidad: currentQuantity });
      setCartCount(prev => Math.max(prev - currentQuantity, 0));
      fetchCart();
    } catch (err) {
      console.error("Error eliminando producto del carrito:", err);
    }
  };

  const handleContinueShopping = () => navigate("/products");
  const handleCheckout = () => navigate("/checkout");

  if (authLoading || loading) {
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <CircularProgress />
      </Box>
    );
  }

  if (!cartItems || cartItems.length === 0) {
    return (
      <Box mt={5} textAlign="center">
        <Typography variant="h5" gutterBottom>
          Carrito vacío
        </Typography>
        <Button variant="contained" onClick={handleContinueShopping} sx={{ mt: 2 }}>
          Seguir Comprando
        </Button>
      </Box>
    );
  }

  // Convertir valores a número y asegurar solo 2 decimales
  const subtotal = Number(cartData?.subtotal) || 0;
  const envio = Number(cartData?.costo_envio) || 500;
  const total = subtotal + envio;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Mi Carrito</Typography>

      <List>
        {cartItems.map(item => (
          <ListItem
            key={item.id_producto}
            secondaryAction={
              <Box display="flex" alignItems="center">
                <IconButton onClick={() => handleDecrease(item.id_producto, item.cantidad)} size="small">
                  <Remove />
                </IconButton>
                <Typography variant="body1" mx={1}>{item.cantidad}</Typography>
                <IconButton onClick={() => handleIncrease(item.id_producto, item.cantidad)} size="small">
                  <Add />
                </IconButton>
                <IconButton onClick={() => handleRemove(item.id_producto, item.cantidad)} color="error" size="small">
                  <Delete />
                </IconButton>
              </Box>
            }
          >
            <ListItemText
              primary={item.producto_nombre}
              secondary={`Precio unitario: $${Number(item.precio_unitario).toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} | Subtotal: $${Number(item.subtotal_linea).toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
            />
          </ListItem>
        ))}
      </List>

      <Box sx={{ mt: 3, p: 2, border: '1px solid #ccc', borderRadius: 1 }}>
        <Typography variant="h6" gutterBottom>Resumen de Compra</Typography>

        <Box sx={{ mb: 2 }}>
          <Box display="flex" justifyContent="space-between" mb={1}>
            <Typography>Subtotal:</Typography>
            <Typography>${subtotal.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Typography>
          </Box>

          <Box display="flex" justifyContent="space-between" mb={1}>
            <Typography>Envío:</Typography>
            <Typography>${envio.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Typography>
          </Box>

          <Divider sx={{ my: 1 }} />

          <Box display="flex" justifyContent="space-between">
            <Typography variant="h6">TOTAL:</Typography>
            <Typography variant="h6">${total.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Typography>
          </Box>
        </Box>

        <Box display="flex" gap={2} mt={2}>
          <Button variant="outlined" onClick={handleContinueShopping} fullWidth>Seguir Comprando</Button>
          <Button variant="contained" onClick={handleCheckout} fullWidth>Finalizar Compra</Button>
        </Box>
      </Box>
    </Box>
  );
};

export default CartPage;
