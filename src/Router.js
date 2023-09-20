import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Product from "./pages/Product";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import Address from "./pages/Address";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import Order from "./pages/Order";
import NotFound from "./pages/NotFound";
import ChangeProfile from "./pages/ChangeProfile";
import ChangePassword from "./pages/ChangePassword";
import UploadAvatar from "./pages/UploadAvatar";
import Settings from "./pages/Settings";



function Routers() {
  return (
    <Routes>
      <Route path="/">
        <Route index element={<Home />} />
        <Route path="products/:id" element={<Product />} />
      </Route>
      <Route path="/cart" element={<Cart />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/settings/change-profile" element={<ChangeProfile />} />
      <Route path="/settings/change-password" element={<ChangePassword />} />
      <Route path="/settings/upload-avatar" element={<UploadAvatar />} />
      <Route path="/address" element={<Address />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/orders">
        <Route index element={<Orders />} />
        <Route path=":id" element={<Order />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default Routers;