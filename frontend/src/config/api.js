// url base de la api: sale de la variable de entorno de vite; si falta se usa el backend local
export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
