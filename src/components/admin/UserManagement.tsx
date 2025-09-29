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
  useMediaQuery,
  useTheme,
  Card,
  CardContent,
  Grid
} from "@mui/material";
import { Delete } from "@mui/icons-material";
import API from "../../api/api";
import type { User } from "../../types/User";
import PaginationComponent from "../../utils/PaginationComponent";

const UserManagement: React.FC = () => {
  const [usuarios, setUsuarios] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

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

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = usuarios.slice(indexOfFirstUser, indexOfLastUser);

  const MobileUserCard = ({ usuario }: { usuario: User }) => (
    <Card sx={{ mb: 2, p: 2 }}>
      <CardContent>
        <Grid container spacing={1} alignItems="center">
          <Grid item xs={8}>
            <Typography variant="h6" component="div" gutterBottom>
              {usuario.nombre} {usuario.apellido}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              DNI: {usuario.dni}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {usuario.email}
            </Typography>
          </Grid>
          <Grid item xs={4} sx={{ textAlign: 'right' }}>
            <IconButton 
              color="error" 
              size="small" 
              onClick={() => handleDeleteClick(usuario)}
              sx={{ border: 1, borderColor: 'error.main' }}
            >
              <Delete fontSize="small" />
            </IconButton>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Gestión de Clientes
      </Typography>

      {loading ? (
        <Typography>Cargando usuarios...</Typography>
      ) : (
        <>
          {/* Vista para desktop */}
          {!isMobile && (
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
                  {currentUsers.map((usuario) => (
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

          {isMobile && (
            <Box>
              {currentUsers.map((usuario) => (
                <MobileUserCard key={usuario.id_usuario} usuario={usuario} />
              ))}
            </Box>
          )}

          <PaginationComponent
            currentPage={currentPage}
            totalItems={usuarios.length}
            itemsPerPage={usersPerPage}
            onPageChange={handlePageChange}
            itemsName="clientes"
          />

          {usuarios.length === 0 && (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="body1" color="textSecondary">
                No hay clientes registrados
              </Typography>
            </Box>
          )}
        </>
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