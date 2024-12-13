import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import Single from "./pages/single/Single";
import New from "./pages/new/New";
import ProductForm from "./pages/new/ProductForm";
import "./pages/login/Login.css";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { productInputs, userInputs } from "./formSource";
import "./style/dark.scss";
import { useContext } from "react";
import { DarkModeContext } from "./context/darkModeContext";
import Signup from "./pages/signup/Signup";
import WholeSalerList from "./pages/list/WholeSalerList";
import ProductList from "./pages/list/ProductList";
import UserForm from "./pages/new/UserForm";
import UserProfile from "./pages/single/Single";

function App() {
  const { darkMode } = useContext(DarkModeContext);

  return (
    <div className={darkMode ? "app dark" : "app"}>
      <BrowserRouter>
        <Routes>
          <Route path="/">
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="signup" element={<Signup />} />
            <Route path="wholesaler-request" element={<WholeSalerList />} />
            <Route path="profile">
              <Route index element={<UserProfile />} />
              <Route path="edit" element={<UserForm />} />
            </Route>
            <Route path="products">
              <Route index element={<ProductList />} />
              <Route path=":productId/edit" element={<ProductForm />} />
              <Route path="new" element={<ProductForm />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
