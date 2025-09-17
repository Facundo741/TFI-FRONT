import React, { useState, useEffect } from "react";
import { Box, TextField, Button, MenuItem, Typography, Card, CardContent, CardActions, CardMedia, Grid } from "@mui/material";
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

const categorias = ["Todos", "Cables", "Iluminación", "Herramientas", "Interruptores", "Tomacorrientes"];

const ProductsPage: React.FC = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [search, setSearch] = useState("");
  const [categoria, setCategoria] = useState("Todos");

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

  const filteredProducts = productos.filter(p => 
    (categoria === "Todos" || p.categoria === categoria) &&
    (p.nombre.toLowerCase().includes(search.toLowerCase()) || p.descripcion.toLowerCase().includes(search.toLowerCase()))
  );

  const handleAddToCart = (producto: Producto) => {

    console.log("Agregar al carrito:", producto);
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
                <Button fullWidth variant="contained" onClick={() => handleAddToCart(producto)}>
                  + Agregar
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ProductsPage;
