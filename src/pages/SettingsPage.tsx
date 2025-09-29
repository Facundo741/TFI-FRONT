import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Divider,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
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

  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  useEffect(() => {
    if (user) {
      setFormData({
        nombre: user.nombre || "",
        apellido: user.apellido || "",
        email: user.email || "",
        username: user.username || "",
        telefono: user.telefono || "",
        direccion: user.direccion || "",
        ciudad: user.ciudad || "",
        codigo_postal: user.codigo_postal || "",
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const toggleShowPassword = (field: "current" | "new" | "confirm") => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
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
      await API.patch(`/users/${user.id_usuario}`, {
        password: passwordData.newPassword,
      });
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

      {/* PERFIL */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6">Información del perfil</Typography>
        <Divider sx={{ my: 2 }} />
        <TextField label="Nombre" name="nombre" value={formData.nombre} onChange={handleChange} fullWidth margin="normal" />
        <TextField label="Apellido" name="apellido" value={formData.apellido} onChange={handleChange} fullWidth margin="normal" />
        <TextField label="Correo electrónico" name="email" value={formData.email} onChange={handleChange} fullWidth margin="normal" />
        <TextField label="Usuario" name="username" value={formData.username} onChange={handleChange} fullWidth margin="normal" />
        <TextField label="Teléfono" name="telefono" value={formData.telefono} onChange={handleChange} fullWidth margin="normal" />
        <TextField label="Dirección" name="direccion" value={formData.direccion} onChange={handleChange} fullWidth margin="normal" />
        <TextField label="Ciudad" name="ciudad" value={formData.ciudad} onChange={handleChange} fullWidth margin="normal" />
        <TextField label="Código postal" name="codigo_postal" value={formData.codigo_postal} onChange={handleChange} fullWidth margin="normal" />
        <Button variant="contained" color="primary" onClick={handleSaveProfile} sx={{ mt: 2 }}>
          Guardar cambios
        </Button>
      </Paper>

      {/* CONTRASEÑA */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6">Cambiar contraseña</Typography>
        <Divider sx={{ my: 2 }} />

        <FormControl fullWidth margin="normal" variant="outlined">
          <InputLabel htmlFor="currentPassword">Contraseña actual</InputLabel>
          <OutlinedInput
            id="currentPassword"
            name="currentPassword"
            type={showPassword.current ? "text" : "password"}
            value={passwordData.currentPassword}
            onChange={handlePasswordChange}
            endAdornment={
              <InputAdornment position="end">
                <IconButton onClick={() => toggleShowPassword("current")} edge="end">
                  {showPassword.current ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            label="Contraseña actual"
          />
        </FormControl>

        <FormControl fullWidth margin="normal" variant="outlined">
          <InputLabel htmlFor="newPassword">Nueva contraseña</InputLabel>
          <OutlinedInput
            id="newPassword"
            name="newPassword"
            type={showPassword.new ? "text" : "password"}
            value={passwordData.newPassword}
            onChange={handlePasswordChange}
            endAdornment={
              <InputAdornment position="end">
                <IconButton onClick={() => toggleShowPassword("new")} edge="end">
                  {showPassword.new ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            label="Nueva contraseña"
          />
        </FormControl>

        <FormControl fullWidth margin="normal" variant="outlined">
          <InputLabel htmlFor="confirmPassword">Confirmar nueva contraseña</InputLabel>
          <OutlinedInput
            id="confirmPassword"
            name="confirmPassword"
            type={showPassword.confirm ? "text" : "password"}
            value={passwordData.confirmPassword}
            onChange={handlePasswordChange}
            endAdornment={
              <InputAdornment position="end">
                <IconButton onClick={() => toggleShowPassword("confirm")} edge="end">
                  {showPassword.confirm ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            label="Confirmar nueva contraseña"
          />
        </FormControl>

        <Button variant="contained" color="secondary" onClick={handleChangePassword} sx={{ mt: 2 }}>
          Actualizar contraseña
        </Button>
      </Paper>
    </Box>
  );
};

export default SettingsPage;
