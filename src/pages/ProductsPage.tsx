import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  CardMedia,
  Grid,
  TextField,
  Button,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  Alert,
  Snackbar
} from "@mui/material";
import API from "../api/api";
import { useAuth } from "../context/AuthContext";
import { addToCart } from "../hooks/cartService";
import { useCart } from "../context/CartContext";
import PaginationComponent from "../utils/PaginationComponent"; 

interface Producto {
  id_producto: number;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  categoria: string;
  imagen_url?: string;
}

const categorias = ["Todos", "Cables", "Iluminación", "Herramientas", "Interruptores", "Tomacorrientes", "Baterías", "Automatización"];

const ProductsPage: React.FC = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [search, setSearch] = useState("");
  const [categoria, setCategoria] = useState("Todos");
  const { user, token, loading } = useAuth();
  const [isAuthenticated, setIsAuthenticated] = useState(!!user && !!token);
  const { setCartCount } = useCart();

  const [selectedProduct, setSelectedProduct] = useState<Producto | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const [snackbar, setSnackbar] = useState<{ open: boolean, message: string, severity: "success" | "error" | "info" | "warning" }>({ open: false, message: "", severity: "success" });

  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 6;

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
    setIsAuthenticated(!!user && !!token);
  }, [user, token]);

  const updateProductStock = (productId: number, nuevaCantidad: number) => {
    setProductos(prev =>
      prev.map(p => p.id_producto === productId ? { ...p, stock: nuevaCantidad } : p)
    );
  };

  const filteredProducts = productos.filter(p =>
    (categoria === "Todos" || p.categoria === categoria) &&
    (p.nombre.toLowerCase().includes(search.toLowerCase()) || p.descripcion.toLowerCase().includes(search.toLowerCase()))
  );

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  const handleAddToCart = async (producto: Producto) => {
    if (!isAuthenticated || !user || !token) {
      setSnackbar({ open: true, message: "Debes iniciar sesión para agregar productos", severity: "info" });
      return;
    }
    if (producto.stock === 0) {
      setSnackbar({ open: true, message: "No hay stock disponible", severity: "error" });
      return;
    }
    try {
      await addToCart(user.id, producto.id_producto, 1, token);
      const res = await API.patch(`/products/${producto.id_producto}/reduce-stock`, { cantidad: 1 });
      setCartCount(prev => prev + 1);
      updateProductStock(producto.id_producto, res.data.stock);
      setSnackbar({ open: true, message: `${producto.nombre} agregado al carrito ✅`, severity: "success" });
    } catch (err: any) {
      console.error("Error agregando al carrito:", err);
      setSnackbar({ open: true, message: err.response?.data?.message || "No se pudo agregar el producto", severity: "error" });
    }
  };

  const openModal = (producto: Producto) => {
    setSelectedProduct(producto);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedProduct(null);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [search, categoria]);

  if (loading) return <Box display="flex" justifyContent="center" mt={5}><CircularProgress /></Box>;

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
        {currentProducts.map(producto => (
          <Grid item xs={12} sm={6} md={4} key={producto.id_producto}>
            <Card sx={{ display: "flex", flexDirection: "column", height: "100%", justifyContent: "space-between" }}>
              <CardMedia
                component="img"
                height={180}
                image={producto.imagen_url || "/placeholder.png"}
                alt={producto.nombre}
                sx={{ objectFit: "contain", bgcolor: "#f5f5f5", p: 1, width: "100%", maxHeight: 180 }}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" noWrap sx={{ textOverflow: "ellipsis", overflow: "hidden", mb: 0.5 }}>
                  {producto.nombre.length > 20 ? producto.nombre.substring(0, 20) + "..." : producto.nombre}
                </Typography>
                <Typography variant="subtitle1" color="green" fontWeight="bold">${producto.precio}</Typography>
                <Typography variant="caption" color={producto.stock > 0 ? "text.secondary" : "error"}>
                  {producto.stock > 0 ? `Stock: ${producto.stock}` : "Agotado"}
                </Typography>
              </CardContent>
              <CardActions sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                <Button fullWidth variant="outlined" color="secondary" onClick={() => openModal(producto)}>
                  Ver detalle
                </Button>
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  disabled={!isAuthenticated || producto.stock === 0}
                  onClick={() => handleAddToCart(producto)}
                >
                  {!isAuthenticated ? "Inicia sesión" : producto.stock === 0 ? "Sin stock" : "+ Agregar"}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <PaginationComponent
        currentPage={currentPage}
        totalItems={filteredProducts.length}
        itemsPerPage={productsPerPage}
        onPageChange={setCurrentPage}
        itemsName="productos"
      />

      {filteredProducts.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="body1" color="textSecondary">
            No se encontraron productos
          </Typography>
        </Box>
      )}

      <Dialog open={modalOpen} onClose={closeModal} maxWidth="sm" fullWidth>
        {selectedProduct && (
          <>
            <DialogTitle>{selectedProduct.nombre}</DialogTitle>
            <DialogContent>
              <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <img src={selectedProduct.imagen_url || "/placeholder.png"} alt={selectedProduct.nombre} style={{ maxHeight: 250, objectFit: "contain", marginBottom: 16 }} />
                <Typography variant="body1" gutterBottom>{selectedProduct.descripcion}</Typography>
                <Typography variant="h6" color="green" gutterBottom>${selectedProduct.precio}</Typography>
                <Typography variant="subtitle2" color={selectedProduct.stock > 0 ? "text.secondary" : "error"}>
                  {selectedProduct.stock > 0 ? `Stock: ${selectedProduct.stock}` : "Agotado"}
                </Typography>
              </Box>
            </DialogContent>
          </>
        )}
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ProductsPage;
