import React, { useState, useEffect } from "react";
import { Container, Typography, Alert, CircularProgress } from "@mui/material";
import ProductTable from "../components/admin/ProductTable";
import type { Producto } from '../types/Product';
import API from "../api/api";

const AdminProducts: React.FC = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProductos();
  }, []);

  const fetchProductos = async () => {
    try {
      setLoading(true);
      const token = sessionStorage.getItem("token");
      if (!token) throw new Error("No hay token de autenticación");

      const { data } = await API.get("/products", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProductos(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar productos");
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = async (productoData: Omit<Producto, "id_producto" | "created_at" | "updated_at">) => {
    try {
      const token = sessionStorage.getItem("token");
      await API.post("/products/create", productoData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchProductos();
    } catch (err) {
      throw err;
    }
  };

  const handleEditProduct = async (id: number, productoData: Partial<Producto>) => {
    try {
      const token = sessionStorage.getItem("token");
      await API.patch(`/products/${id}`, productoData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchProductos();
    } catch (err) {
      throw err;
    }
  };

  const handleDeleteProduct = async (id: number) => {
    try {
      const token = sessionStorage.getItem("token");
      await API.delete(`/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchProductos();
    } catch (err) {
      throw err;
    }
  };

  if (loading) return <CircularProgress />;

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>Gestión de Productos</Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>{error}</Alert>}

      <ProductTable
        productos={productos}
        onAddProduct={handleAddProduct}
        onEditProduct={handleEditProduct}
        onDeleteProduct={handleDeleteProduct}
      />
    </Container>
  );
};

export default AdminProducts;
