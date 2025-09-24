import React, { useState } from "react";
import { Box, Typography, TextField, Button, Paper } from "@mui/material";

const ContactoPage: React.FC = () => {
  const [form, setForm] = useState({ nombre: "", email: "", mensaje: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Mensaje enviado ✅ (aquí iría la lógica real de envío)");
    setForm({ nombre: "", email: "", mensaje: "" });
  };

  return (
    <Box sx={{ p: 3, display: "flex", justifyContent: "center" }}>
      <Paper sx={{ p: 4, maxWidth: 600 }}>
        <Typography variant="h4" gutterBottom>Contacto</Typography>
        <Typography variant="body1" gutterBottom>
          ¿Tenés dudas o querés más información? Completá el formulario y nos pondremos en contacto.
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            margin="normal"
            label="Nombre"
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Mensaje"
            name="mensaje"
            multiline
            rows={4}
            value={form.mensaje}
            onChange={handleChange}
          />
          <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
            Enviar
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default ContactoPage;
