import API from "../api/api";

export const getCart = async (userId: number, token: string) => {
  if (!userId || !token) throw new Error("Usuario no definido o token faltante");
  const { data } = await API.get(`/order/usuario/${userId}/carrito`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

export const addToCart = async (userId: number, productId: number, quantity: number, token: string) => {
  if (!userId || !token) {
    console.error("userId:", userId, "Token:", token);
    throw new Error("Usuario no definido o token faltante");
  }

  try {
    const { data } = await API.post(
      `/order/usuario/${userId}/carrito`,
      { id_producto: productId, cantidad: quantity }, 
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return data;
  } catch (error) {
    console.error("Error en addToCart:", error);
    throw error;
  }
};

export const updateCartQuantity = async (
  idUsuario: number,
  idProducto: number,
  cantidad: number,
  token: string
) => {
  if (!idUsuario || !token) throw new Error("Usuario no definido o token faltante");
  
  if (isNaN(cantidad) || cantidad < 1) {
    throw new Error("La cantidad debe ser un número válido mayor a 0");
  }

  try {
    const res = await API.patch(
  `/order/usuario/${idUsuario}/carrito/producto/${idProducto}`,
  { cantidad: cantidad }, 
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json', 
        },
      }
    );
    return res.data;
  } catch (error) {
    if (error.response) {
      console.error("Response data:", error.response.data);
      console.error("Response status:", error.response.status);
    }
    throw error;
  }
};



export const removeFromCart = async (userId: number, productId: number, token: string) => {
  if (!userId || !token) throw new Error("Usuario no definido o token faltante");
  await API.delete(`/order/usuario/${userId}/carrito/producto/${productId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const clearCart = async (userId: number, token: string) => {
  if (!userId || !token) throw new Error("Usuario no definido o token faltante");
  await API.delete(`/order/usuario/${userId}/carrito`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const confirmCart = async (userId: number, orderData: any, token: string) => {
  if (!userId || !token) throw new Error("Usuario no definido o token faltante");
  const { data } = await API.post(
    `/order/usuario/${userId}/carrito/confirmar`,
    orderData,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return data;
};
