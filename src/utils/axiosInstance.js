import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://oryonlabsdb-production.up.railway.app/api', // Cambia la URL base según tu API
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Puedes agregar interceptores si necesitas manejar tokens o errores globales
axiosInstance.interceptors.request.use(
  (config) => {     
    // Aquí puedes agregar lógica para el token si lo necesitas
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Manejo global de errores
    return Promise.reject(error);
  }
);

export default axiosInstance;
