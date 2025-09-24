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
} from "@mui/material";
import API from "../api/api";

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
  const [loading, setLoading] = useState(true);

  const [selectedProduct, setSelectedProduct] = useState<Producto | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const res = await API.get("/products");
        setProductos(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProductos();
  }, []);

  const filteredProducts = productos.filter(p =>
    (categoria === "Todos" || p.categoria === categoria) &&
    (p.nombre.toLowerCase().includes(search.toLowerCase()) || p.descripcion.toLowerCase().includes(search.toLowerCase()))
  );

  const openModal = (producto: Producto) => {
    setSelectedProduct(producto);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedProduct(null);
  };

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
        {filteredProducts.map(producto => (
          <Grid item xs={12} sm={6} md={4} key={producto.id_producto}>
            <Card sx={{ display: "flex", flexDirection: "column", height: "100%", justifyContent: "space-between" }}>
              <CardMedia
                component="img"
                height="180"
                image={producto.imagen_url || "/placeholder.png"}
                alt={producto.nombre}
                sx={{ objectFit: "contain", bgcolor: "#f5f5f5", p: 1 }}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" noWrap sx={{ textOverflow: "ellipsis", overflow: "hidden", mb: 0.5 }}>
                  {producto.nombre}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {producto.descripcion.length > 50 ? producto.descripcion.substring(0, 50) + "..." : producto.descripcion}
                </Typography>
                <Typography variant="subtitle1" color="green" fontWeight="bold">
                  ${producto.precio}
                </Typography>
                <Typography variant="caption" color={producto.stock > 0 ? "text.secondary" : "error"}>
                  {producto.stock > 0 ? `Stock: ${producto.stock}` : "Agotado"}
                </Typography>
              </CardContent>
              <CardActions>
                <Button fullWidth variant="outlined" onClick={() => openModal(producto)}>
                  Ver detalle
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Modal */}
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
    </Box>
  );
};

export default ProductsPage;
