import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { Delete } from "@mui/icons-material";
import API from "../../api/api";
import type { User } from "../../types/User";

const UserManagement: React.FC = () => {
  const [usuarios, setUsuarios] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const fetchUsuarios = async () => {
    try {
      const res = await API.get("/users");
      setUsuarios(res.data);
    } catch (error) {
      console.error("Error al cargar usuarios:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const handleDeleteClick = (usuario: User) => {
    setSelectedUser(usuario);
    setOpenDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedUser) return;
    try {
      await API.delete(`/users/${selectedUser.id_usuario}`);
      setUsuarios((prev) =>
        prev.filter((u) => u.id_usuario !== selectedUser.id_usuario)
      );
    } catch (error) {
      console.error("Error eliminando usuario:", error);
    } finally {
      setOpenDeleteDialog(false);
      setSelectedUser(null);
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Gestión de Clientes
      </Typography>

      {loading ? (
        <Typography>Cargando usuarios...</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><b>Nombre</b></TableCell>
                <TableCell><b>Apellido</b></TableCell>
                <TableCell><b>DNI</b></TableCell>
                <TableCell><b>Email</b></TableCell>
                <TableCell align="center"><b>Acciones</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {usuarios.map((usuario) => (
                <TableRow key={usuario.id_usuario}>
                  <TableCell>{usuario.nombre}</TableCell>
                  <TableCell>{usuario.apellido}</TableCell>
                  <TableCell>{usuario.dni}</TableCell>
                  <TableCell>{usuario.email}</TableCell>
                  <TableCell align="center">
                    <IconButton
                      sx={{ color: "red" }}
                      onClick={() => handleDeleteClick(usuario)}
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
            <Typography>
                ¿Seguro que quieres eliminar al usuario{" "}
                <b>{selectedUser?.nombre} {selectedUser?.apellido}</b> con documento:{" "}
                <b>{selectedUser?.dni}</b>?
            </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancelar</Button>
          <Button onClick={handleConfirmDelete} sx={{ color: "red" }}>
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserManagement;
