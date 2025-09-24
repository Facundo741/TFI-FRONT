import React, { useState, useEffect } from "react";
import {
  Box, Typography, List, ListItem, ListItemText,
  CircularProgress, IconButton, Button, Divider
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
  const [loading, setLoading] = useState(true);
  const { setCartCount } = useCart();
  const navigate = useNavigate();

  const fetchCart = async () => {
    if (!user || !token) {
      setCartItems([]);
      setLoading(false);
      return;
    }
    try {
      const data = await getCart(user.id, token);
      setCartItems(data?.detalles ?? []);
      const totalCantidad = data?.detalles?.reduce((acc: number, item: any) => acc + item.cantidad, 0);
      setCartCount(totalCantidad || 0);
    } catch (err) {
      console.error("Error cargando carrito:", err);
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (!authLoading) fetchCart(); }, [user, token, authLoading]);

  const subtotal = cartItems.reduce((acc, item) => acc + item.cantidad * Number(item.precio_unitario ?? 0), 0);
  const envio = subtotal > 0 ? Math.max(subtotal * 0.1, 500) : 0;
  const total = subtotal + envio;

  const handleIncrease = async (productId: number, currentQuantity: number) => {
    if (!user || !token) return;
    try {
      const nuevaCantidad = currentQuantity + 1;
      await updateCartQuantity(user.id, productId, nuevaCantidad, token);
      await API.patch(`/products/${productId}/reduce-stock`, { cantidad: 1 });
      setCartItems(prev => prev.map(item => item.id_producto === productId ? { ...item, cantidad: nuevaCantidad } : item));
      setCartCount(prev => prev + 1);
    } catch (err) { console.error(err); }
  };

  const handleDecrease = async (productId: number, currentQuantity: number) => {
    if (!user || !token) return;
    try {
      const nuevaCantidad = currentQuantity - 1;
      if (nuevaCantidad >= 1) {
        await updateCartQuantity(user.id, productId, nuevaCantidad, token);
        await API.patch(`/products/${productId}/increase-stock`, { cantidad: 1 });
        setCartItems(prev => prev.map(item => item.id_producto === productId ? { ...item, cantidad: nuevaCantidad } : item));
        setCartCount(prev => Math.max(prev - 1, 0));
      } else {
        await removeFromCart(user.id, productId, token);
        await API.patch(`/products/${productId}/increase-stock`, { cantidad: currentQuantity });
        setCartItems(prev => prev.filter(item => item.id_producto !== productId));
        setCartCount(prev => Math.max(prev - currentQuantity, 0));
      }
    } catch (err) { console.error(err); }
  };

  const handleRemove = async (productId: number, currentQuantity: number) => {
    if (!user || !token) return;
    try {
      await removeFromCart(user.id, productId, token);
      await API.patch(`/products/${productId}/increase-stock`, { cantidad: currentQuantity });
      setCartItems(prev => prev.filter(item => item.id_producto !== productId));
      setCartCount(prev => Math.max(prev - currentQuantity, 0));
    } catch (err) { console.error(err); }
  };

  const handleContinueShopping = () => navigate("/products");
  const handleCheckout = () => navigate("/checkout");

  if (authLoading || loading) return <Box display="flex" justifyContent="center" mt={5}><CircularProgress /></Box>;
  if (!cartItems || cartItems.length === 0)
    return (
      <Box mt={5} textAlign="center">
        <Typography variant="h5">Carrito vacío</Typography>
        <Button variant="contained" onClick={handleContinueShopping} sx={{ mt: 2 }}>Seguir Comprando</Button>
      </Box>
    );

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Mi Carrito</Typography>
      <List>
        {cartItems.map(item => (
          <ListItem key={item.id_producto} secondaryAction={
            <Box display="flex" alignItems="center">
              <IconButton onClick={() => handleDecrease(item.id_producto, item.cantidad)} size="small"><Remove /></IconButton>
              <Typography variant="body1" mx={1}>{item.cantidad}</Typography>
              <IconButton onClick={() => handleIncrease(item.id_producto, item.cantidad)} size="small"><Add /></IconButton>
              <IconButton onClick={() => handleRemove(item.id_producto, item.cantidad)} color="error" size="small"><Delete /></IconButton>
            </Box>
          }>
            <ListItemText
              primary={item.producto_nombre}
              secondary={`Precio unitario: $${Number(item.precio_unitario).toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} | Subtotal: $${(item.cantidad * Number(item.precio_unitario)).toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
            />
          </ListItem>
        ))}
      </List>
      <Box sx={{ mt: 3, p: 2, border: '1px solid #ccc', borderRadius: 1 }}>
        <Typography variant="h6">Resumen de Compra</Typography>
        <Box display="flex" justifyContent="space-between" mb={1}><Typography>Subtotal:</Typography><Typography>${subtotal.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Typography></Box>
        <Box display="flex" justifyContent="space-between" mb={1}><Typography>Envío:</Typography><Typography>${envio.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Typography></Box>
        <Box display="flex" justifyContent="space-between" fontWeight="bold" mb={2}><Typography>Total:</Typography><Typography>${total.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Typography></Box>
        <Box display="flex" gap={2}>
          <Button variant="outlined" onClick={handleContinueShopping} fullWidth>Seguir Comprando</Button>
          <Button variant="contained" onClick={handleCheckout} fullWidth>Finalizar Compra</Button>
        </Box>
      </Box>
    </Box>
  );
};

export default CartPage;
