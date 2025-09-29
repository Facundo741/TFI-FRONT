import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  Typography,
  Container,
  Paper,
  Link,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton,
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useAuth } from '../../context/AuthContext';

const LoginForm: React.FC = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
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
    <Container maxWidth="sm" sx={{ py: { xs: 2, md: 4 }, px: { xs: 1, md: 2 } }}>
      <Paper elevation={3} sx={{ p: { xs: 3, md: 4 }, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography
            variant="h4"
            gutterBottom
            sx={{
              whiteSpace: 'nowrap',
              fontSize: { xs: '1.5rem', sm: '2rem' },
              textAlign: 'center',
            }}
          >
            JFA DISTRIBUCIONES
          </Typography>

          <Typography
            variant="h5"
            gutterBottom
            sx={{ fontSize: { xs: '1.2rem', sm: '1.5rem' } }}
          >
            INICIAR SESIÓN
          </Typography>

          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}
          >
            <FormControl fullWidth required>
              <InputLabel htmlFor="email">Email</InputLabel>
              <OutlinedInput
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                label="Email"
              />
            </FormControl>

            {/* Input con ojo */}
            <FormControl fullWidth required>
              <InputLabel htmlFor="password">Contraseña</InputLabel>
              <OutlinedInput
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
                label="Contraseña"
              />
            </FormControl>

            <Button type="submit" fullWidth variant="contained">
              {loading ? 'CARGANDO...' : 'INICIAR SESIÓN'}
            </Button>

            <Box sx={{ textAlign: 'center' }}>
              <Link component={RouterLink} to="/register">
                ¿No tienes cuenta? Regístrate aquí
              </Link>
            </Box>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default LoginForm;
