import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Box, TextField, Button, Typography, Container, Paper,
  Link, InputAdornment, IconButton, useTheme, useMediaQuery, Alert, CircularProgress
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import API from '../../api/api';

interface FormErrors {
  nombre?: string;
  apellido?: string;
  dni?: string;
  email?: string;
  username?: string;
  contraseña?: string;
  confirmarPassword?: string;
  telefono?: string;
  direccion?: string;
  ciudad?: string;
  codigo_postal?: string;
}

const RegisterForm: React.FC = () => {
  const [formData, setFormData] = useState({
    nombre: '', apellido: '', dni: '', email: '', username: '',
    contraseña: '', confirmarPassword: '', telefono: '',
    direccion: '', ciudad: '', codigo_postal: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();

  const validateField = (name: string, value: string): string => {
    switch (name) {
      case 'nombre':
      case 'apellido':
        if (!value.trim()) return 'Este campo es requerido';
        if (value.length < 2) return 'Mínimo 2 caracteres';
        if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value)) return 'Solo se permiten letras';
        return '';
      case 'dni':
        if (!value.trim()) return 'Este campo es requerido';
        if (!/^\d{7,8}$/.test(value)) return 'DNI debe tener 7 u 8 dígitos';
        return '';
      case 'email':
        if (!value.trim()) return 'Este campo es requerido';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Email inválido';
        return '';
      case 'username':
        if (!value.trim()) return 'Este campo es requerido';
        if (value.length < 3) return 'Mínimo 3 caracteres';
        if (!/^[a-zA-Z0-9_]+$/.test(value)) return 'Solo letras, números y _';
        return '';
      case 'contraseña':
        if (!value.trim()) return 'Este campo es requerido';
        if (value.length < 6) return 'Mínimo 6 caracteres';
        if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) return 'Debe contener mayúsculas, minúsculas y números';
        return '';
      case 'confirmarPassword':
        if (value !== formData.contraseña) return 'Las contraseñas no coinciden';
        return '';
      case 'telefono':
        if (!value.trim()) return 'Este campo es requerido';
        if (!/^\d{10,15}$/.test(value)) return 'Teléfono inválido';
        return '';
      case 'direccion':
        if (!value.trim()) return 'Este campo es requerido';
        if (value.length < 5) return 'Dirección demasiado corta';
        return '';
      case 'ciudad':
        if (!value.trim()) return 'Este campo es requerido';
        return '';
      case 'codigo_postal':
        if (!value.trim()) return 'Este campo es requerido';
        if (!/^\d{4,8}$/.test(value)) return 'Código postal inválido';
        return '';
      default:
        return '';
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let isValid = true;
    const newErrors: FormErrors = {};
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key as keyof typeof formData]);
      if (error) { newErrors[key as keyof FormErrors] = error; isValid = false; }
    });
    if (!isValid) { setErrors(newErrors); setAlert({ type: 'error', message: 'Corrige los errores' }); return; }

    setLoading(true);
    setAlert(null);

    try {
      const res = await API.post('/users/create', {
        nombre: formData.nombre,
        apellido: formData.apellido,
        dni: formData.dni,
        email: formData.email,
        username: formData.username,
        password: formData.contraseña,
        telefono: formData.telefono,
        direccion: formData.direccion,
        ciudad: formData.ciudad,
        codigo_postal: formData.codigo_postal
      });

      setAlert({ type: 'success', message: '¡Registro exitoso! Redirigiendo...' });
      setTimeout(() => navigate('/login'), 2000);

    } catch (error: any) {
      console.error(error.response?.data || error);
      setAlert({ type: 'error', message: error.response?.data?.message || 'Error en registro' });
    } finally { setLoading(false); }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 4, px: 2 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2, position: 'relative' }}>
        {loading && <Box sx={{position:'absolute',top:0,left:0,right:0,bottom:0,display:'flex',alignItems:'center',justifyContent:'center',backgroundColor:'rgba(255,255,255,0.8)'}}><CircularProgress /></Box>}
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography variant="h4" gutterBottom>JFA DISTRIBUCIONES</Typography>
          <Typography variant="h5" gutterBottom>CREAR CUENTA</Typography>
          {alert && <Alert severity={alert.type} sx={{ width: '100%', mb: 3 }}>{alert.message}</Alert>}
          <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%', display:'flex', flexDirection:'column', gap:2 }}>
            {['nombre','apellido','dni','telefono','email','username'].map(f => (
              <TextField
                key={f} fullWidth required id={f} label={f.charAt(0).toUpperCase()+f.slice(1)}
                name={f} value={formData[f as keyof typeof formData]} onChange={handleChange}
                error={!!errors[f as keyof FormErrors]} helperText={errors[f as keyof FormErrors]}
              />
            ))}
            <TextField
              fullWidth required id="contraseña" label="Contraseña" name="contraseña"
              type={showPassword?'text':'password'} value={formData.contraseña} onChange={handleChange}
              error={!!errors.contraseña} helperText={errors.contraseña}
              InputProps={{ endAdornment: <InputAdornment position="end"><IconButton onClick={()=>setShowPassword(!showPassword)}>{showPassword?<VisibilityOff/>:<Visibility/>}</IconButton></InputAdornment> }}
            />
            <TextField
              fullWidth required id="confirmarPassword" label="Confirmar Contraseña" name="confirmarPassword"
              type={showConfirmPassword?'text':'password'} value={formData.confirmarPassword} onChange={handleChange}
              error={!!errors.confirmarPassword} helperText={errors.confirmarPassword}
              InputProps={{ endAdornment: <InputAdornment position="end"><IconButton onClick={()=>setShowConfirmPassword(!showConfirmPassword)}>{showConfirmPassword?<VisibilityOff/>:<Visibility/>}</IconButton></InputAdornment> }}
            />
            {[
              { key: 'direccion', label: 'Dirección' },
              { key: 'ciudad', label: 'Ciudad' },
              { key: 'codigo_postal', label: 'Código Postal' },
            ].map(f => (
              <TextField
                key={f.key}
                fullWidth
                required
                id={f.key}
                label={f.label}
                name={f.key}
                value={formData[f.key as keyof typeof formData]}
                onChange={handleChange}
                error={!!errors[f.key as keyof FormErrors]}
                helperText={errors[f.key as keyof FormErrors]}
              />
            ))}
            <Button type="submit" fullWidth variant="contained">{loading?'REGISTRANDO...':'CREAR CUENTA'}</Button>
            <Box sx={{ textAlign:'center' }}>
              <Link component={RouterLink} to="/login">¿Ya tienes cuenta? Inicia sesión aquí</Link>
            </Box>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default RegisterForm;
