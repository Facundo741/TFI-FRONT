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
  Badge,
  Divider
} from "@mui/material";
import { 
  Menu as MenuIcon, 
  Close, 
  ShoppingCart, 
  Dashboard,
  Inventory,
  People,
  Receipt,
  BarChart,
  Settings,
  Category,
  LocalShipping,
  Payment
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [profileAnchor, setProfileAnchor] = React.useState<null | HTMLElement>(null);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const isLoggedIn = !!sessionStorage.getItem("token");
  const role = sessionStorage.getItem("role");
  const isAdmin = role === "admin";

  const menuItems = [
    { text: "Inicio", path: "/" },
    { text: "Productos", path: "/products" },
    { text: "Categorías", path: "/categorias" },
    { text: "Nosotros", path: "/nosotros" },
    { text: "Contacto", path: "/contacto" },
  ];

  const adminMenuItems = [
    { text: "Dashboard Admin", icon: <Dashboard />, path: "/admin" },
    { text: "Gestión de Productos", icon: <Inventory />, path: "/admin/products" },
    { text: "Categorías", icon: <Category />, path: "/admin/categories" },
    { text: "Gestión de Clientes", icon: <People />, path: "/admin/users" },
    { text: "Pedidos", icon: <Receipt />, path: "/admin/orders" },
    { text: "Envíos", icon: <LocalShipping />, path: "/admin/shipping" },
    { text: "Pagos", icon: <Payment />, path: "/admin/payments" },
    { text: "Reportes", icon: <BarChart />, path: "/admin/reports" },
    { text: "Configuración", icon: <Settings />, path: "/admin/settings" },
  ];

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  const handleNavigation = (path: string) => {
    if (path === "/categorias") {
      if (window.location.pathname !== "/") {
        navigate("/", { replace: false });
        setTimeout(() => {
          const section = document.getElementById("categorias");
          if (section) section.scrollIntoView({ behavior: "smooth" });
        }, 100); 
      } else {
        const section = document.getElementById("categorias");
        if (section) section.scrollIntoView({ behavior: "smooth" });
      }
      setMobileMenuOpen(false);
      setProfileAnchor(null);
    } else {
      navigate(path);
      setMobileMenuOpen(false);
      setProfileAnchor(null);
    }
  };


  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setProfileAnchor(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setProfileAnchor(null);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("role"); 
    handleProfileMenuClose();
    setMobileMenuOpen(false);
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
                  sx={{ 
                    color: "white", 
                    "&:hover": { 
                      backgroundColor: "rgba(255,255,255,0.1)",
                      transform: "translateY(-2px)"
                    },
                    transition: "all 0.2s ease"
                  }}
                  onClick={() => handleNavigation(item.path)}
                >
                  {item.text}
                </Button>
              ))}
            </Box>
          )}

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {isLoggedIn && (
              <IconButton 
                color="inherit" 
                onClick={() => handleNavigation("/cart")}
                sx={{
                  "&:hover": { 
                    backgroundColor: "rgba(255,255,255,0.1)",
                    transform: "scale(1.1)"
                  },
                  transition: "all 0.2s ease"
                }}
              >
                <Badge badgeContent={0} color="error">
                  <ShoppingCart sx={{ color: "white" }} />
                </Badge>
              </IconButton>
            )}

            {!isMobile && (
              <>
                {isLoggedIn ? (
                  <>
                    <IconButton 
                      color="inherit" 
                      onClick={handleProfileMenuOpen}
                      sx={{
                        "&:hover": { 
                          backgroundColor: "rgba(255,255,255,0.1)",
                          transform: "scale(1.1)"
                        },
                        transition: "all 0.2s ease"
                      }}
                    >
                      <Avatar sx={{ 
                        bgcolor: isAdmin ? "#4fc3f7" : "#38a169",
                        width: 32,
                        height: 32,
                        fontSize: "0.8rem"
                      }}>
                        {isAdmin ? "A" : "U"}
                      </Avatar>
                    </IconButton>
                    <Menu
                      anchorEl={profileAnchor}
                      open={Boolean(profileAnchor)}
                      onClose={handleProfileMenuClose}
                      PaperProps={{
                        sx: {
                          mt: 1.5,
                          minWidth: 200,
                          maxHeight: 400,
                          overflowY: 'auto'
                        }
                      }}
                    >
                      <MenuItem 
                        onClick={() => { handleProfileMenuClose(); handleNavigation("/profile"); }}
                        sx={{ fontWeight: 600 }}
                      >
                        👤 Mi Perfil
                      </MenuItem>

                      <Divider />

                      {/* Opciones de Admin */}
                      {isAdmin && (
                        <>
                          <MenuItem 
                            sx={{ 
                              bgcolor: '#f0f9ff',
                              fontWeight: 600,
                              color: '#1a3447',
                              '&:hover': { bgcolor: '#e0f2fe' }
                            }}
                          >
                            🛠️ PANEL ADMINISTRATIVO
                          </MenuItem>
                          
                          {adminMenuItems.slice(0, 3).map((item) => (
                            <MenuItem 
                              key={item.text}
                              onClick={() => { handleProfileMenuClose(); handleNavigation(item.path); }}
                              sx={{ pl: 3 }}
                            >
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                {item.icon}
                                <span>{item.text}</span>
                              </Box>
                            </MenuItem>
                          ))}
                          
                          <Divider />
                          
                          {adminMenuItems.slice(3).map((item) => (
                            <MenuItem 
                              key={item.text}
                              onClick={() => { handleProfileMenuClose(); handleNavigation(item.path); }}
                              sx={{ pl: 3 }}
                            >
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                {item.icon}
                                <span>{item.text}</span>
                              </Box>
                            </MenuItem>
                          ))}
                          
                          <Divider />
                        </>
                      )}

                      <MenuItem 
                        onClick={handleLogout}
                        sx={{ 
                          color: '#e53e3e',
                          fontWeight: 600,
                          '&:hover': { bgcolor: 'rgba(229, 62, 62, 0.1)' }
                        }}
                      >
                        🚪 Cerrar Sesión
                      </MenuItem>
                    </Menu>
                  </>
                ) : (
                  <>
                    <Button
                      variant="outlined"
                      sx={{
                        color: "white",
                        borderColor: "white",
                        "&:hover": { 
                          borderColor: "#4fc3f7", 
                          color: "#4fc3f7",
                          transform: "translateY(-2px)"
                        },
                        transition: "all 0.2s ease"
                      }}
                      onClick={() => handleNavigation("/login")}
                    >
                      Iniciar Sesión
                    </Button>
                    <Button
                      variant="contained"
                      sx={{ 
                        bgcolor: "#4fc3f7", 
                        "&:hover": { 
                          bgcolor: "#039be5",
                          transform: "translateY(-2px)"
                        },
                        transition: "all 0.2s ease"
                      }}
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
              sx={{ 
                "&:hover": { 
                  bgcolor: "rgba(255,255,255,0.1)",
                  transform: "translateX(5px)"
                },
                transition: "all 0.2s ease",
                mb: 0.5
              }}
            >
              <ListItemText primary={item.text} />
            </ListItemButton>
          ))}

          <Divider sx={{ my: 2, bgcolor: 'rgba(255,255,255,0.2)' }} />

          {isLoggedIn ? (
            <>
              <ListItemButton 
                onClick={() => handleNavigation("/profile")} 
                sx={{ 
                  "&:hover": { 
                    bgcolor: "rgba(255,255,255,0.1)",
                    transform: "translateX(5px)"
                  },
                  transition: "all 0.2s ease",
                  mb: 0.5
                }}
              >
                <ListItemText primary="👤 Mi Perfil" />
              </ListItemButton>
              {isAdmin && (
                <>
                  <ListItemButton 
                    sx={{ 
                      bgcolor: 'rgba(79, 195, 247, 0.2)',
                      mb: 0.5,
                      '&:hover': { bgcolor: 'rgba(79, 195, 247, 0.3)' }
                    }}
                  >
                    <ListItemText 
                      primary="🛠️ PANEL ADMIN" 
                      sx={{ fontWeight: 'bold' }}
                    />
                  </ListItemButton>
                  
                  {adminMenuItems.map((item) => (
                    <ListItemButton
                      key={item.text}
                      onClick={() => handleNavigation(item.path)}
                      sx={{ 
                        pl: 4,
                        "&:hover": { 
                          bgcolor: "rgba(255,255,255,0.1)",
                          transform: "translateX(5px)"
                        },
                        transition: "all 0.2s ease",
                        mb: 0.5
                      }}
                    >
                      <ListItemText primary={item.text} />
                    </ListItemButton>
                  ))}
                </>
              )}

              <ListItemButton 
                onClick={handleLogout}
                sx={{ 
                  color: '#ff6b6b',
                  "&:hover": { 
                    bgcolor: "rgba(255,107,107,0.1)",
                    transform: "translateX(5px)"
                  },
                  transition: "all 0.2s ease",
                  mb: 0.5
                }}
              >
                <ListItemText primary="🚪 Cerrar Sesión" />
              </ListItemButton>
            </>
          ) : (
            <>
              <ListItemButton 
                onClick={() => handleNavigation("/login")} 
                sx={{ 
                  "&:hover": { 
                    bgcolor: "rgba(255,255,255,0.1)",
                    transform: "translateX(5px)"
                  },
                  transition: "all 0.2s ease",
                  mb: 0.5
                }}
              >
                <ListItemText primary="Iniciar Sesión" />
              </ListItemButton>
              <ListItemButton 
                onClick={() => handleNavigation("/register")} 
                sx={{ 
                  "&:hover": { 
                    bgcolor: "rgba(255,255,255,0.1)",
                    transform: "translateX(5px)"
                  },
                  transition: "all 0.2s ease",
                  mb: 0.5
                }}
              >
                <ListItemText primary="Registrarse" />
              </ListItemButton>
            </>
          )}
        </Box>
      </Drawer>
    </>
  );
};