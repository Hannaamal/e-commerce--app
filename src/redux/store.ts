
import { configureStore } from "@reduxjs/toolkit";
import productsReducer from "./productsSlice";
import authReducer from "./authSlice";
import cartReducer from "./cartSlice";
import userReducer from "./userSlice";



export const store = configureStore({
  reducer: {
    products: productsReducer,
     auth: authReducer, 
    cart: cartReducer,
     users: userReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
