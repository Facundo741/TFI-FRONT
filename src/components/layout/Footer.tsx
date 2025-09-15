import React from 'react';
import { Container, Grid, Typography, Box, Link, Divider } from '@mui/material';
import { Phone, Email, LocationOn } from '@mui/icons-material';

const Footer: React.FC = () => {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: '#1a3447',
        color: 'white',
        py: { xs: 4, md: 6 },
        mt: 8
      }}
    >
      <Container maxWidth="xl">
        <Grid container spacing={{ xs: 3, md: 4 }} justifyContent="center">
          <Grid item xs={12} md={4} lg={3} sx={{ textAlign: { xs: 'center', md: 'left' } }}>
            <Typography variant="h5" component="h2" gutterBottom sx={{ 
              fontWeight: 'bold', 
              mb: 2,
              fontSize: { xs: '1.1rem', md: '1.2rem'  }
            }}>
              JFA DISTRIBUCIONES
            </Typography>
            <Typography variant="body1" sx={{ 
            color: '#c5c5c5', 
            mb: 2,
            fontSize: { xs: '0.9rem', md: '1rem' },
            lineHeight: 1.6,
            whiteSpace: 'pre-line'
            }}>
            Distribuidores oficiales de materiales{'\n'}eléctricos de primera calidad para{'\n'}profesionales y particulares.
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6} md={4} lg={3} sx={{ textAlign: { xs: 'center', md: 'left' } }}>
            <Typography variant="h6" component="h3" gutterBottom sx={{ 
              fontWeight: 'bold', 
              mb: 2,
              fontSize: { xs: '1.1rem', md: '1.2rem' }
            }}>
              CONTACTO
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, justifyContent: { xs: 'center', md: 'flex-start' } }}>
              <Phone sx={{ mr: 1, fontSize: { xs: '18px', md: '20px' } }} />
              <Typography variant="body2" sx={{ color: '#c5c5c5', fontSize: { xs: '0.85rem', md: '0.9rem' } }}>
                (381) 123-4567
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, justifyContent: { xs: 'center', md: 'flex-start' } }}>
              <Email sx={{ mr: 1, fontSize: { xs: '18px', md: '20px' } }} />
              <Typography variant="body2" sx={{ color: '#c5c5c5', fontSize: { xs: '0.85rem', md: '0.9rem' } }}>
                info@jfadistribuciones.com
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, justifyContent: { xs: 'center', md: 'flex-start' } }}>
              <LocationOn sx={{ mr: 1, fontSize: { xs: '18px', md: '20px' } }} />
              <Typography variant="body2" sx={{ 
                color: '#c5c5c5', 
                fontSize: { xs: '0.85rem', md: '0.9rem' },
                maxWidth: '200px'
              }}>
                Av. Siempre Viva 742, Tucumbín
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={2} lg={2} sx={{ textAlign: { xs: 'center', md: 'left' } }}>
            <Typography variant="h6" component="h3" gutterBottom sx={{ 
              fontWeight: 'bold', 
              mb: 2,
              fontSize: { xs: '1.1rem', md: '1.2rem' }
            }}>
              ENLACES RÁPIDOS
            </Typography>
            <Link href="#" variant="body2" display="block" sx={{ 
              color: '#c5c5c5', 
              mb: 1, 
              textDecoration: 'none', 
              fontSize: { xs: '0.85rem', md: '0.9rem' },
              '&:hover': { color: 'white' },
              textAlign: { xs: 'center', md: 'left' }
            }}>
              Sobre Nosotros
            </Link>
            <Link href="#" variant="body2" display="block" sx={{ 
              color: '#c5c5c5', 
              mb: 1, 
              textDecoration: 'none', 
              fontSize: { xs: '0.85rem', md: '0.9rem' },
              '&:hover': { color: 'white' },
              textAlign: { xs: 'center', md: 'left' }
            }}>
              Programas Frecuentes
            </Link>
            <Link href="#" variant="body2" display="block" sx={{ 
              color: '#c5c5c5', 
              mb: 1, 
              textDecoration: 'none', 
              fontSize: { xs: '0.85rem', md: '0.9rem' },
              '&:hover': { color: 'white' },
              textAlign: { xs: 'center', md: 'left' }
            }}>
              Términos y Condiciones
            </Link>
            <Link href="#" variant="body2" display="block" sx={{ 
              color: '#c5c5c5', 
              mb: 1, 
              textDecoration: 'none', 
              fontSize: { xs: '0.85rem', md: '0.9rem' },
              '&:hover': { color: 'white' },
              textAlign: { xs: 'center', md: 'left' }
            }}>
              Política de Privacidad
            </Link>
          </Grid>


          <Grid item xs={12} sm={6} md={2} lg={2} sx={{ textAlign: { xs: 'center', md: 'left' } }}>
            <Typography variant="h6" component="h3" gutterBottom sx={{ 
              fontWeight: 'bold', 
              mb: 2,
              fontSize: { xs: '1.1rem', md: '1.2rem' }
            }}>
              HORARIOS
            </Typography>
            <Typography variant="body2" sx={{ 
              color: '#c5c5c5', 
              mb: 1,
              fontSize: { xs: '0.85rem', md: '0.9rem' }
            }}>
              Lunes a viernes: 8:00 - 13:00
            </Typography>
            <Typography variant="body2" sx={{ 
              color: '#c5c5c5', 
              mb: 1,
              fontSize: { xs: '0.85rem', md: '0.9rem' }
            }}>
              Sábados: 8:00 - 13:00
            </Typography>
            <Typography variant="body2" sx={{ 
              color: '#c5c5c5',
              fontSize: { xs: '0.85rem', md: '0.9rem' }
            }}>
              Domingos: Cerrado
            </Typography>
          </Grid>
        </Grid>

        <Divider sx={{ 
          my: 4, 
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
          mx: { xs: 2, md: 0 }
        }} />

        <Typography variant="body2" align="center" sx={{ 
          color: '#c5c5c5',
          fontSize: { xs: '0.8rem', md: '0.9rem' }
        }}>
          © 2025 JFA Distribuciones. Todos los derechos reservados.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;