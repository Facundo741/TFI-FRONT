import React from "react";
import { Box, Typography, Paper, Divider } from "@mui/material";

const AboutPage: React.FC = () => {
  return (
    <Box sx={{ p: 3, display: "flex", justifyContent: "center" }}>
      <Paper sx={{ p: 4, maxWidth: 800 }}>
        <Typography variant="h4" gutterBottom>Sobre Nosotros</Typography>

        <Typography variant="h6" gutterBottom>Historia</Typography>
        <Typography paragraph>
          La empresa se crea a partir de un ex empleado que trabajó 18 años en la empresa Conteiner 
          llamado <strong>Sebastián Sotelo</strong>, que decidió independizarse y comenzar su propio emprendimiento. 
          La empresa se llama <strong>JFA Distribuciones</strong>, cuyas siglas hacen referencia a los nombres de sus tres hijos. 
          Se dedica a la distribución de materiales eléctricos con fines de lucro.
        </Typography>
        <Typography paragraph>
          Sebastián comenzó buscando proveedores y comprando a medida que los clientes le iban pidiendo. 
          Con esfuerzo y dedicación, a lo largo de 10 años logró consolidar su propia distribuidora de materiales eléctricos.
        </Typography>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h6" gutterBottom>Misión</Typography>
        <Typography paragraph>
          Formar una empresa competente, líder y de mayor jerarquía frente a sus competencias 
          para poder ofrecer calidad en sus productos.
        </Typography>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h6" gutterBottom>Visión</Typography>
        <Typography paragraph>
          Poder proyectarse a lo largo del país para ofrecer sus productos e insumos.
        </Typography>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h6" gutterBottom>Objetivos</Typography>
        <ul>
          <li>Alcanzar la satisfacción de nuestros clientes.</li>
          <li>Prevenir y reducir constantemente los riesgos e incidentes en nuestra actividad.</li>
          <li>Mejorar la eficiencia de desempeño, llevando a cabo revisiones periódicas que verifiquen el cumplimiento de estos objetivos.</li>
        </ul>
      </Paper>
    </Box>
  );
};

export default AboutPage;
