import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  useMediaQuery,
  useTheme,
  IconButton,
  Drawer,
  ListItemButton,
  ListItemText
} from "@mui/material";
import { Menu as MenuIcon, Close } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const menuItems = [
    { text: "Inicio", path: "/" },
    { text: "Productos", path: "/productos" },
    { text: "Categorías", path: "/categorias" },
    { text: "Nosotros", path: "/nosotros" },
    { text: "Contacto", path: "/contacto" },
  ];

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <AppBar
        position="sticky"
        elevation={2}
        sx={{ bgcolor: "#1a3447", py: 1 }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: "bold",
              color: "white",
              cursor: "pointer",
              fontSize: { xs: "1.2rem", md: "1.5rem" },
            }}
            onClick={() => navigate("/")}
          >
            JFA<span style={{ color: "#4fc3f7" }}>DISTRIBUCIONES</span>
          </Typography>

          {!isMobile && (
            <Box sx={{ display: "flex", gap: 2 }}>
              {menuItems.map((item) => (
                <Button
                  key={item.text}
                  sx={{
                    color: "white",
                    fontWeight: item.text === "Inicio" ? "normal" : "normal",
                    "&:hover": { backgroundColor: "rgba(255,255,255,0.1)" },
                  }}
                  onClick={() => handleNavigation(item.path)}
                >
                  {item.text}
                </Button>
              ))}
            </Box>
          )}

          {!isMobile && (
            <Box sx={{ display: "flex", gap: 1 }}>
              <Button
                variant="outlined"
                sx={{
                  color: "white",
                  borderColor: "white",
                  "&:hover": { borderColor: "#4fc3f7", color: "#4fc3f7" },
                }}
                onClick={() => handleNavigation("/login")}
              >
                Iniciar Sesión
              </Button>
              <Button
                variant="contained"
                sx={{
                  bgcolor: "#4fc3f7",
                  "&:hover": { bgcolor: "#039be5" },
                }}
                onClick={() => handleNavigation("/register")}
              >
                Registrarse
              </Button>
            </Box>
          )}

          {isMobile && (
            <IconButton color="inherit" onClick={toggleMobileMenu}>
              {mobileMenuOpen ? <Close /> : <MenuIcon />}
            </IconButton>
          )}
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="right"
        open={mobileMenuOpen}
        onClose={toggleMobileMenu}
        PaperProps={{
          sx: { bgcolor: "#1a3447", color: "white", width: "70%" },
        }}
      >
        <Box sx={{ p: 2 }}>
        {menuItems.map((item) => (
            <ListItemButton
            key={item.text}
            onClick={() => handleNavigation(item.path)}
            sx={{ "&:hover": { bgcolor: "rgba(255,255,255,0.1)" } }}
            >
            <ListItemText primary={item.text} />
            </ListItemButton>
        ))}

        <ListItemButton
            onClick={() => handleNavigation("/login")}
            sx={{ "&:hover": { bgcolor: "rgba(255,255,255,0.1)" } }}
        >
            <ListItemText primary="Iniciar Sesión" />
        </ListItemButton>

        <ListItemButton
            onClick={() => handleNavigation("/register")}
            sx={{ "&:hover": { bgcolor: "rgba(255,255,255,0.1)" } }}
        >
            <ListItemText primary="Registrarse" />
        </ListItemButton>
        </Box>
      </Drawer>
    </>
  );
};
