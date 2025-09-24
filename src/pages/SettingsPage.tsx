import React, { useState, useEffect } from "react";
import { Box, Typography, TextField, Button, Paper, Divider } from "@mui/material";
import { useAuth } from "../context/AuthContext";
import API from "../api/api";

const SettingsPage: React.FC = () => {
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    username: "",
    telefono: "",
    direccion: "",
    ciudad: "",
    codigo_postal: "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        nombre: user.nombre,
        apellido: user.apellido,
        email: user.email,
        username: user.username,
        telefono: user.telefono,
        direccion: user.direccion,
        ciudad: user.ciudad,
        codigo_postal: user.codigo_postal,
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleSaveProfile = async () => {
    if (!user?.id_usuario) return alert("No se pudo identificar al usuario.");
    try {
      await API.patch(`/users/${user.id_usuario}`, formData);
      alert("¡Perfil actualizado correctamente!");
    } catch (err) {
      console.error("Error al actualizar el perfil", err);
      alert("Hubo un error al actualizar el perfil.");
    }
  };

  const handleChangePassword = async () => {
    if (!user?.id_usuario) return alert("No se pudo identificar al usuario.");
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("Las nuevas contraseñas no coinciden.");
      return;
    }

    try {
      await API.patch(`/users/${user.id_usuario}`, { password: passwordData.newPassword });
      alert("¡Contraseña actualizada correctamente!");
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      console.error("Error al cambiar la contraseña", err);
      alert("Hubo un error al cambiar la contraseña.");
    }
  };

  if (!user) {
    return <Typography>Por favor, inicia sesión para ver tu configuración.</Typography>;
  }

  return (
    <Box sx={{ maxWidth: 600, margin: "auto", p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Configuración
      </Typography>

      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6">Información del perfil</Typography>
        <Divider sx={{ my: 2 }} />
        <TextField label="Nombre" name="nombre" value={formData.nombre} onChange={handleChange} fullWidth margin="normal"/>
        <TextField label="Apellido" name="apellido" value={formData.apellido} onChange={handleChange} fullWidth margin="normal"/>
        <TextField label="Correo electrónico" name="email" value={formData.email} onChange={handleChange} fullWidth margin="normal"/>
        <TextField label="Usuario" name="username" value={formData.username} onChange={handleChange} fullWidth margin="normal"/>
        <TextField label="Teléfono" name="telefono" value={formData.telefono} onChange={handleChange} fullWidth margin="normal"/>
        <TextField label="Dirección" name="direccion" value={formData.direccion} onChange={handleChange} fullWidth margin="normal"/>
        <TextField label="Ciudad" name="ciudad" value={formData.ciudad} onChange={handleChange} fullWidth margin="normal"/>
        <TextField label="Código postal" name="codigo_postal" value={formData.codigo_postal} onChange={handleChange} fullWidth margin="normal"/>
        <Button variant="contained" color="primary" onClick={handleSaveProfile}>Guardar cambios</Button>
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6">Cambiar contraseña</Typography>
        <Divider sx={{ my: 2 }} />
        <TextField label="Contraseña actual" name="currentPassword" type="password" value={passwordData.currentPassword} onChange={handlePasswordChange} fullWidth margin="normal"/>
        <TextField label="Nueva contraseña" name="newPassword" type="password" value={passwordData.newPassword} onChange={handlePasswordChange} fullWidth margin="normal"/>
        <TextField label="Confirmar nueva contraseña" name="confirmPassword" type="password" value={passwordData.confirmPassword} onChange={handlePasswordChange} fullWidth margin="normal"/>
        <Button variant="contained" color="secondary" onClick={handleChangePassword}>Actualizar contraseña</Button>
      </Paper>
    </Box>
  );
};

export default SettingsPage;
