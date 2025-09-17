import React, { useState, useEffect } from "react";
import {
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
  Chip,
  TextField,
  Tabs,
  Tab
} from "@mui/material";
import { AddShoppingCart } from "@mui/icons-material";
import { Producto } from "../../types/Product";
import { useProductos } from "../../hooks/useProductos";

interface ProductGridProps {
  categoriaFiltro?: string;
}

const ProductGrid: React.FC<ProductGridProps> = ({ categoriaFiltro }) => {
  const [categoriaActiva, setCategoriaActiva] = useState("Todos");
  const [terminoBusqueda, setTerminoBusqueda] = useState("");
  const { productos, loading, error } = useProductos();
  const [productosFiltrados, setProductosFiltrados] = useState<Producto[]>([]);

  const categorias = [
    "Todos",
    "Cables",
    "Iluminación",
    "Herramientas",
    "Interruptores",
    "Tomacorrientes"
  ];

  useEffect(() => {
    let filtered = productos;
    
    // Aplicar filtro de categoría
    if (categoriaFiltro && categoriaFiltro !== "Todos") {
      filtered = filtered.filter(producto => 
        producto.categoria === categoriaFiltro
      );
    } else if (categoriaActiva !== "Todos") {
      filtered = filtered.filter(producto => 
        producto.categoria === categoriaActiva
      );
    }
    
    // Aplicar filtro de búsqueda
    if (terminoBusqueda) {
      filtered = filtered.filter(producto =>
        producto.nombre.toLowerCase().includes(terminoBusqueda.toLowerCase()) ||
        producto.descripcion.toLowerCase().includes(terminoBusqueda.toLowerCase())
      );
    }
    
    setProductosFiltrados(filtered);
  }, [productos, categoriaActiva, terminoBusqueda, categoriaFiltro]);

  const handleAgregarCarrito = (producto: Producto) => {
    // Lógica para agregar al carrito
    console.log("Agregando al carrito:", producto);
  };

  if (loading) return <Typography>Cargando productos...</Typography>;
  if (error) return <Typography color="error">Error: {error}</Typography>;

  return (
    <Box sx={{ p: 2 }}>
      <TextField
        fullWidth
        placeholder="Buscar productos eléctricos..."
        value={terminoBusqueda}
        onChange={(e) => setTerminoBusqueda(e.target.value)}
        sx={{ mb: 2 }}
      />
      
      <Tabs
        value={categoriaActiva}
        onChange={(_, newValue) => setCategoriaActiva(newValue)}
        sx={{ mb: 3 }}
        variant="scrollable"
        scrollButtons="auto"
      >
        {categorias.map(cat => (
          <Tab key={cat} label={cat} value={cat} />
        ))}
      </Tabs>

      <Grid container spacing={3}>
        {productosFiltrados.map((producto) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={producto.id_producto}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardMedia
                component="img"
                height="140"
                image={producto.imagen_url || "/placeholder-product.jpg"}
                alt={producto.nombre}
                sx={{ objectFit: "contain", p: 1 }}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h6" component="h3">
                  {producto.nombre}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  {producto.descripcion}
                </Typography>
                <Chip 
                  label={producto.categoria} 
                  size="small" 
                  color="primary" 
                  variant="outlined"
                  sx={{ mb: 1 }}
                />
                <Typography variant="h6" color="primary" sx={{ mt: 1 }}>
                  ${producto.precio}
                </Typography>
              </CardContent>
              <Box sx={{ p: 1, mt: 'auto' }}>
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<AddShoppingCart />}
                  onClick={() => handleAgregarCarrito(producto)}
                >
                  Agregar
                </Button>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
      
      {productosFiltrados.length === 0 && (
        <Typography align="center" sx={{ mt: 4 }}>
          No se encontraron productos
        </Typography>
      )}
    </Box>
  );
};

export default ProductGrid;