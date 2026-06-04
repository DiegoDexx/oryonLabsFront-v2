import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./reducers/rootReducer"; // Asegúrate de que rootReducer sea un objeto combinado

// Configuración de la tienda Redux
export const store = configureStore({
  reducer: rootReducer, // Pasa rootReducer como el valor de la propiedad "reducer"

});

export default store;