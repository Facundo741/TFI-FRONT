import React from 'react';
import { Container, Typography, Grid, Box, Paper } from '@mui/material';

const FeaturesSection: React.FC = () => {
  const features = [
    {
      emoji: "🚚",
      title: "Envío Rápido",
      description: "Entregamos en 24-48 horas en toda la provincia. Envío gratis en compras mayores a $10.000"
    },
    {
      emoji: "✅",
      title: "Calidad Garantizada",
      description: "Todos nuestros productos tienen garantía oficial del fabricante y certificación IRAM"
    },
    {
      emoji: "💳",
      title: "Múltiples Pagos",
      description: "Aceptamos todos los medios de pago: efectivo, transferencia, tarjetas y Mercado Pago"
    },
    {
      emoji: "👨‍💼",
      title: "Asesoramiento",
      description: "Nuestros técnicos especializados te ayudan a elegir el producto ideal para tu proyecto"
    }
  ];

  return (
    <Box sx={{ 
      py: { xs: 6, md: 10 }, 
      backgroundColor: '#f8fafc',
      backgroundImage: 'linear-gradient(to bottom, #ffffff 0%, #f8fafc 100%)'
    }}>
      <Container maxWidth="xl">
        <Box sx={{ textAlign: 'center', mb: { xs: 4, md: 8 } }}>
          <Typography variant="h2" component="h2" gutterBottom sx={{ 
            fontWeight: 800, 
            color: '#1a3447',
            mb: 3,
            fontSize: { xs: '2.2rem', md: '3rem' }
          }}>
            ¿Por qué elegirnos?
          </Typography>
          <Typography variant="h5" sx={{ 
            color: '#64748b', 
            maxWidth: '800px', 
            margin: '0 auto',
            fontSize: { xs: '1.1rem', md: '1.3rem' },
            lineHeight: 1.6
          }}>
            Ofrecemos los mejores servicios para satisfacer todas tus necesidades en materiales eléctricos
          </Typography>
        </Box>
        
        <Grid container spacing={{ xs: 3, md: 6 }} justifyContent="center">
          {features.map((feature, index) => (
            <Grid 
              item 
              xs={12} 
              sm={6} 
              lg={3} 
              key={index}
              sx={{ 
                display: 'flex',
                justifyContent: 'center'
              }}
            >
              <Paper 
                elevation={0}
                sx={{ 
                  padding: { xs: 3, md: 4 },
                  textAlign: 'center', 
                  height: '100%',
                  borderRadius: 3,
                  background: 'white',
                  border: '1px solid #e2e8f0',
                  transition: 'all 0.3s ease-in-out',
                  maxWidth: '320px',
                  width: '100%',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.12)',
                    borderColor: 'transparent'
                  }
                }}
              >
                <Box sx={{ 
                  fontSize: '4rem',
                  mb: 3,
                  display: 'flex',
                  justifyContent: 'center',
                  lineHeight: 1
                }}>
                  {feature.emoji}
                </Box>
                <Typography 
                  variant="h4" 
                  component="h3" 
                  gutterBottom 
                  sx={{ 
                    fontWeight: 700,
                    color: '#1a3447',
                    mb: 2,
                    fontSize: { xs: '1.5rem', md: '1.75rem' }
                  }}
                >
                  {feature.title}
                </Typography>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    color: '#64748b', 
                    lineHeight: 1.7,
                    fontSize: { xs: '1rem', md: '1.1rem' }
                  }}
                >
                  {feature.description}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default FeaturesSection;