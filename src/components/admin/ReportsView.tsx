import React, { useEffect, useState } from "react";
import { Box, Typography, Button, Grid, Paper, CircularProgress, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar } from "recharts";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import API from '../../api/api'

const formatSimple = (value: any) => {
  const num = Number(value);
  if (isNaN(num)) return "0,00"; 
  return `${num.toFixed(2).replace('.', ',')}`;
}

const AdminReports: React.FC = () => {
  const [ventasMensuales, setVentasMensuales] = useState<any[]>([]);
  const [productosMasVendidos, setProductosMasVendidos] = useState<any[]>([]);
  const [clientesTop, setClientesTop] = useState<any[]>([]);
  const [stockCritico, setStockCritico] = useState<any[]>([]);
  const [ventasPorCategoria, setVentasPorCategoria] = useState<any[]>([]);
  const [metricasGenerales, setMetricasGenerales] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);

        const [ventasRes, productosRes, clientesRes, stockRes, categoriaRes, metricasRes] = await Promise.all([
          API.get("/reports/ingresos-totales"),
          API.get("/reports/productos-mas-vendidos?limite=5"),
          API.get("/reports/clientes-top?limite=5"),
          API.get("/reports/stock-critico?nivel_minimo=5"),
          API.get("/reports/ventas-categoria"),
          API.get("/reports/metricas-generales")
        ]);

        setVentasMensuales(ventasRes.data);
        setProductosMasVendidos(productosRes.data);
        setClientesTop(clientesRes.data);
        setStockCritico(stockRes.data);
        setVentasPorCategoria(categoriaRes.data);
        setMetricasGenerales(metricasRes.data);

      } catch (error) {
        console.error("Error fetching reports:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  const exportToExcel = () => {
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(ventasMensuales), "Ventas");
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(productosMasVendidos), "Productos");
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(clientesTop), "Clientes");
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(stockCritico), "Stock Critico");
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(ventasPorCategoria), "Ventas Categoria");
    XLSX.writeFile(workbook, "reportes.xlsx");
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Reporte General", 14, 10);

    autoTable(doc, {
      head: [["Mes", "Total Facturas", "Ingresos Totales"]],
      body: ventasMensuales.map(d => [d.mes, d.total_facturas, formatSimple(d.ingresos_totales)])
    });

    autoTable(doc, {
      head: [["Producto", "Categoria", "Total Vendido"]],
      body: productosMasVendidos.map(d => [d.nombre, d.categoria, d.total_vendido])
    });

    autoTable(doc, {
      head: [["Cliente", "Email", "Total Gastado"]],
      body: clientesTop.map(d => [`${d.nombre} ${d.apellido}`, d.email, formatSimple(d.total_gastado)])
    });

    autoTable(doc, {
      head: [["Producto", "Stock", "Precio"]],
      body: stockCritico.map(d => [d.nombre, d.stock, formatSimple(d.precio)])
    });

    autoTable(doc, {
      head: [["Categoria", "Total Ventas", "Total Unidades", "Ingresos Totales"]],
      body: ventasPorCategoria.map(d => [d.categoria, d.total_ventas, d.total_unidades, formatSimple(d.ingresos_totales)])
    });

    doc.save("reportes.pdf");
  };

  if (loading) return <CircularProgress />;

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>📊 Reportes de Administración</Typography>

      {metricasGenerales && (
        <Box mb={3}>
          <Typography variant="h6">📈 Métricas Generales</Typography>
          <ul>
            <li>Ingresos Totales: $ {formatSimple(metricasGenerales.ingresos_totales)}</li>
            <li>Promedio por Factura: $ {formatSimple(metricasGenerales.promedio_venta)}</li>
            <li>Total Clientes: {metricasGenerales.total_clientes}</li>
            <li>Total Pedidos: {metricasGenerales.total_pedidos}</li>
            <li>Facturas Pagadas: {metricasGenerales.facturas_pagadas}</li>
            <li>Productos Stock Crítico: {metricasGenerales.productos_stock_critico}</li>
          </ul>
        </Box>
      )}

      <Box display="flex" gap={2} mb={3}>
        <Button variant="contained" color="primary" onClick={exportToExcel}>Exportar a Excel</Button>
        <Button variant="contained" color="secondary" onClick={exportToPDF}>Exportar a PDF</Button>
      </Box>

      <Grid container spacing={3}>

        <Grid item xs={12} md={6}>
          <Paper elevation={3} style={{ padding: 20 }}>
            <Typography variant="h6">Ingresos Mensuales</Typography>
            <LineChart width={500} height={300} data={ventasMensuales}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mes" />
              <YAxis />
              <Tooltip formatter={(value: number) => formatSimple(value)} />
              <Legend />
              <Line type="monotone" dataKey="ingresos_totales" stroke="#8884d8" />
            </LineChart>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper elevation={3} style={{ padding: 20 }}>
            <Typography variant="h6">Productos Más Vendidos</Typography>
            <BarChart width={500} height={300} data={productosMasVendidos}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="nombre" />
              <YAxis />
              <Tooltip formatter={(value: number) => formatSimple(value)} />
              <Legend />
              <Bar dataKey="total_vendido" fill="#82ca9d" />
            </BarChart>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper elevation={3} style={{ padding: 20 }}>
            <Typography variant="h6">Clientes Top</Typography>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Cliente</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Total Gastado</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {clientesTop.map(c => (
                  <TableRow key={c.id_usuario}>
                    <TableCell>{c.nombre} {c.apellido}</TableCell>
                    <TableCell>{c.email}</TableCell>
                    <TableCell>{formatSimple(c.total_gastado)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper elevation={3} style={{ padding: 20 }}>
            <Typography variant="h6">Stock Crítico</Typography>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Producto</TableCell>
                  <TableCell>Stock</TableCell>
                  <TableCell>Precio</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {stockCritico.map(s => (
                  <TableRow key={s.id_producto}>
                    <TableCell>{s.nombre}</TableCell>
                    <TableCell>{s.stock}</TableCell>
                    <TableCell>{formatSimple(s.precio)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper elevation={3} style={{ padding: 20 }}>
            <Typography variant="h6">Ventas por Categoría</Typography>
            <BarChart width={800} height={300} data={ventasPorCategoria}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="categoria" />
              <YAxis />
              <Tooltip formatter={(value: number) => formatSimple(value)} />
              <Legend />
              <Bar dataKey="ingresos_totales" fill="#ffc658" />
            </BarChart>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminReports;
