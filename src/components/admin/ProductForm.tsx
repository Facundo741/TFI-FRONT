import React, { useState } from "react";
import { Box, TextField, Button, MenuItem, Paper, Typography, Alert } from "@mui/material";
import type { Producto } from "../../types/Product";

interface ProductFormProps {
  onSubmit: (producto: Omit<Producto, "id_producto" | "created_at" | "updated_at"> | Partial<Producto>) => Promise<void>;
  editingProduct?: Producto | null;
  onCancel?: () => void;
}

const categorias = ["Cables", "Iluminación", "Herramientas", "Interruptores", "Tomacorrientes", "Baterías", "Automatización"];

const ProductForm: React.FC<ProductFormProps> = ({ onSubmit, editingProduct, onCancel }) => {
  const [formData, setFormData] = useState({
    nombre: editingProduct?.nombre || "",
    descripcion: editingProduct?.descripcion || "",
    precio: editingProduct?.precio || "",
    stock: editingProduct?.stock || "",
    categoria: editingProduct?.categoria || "",
    imagen_url: editingProduct?.imagen_url || ""
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const validateForm = () => {
    if (!formData.nombre || formData.nombre.length < 2 || formData.nombre.length > 100) return "Nombre debe tener entre 2 y 100 caracteres";
    if (!formData.descripcion || formData.descripcion.length < 10 || formData.descripcion.length > 500) return "Descripción debe tener entre 10 y 500 caracteres";
    if (!formData.precio || isNaN(Number(formData.precio)) || Number(formData.precio) < 0) return "Precio debe ser un número positivo";
    if (formData.stock !== "" && (isNaN(Number(formData.stock)) || Number(formData.stock) < 0)) return "Stock debe ser un número entero positivo";
    if (!formData.categoria || formData.categoria.length < 2 || formData.categoria.length > 50) return "Categoría debe tener entre 2 y 50 caracteres";

    if (formData.imagen_url) {
      try {
        new URL(formData.imagen_url);
        const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
        const valid = allowedExtensions.some(ext => formData.imagen_url.toLowerCase().endsWith(ext));
        if (!valid) return "La imagen debe ser JPG, JPEG, PNG, GIF o WEBP";
      } catch {
        return "Debe ser una URL válida";
      }
    }

    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      await onSubmit({
        nombre: formData.nombre,
        descripcion: formData.descripcion,
        precio: parseFloat(formData.precio as string),
        stock: parseInt(formData.stock as string) || 0,
        categoria: formData.categoria,
        imagen_url: formData.imagen_url || undefined
      });
      setSuccess(editingProduct ? "Producto actualizado correctamente" : "Producto agregado correctamente");
      if (!editingProduct) setFormData({ nombre: "", descripcion: "", precio: "", stock: "", categoria: "", imagen_url: "" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al guardar el producto");
    }
  };

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        {editingProduct ? "Editar Producto" : "Agregar Nuevo Producto"}
      </Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
      <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <TextField label="Nombre" name="nombre" value={formData.nombre} onChange={handleChange} fullWidth required />
        <TextField label="Descripción" name="descripcion" value={formData.descripcion} onChange={handleChange} fullWidth required multiline rows={3} />
        <TextField label="Precio" name="precio" type="number" value={formData.precio} onChange={handleChange} fullWidth required inputProps={{ min: 0, step: 0.01 }} />
        <TextField label="Stock" name="stock" type="number" value={formData.stock} onChange={handleChange} fullWidth inputProps={{ min: 0, step: 1 }} />
        <TextField select label="Categoría" name="categoria" value={formData.categoria} onChange={handleChange} fullWidth required>
          {categorias.map(cat => <MenuItem key={cat} value={cat}>{cat}</MenuItem>)}
        </TextField>
        <TextField label="URL Imagen" name="imagen_url" value={formData.imagen_url} onChange={handleChange} fullWidth />
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button type="submit" variant="contained">{editingProduct ? "Actualizar" : "Agregar"}</Button>
          {editingProduct && <Button variant="outlined" onClick={onCancel}>Cancelar</Button>}
        </Box>
      </Box>
    </Paper>
  );
};

export default ProductForm;
