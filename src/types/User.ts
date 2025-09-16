export interface User {
  id_usuario?: number;
  nombre: string;
  apellido: string;
  dni: string;
  email: string;
  username: string;
  contraseña: string;
  telefono: string;
  direccion: string;
  ciudad: string;
  codigo_postal: string;
}

export interface LoginData {
  email: string;
  password: string;
  rememberMe?: boolean;
}