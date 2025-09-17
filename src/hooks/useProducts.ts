import { useState, useEffect } from "react";
import { Producto } from "../types/Product";

export const useProductos = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await fetch("/api/productos");
        if (!response.ok) throw new Error("Error al cargar productos");
        const data = await response.json();
        setProductos(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error desconocido");
      } finally {
        setLoading(false);
      }
    };

    fetchProductos();
  }, []);

  return { productos, loading, error };
};