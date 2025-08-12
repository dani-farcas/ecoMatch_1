import React from "react";
import { Outlet } from "react-router-dom";
import HeaderLanding from "@/components/HeaderLanding/HeaderLanding";
import Footer from "@/components/Footer/Footer";
import ChatBot from "@/components/ChatBot/ChatBot";
import BackgroundWrapper from "@/components/BackgroundWrapper/BackgroundWrapper";

const UniversalLayout: React.FC = () => {
  return (
    <BackgroundWrapper>
      <HeaderLanding />
      <main style={{ flex: 1 }}>
        <Outlet />
      </main>
      <Footer />
      <ChatBot />
    </BackgroundWrapper>
  );
};

export default UniversalLayout;
