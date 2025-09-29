import React from 'react';
import { Container, Typography, Button, Grid, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const HeroSection: React.FC = () => {
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    if (path === "/categorias") {
      if (window.location.pathname !== "/") {
        navigate("/", { replace: false });
        setTimeout(() => {
          const section = document.getElementById("categorias");
          if (section) section.scrollIntoView({ behavior: "smooth" });
        }, 100); 
      } else {
        const section = document.getElementById("categorias");
        if (section) section.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      navigate(path);
    }
  };

  return (
    <Box sx={{ 
      py: 10, 
      background: 'linear-gradient(135deg, #0a5c96ff 0%, #0c2543ff 100%)',
      color: 'white',
      position: 'relative',
      overflow: 'hidden'
    }}>
      
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
        <Grid container spacing={4} alignItems="center" justifyContent="center">
          <Grid item xs={12} md={8} sx={{ textAlign: 'center' }}>
            <Typography 
              variant="h2" 
              component="h1" 
              gutterBottom 
              sx={{ 
                fontWeight: 800, 
                color: 'white',
                mb: 3,
                fontSize: { xs: '2.5rem', md: '3.5rem' },
                textShadow: '0 2px 4px rgba(0,0,0,0.3)'
              }}
            >
              Materiales Eléctricos de Calidad
            </Typography>
            <Typography 
              variant="h6" 
              sx={{ 
                color: 'rgba(255, 255, 255, 0.9)', 
                fontSize: '1.3rem',
                lineHeight: 1.6,
                mb: 5,
                maxWidth: '800px',
                mx: 'auto'
              }} 
              paragraph
            >
              Todo lo que necesitas para tus proyectos eléctricos al mejor precio del mercado. 
              Distribuidores oficiales de las mejores marcas.
            </Typography>
            <Box sx={{ mt: 4, display: 'flex', gap: 3, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button 
                variant="outlined" 
                size="large" 
                onClick={() => handleNavigation("/categorias")}
                sx={{ 
                  px: 5,
                  py: 1.5,
                  fontWeight: 600,
                  borderRadius: 2,
                  border: '2px solid white',
                  color: 'white',
                  backgroundColor: 'transparent',
                  '&:hover': {
                    backgroundColor: 'white',
                    color: '#1a3447',
                    borderColor: 'white',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 20px rgba(0,0,0,0.2)'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                Ver Catálogo Completo
              </Button>
              <Button 
                variant="outlined" 
                size="large"
                onClick={() => handleNavigation("/contacto")}
                sx={{ 
                  px: 5,
                  py: 1.5,
                  fontWeight: 600,
                  borderRadius: 2,
                  border: '2px solid rgba(255, 255, 255, 0.5)',
                  color: 'white',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  '&:hover': {
                    backgroundColor: 'white',
                    color: '#1a3447',
                    borderColor: 'white',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 20px rgba(0,0,0,0.2)'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                Contactar Vendedor
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Container>

      <Box sx={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '60px',
        background: 'linear-gradient(transparent, rgba(0,0,0,0.1))',
        zIndex: 1
      }} />
    </Box>
  );
};

export default HeroSection;