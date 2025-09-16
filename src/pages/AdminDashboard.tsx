import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  Card, 
  CardContent,
  CircularProgress,
  Alert,
  Button,
  Chip
} from '@mui/material';
import {
  Inventory,
  People,
  Receipt,
  TrendingUp,
  Warning,
  Block,
  Refresh,
  AttachMoney
} from '@mui/icons-material';
import API from '../api/api';

interface DashboardStats {
  totalProductos: number;
  totalClientes: number;
  totalPedidos: number;
  productosStockBajo: number;
  productosSinStock: number;
  ingresosTotales: number;
  facturasTotales: number;
  promedioPorFactura: number;
  pedidosPendientes: number;
  pedidosCompletados: number;
}

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [lastUpdated, setLastUpdated] = useState<string>('');

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const token = sessionStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');

      const metrics: DashboardStats = {
        totalProductos: 0,
        totalClientes: 0,
        totalPedidos: 0,
        productosStockBajo: 0,
        productosSinStock: 0,
        ingresosTotales: 0,
        facturasTotales: 0,
        promedioPorFactura: 0,
        pedidosPendientes: 0,
        pedidosCompletados: 0
      };

      const productosResponse = await API.get('/products', { headers: { Authorization: `Bearer ${token}` } });
      const productos = productosResponse.data;
      metrics.totalProductos = productos.length;
      metrics.productosStockBajo = productos.filter((p: any) => p.stock < 10 && p.stock > 0).length;
      metrics.productosSinStock = productos.filter((p: any) => p.stock === 0).length;

      const usuariosResponse = await API.get('/users', { headers: { Authorization: `Bearer ${token}` } });
      metrics.totalClientes = usuariosResponse.data.filter((u: any) => u.role === 'user').length;

      const pedidosResponse = await API.get('/order/', { headers: { Authorization: `Bearer ${token}` } });
      const pedidos = pedidosResponse.data;
      metrics.totalPedidos = pedidos.length;
      metrics.pedidosPendientes = pedidos.filter((p: any) => p.estado === 'pendiente').length;
      metrics.pedidosCompletados = pedidos.filter((p: any) => p.estado === 'completado').length;

      try {
        const estadisticasResponse = await API.get('/bill/admin/estadisticas', { headers: { Authorization: `Bearer ${token}` } });
        const e = estadisticasResponse.data;
        metrics.facturasTotales = e.total_facturas || 0;
        metrics.ingresosTotales = e.ingresos_totales || 0;
        metrics.promedioPorFactura = e.promedio_por_factura || 0;
      } catch {
        const facturasResponse = await API.get('/bill/', { headers: { Authorization: `Bearer ${token}` } });
        const facturas = facturasResponse.data;
        metrics.facturasTotales = facturas.length;
        metrics.ingresosTotales = facturas.reduce((total: number, f: any) => total + (f.total || f.monto || 0), 0);
        metrics.promedioPorFactura = metrics.facturasTotales > 0 ? metrics.ingresosTotales / metrics.facturasTotales : 0;
      }

      setStats(metrics);
      setLastUpdated(new Date().toLocaleTimeString());

    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Error loading dashboard data');
      setStats({
        totalProductos: 42,
        totalClientes: 156,
        totalPedidos: 128,
        productosStockBajo: 15,
        productosSinStock: 8,
        facturasTotales: 2,
        ingresosTotales: 125000,
        promedioPorFactura: 62500,
        pedidosPendientes: 23,
        pedidosCompletados: 105
      });
      setLastUpdated(new Date().toLocaleTimeString());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDashboardData(); }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '50vh', gap: 2 }}>
        <CircularProgress />
        <Typography variant="body2" color="textSecondary">
          Cargando datos del dashboard...
        </Typography>
      </Box>
    );
  }

  const dashboardStats = [
    { title: 'Productos Activos', value: stats?.totalProductos ?? 0, subtitle: 'Total en inventario', icon: <Inventory sx={{ fontSize: 40, color: '#38a169' }} />, color: '#38a169' },
    { title: 'Clientes Registrados', value: stats?.totalClientes ?? 0, subtitle: 'Usuarios en el sistema', icon: <People sx={{ fontSize: 40, color: '#3182ce' }} />, color: '#3182ce' },
    { title: 'Total Pedidos', value: stats?.totalPedidos ?? 0, subtitle: 'Pedidos realizados', icon: <Receipt sx={{ fontSize: 40, color: '#dd6b20' }} />, color: '#dd6b20' },
    { title: 'Facturas Emitidas', value: stats?.facturasTotales ?? 0, subtitle: 'Total facturado', icon: <AttachMoney sx={{ fontSize: 40, color: '#38a169' }} />, color: '#38a169' },
    { title: 'Stock Bajo', value: stats?.productosStockBajo ?? 0, subtitle: 'Necesitan reposición', icon: <Warning sx={{ fontSize: 40, color: '#d69e2e' }} />, color: '#d69e2e' },
    { title: 'Sin Stock', value: stats?.productosSinStock ?? 0, subtitle: 'Agotados', icon: <Block sx={{ fontSize: 40, color: '#e53e3e' }} />, color: '#e53e3e' }
  ];

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5', p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: 'white', p: 3, borderRadius: 2, boxShadow: 1, mb: 4, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" gutterBottom color="#1a3447">🛠️ Panel de Administración</Typography>
          <Typography variant="body2" color="textSecondary">
            Gestión integral de JFA Distribuciones{lastUpdated && ` • Actualizado: ${lastUpdated}`}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {error && <Chip label="Modo Demo" color="warning" variant="outlined" size="small" />}
          <Button variant="outlined" startIcon={<Refresh />} onClick={fetchDashboardData} disabled={loading}>Actualizar</Button>
        </Box>
      </Box>

      {error && <Alert severity="warning" sx={{ mb: 3 }}>{error} - Mostrando datos de demostración</Alert>}

      {/* Estadísticas principales */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {dashboardStats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card sx={{ borderRadius: 3, boxShadow: 3, transition: 'all 0.3s ease-in-out', '&:hover': { transform: 'translateY(-5px)', boxShadow: 6 } }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h3" fontWeight="bold" color={stat.color} gutterBottom>{stat.value}</Typography>
                    <Typography variant="h6" color="textPrimary" gutterBottom>{stat.title}</Typography>
                    <Typography variant="body2" color="textSecondary">{stat.subtitle}</Typography>
                  </Box>
                  {stat.icon}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Métricas financieras */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, borderRadius: 3, bgcolor: '#1a3447', color: 'white', boxShadow: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <AttachMoney sx={{ fontSize: 32, color: '#4fc3f7' }} />
              <Box>
                <Typography variant="h6">Ingresos Totales</Typography>
                <Typography variant="h4" fontWeight="bold" color="#4fc3f7">
                  ${Number(stats?.ingresosTotales ?? 0).toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </Typography>
              </Box>
            </Box>
            <Typography variant="body2">Total facturado hasta la fecha</Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, borderRadius: 3, bgcolor: '#2d3748', color: 'white', boxShadow: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <TrendingUp sx={{ fontSize: 32, color: '#38a169' }} />
              <Box>
                <Typography variant="h6">Promedio por Factura</Typography>
                <Typography variant="h4" fontWeight="bold" color="#38a169">
                  ${Number(stats?.promedioPorFactura ?? 0).toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </Typography>
              </Box>
            </Box>
            <Typography variant="body2">Valor promedio por transacción</Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminDashboard;
