
import { configureStore } from "@reduxjs/toolkit";
import productsReducer from "./productsSlice";
import authReducer from "./authSlice";
import cartReducer from "./cartSlice";
import userReducer from "./userSlice";
import topRatedReducer from "./topRatedSlice";
import bestsellingReducer from "./bestsellingSlice";



export const store = configureStore({
  reducer: {
    products: productsReducer,
     auth: authReducer, 
    cart: cartReducer,
     users: userReducer,
      topRated: topRatedReducer,
      bestSelling: bestsellingReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
