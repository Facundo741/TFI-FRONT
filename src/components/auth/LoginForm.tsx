import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { Box, TextField, Button, Typography, Container, Paper, Link } from '@mui/material';
import API from '../../api/api';

const LoginForm: React.FC = () => {
  const [formData, setFormData] = useState({ email:'', password:'' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await API.post('/auth/login', {
        email: formData.email,
        password: formData.password
      });

      sessionStorage.setItem('token', res.data.token);


      if (res.data.user.role) {
        sessionStorage.setItem('role', res.data.user.role);
      } else {
        sessionStorage.removeItem('role');
      }

      navigate('/');
    } catch (error: any) {
      console.error(error.response?.data || error);
      alert(error.response?.data?.message || 'Error en login');
    } finally {
      setLoading(false);
    }
  };


  return (
    <Container maxWidth="sm" sx={{ py: 4, px: 2 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Box sx={{ display:'flex', flexDirection:'column', alignItems:'center' }}>
          <Typography variant="h4" gutterBottom>JFA DISTRIBUCIONES</Typography>
          <Typography variant="h5" gutterBottom>INICIAR SESIÓN</Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ width:'100%', display:'flex', flexDirection:'column', gap:2 }}>
            <TextField fullWidth required label="Email" name="email" value={formData.email} onChange={handleChange}/>
            <TextField fullWidth required label="Contraseña" type="password" name="password" value={formData.password} onChange={handleChange}/>
            <Button type="submit" fullWidth variant="contained">{loading?'CARGANDO...':'INICIAR SESIÓN'}</Button>
            <Box sx={{ textAlign:'center' }}>
              <Link component={RouterLink} to="/register">¿No tienes cuenta? Regístrate aquí</Link>
            </Box>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default LoginForm;
