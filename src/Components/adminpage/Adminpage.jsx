import React, { useContext, useState } from "react";
import "./admin.css";
import { useNavigate } from "react-router-dom";
import Addproduct from "../addproduct/Addproduct";
import Allproduct from "./Allproduct";
import { Routes, NavLink, Route } from "react-router-dom";
import Order from "../Orders/Order";
import Allmenu from "../Menu/showmenu";
import Addmenu from "../Menu/addmenu";
import { AdminContext } from "../Contextapi/adminstorcontext";
function Adminpage() {
  const navigate = useNavigate();
  const {addProductVisible,addMenuVisible}=useContext(AdminContext);
  return (
    <>
              {addProductVisible && <Addproduct />}
              {addMenuVisible && <Addmenu/>}
      <div className="heading">
        <h1 className="heading-title">Tomato Admin</h1>
        <button
          className="logout-button"
          onClick={() => {
            navigate("/");
          }}
        >
          Logout
        </button>
      </div>

      <div className="main">
        <div className="nav">
          <ul>
            <li>
              <NavLink to="/adminpage/" end className="navigation">
                Products
              </NavLink>
            </li>
            <li>
              <NavLink to="/adminpage/order" className="navigation">
                Orders
              </NavLink>
            </li>
                        <li>
              <NavLink to="/adminpage/Menus" className="navigation">
                Menus
              </NavLink>
            </li>

          </ul>
        </div>
        <div className="content">
          <Routes>
            <Route path="/" element={<Allproduct/>} />
            <Route path="order" element={<Order />} />
            <Route path="Menus" element={<Allmenu/>} />
          </Routes>
        </div>
      </div>
    </>
  );
}
export default Adminpage;
