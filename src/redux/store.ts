import { configureStore } from "@reduxjs/toolkit";
import productsReducer from "./productsSlice";
import authReducer from "./authSlice";
import cartReducer from "./cartSlice";
import userReducer from "./userSlice";
import topRatedReducer from "./topRatedSlice";
import bestsellingReducer from "./bestsellingSlice";
import wishlistReducer from "./wishlistSlice";
import checkoutReducer from "./checkoutSlice";
import categoryReducer from "./categorySlice";
import adminproductReducer from "./adminSlice";

export const store = configureStore({
  reducer: {
    products: productsReducer,
    adminProducts: adminproductReducer,
    auth: authReducer,
    cart: cartReducer,
    users: userReducer,
    topRated: topRatedReducer,
    bestSelling: bestsellingReducer,
    wishlist: wishlistReducer,
    checkout: checkoutReducer,
    categories: categoryReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
