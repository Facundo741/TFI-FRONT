import React, { useState } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Button, Box, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import ProductForm from "./ProductForm";
import type { Producto } from "../../types/Product";

interface ProductTableProps {
  productos: Producto[];
  onEditProduct: (id: number, producto: Partial<Producto>) => Promise<void>;
  onDeleteProduct: (id: number) => Promise<void>;
  onAddProduct: (producto: Omit<Producto, "id_producto" | "created_at" | "updated_at">) => Promise<void>;
}

const ProductTable: React.FC<ProductTableProps> = ({ productos, onEditProduct, onDeleteProduct, onAddProduct }) => {
  const [editingProduct, setEditingProduct] = useState<Producto | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const handleEdit = (producto: Producto) => { setEditingProduct(producto); setShowAddForm(false); };
  const handleSaveEdit = async (productoData: Partial<Producto>) => { if (editingProduct) { await onEditProduct(editingProduct.id_producto, productoData); setEditingProduct(null); } };
  const handleDeleteConfirm = (id: number) => setDeleteConfirm(id);
  const handleDelete = async () => { if (deleteConfirm) { await onDeleteProduct(deleteConfirm); setDeleteConfirm(null); } };

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Button variant="contained" onClick={() => setShowAddForm(!showAddForm)}>
          {showAddForm ? "Cancelar" : "Agregar Nuevo Producto"}
        </Button>
      </Box>

      {showAddForm && <Box sx={{ mb: 3 }}><ProductForm onSubmit={onAddProduct} /></Box>}
      {editingProduct && <Box sx={{ mb: 3 }}><ProductForm editingProduct={editingProduct} onSubmit={handleSaveEdit} onCancel={() => setEditingProduct(null)} /></Box>}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Descripción</TableCell>
              <TableCell>Precio</TableCell>
              <TableCell>Stock</TableCell>
              <TableCell>Categoría</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {productos.map((producto) => (
              <TableRow key={producto.id_producto}>
                <TableCell>{producto.id_producto}</TableCell>
                <TableCell>{producto.nombre}</TableCell>
                <TableCell>{producto.descripcion}</TableCell>
                <TableCell>${producto.precio}</TableCell>
                <TableCell>{producto.stock}</TableCell>
                <TableCell>{producto.categoria}</TableCell>
                <TableCell>
                  <IconButton color="primary" onClick={() => handleEdit(producto)}><Edit /></IconButton>
                  <IconButton color="error" onClick={() => handleDeleteConfirm(producto.id_producto)}><Delete /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={deleteConfirm !== null} onClose={() => setDeleteConfirm(null)}>
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>¿Estás seguro de eliminar este producto? Esta acción no se puede deshacer.</DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirm(null)}>Cancelar</Button>
          <Button onClick={handleDelete} color="error">Eliminar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProductTable;
