import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { Box, TextField, Button, Typography, Container, Paper, Link } from '@mui/material';
import { useAuth } from '../../context/AuthContext';

const LoginForm: React.FC = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();
  const { login, loading } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(formData.email, formData.password);
      navigate('/');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error en login');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 4, px: 2 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography variant="h4" gutterBottom>JFA DISTRIBUCIONES</Typography>
          <Typography variant="h5" gutterBottom>INICIAR SESIÓN</Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField fullWidth required label="Email" name="email" value={formData.email} onChange={handleChange} />
            <TextField fullWidth required label="Contraseña" type="password" name="password" value={formData.password} onChange={handleChange} />
            <Button type="submit" fullWidth variant="contained">
              {loading ? 'CARGANDO...' : 'INICIAR SESIÓN'}
            </Button>
            <Box sx={{ textAlign: 'center' }}>
              <Link component={RouterLink} to="/register">¿No tienes cuenta? Regístrate aquí</Link>
            </Box>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default LoginForm;
