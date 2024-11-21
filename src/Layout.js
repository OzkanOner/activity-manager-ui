import React from "react";
import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div>
      <Navbar />
      <main className="container w-full mt-10">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;