import React, { useState, useEffect } from "react";
import { Box, Typography, Card, CardContent, CardActions, CardMedia, Grid, TextField, Button, CircularProgress } from "@mui/material";
import API from "../api/api";
import { useAuth } from "../context/AuthContext";
import { addToCart } from "../hooks/cartService";
import { useCart } from "../context/CartContext";

interface Producto {
  id_producto: number;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  categoria: string;
  imagen_url?: string;
}

const categorias = ["Todos", "Cables", "Iluminación", "Herramientas", "Interruptores", "Tomacorrientes"];



const ProductsPage: React.FC = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [search, setSearch] = useState("");
  const [categoria, setCategoria] = useState("Todos");
  const { user, token, loading } = useAuth();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const res = await API.get("/products");
        setProductos(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProductos();
  }, []);

  useEffect(() => {
    if (!loading) {
      setIsAuthenticated(!!user && !!token);
    }
  }, [loading, user, token]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <CircularProgress />
      </Box>
    );
  }

    if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <CircularProgress />
      </Box>
    );
  }
  const { setCartCount } = useCart();

  const updateProductStock = (productId: number, nuevaCantidad: number) => {
  setProductos(prev =>
    prev.map(p => p.id_producto === productId ? { ...p, stock: nuevaCantidad } : p)
  );
};

  const filteredProducts = productos.filter(p =>
    (categoria === "Todos" || p.categoria === categoria) &&
    (p.nombre.toLowerCase().includes(search.toLowerCase()) || p.descripcion.toLowerCase().includes(search.toLowerCase()))
  );

  const handleAddToCart = async (producto: Producto) => {
    if (!isAuthenticated || !user || !token) {
      alert("Debes iniciar sesión para agregar productos al carrito");
      return;
    }

    try {
      await addToCart(user.id, producto.id_producto, 1, token);

      const res = await API.patch(`/products/${producto.id_producto}/reduce-stock`, { cantidad: 1 });
      setCartCount(prev => prev + 1);

      updateProductStock(producto.id_producto, res.data.stock);

      alert(`${producto.nombre} agregado al carrito ✅`);
    } catch (err: any) {
      console.error("Error agregando al carrito:", err);
      alert(err.response?.data?.message || "No se pudo agregar el producto al carrito");
    }
  };

  


  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Productos Eléctricos</Typography>

      <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
        <TextField
          placeholder="Buscar productos eléctricos..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          fullWidth
        />
        {categorias.map(cat => (
          <Button
            key={cat}
            variant={categoria === cat ? "contained" : "outlined"}
            onClick={() => setCategoria(cat)}
          >
            {cat}
          </Button>
        ))}
      </Box>

      <Grid container spacing={3}>
        {filteredProducts.map(producto => (
          <Grid item xs={12} sm={6} md={4} key={producto.id_producto}>
            <Card>
              <CardMedia
                component="img"
                height="140"
                image={producto.imagen_url || "/placeholder.png"}
                alt={producto.nombre}
              />
              <CardContent>
                <Typography variant="h6">{producto.nombre}</Typography>
                <Typography variant="body2" color="text.secondary">{producto.descripcion}</Typography>
                <Typography variant="subtitle1" color="green">${producto.precio}</Typography>
              </CardContent>
              <CardActions>
                {!user || !token ? (
                  <Button fullWidth variant="contained" disabled>
                    Inicia sesión para agregar
                  </Button>
                ) : (
                  <Button fullWidth variant="contained" onClick={() => handleAddToCart(producto)}>
                    + Agregar
                  </Button>
                )}
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ProductsPage;
