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
  ListItemText,
  Menu,
  MenuItem,
  Avatar,
  Badge
} from "@mui/material";
import { Menu as MenuIcon, Close, ShoppingCart } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [profileAnchor, setProfileAnchor] = React.useState<null | HTMLElement>(null);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const isLoggedIn = !!sessionStorage.getItem("token");

  const menuItems = [
    { text: "Inicio", path: "/" },
    { text: "Productos", path: "/productos" },
    { text: "Categorías", path: "/categorias" },
    { text: "Nosotros", path: "/nosotros" },
    { text: "Contacto", path: "/contacto" },
  ];

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  const handleNavigation = (path: string) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setProfileAnchor(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setProfileAnchor(null);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    handleProfileMenuClose();
    navigate("/");
  };

  return (
    <>
      <AppBar position="sticky" elevation={2} sx={{ bgcolor: "#1a3447", py: 1 }}>
        <Toolbar sx={{ justifyContent: "space-between" }}>
          {isMobile && (
            <IconButton color="inherit" onClick={toggleMobileMenu} edge="start">
              {mobileMenuOpen ? <Close /> : <MenuIcon />}
            </IconButton>
          )}

          <Typography
            variant="h6"
            sx={{
              fontWeight: "bold",
              color: "white",
              cursor: "pointer",
              fontSize: { xs: "1.2rem", md: "1.5rem" },
              flexGrow: isMobile ? 1 : 0,
              textAlign: isMobile ? "center" : "left",
            }}
            onClick={() => navigate("/")}
          >
            JFA<span style={{ color: "#4fc3f7" }}>DISTRIBUCIONES</span>
          </Typography>

          
          {!isMobile && (
            <Box sx={{ display: "flex", gap: 2, position: "absolute", left: "50%", transform: "translateX(-50%)" }}>
              {menuItems.map((item) => (
                <Button
                  key={item.text}
                  sx={{ color: "white", "&:hover": { backgroundColor: "rgba(255,255,255,0.1)" } }}
                  onClick={() => handleNavigation(item.path)}
                >
                  {item.text}
                </Button>
              ))}
            </Box>
          )}

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {isLoggedIn && (
              <IconButton color="inherit" onClick={() => handleNavigation("/cart")}>
                <Badge badgeContent={0} color="error">
                  <ShoppingCart sx={{ color: "white" }} />
                </Badge>
              </IconButton>
            )}

            {!isMobile && (
              <>
                {isLoggedIn ? (
                  <>
                    <IconButton color="inherit" onClick={handleProfileMenuOpen}>
                      <Avatar sx={{ bgcolor: "#1A3447" }}></Avatar>
                    </IconButton>
                    <Menu
                      anchorEl={profileAnchor}
                      open={Boolean(profileAnchor)}
                      onClose={handleProfileMenuClose}
                    >
                      <MenuItem onClick={() => { handleProfileMenuClose(); navigate("/profile"); }}>Mi Perfil</MenuItem>
                      <MenuItem onClick={handleLogout}>Cerrar Sesión</MenuItem>
                    </Menu>
                  </>
                ) : (
                  <>
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
                      sx={{ bgcolor: "#4fc3f7", "&:hover": { bgcolor: "#039be5" } }}
                      onClick={() => handleNavigation("/register")}
                    >
                      Registrarse
                    </Button>
                  </>
                )}
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="left"
        open={mobileMenuOpen}
        onClose={toggleMobileMenu}
        PaperProps={{ sx: { bgcolor: "#1a3447", color: "white", width: "70%" } }}
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

          {isLoggedIn ? (
            <>
              <ListItemButton onClick={() => handleNavigation("/profile")} sx={{ "&:hover": { bgcolor: "rgba(255,255,255,0.1)" } }}>
                <ListItemText primary="Mi Perfil" />
              </ListItemButton>
              <ListItemButton onClick={handleLogout} sx={{ "&:hover": { bgcolor: "rgba(255,255,255,0.1)" } }}>
                <ListItemText primary="Cerrar Sesión" />
              </ListItemButton>
            </>
          ) : (
            <>
              <ListItemButton onClick={() => handleNavigation("/login")} sx={{ "&:hover": { bgcolor: "rgba(255,255,255,0.1)" } }}>
                <ListItemText primary="Iniciar Sesión" />
              </ListItemButton>
              <ListItemButton onClick={() => handleNavigation("/register")} sx={{ "&:hover": { bgcolor: "rgba(255,255,255,0.1)" } }}>
                <ListItemText primary="Registrarse" />
              </ListItemButton>
            </>
          )}
        </Box>
      </Drawer>
    </>
  );
};
