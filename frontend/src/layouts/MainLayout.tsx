// 📂 src/layouts/MainLayout.tsx
import React from "react";
import { Outlet } from "react-router-dom";
import HeaderLanding from "@components/HeaderLanding/HeaderLanding";
import Footer from "@components/Footer/Footer";
import ChatBot from "@components/ChatBot/ChatBot";
import "./MainLayout.css";

const MainLayout: React.FC = () => {
  return (
    <div className="main-layout-container">
      <HeaderLanding />
      <main>
        <Outlet />
      </main>
      <Footer />
      <ChatBot />
    </div>
  );
};

export default MainLayout;
