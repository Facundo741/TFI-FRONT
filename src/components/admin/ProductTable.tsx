import React, { useState } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  IconButton, 
  Button, 
  Box, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions,
  Pagination,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
  Card,
  CardContent,
  Grid
} from "@mui/material";
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
  const [page, setPage] = useState(1);
  const productsPerPage = 5;

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleEdit = (producto: Producto) => { setEditingProduct(producto); setShowAddForm(false); };
  const handleSaveEdit = async (productoData: Partial<Producto>) => { if (editingProduct) { await onEditProduct(editingProduct.id_producto, productoData); setEditingProduct(null); } };
  const handleDeleteConfirm = (id: number) => setDeleteConfirm(id);
  const handleDelete = async () => { if (deleteConfirm) { await onDeleteProduct(deleteConfirm); setDeleteConfirm(null); } };

  const indexOfLastProduct = page * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = productos.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(productos.length / productsPerPage);

const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
  setPage(value);
};

  const MobileProductCard = ({ producto }: { producto: Producto }) => (
    <Card sx={{ mb: 2, p: 2 }}>
      <CardContent>
        <Grid container spacing={1} alignItems="center">
          <Grid item xs={8}>
            <Typography variant="h6" component="div" gutterBottom>
              {producto.nombre}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Stock: {producto.stock}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              ${producto.precio}
            </Typography>
          </Grid>
          <Grid item xs={4} sx={{ textAlign: 'right' }}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
              <IconButton 
                color="primary" 
                size="small" 
                onClick={() => handleEdit(producto)}
                sx={{ border: 1, borderColor: 'primary.main' }}
              >
                <Edit fontSize="small" />
              </IconButton>
              <IconButton 
                color="error" 
                size="small" 
                onClick={() => handleDeleteConfirm(producto.id_producto)}
                sx={{ border: 1, borderColor: 'error.main' }}
              >
                <Delete fontSize="small" />
              </IconButton>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Button variant="contained" onClick={() => setShowAddForm(!showAddForm)}>
          {showAddForm ? "Cancelar" : "Agregar Nuevo Producto"}
        </Button>
      </Box>

      {showAddForm && <Box sx={{ mb: 3 }}><ProductForm onSubmit={onAddProduct} /></Box>}
      {editingProduct && <Box sx={{ mb: 3 }}><ProductForm editingProduct={editingProduct} onSubmit={handleSaveEdit} onCancel={() => setEditingProduct(null)} /></Box>}

      {!isMobile && (
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
              {currentProducts.map((producto) => (
                <TableRow key={producto.id_producto}>
                  <TableCell>{producto.id_producto}</TableCell>
                  <TableCell>{producto.nombre}</TableCell>
                  <TableCell>{producto.descripcion}</TableCell>
                  <TableCell>${producto.precio}</TableCell>
                  <TableCell>{producto.stock}</TableCell>
                  <TableCell>{producto.categoria}</TableCell>
                  <TableCell>
                    <IconButton color="primary" onClick={() => handleEdit(producto)}>
                      <Edit />
                    </IconButton>
                    <IconButton color="error" onClick={() => handleDeleteConfirm(producto.id_producto)}>
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {isMobile && (
        <Box>
          {currentProducts.map((producto) => (
            <MobileProductCard key={producto.id_producto} producto={producto} />
          ))}
        </Box>
      )}

      {productos.length > 0 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <Stack spacing={2}>
            <Typography variant="body2" color="textSecondary" sx={{ textAlign: 'center' }}>
              Página {page} de {totalPages} - Mostrando {currentProducts.length} de {productos.length} productos
            </Typography>
            <Pagination 
              count={totalPages} 
              page={page} 
              onChange={handlePageChange} 
              color="primary"
              showFirstButton
              showLastButton
              size={isMobile ? "small" : "medium"}
            />
          </Stack>
        </Box>
      )}

      {productos.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="body1" color="textSecondary">
            No hay productos disponibles
          </Typography>
        </Box>
      )}

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