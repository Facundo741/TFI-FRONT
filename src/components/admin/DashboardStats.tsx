// import React, { useEffect, useState } from 'react';
// import { Grid, Paper, Typography, Box } from '@mui/material';
// import { Inventory, Warning, Block, TrendingUp } from '@mui/icons-material';
// import axios from 'axios';

// interface StatCardProps {
//   title: string;
//   value: number;
//   subtitle: string;
//   icon: React.ReactNode;
//   color: string;
// }

// const StatCard: React.FC<StatCardProps> = ({ title, value, subtitle, icon, color }) => (
//   <Paper
//     elevation={2}
//     sx={{ p: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
//   >
//     <Box>
//       <Typography variant="h4" fontWeight="bold" color={color}>
//         {value}
//       </Typography>
//       <Typography variant="h6" color="textSecondary">
//         {title}
//       </Typography>
//       <Typography variant="body2" color="textSecondary">
//         {subtitle}
//       </Typography>
//     </Box>
//     <Box sx={{ color, fontSize: '2.5rem' }}>{icon}</Box>
//   </Paper>
// );

// const DashboardStats: React.FC = () => {
//   const [stats, setStats] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchStats = async () => {
//       try {
//         setLoading(true);
//         const token = sessionStorage.getItem('token');
//         if (token) {
//           try {
//             const res = await axios.get('/api/bill/admin/estadisticas', {
//               headers: { Authorization: `Bearer ${token}` },
//             });
            
//             if (res.data && res.data.length > 0) {
//               const data = res.data;
//               setStats([
//                 {
//                   title: 'Facturas Totales',
//                   value: data.reduce((a: number, b: any) => a + parseInt(b.total_facturas), 0),
//                   subtitle: 'Total facturas emitidas',
//                   icon: <TrendingUp />,
//                   color: '#3182ce',
//                 },
//                 {
//                   title: 'Ingresos Totales',
//                   value: data.reduce((a: number, b: any) => a + parseFloat(b.ingresos_totales || 0), 0),
//                   subtitle: 'Ingresos últimos 30 días',
//                   icon: <Inventory />,
//                   color: '#38a169',
//                 },
//                 {
//                   title: 'Promedio por factura',
//                   value: Math.round(data.reduce((a: number, b: any) => a + parseFloat(b.promedio_por_factura || 0), 0)),
//                   subtitle: 'Promedio de ventas',
//                   icon: <Warning />,
//                   color: '#dd6b20',
//                 },
//                 {
//                   title: 'Facturas pendientes',
//                   value: data.find((d: any) => d.estado_factura === 'pendiente')?.total_facturas || 0,
//                   subtitle: 'Pendientes por gestionar',
//                   icon: <Block />,
//                   color: '#e53e3e',
//                 },
//               ]);
//               return;
//             }
//           } catch (error) {
//             console.log('API no disponible, usando datos mock');
//           }
//         }

//         setStats([
//           {
//             title: 'Productos Activos',
//             value: 42,
//             subtitle: 'Total en inventario',
//             icon: <Inventory />,
//             color: '#38a169'
//           },
//           {
//             title: 'Stock Bajo',
//             value: 15,
//             subtitle: 'Necesitan reposición',
//             icon: <Warning />,
//             color: '#dd6b20'
//           },
//           {
//             title: 'Sin Stock',
//             value: 8,
//             subtitle: 'Agotados',
//             icon: <Block />,
//             color: '#e53e3e'
//           },
//           {
//             title: 'Ventas del Mes',
//             value: 128,
//             subtitle: 'Pedidos completados',
//             icon: <TrendingUp />,
//             color: '#3182ce'
//           }
//         ]);

//       } catch (error) {
//         console.error('Error fetching stats:', error);

//         setStats([
//           {
//             title: 'Productos Activos',
//             value: 42,
//             subtitle: 'Total en inventario',
//             icon: <Inventory />,
//             color: '#38a169'
//           },
//           {
//             title: 'Stock Bajo',
//             value: 15,
//             subtitle: 'Necesitan reposición',
//             icon: <Warning />,
//             color: '#dd6b20'
//           },
//           {
//             title: 'Sin Stock',
//             value: 8,
//             subtitle: 'Agotados',
//             icon: <Block />,
//             color: '#e53e3e'
//           },
//           {
//             title: 'Ventas del Mes',
//             value: 128,
//             subtitle: 'Pedidos completados',
//             icon: <TrendingUp />,
//             color: '#3182ce'
//           }
//         ]);
//       } finally {
//         setLoading(false);
//       }
//     };
    
//     fetchStats();
//   }, []);

//   if (loading) {
//     return <Typography>Cargando estadísticas...</Typography>;
//   }

//   return (
//     <Grid container spacing={3}>
//       {stats.map((stat, idx) => (
//         <Grid item xs={12} sm={6} md={3} key={idx}>
//           <StatCard {...stat} />
//         </Grid>
//       ))}
//     </Grid>
//   );
// };

// export default DashboardStats;