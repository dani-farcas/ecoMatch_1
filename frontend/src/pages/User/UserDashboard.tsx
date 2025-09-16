import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import HeaderLanding from "@/components/HeaderLanding/HeaderLanding";
import Footer from "@/components/Footer/Footer";
import ChatBot from "@/components/ChatBot/ChatBot";
import BackgroundWrapper from "@/components/BackgroundWrapper/BackgroundWrapper";

import BecomeProvider from "./ProviderSection/BecomeProvider";
import RequestsSection from "./RequestsSection/RequestsSection";
import ProviderSection from "./ProviderSection/ProviderSection";
import ProfileSection from "./ProfileSection/ProfileSection";

import { useAuth } from "@/contexts/AuthContext";

import "./UserDashboard.css";

const UserDashboard: React.FC = () => {
  const { user } = useAuth();

  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get("tab") as
    | "profil"
    | "anfragen"
    | "anbieter"
    | "abo"
    | "notify"
    | null;

  const [activeTab, setActiveTab] = useState<
    "profil" | "anfragen" | "anbieter" | "abo" | "notify"
  >(tabParam || "profil");

  useEffect(() => {
    setSearchParams({ tab: activeTab });
  }, [activeTab, setSearchParams]);

  const handleTabChange = (
    tab: "profil" | "anfragen" | "anbieter" | "abo" | "notify"
  ) => {
    setActiveTab(tab);
  };

  return (
    <BackgroundWrapper>
      <div className="dashboard-wrapper">
        <HeaderLanding />

        <div className="dashboard-container">
          <aside className="dashboard-sidebar">
            <h2 className="dashboard-title">Übersicht</h2>
            <ul>
              <li
                className={activeTab === "profil" ? "active" : ""}
                onClick={() => handleTabChange("profil")}
              >
                Profil
              </li>

              <li
                className={activeTab === "anfragen" ? "active" : ""}
                onClick={() => handleTabChange("anfragen")}
              >
                Anfragen
              </li>

              {user?.has_providerprofile ? (
                <li
                  className={activeTab === "anbieter" ? "active" : ""}
                  onClick={() => handleTabChange("anbieter")}
                >
                  Anbieter
                </li>
              ) : (
                <li
                  className={
                    activeTab === "anbieter" ? "active highlight" : "highlight"
                  }
                  onClick={() => handleTabChange("anbieter")}
                >
                  Anbieter werden
                </li>
              )}

              <li
                className={activeTab === "abo" ? "active" : ""}
                onClick={() => handleTabChange("abo")}
              >
                Abo
              </li>
              <li
                className={activeTab === "notify" ? "active" : ""}
                onClick={() => handleTabChange("notify")}
              >
                Benachrichtigungen
              </li>
            </ul>
          </aside>

          <main className="dashboard-content">
            {activeTab === "profil" && <ProfileSection />}
            {activeTab === "anfragen" && <RequestsSection />}

            {activeTab === "anbieter" &&
              (user?.has_providerprofile ? (
                <ProviderSection />
              ) : (
                <BecomeProvider onSuccess={() => setActiveTab("anbieter")} />
              ))}

            {activeTab === "abo" && <div>💳 Abo-Verwaltung</div>}
            {activeTab === "notify" && <div>🔔 Benachrichtigungen</div>}
          </main>
        </div>

        <Footer />
        <ChatBot />
      </div>
    </BackgroundWrapper>
  );
};

export default UserDashboard;
