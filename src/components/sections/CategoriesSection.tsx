import React from 'react';
import { Container, Typography, Grid, Box, Card, CardContent, Button } from '@mui/material';
import {
  ElectricBolt,
  Lightbulb,
  Build,
  Power,
  BatteryChargingFull,
  Settings
} from '@mui/icons-material';

const CategoriesSection: React.FC = () => {
  const categories = [
    {
      name: "Cables",
      count: "42 productos",
      icon: <ElectricBolt sx={{ fontSize: 50 }} />,
      color: "#FF6B6B"
    },
    {
      name: "Iluminación",
      count: "35 productos",
      icon: <Lightbulb sx={{ fontSize: 50 }} />,
      color: "#FFD93D"
    },
    {
      name: "Herramientas",
      count: "28 productos",
      icon: <Build sx={{ fontSize: 50 }} />,
      color: "#6BCB77"
    },
    {
      name: "Interruptores",
      count: "24 productos",
      icon: <Power sx={{ fontSize: 50 }} />,
      color: "#4D96FF"
    },
    {
      name: "Baterías",
      count: "18 productos",
      icon: <BatteryChargingFull sx={{ fontSize: 50 }} />,
      color: "#9B5DE5"
    },
    {
      name: "Automatización",
      count: "15 productos",
      icon: <Settings sx={{ fontSize: 50 }} />,
      color: "#00BBF9"
    }
  ];

  return (
    <Box sx={{ py: { xs: 6, md: 10 }, }}>
      <Container maxWidth="xl">
        <Box sx={{ textAlign: 'center', mb: { xs: 4, md: 8 } }}>
          <Typography variant="h2" component="h2" gutterBottom sx={{ 
            fontWeight: 800, 
            color: '#1a3447',
            mb: 3,
            fontSize: { xs: '2.2rem', md: '3rem' }
          }}>
            Nuestras Categorías
          </Typography>
          <Typography variant="h5" sx={{ 
            color: '#64748b', 
            maxWidth: '800px', 
            margin: '0 auto',
            fontSize: { xs: '1.1rem', md: '1.3rem' },
            lineHeight: 1.6
          }}>
            Descubre nuestra amplia gama de productos eléctricos de primera calidad
          </Typography>
        </Box>
        
        <Grid container spacing={{ xs: 3, md: 4 }} justifyContent="center">
          {categories.map((category, index) => (
            <Grid 
              item 
              xs={12} 
              sm={6} 
              md={4} 
              lg={2}
              key={index}
              sx={{ 
                display: 'flex',
                justifyContent: 'center'
              }}
            >
              <Card 
                sx={{ 
                  padding: { xs: 2, md: 3 },
                  textAlign: 'center', 
                  height: '100%',
                  width: '100%',
                  maxWidth: '220px',
                  borderRadius: 3,
                  background: 'white',
                  border: `2px solid ${category.color}20`,
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: `0 15px 35px ${category.color}40`,
                    borderColor: category.color
                  }
                }}
              >
                <Box 
                  sx={{ 
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    backgroundColor: `${category.color}20`,
                    margin: '0 auto 20px',
                    color: category.color,
                    transition: 'all 0.3s ease'
                  }}
                >
                  {category.icon}
                </Box>
                
                <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>
                  <Typography 
                    variant="h6" 
                    component="h3" 
                    gutterBottom 
                    sx={{ 
                      fontWeight: 700,
                      color: '#1a3447',
                      mb: 1,
                      fontSize: '1.2rem'
                    }}
                  >
                    {category.name}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: '#64748b', 
                      mb: 2,
                      fontWeight: 500
                    }}
                  >
                    {category.count}
                  </Typography>
                  <Button 
                    variant="outlined" 
                    size="small"
                    sx={{ 
                      borderColor: category.color,
                      color: category.color,
                      fontWeight: 600,
                      borderRadius: 2,
                      px: 2,
                      '&:hover': {
                        backgroundColor: category.color,
                        color: 'white',
                        borderColor: category.color
                      }
                    }}
                  >
                    Ver productos
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default CategoriesSection;