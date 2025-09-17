export interface Producto {
  id_producto: number;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  categoria: string;
  imagen_url?: string;
  created_at?: Date;
  updated_at?: Date;
}


export interface ProductoFormData {
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  categoria: string;
  imagen_url?: string;
}

export interface ProductoFilters {
  categoria?: string;
  searchTerm?: string;
  minPrice?: number;
  maxPrice?: number;
}